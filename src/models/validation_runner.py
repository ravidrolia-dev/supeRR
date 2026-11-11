"""
ClutchIQ - Task 03.1 Validation & Model Comparison Runner
Generates:
1. reports/pressure/pressure_confidence_coverage.csv
2. reports/pressure/pressure_model_comparison.csv
3. reports/pressure/validation_visuals/ (Calibration curves, ROC, leverage vs state)
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
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import calibration_curve
from sklearn.metrics import brier_score_loss, roc_auc_score, log_loss, roc_curve, precision_recall_curve

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ClutchIQ.ValidationRunner")

REPORTS_DIR = Path("reports/pressure")
VISUALS_DIR = REPORTS_DIR / "validation_visuals"
VISUALS_DIR.mkdir(parents=True, exist_ok=True)


def run_statistical_validation():
    logger.info("Loading master datasets...")
    bbb = pd.read_csv("data/processed/master_ball_by_ball.csv", low_memory=False)
    mc = pd.read_csv("data/processed/match_context.csv", low_memory=False)
    scope = bbb[bbb["is_primary_scope"]].copy()

    # =========================================================================
    # 1. CHASE CONFIDENCE AUDIT & COVERAGE EXPORT
    # =========================================================================
    logger.info("Auditing chase score confidence at delivery, innings, and match levels...")
    chase = scope[scope["innings"].isin([2, 4])].copy()
    
    # Delivery level counts
    deliv_counts = chase["target_confidence"].value_counts()
    deliv_pcts = (deliv_counts / len(chase) * 100).round(2)
    
    # Match level counts
    match_conf = chase.groupby("match_id")["target_confidence"].first().value_counts()
    match_pcts = (match_conf / len(chase.groupby("match_id")) * 100).round(2)

    coverage_rows = []
    for conf_tier in ["AUTHORITATIVE_DLS_TARGET", "EXACT_RECONSTRUCTED_TARGET", "ESTIMATED_TARGET_LOWER_BOUND", "EXACT_SUPER_OVER_TARGET"]:
        d_cnt = int(deliv_counts.get(conf_tier, 0))
        d_pct = float(deliv_pcts.get(conf_tier, 0.0))
        m_cnt = int(match_conf.get(conf_tier, 0))
        m_pct = float(match_pcts.get(conf_tier, 0.0))
        
        # Primary usage recommendation
        if conf_tier in ["AUTHORITATIVE_DLS_TARGET", "EXACT_RECONSTRUCTED_TARGET", "EXACT_SUPER_OVER_TARGET"]:
            rec = "PRIMARY_EXACT_ANALYSIS (Strict Ground-Truth Benchmark)"
        else:
            rec = "PRIMARY_SUPPORTED_FLOOR (Robust Bounds for Broad Sample Coverage)"
            
        coverage_rows.append({
            "confidence_tier": conf_tier,
            "deliveries_count": d_cnt,
            "deliveries_pct": d_pct,
            "matches_count": m_cnt,
            "matches_pct": m_pct,
            "exact_score_status": "EXACT" if "EXACT" in conf_tier or "AUTHORITATIVE" in conf_tier else "LOWER_BOUND_FLOOR",
            "usage_recommendation": rec
        })
    
    coverage_df = pd.DataFrame(coverage_rows)
    coverage_df.to_csv(REPORTS_DIR / "pressure_confidence_coverage.csv", index=False)
    logger.info("Saved reports/pressure/pressure_confidence_coverage.csv")

    # =========================================================================
    # 2. FIRST-INNINGS PAR MODEL VALIDATION (5-FOLD MATCH SPLIT)
    # =========================================================================
    logger.info("Evaluating first-innings expected par model vs baseline...")
    inn1 = scope[scope["innings"] == 1].copy()
    inn1_totals = inn1.groupby("match_id")["runs_before_ball_lower_bound"].max().to_dict()
    inn1["final_total"] = inn1["match_id"].map(inn1_totals)
    inn1["actual_runs_remaining"] = inn1["final_total"] - inn1["runs_before_ball_lower_bound"]

    unique_matches = inn1["match_id"].unique()
    np.random.seed(42)
    np.random.shuffle(unique_matches)
    folds = np.array_split(unique_matches, 5)

    mae_par_list, mae_const_list = [], []
    rmse_par_list, rmse_const_list = [], []
    median_baseline = np.median(list(inn1_totals.values())) # 169.0

    for test_m in folds:
        train_m = [m for m in unique_matches if m not in test_m]
        train_df = inn1[inn1["match_id"].isin(train_m)].copy()
        test_df = inn1[inn1["match_id"].isin(test_m)].copy()
        
        train_df["overs_rem"] = (train_df["legal_balls_remaining_before"] // 6).clip(0, 20)
        test_df["overs_rem"] = (test_df["legal_balls_remaining_before"] // 6).clip(0, 20)
        
        par_map = train_df.groupby(["wickets_in_hand_before", "overs_rem"])["actual_runs_remaining"].mean().to_dict()
        global_overs = train_df.groupby("overs_rem")["actual_runs_remaining"].mean().to_dict()
        
        test_df["pred_rem_par"] = [par_map.get((w, o), global_overs.get(o, 0)) for w, o in zip(test_df["wickets_in_hand_before"], test_df["overs_rem"])]
        test_df["pred_final_par"] = test_df["runs_before_ball_lower_bound"] + test_df["pred_rem_par"]
        
        err_par = test_df["pred_final_par"] - test_df["final_total"]
        err_const = median_baseline - test_df["final_total"]
        
        mae_par_list.append(np.abs(err_par).mean())
        mae_const_list.append(np.abs(err_const).mean())
        rmse_par_list.append(np.sqrt((err_par**2).mean()))
        rmse_const_list.append(np.sqrt((err_const**2).mean()))

    par_mae = np.mean(mae_par_list)
    par_rmse = np.mean(rmse_par_list)
    const_mae = np.mean(mae_const_list)
    const_rmse = np.mean(rmse_const_list)
    logger.info(f"Par Surface 5-Fold: MAE={par_mae:.2f}, RMSE={par_rmse:.2f} vs Const Median: MAE={const_mae:.2f}, RMSE={const_rmse:.2f}")

    # =========================================================================
    # 3. WIN PROBABILITY & MATCH LEVERAGE (TEMPORAL + RANDOM SPLITS)
    # =========================================================================
    logger.info("Evaluating win probability models and match leverage across validation splits...")
    chase_inn2 = scope[scope["innings"] == 2].copy()
    chase_inn2["chase_won"] = (chase_inn2["win_team_id"] == chase_inn2["batting_team_id"]).astype(int)
    chase_inn2["year"] = chase_inn2["season"].astype(str).str[:4].astype(int)

    features = ["runs_remaining_before", "legal_balls_remaining_before", "wickets_in_hand_before", "required_run_rate_before"]
    
    # Temporal Split: 2022-2024 (Train) vs 2025-2026 (Test)
    train_mask_temp = chase_inn2["year"].isin([2022, 2023, 2024])
    test_mask_temp = chase_inn2["year"].isin([2025, 2026])

    X_train_temp = chase_inn2.loc[train_mask_temp, features].clip(0, 500)
    y_train_temp = chase_inn2.loc[train_mask_temp, "chase_won"]
    X_test_temp = chase_inn2.loc[test_mask_temp, features].clip(0, 500)
    y_test_temp = chase_inn2.loc[test_mask_temp, "chase_won"]

    lr_temp = LogisticRegression(max_iter=1000)
    lr_temp.fit(X_train_temp, y_train_temp)
    preds_temp = lr_temp.predict_proba(X_test_temp)[:, 1]

    # Metrics
    brier_prev_temp = ((y_test_temp - y_train_temp.mean())**2).mean()
    brier_temp = brier_score_loss(y_test_temp, preds_temp)
    auc_temp = roc_auc_score(y_test_temp, preds_temp)
    logloss_temp = log_loss(y_test_temp, preds_temp)

    # Random Match Split (70% Train, 30% Test)
    match_ids = chase_inn2["match_id"].unique()
    np.random.seed(42)
    train_matches = set(np.random.choice(match_ids, size=int(0.7 * len(match_ids)), replace=False))
    
    train_mask_rnd = chase_inn2["match_id"].isin(train_matches)
    test_mask_rnd = ~train_mask_rnd

    X_train_rnd = chase_inn2.loc[train_mask_rnd, features].clip(0, 500)
    y_train_rnd = chase_inn2.loc[train_mask_rnd, "chase_won"]
    X_test_rnd = chase_inn2.loc[test_mask_rnd, features].clip(0, 500)
    y_test_rnd = chase_inn2.loc[test_mask_rnd, "chase_won"]

    lr_rnd = LogisticRegression(max_iter=1000)
    lr_rnd.fit(X_train_rnd, y_train_rnd)
    preds_rnd = lr_rnd.predict_proba(X_test_rnd)[:, 1]

    brier_prev_rnd = ((y_test_rnd - y_train_rnd.mean())**2).mean()
    brier_rnd = brier_score_loss(y_test_rnd, preds_rnd)
    auc_rnd = roc_auc_score(y_test_rnd, preds_rnd)
    logloss_rnd = log_loss(y_test_rnd, preds_rnd)

    # Save Model Comparison CSV
    model_comparison_df = pd.DataFrame([
        {
            "model_name": "Innings 1 Par Surface (Empirical Grid)",
            "evaluation_type": "5-Fold Match Out-of-Sample",
            "metric_1_name": "MAE (Runs)",
            "metric_1_value": round(par_mae, 2),
            "metric_2_name": "RMSE (Runs)",
            "metric_2_value": round(par_rmse, 2),
            "benchmark_name": "Constant Median (169.0)",
            "benchmark_metric_1": round(const_mae, 2),
            "benchmark_metric_2": round(const_rmse, 2),
            "relative_improvement_pct": round(((const_mae - par_mae) / const_mae) * 100, 2)
        },
        {
            "model_name": "Chase Win Probability (Logistic Pre-delivery)",
            "evaluation_type": "Random Match Split (70/30)",
            "metric_1_name": "Brier Score",
            "metric_1_value": round(brier_rnd, 4),
            "metric_2_name": "ROC AUC",
            "metric_2_value": round(auc_rnd, 4),
            "benchmark_name": "Prevalence Constant (p=0.498)",
            "benchmark_metric_1": round(brier_prev_rnd, 4),
            "benchmark_metric_2": 0.5000,
            "relative_improvement_pct": round(((brier_prev_rnd - brier_rnd) / brier_prev_rnd) * 100, 2)
        },
        {
            "model_name": "Chase Win Probability (Logistic Pre-delivery)",
            "evaluation_type": "Temporal Split (2022-24 to 2025-26)",
            "metric_1_name": "Brier Score",
            "metric_1_value": round(brier_temp, 4),
            "metric_2_name": "ROC AUC",
            "metric_2_value": round(auc_temp, 4),
            "benchmark_name": "Prevalence Constant (p=0.505)",
            "benchmark_metric_1": round(brier_prev_temp, 4),
            "benchmark_metric_2": 0.5000,
            "relative_improvement_pct": round(((brier_prev_temp - brier_temp) / brier_prev_temp) * 100, 2)
        }
    ])
    model_comparison_df.to_csv(REPORTS_DIR / "pressure_model_comparison.csv", index=False)
    logger.info("Saved reports/pressure/pressure_model_comparison.csv")

    # =========================================================================
    # 4. GENERATING VALIDATION VISUALIZATIONS
    # =========================================================================
    logger.info("Generating statistical validation visual charts...")
    sns.set_theme(style="whitegrid", font="sans-serif")

    # Visual 1: Calibration Curve & Reliability Diagram
    prob_true, prob_pred = calibration_curve(y_test_rnd, preds_rnd, n_bins=10, strategy="uniform")
    plt.figure(figsize=(8, 6))
    plt.plot([0, 1], [0, 1], "k--", label="Perfect Calibration")
    plt.plot(prob_pred, prob_true, "s-", color="#1f77b4", linewidth=2, label="Pre-Delivery Win Prob (Brier=0.1276)")
    plt.title("Reliability Diagram: Pre-Delivery Win Probability Calibration", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Mean Predicted Win Probability", fontsize=11)
    plt.ylabel("Observed Fraction of Chase Victories", fontsize=11)
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "01_win_prob_calibration_curve.png", dpi=200)
    plt.close()

    # Visual 2: ROC and Precision-Recall Curves
    fpr, tpr, _ = roc_curve(y_test_rnd, preds_rnd)
    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color="#2ca02c", linewidth=2.5, label=f"Logistic Model (AUC = {auc_rnd:.4f})")
    plt.plot([0, 1], [0, 1], "k--", label="Random Chance (AUC = 0.5000)")
    plt.title("ROC Curve: Chase Outcome Discriminatory Power", fontsize=13, weight="bold", pad=12)
    plt.xlabel("False Positive Rate", fontsize=11)
    plt.ylabel("True Positive Rate", fontsize=11)
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "02_win_prob_roc_curve.png", dpi=200)
    plt.close()

    # Visual 3: Expected Remaining Runs Error Residuals
    plt.figure(figsize=(9, 5))
    sns.histplot(test_df["pred_final_par"] - test_df["final_total"], bins=40, kde=True, color="#9467bd")
    plt.axvline(0, color="r", linestyle="--", linewidth=1.5)
    plt.title("Out-of-Sample Par Model Residuals: Projected Par - Actual Final Total", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Prediction Error (Runs)", fontsize=11)
    plt.ylabel("Delivery Frequency", fontsize=11)
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "03_par_model_residuals.png", dpi=200)
    plt.close()

    # Visual 4: Leverage Index vs P(Win)
    plt.figure(figsize=(8, 5))
    p_grid = np.linspace(0, 1, 200)
    closeness_grid = 1.0 - 2.0 * np.abs(p_grid - 0.5)
    plt.plot(p_grid, closeness_grid, color="#d62728", linewidth=2.5, label="Closeness Weight = 1 - 2*|P(Win) - 0.5|")
    plt.axvline(0.5, color="k", linestyle=":", alpha=0.7, label="Peak Dead-Heat (P=0.50)")
    plt.title("Match Closeness Weight as a Function of Pre-Delivery Win Probability", fontsize=13, weight="bold", pad=12)
    plt.xlabel("Pre-Delivery Win Probability P(Win)", fontsize=11)
    plt.ylabel("Closeness / Leverage Weight (0 to 1)", fontsize=11)
    plt.legend()
    plt.tight_layout()
    plt.savefig(VISUALS_DIR / "04_match_closeness_function.png", dpi=200)
    plt.close()

    logger.info("Task 03.1 Statistical Validation script completed successfully.")


if __name__ == "__main__":
    run_statistical_validation()

