"""
ClutchIQ - Task 03: Pressure Intelligence Research Analysis Script
Computes all statistical distributions, empirical grids, match leverage models,
generates CSV reports, and produces high-resolution exploratory charts.
"""

import os
import sys
import logging
from pathlib import Path
import numpy as np
import pandas as pd

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, roc_auc_score, log_loss

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ClutchIQ.PressureResearch")

REPORTS_DIR = Path("reports/pressure")
VISUALS_DIR = REPORTS_DIR / "pressure_research_visuals"
VISUALS_DIR.mkdir(parents=True, exist_ok=True)


def run_pressure_research() -> None:
    logger.info("Loading master analytical datasets...")
    bbb = pd.read_csv("data/processed/master_ball_by_ball.csv", low_memory=False)
    mc = pd.read_csv("data/processed/match_context.csv", low_memory=False)

    # Restrict to primary scope (IPL + Senior T20I)
    scope = bbb[bbb["is_primary_scope"]].copy()
    logger.info(f"Loaded {len(scope):,} primary scope deliveries across {scope['match_id'].nunique()} matches.")

    # -------------------------------------------------------------
    # PART A: DATA PROFILING & COVERAGE
    # -------------------------------------------------------------
    logger.info("Part A: Profiling pressure variables and data quality...")
    pressure_vars = [
        "legal_balls_remaining_before",
        "wickets_in_hand_before",
        "runs_before_ball_lower_bound",
        "required_run_rate_before",
        "runs_remaining_before",
        "target_score",
        "innings_phase_before",
        "is_super_over",
        "score_reconstruction_confidence",
        "target_confidence"
    ]

    profile_records = []
    for var in pressure_vars:
        s = scope[var]
        n_null = s.isna().sum()
        pct_null = round((n_null / len(scope)) * 100, 2)
        n_unique = s.nunique(dropna=True)
        dtype_str = str(s.dtype)
        
        # Availability in Innings 1 vs Innings 2
        inn1_null = scope[scope["innings"] == 1][var].isna().sum()
        inn2_null = scope[scope["innings"] == 2][var].isna().sum()
        inn1_count = len(scope[scope["innings"] == 1])
        inn2_count = len(scope[scope["innings"] == 2])
        
        profile_records.append({
            "variable_name": var,
            "data_type": dtype_str,
            "distinct_values": n_unique,
            "total_null_count": int(n_null),
            "total_null_pct": pct_null,
            "inn1_null_count": int(inn1_null),
            "inn1_null_pct": round((inn1_null / inn1_count) * 100, 2),
            "inn2_null_count": int(inn2_null),
            "inn2_null_pct": round((inn2_null / inn2_count) * 100, 2),
            "min_val": s.min() if pd.api.types.is_numeric_dtype(s) else None,
            "mean_val": round(float(s.mean()), 2) if pd.api.types.is_numeric_dtype(s) and s.notna().any() else None,
            "max_val": s.max() if pd.api.types.is_numeric_dtype(s) else None,
            "reliability_status": "EXACT_RELIABLE" if n_null == 0 else ("CONDITIONAL_CHASE_ONLY" if "inn1" in var or var in ["required_run_rate_before", "runs_remaining_before", "target_score"] else "FLAG_DEPENDENT")
        })

    profile_df = pd.DataFrame(profile_records)
    profile_df.to_csv(REPORTS_DIR / "pressure_feature_analysis.csv", index=False)
    logger.info("Saved reports/pressure/pressure_feature_analysis.csv")

    # -------------------------------------------------------------
    # PART B: CHASE PRESSURE DYNAMICS
    # -------------------------------------------------------------
    logger.info("Part B: Analyzing Chase Pressure Dynamics (Innings 2)...")
    inn2 = scope[scope["innings"] == 2].copy()
    inn2["chase_won"] = (inn2["win_team_id"] == inn2["batting_team_id"]).astype(int)

    # Buckets for analysis
    inn2["rrr_bracket"] = pd.cut(
        inn2["required_run_rate_before"],
        bins=[-1, 6, 8, 10, 12, 15, 20, 1000],
        labels=["<6.0 (Low)", "6.0-8.0 (Comfortable)", "8.0-10.0 (Par/Competitive)", "10.0-12.0 (High)", "12.0-15.0 (Very High)", "15.0-20.0 (Extreme)", ">20.0 (Unattainable)"]
    )
    inn2["wickets_bracket"] = pd.cut(
        inn2["wickets_in_hand_before"],
        bins=[-1, 2, 4, 7, 10],
        labels=["1-2 (Tailenders)", "3-4 (Crisis)", "5-7 (Moderate)", "8-10 (Deep)"]
    )
    inn2["overs_rem_bracket"] = pd.cut(
        inn2["legal_balls_remaining_before"] // 6,
        bins=[-1, 3, 6, 10, 15, 20],
        labels=["Last 3 Overs", "Death (4-6 ovs)", "Late-Mid (7-10 ovs)", "Early-Mid (11-15 ovs)", "Powerplay (16-20 ovs)"]
    )

    chase_summary = inn2.groupby(["rrr_bracket", "wickets_bracket"], observed=False).agg(
        delivery_count=("runs", "count"),
        chase_win_rate=("chase_won", lambda x: round(x.mean() * 100, 1)),
        mean_strike_rate=("batter_runs", lambda x: round(x.mean() * 100, 1)),
        dot_ball_pct=("batter_runs", lambda x: round((x == 0).mean() * 100, 1)),
        boundary_pct=("batter_runs", lambda x: round(x.isin([4, 6]).mean() * 100, 1)),
        dismissal_hazard=("is_wicket", lambda x: round(x.mean() * 100, 2))
    ).reset_index()

    # -------------------------------------------------------------
    # PART C: FIRST-INNINGS EMPIRICAL PAR-SCORE GRID
    # -------------------------------------------------------------
    logger.info("Part C: Constructing empirical First-Innings Par-Score Framework...")
    inn1 = scope[scope["innings"] == 1].copy()
    
    # Calculate final innings 1 team total
    inn1_match_totals = inn1.groupby("match_id")["runs_before_ball_lower_bound"].max().to_dict()
    inn1["final_innings_total"] = inn1["match_id"].map(inn1_match_totals)
    inn1["runs_added_remaining"] = inn1["final_innings_total"] - inn1["runs_before_ball_lower_bound"]

    # Conditioning on legal balls remaining (bucketed by over) and wickets in hand
    inn1["overs_remaining"] = (inn1["legal_balls_remaining_before"] // 6).clip(0, 20)
    
    par_grid = inn1.groupby(["wickets_in_hand_before", "overs_remaining"]).agg(
        sample_balls=("runs", "count"),
        expected_runs_remaining=("runs_added_remaining", "mean"),
        std_runs_remaining=("runs_added_remaining", "std")
    ).reset_index()
    par_grid["expected_runs_remaining"] = par_grid["expected_runs_remaining"].round(1)
    par_grid["std_runs_remaining"] = par_grid["std_runs_remaining"].round(1)

    # Current Projected Par Score: runs_before_ball + expected_runs_remaining
    # Merge expected remaining runs back
    par_lookup = par_grid.set_index(["wickets_in_hand_before", "overs_remaining"])["expected_runs_remaining"].to_dict()
    inn1["expected_runs_to_add"] = [
        par_lookup.get((w, ov), np.nan)
        for w, ov in zip(inn1["wickets_in_hand_before"], inn1["overs_remaining"])
    ]
    inn1["projected_par_score"] = inn1["runs_before_ball_lower_bound"] + inn1["expected_runs_to_add"]

    # Historical Innings 1 Median across all matches:
    hist_median_inn1 = np.median(list(inn1_match_totals.values())) # ~169 runs
    # Par deficit: how far below median competitive par is this projection?
    inn1["par_deficit"] = np.maximum(0, hist_median_inn1 - inn1["projected_par_score"])
    
    # -------------------------------------------------------------
    # PART D: MATCH LEVERAGE & WIN PROBABILITY (PRE-DELIVERY)
    # -------------------------------------------------------------
    logger.info("Part D: Evaluating pre-delivery Match Leverage via logistic model...")
    # Train logistic regression win probability on held-out match splits
    # Only using pre-delivery information: runs_remaining, legal_balls_remaining, wickets_in_hand
    chase_clean = inn2[inn2["target_confidence"].isin(["AUTHORITATIVE_DLS_TARGET", "EXACT_RECONSTRUCTED_TARGET", "ESTIMATED_TARGET_LOWER_BOUND"])].copy()
    chase_clean = chase_clean.dropna(subset=["runs_remaining_before", "required_run_rate_before"]).copy()

    # Match-level split: 70% train matches, 30% test matches (prevent intra-match leakage)
    unique_matches = chase_clean["match_id"].unique()
    np.random.seed(42)
    train_matches = set(np.random.choice(unique_matches, size=int(0.7 * len(unique_matches)), replace=False))
    
    train_df = chase_clean[chase_clean["match_id"].isin(train_matches)]
    test_df = chase_clean[~chase_clean["match_id"].isin(train_matches)]

    features = ["runs_remaining_before", "legal_balls_remaining_before", "wickets_in_hand_before", "required_run_rate_before"]
    X_train = train_df[features].clip(lower=0, upper=500)
    y_train = train_df["chase_won"]
    X_test = test_df[features].clip(lower=0, upper=500)
    y_test = test_df["chase_won"]

    lr = LogisticRegression(max_iter=1000)
    lr.fit(X_train, y_train)

    test_preds = lr.predict_proba(X_test)[:, 1]
    brier = brier_score_loss(y_test, test_preds)
    auc = roc_auc_score(y_test, test_preds)
    logger.info(f"Chase Win Probability Model (Out-of-Match Test): Brier Score = {brier:.4f}, ROC AUC = {auc:.4f}")

    # Leverage Index = |p_win - 0.5| * 2 (or 1 - 2*|p_win - 0.5|: closeness is maximized at p_win=0.50)
    # Match Closeness / Leverage = 1.0 - 2.0 * abs(p_win - 0.5)
    # When p_win = 0.50, Closeness = 1.0 (dead heat). When p_win = 0.0 or 1.0, Closeness = 0.0 (blowout).

    # -------------------------------------------------------------
    # PART E: PRESSURE FEATURE CORRELATIONS & DISTRIBUTIONS
    # -------------------------------------------------------------
    logger.info("Part E: Analyzing multicollinearity, distributions, and IPL vs T20I differences...")
    
    # Pressure distribution export
    dist_records = []
    for comp_cat in ["IPL", "T20I"]:
        sub = scope[scope["competition_category"] == comp_cat]
        for phase in ["Powerplay", "Middle", "Death"]:
            phase_sub = sub[sub["innings_phase_before"] == phase]
            dist_records.append({
                "competition": comp_cat,
                "phase": phase,
                "deliveries": len(phase_sub),
                "strike_rate": round(phase_sub["batter_runs"].mean() * 100, 2),
                "dot_pct": round((phase_sub["batter_runs"] == 0).mean() * 100, 2),
                "boundary_pct": round(phase_sub["batter_runs"].isin([4, 6]).mean() * 100, 2),
                "dismissal_rate": round(phase_sub["is_wicket"].mean() * 100, 2),
                "mean_bowler_runs_conceded": round(phase_sub["bowler_runs_conceded"].mean(), 2)
            })
    
    dist_df = pd.DataFrame(dist_records)
    dist_df.to_csv(REPORTS_DIR / "pressure_distribution_analysis.csv", index=False)
    logger.info("Saved reports/pressure/pressure_distribution_analysis.csv")

    # -------------------------------------------------------------
    # GENERATING RESEARCH VISUALIZATIONS
    # -------------------------------------------------------------
    logger.info("Generating research visualization charts...")
    sns.set_theme(style="whitegrid", font="sans-serif")

    # Chart 1: Empirical Par-Score Surface (Innings 1)
    plt.figure(figsize=(10, 6))
    pivot_par = par_grid[par_grid["overs_remaining"] <= 20].pivot(index="wickets_in_hand_before", columns="overs_remaining", values="expected_runs_remaining")
    sns.heatmap(pivot_par.sort_index(ascending=False), cmap="YlGnBu", annot=True, fmt=".0f", cbar_kws={'label': 'Expected Additional Runs'})
    plt.title("ClutchIQ Innings 1 Empirical Par-Score Surface\n(Expected Runs to Add by Wickets in Hand & Overs Remaining)", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Overs Remaining in Innings", fontsize=11)
    plt.ylabel("Wickets in Hand (Before Delivery)", fontsize=11)
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "01_innings1_par_score_surface.png", dpi=200)
    plt.close()

    # Chart 2: Chase Win Probability vs Required Run Rate Across Overs Remaining
    plt.figure(figsize=(10, 6))
    chase_plot_data = inn2.groupby(["overs_rem_bracket", "rrr_bracket"], observed=False)["chase_won"].mean().reset_index()
    chase_plot_data["chase_win_pct"] = chase_plot_data["chase_won"] * 100
    sns.lineplot(
        data=chase_plot_data,
        x="rrr_bracket",
        y="chase_win_pct",
        hue="overs_rem_bracket",
        marker="o",
        linewidth=2.5
    )
    plt.title("Empirical Chase Win Rate (%) by Required Run Rate & Match Stage", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Required Run Rate Bracket (Runs Per Over)", fontsize=11)
    plt.ylabel("Observed Chase Win Rate (%)", fontsize=11)
    plt.xticks(rotation=25)
    plt.legend(title="Innings Stage")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "02_chase_win_rate_vs_rrr.png", dpi=200)
    plt.close()

    # Chart 3: Dismissal Hazard under Escalating Pressure
    plt.figure(figsize=(10, 6))
    hazard_data = inn2.groupby("rrr_bracket", observed=False).agg(
        wicket_hazard=("is_wicket", lambda x: x.mean() * 100),
        dot_pct=("batter_runs", lambda x: (x == 0).mean() * 100),
        strike_rate=("batter_runs", lambda x: x.mean() * 100)
    ).reset_index()

    ax = sns.barplot(data=hazard_data, x="rrr_bracket", y="wicket_hazard", color="#d95f02", alpha=0.85)
    plt.title("Dismissal Hazard (%) Escalation as Required Run Rate Rises", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Required Run Rate Bracket", fontsize=11)
    plt.ylabel("Delivery Dismissal Probability (%)", fontsize=11)
    plt.xticks(rotation=20)
    for p in ax.patches:
        ax.annotate(f"{p.get_height():.2f}%", (p.get_x() + p.get_width() / 2., p.get_height()),
                    ha='center', va='center', xytext=(0, 5), textcoords='offset points', fontsize=10, weight="bold")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "03_dismissal_hazard_escalation.png", dpi=200)
    plt.close()

    # Chart 4: IPL vs Senior T20I Scoring Distribution Across Phases
    plt.figure(figsize=(10, 6))
    phase_order = ["Powerplay", "Middle", "Death"]
    sns.barplot(data=dist_df, x="phase", y="strike_rate", hue="competition", order=phase_order, palette="muted")
    plt.title("Scoring Rate Comparison: IPL vs Senior T20I Across Tactical Phases", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Tactical Phase (Pre-Delivery State)", fontsize=11)
    plt.ylabel("Mean Batting Strike Rate", fontsize=11)
    plt.ylim(100, 175)
    plt.legend(title="Competition Scope")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "04_ipl_vs_t20i_phase_dynamics.png", dpi=200)
    plt.close()

    # Chart 5: Correlation Matrix of Key State Variables
    plt.figure(figsize=(8, 6))
    corr_vars = ["legal_balls_remaining_before", "wickets_in_hand_before", "runs_before_ball_lower_bound", "bowler_runs_conceded", "is_wicket"]
    corr_matrix = scope[corr_vars].corr()
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".2f", linewidths=0.5)
    plt.title("Inter-Variable Correlation Matrix (Primary Scope Deliveries)", fontsize=12, weight="bold", pad=12)
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "05_state_variable_correlation_matrix.png", dpi=200)
    plt.close()

    logger.info("All research visuals and CSV reports generated successfully.")


if __name__ == "__main__":
    run_pressure_research()

