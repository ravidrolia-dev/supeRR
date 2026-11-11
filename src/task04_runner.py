"""
ClutchIQ - Task 04 Production Runner & Sensitivity Evaluator
Executes:
1. Production pressure scoring on delivery level -> data/processed/delivery_pressure_scores.csv
2. Expected performance baseline computation
3. Batter and Bowler clutch impact calculations
4. Empirical Bayes shrinkage -> data/processed/player_clutch_ratings.csv
5. Sensitivity Analysis across exposure thresholds and formulas -> reports/pressure/player_rating_sensitivity.csv
6. Diagnostic plots under reports/pressure/validation_visuals/
"""

import sys
import logging
from pathlib import Path
import numpy as np
import pandas as pd

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from src.pressure_index import compute_production_pressure_indices
from src.expected_performance import compute_expected_performance_baselines
from src.clutch_rating import compute_batter_clutch_impact, compute_bowler_clutch_impact
from src.reliability import apply_empirical_bayes_shrinkage

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("ClutchIQ.Task04Runner")

PROCESSED_DIR = Path("data/processed")
REPORTS_DIR = Path("reports/pressure")
VISUALS_DIR = REPORTS_DIR / "validation_visuals"
VISUALS_DIR.mkdir(parents=True, exist_ok=True)


def run_task04_production_pipeline():
    logger.info("=== Starting Task 04 Production Pipeline ===")
    
    # 1. Load Master Ball-by-Ball
    master_bbb_path = PROCESSED_DIR / "master_ball_by_ball.csv"
    logger.info(f"Loading {master_bbb_path}...")
    bbb = pd.read_csv(master_bbb_path, low_memory=False)

    # 2. Compute Production Pressure Indices (BPI & BowlerPI)
    bbb_pressure = compute_production_pressure_indices(bbb)

    # 3. Compute Expected Performance Baselines & Value-Added Metrics
    bbb_enriched = compute_expected_performance_baselines(bbb_pressure)

    # Export delivery_pressure_scores.csv
    # Select key delivery-level fields to maintain manageable size
    delivery_export_cols = [
        "match_id", "innings", "overid", "over_ball_num", "innings_ball_num",
        "competition_category", "is_primary_scope", "match_date",
        "batting_team_id", "bowling_team_id", "striker_id", "striker_name",
        "bowler_id", "bowler_name", "batter_runs", "bowler_runs_conceded",
        "is_legal_ball", "is_wicket", "is_bowler_wicket", "dismissal_type",
        "wickets_in_hand_before", "legal_balls_remaining_before", "innings_phase_before",
        "pressure_context_type", "pressure_confidence", "pressure_model_version",
        "required_run_rate_before", "target_score", "win_prob_pre_delivery",
        "batter_pressure_index", "bowler_pressure_index",
        "batter_pressure_tier", "bowler_pressure_tier",
        "batter_runs_added", "bowler_runs_saved", "bowler_wickets_added"
    ]
    delivery_scores_df = bbb_enriched[delivery_export_cols]
    delivery_scores_path = PROCESSED_DIR / "delivery_pressure_scores.csv"
    logger.info(f"Saving {delivery_scores_path} ({len(delivery_scores_df):,} rows)...")
    delivery_scores_df.to_csv(delivery_scores_path, index=False)
    logger.info("Saved delivery_pressure_scores.csv successfully.")

    # 4. Compute Player Clutch Impact Profiles
    logger.info("Calculating Batter Clutch Impact...")
    batter_impact = compute_batter_clutch_impact(bbb_enriched)

    logger.info("Calculating Bowler Clutch Impact...")
    bowler_impact = compute_bowler_clutch_impact(bbb_enriched)

    # 5. Apply Empirical Bayes Shrinkage
    # Batters: shrink raw_clutch_runs_added_per_100 on legal_balls_faced
    batter_shrunk = apply_empirical_bayes_shrinkage(
        batter_impact,
        value_col="raw_clutch_runs_added_per_100",
        sample_size_col="legal_balls_faced",
        output_prefix="batting_clutch",
        min_volume_threshold=150,
        min_pressure_threshold=40
    )

    # Bowlers: shrink raw_clutch_runs_saved_per_100 on legal_balls_bowled
    bowler_shrunk = apply_empirical_bayes_shrinkage(
        bowler_impact,
        value_col="raw_clutch_runs_saved_per_100",
        sample_size_col="legal_balls_bowled",
        output_prefix="bowling_clutch",
        min_volume_threshold=150,
        min_pressure_threshold=40
    )

    # Combine into unified player_clutch_ratings.csv
    # Prefix columns to avoid collisions
    bat_clean = batter_shrunk.copy()
    bowl_clean = bowler_shrunk.copy()

    # Outer merge on player_id
    player_ratings = bat_clean.merge(
        bowl_clean,
        on="player_id",
        how="outer",
        suffixes=("_batting", "_bowling")
    )

    # Coalesce player name
    player_ratings["player_name"] = player_ratings["player_name_batting"].combine_first(player_ratings["player_name_bowling"])
    player_ratings = player_ratings.drop(columns=["player_name_batting", "player_name_bowling"])

    # Reorder columns with player metadata first
    first_cols = ["player_id", "player_name", "batting_type", "bowling_type", "pace_or_spin"]
    remaining_cols = [c for c in player_ratings.columns if c not in first_cols]
    player_ratings = player_ratings[first_cols + remaining_cols]

    player_ratings_path = PROCESSED_DIR / "player_clutch_ratings.csv"
    logger.info(f"Saving {player_ratings_path} ({len(player_ratings):,} players)...")
    player_ratings.to_csv(player_ratings_path, index=False)
    logger.info("Saved player_clutch_ratings.csv successfully.")

    # 6. Sensitivity Analysis
    logger.info("Running sensitivity analysis across eligibility cutoffs and shrinkage weights...")
    sens_records = []
    
    # Batting sensitivity
    for vol_cut in [100, 150, 200, 250]:
        for hp_cut in [25, 40, 60]:
            eligible = (bat_clean["legal_balls_faced"] >= vol_cut) & (bat_clean["high_pressure_balls"] >= hp_cut)
            top_candidates = bat_clean[eligible].sort_values(by="batting_clutch_shrunk_rating", ascending=False).head(10)["player_name"].tolist()
            sens_records.append({
                "role": "BATTER",
                "volume_threshold": vol_cut,
                "high_pressure_threshold": hp_cut,
                "qualified_players_count": int(eligible.sum()),
                "top_ranked_sample": ", ".join(top_candidates[:5])
            })

    # Bowling sensitivity
    for vol_cut in [100, 150, 200, 250]:
        for hp_cut in [25, 40, 60]:
            eligible = (bowl_clean["legal_balls_bowled"] >= vol_cut) & (bowl_clean["high_pressure_balls"] >= hp_cut)
            top_candidates = bowl_clean[eligible].sort_values(by="bowling_clutch_shrunk_rating", ascending=False).head(10)["player_name"].tolist()
            sens_records.append({
                "role": "BOWLER",
                "volume_threshold": vol_cut,
                "high_pressure_threshold": hp_cut,
                "qualified_players_count": int(eligible.sum()),
                "top_ranked_sample": ", ".join(top_candidates[:5])
            })

    sens_df = pd.DataFrame(sens_records)
    sens_path = REPORTS_DIR / "player_rating_sensitivity.csv"
    sens_df.to_csv(sens_path, index=False)
    logger.info(f"Saved {sens_path} successfully.")

    # 7. Validation Visualizations
    logger.info("Generating Task 04 validation visualizations...")
    sns.set_theme(style="whitegrid", font="sans-serif")

    # Visual 1: Raw vs Shrunk Ratings (Shrinkage Effect)
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    
    # Batters
    bat_qual = bat_clean[bat_clean["is_eligible_for_ranking"]].copy()
    sns.scatterplot(
        data=bat_qual,
        x="raw_clutch_runs_added_per_100",
        y="batting_clutch_shrunk_rating",
        size="legal_balls_faced",
        sizes=(30, 200),
        alpha=0.75,
        ax=axes[0],
        color="#1f77b4"
    )
    axes[0].plot([-30, 40], [-30, 40], "k--", alpha=0.6, label="No Shrinkage (y = x)")
    axes[0].axhline(bat_clean["batting_clutch_prior_mean"].iloc[0], color="r", linestyle=":", label="Prior Mean")
    axes[0].set_title("Batting: Raw vs Empirical Bayes Posterior Rating", weight="bold")
    axes[0].set_xlabel("Raw Clutch Runs Added / 100 Balls")
    axes[0].set_ylabel("Shrunk Clutch Rating")
    axes[0].legend(loc="upper left")

    # Bowlers
    bowl_qual = bowl_clean[bowl_clean["is_eligible_for_ranking"]].copy()
    sns.scatterplot(
        data=bowl_qual,
        x="raw_clutch_runs_saved_per_100",
        y="bowling_clutch_shrunk_rating",
        size="legal_balls_bowled",
        sizes=(30, 200),
        alpha=0.75,
        ax=axes[1],
        color="#2ca02c"
    )
    axes[1].plot([-30, 40], [-30, 40], "k--", alpha=0.6, label="No Shrinkage (y = x)")
    axes[1].axhline(bowl_clean["bowling_clutch_prior_mean"].iloc[0], color="r", linestyle=":", label="Prior Mean")
    axes[1].set_title("Bowling: Raw vs Empirical Bayes Posterior Rating", weight="bold")
    axes[1].set_xlabel("Raw Clutch Runs Saved / 100 Balls")
    axes[1].set_ylabel("Shrunk Clutch Rating")
    axes[1].legend(loc="upper left")

    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "05_bayesian_shrinkage_effect.png", dpi=200)
    plt.close()

    # Visual 2: BPI & BowlerPI Density Distributions
    plt.figure(figsize=(10, 5))
    sns.kdeplot(bbb_enriched["batter_pressure_index"], label="Batter Pressure Index (BPI)", color="#d62728", fill=True, alpha=0.3, linewidth=2)
    sns.kdeplot(bbb_enriched["bowler_pressure_index"], label="Bowler Pressure Index (BowlerPI)", color="#1f77b4", fill=True, alpha=0.3, linewidth=2)
    plt.title("Distribution of Batter and Bowler Pressure Indices Across Primary Scope Deliveries", weight="bold", pad=12)
    plt.xlabel("Pressure Index (0 to 100)")
    plt.ylabel("Density")
    plt.xlim(0, 100)
    plt.axvline(35, color="gray", linestyle=":", label="Low / Moderate Cutoff (35)")
    plt.axvline(65, color="orange", linestyle="--", label="High Pressure Cutoff (65)")
    plt.axvline(85, color="red", linestyle="-.", label="Extreme Pressure Cutoff (85)")
    plt.legend(loc="upper right")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "06_pressure_indices_density.png", dpi=200)
    plt.close()

    logger.info("=== Task 04 Production Pipeline Completed Successfully! ===")


if __name__ == "__main__":
    run_task04_production_pipeline()

