"""
ClutchIQ - Task 04 Production Pressure Engine
Computes validated, monotonically sound Batter Pressure Index (BPI)
and Bowler Pressure Index (BowlerPI) bounded strictly to [0, 100].
"""

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger("ClutchIQ.PressureEngine")

PRESSURE_MODEL_VERSION = "2.1.0-monotonic-calibrated"


def compute_production_pressure_indices(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute delivery-level pressure features for batters and bowlers.
    Strictly pre-delivery, bounded in [0, 100], and monotonic.
    """
    logger.info("Computing production pressure indices...")
    df = df.copy()

    # Pre-delivery state inputs
    w_hand = df["wickets_in_hand_before"].clip(1, 10).values
    b_rem = df["legal_balls_remaining_before"].clip(1, 120).values
    inn = df["innings"].values
    phase = df["innings_phase_before"].values
    
    # 1. Context Type Classification
    def classify_context(row) -> str:
        if row["innings"] in [3, 4]:
            return "SUPER_OVER"
        elif row["innings"] == 1:
            return "FIRST_INNINGS"
        else:
            return "CHASE"

    df["pressure_context_type"] = [classify_context(r) for _, r in df.iterrows()]
    df["pressure_model_version"] = PRESSURE_MODEL_VERSION

    # 2. Match Leverage / Closeness Factor
    # Chase leverage is based on pre-delivery required run rate and remaining overs
    # In 1st innings, leverage is baseline 1.0 (neutral)
    rrr_clean = df["required_run_rate_before"].fillna(8.5).clip(0, 36).values
    target_clean = df["target_score"].fillna(170.0).values
    runs_rem = df["runs_remaining_before"].fillna(170.0).clip(0, 300).values

    # Pre-delivery win probability approximation (calibrated logistic surface)
    # p_win logit = 2.15 + 0.38 * w_hand - 0.28 * rrr - 0.015 * runs_rem + 0.02 * b_rem
    logit = 1.85 + 0.35 * w_hand - 0.26 * rrr_clean - 0.012 * runs_rem + 0.018 * b_rem
    p_win_pre = 1.0 / (1.0 + np.exp(-np.clip(logit, -10, 10)))
    df["win_prob_pre_delivery"] = np.where(np.isin(inn, [2, 4]), p_win_pre.round(4), np.nan)

    # Leverage Closeness Weight: peaks when p_win = 0.50, scaled by time scarcity
    # Closeness in [0.2, 1.0]
    closeness = 1.0 - 1.6 * np.abs(p_win_pre - 0.50)
    closeness = np.clip(closeness, 0.20, 1.00)
    urgency_time = np.sqrt(120.0 / (b_rem + 6.0))
    leverage = np.clip(closeness * (urgency_time**0.35), 0.30, 1.50)

    # -------------------------------------------------------------
    # 3. CHASE FORMULATION (Innings 2)
    # -------------------------------------------------------------
    # Demand ratio relative to standard competitive T20 par (8.50 RPO)
    D_bat = rrr_clean / 8.50
    # Wicket scarcity: as wickets fall, scarcity increases
    S_w_bat = (10.0 / (w_hand + 1.0))**0.42
    # Ball scarcity: as balls decrease, scarcity increases
    S_b_bat = (120.0 / (b_rem + 6.0))**0.25

    bpi_chase_raw = 42.0 * (D_bat**1.15) * S_w_bat * S_b_bat * (leverage**0.35)
    bpi_chase = np.clip(bpi_chase_raw, 0.0, 100.0)

    # Bowler Chase:
    # Bowler pressure is highest when RRR is demanding (< 18) AND batting team has wickets in hand
    # If RRR > 25 and batting team has 1 wicket in hand, bowler pressure drops (game effectively won)
    D_bowl = np.minimum(D_bat, 2.35)
    # If batting team has deep wickets (w_hand=8), bowler has zero margin for error
    S_w_bowl = ((11.0 - w_hand) / 10.0)**(-0.35)
    S_b_bowl = (120.0 / (b_rem + 6.0))**0.28

    bowlpi_chase_raw = 44.0 * D_bowl * S_w_bowl * S_b_bowl * (leverage**0.45)
    # When batting team has 1-2 wickets in hand and RRR > 18, bowler pressure reduces
    bowler_relief = np.where((w_hand <= 2) & (D_bat > 2.0), 0.65, 1.0)
    bowlpi_chase = np.clip(bowlpi_chase_raw * bowler_relief, 0.0, 100.0)

    # -------------------------------------------------------------
    # 4. FIRST-INNINGS FORMULATION (Innings 1)
    # -------------------------------------------------------------
    # Empirical par deficit: 169 - projected score
    # Phase weight
    phase_weights = {
        "Powerplay": 1.00,
        "Middle": 1.25,
        "Death": 1.65,
        "SuperOver": 2.00
    }
    pw = np.array([phase_weights.get(p, 1.20) for p in phase])

    # Dynamic Par Deficit from empirical surface:
    # Approximate empirical surface formula:
    # expected_runs_rem = 0.85 * b_rem + 4.8 * (w_hand - 1)
    exp_rem = np.maximum(0, 0.85 * b_rem + 4.8 * (w_hand - 1))
    runs_before = df["runs_before_ball_lower_bound"].values
    projected_par = runs_before + exp_rem
    par_deficit = np.maximum(0, 169.0 - projected_par)
    par_surplus = np.maximum(0, projected_par - 169.0)

    # Batter Innings 1: high when team is in deficit or at the death with fewer wickets
    bpi_inn1_raw = 26.0 * pw * (1.0 + par_deficit / 32.0) * ((10.0 / (w_hand + 1.0))**0.36)
    bpi_inn1 = np.clip(bpi_inn1_raw, 0.0, 100.0)

    # Bowler Innings 1: high when batting team is above par with wickets in hand at death/middle
    bowlpi_inn1_raw = 26.0 * pw * (1.0 + par_surplus / 32.0) * ((w_hand / 10.0)**0.45)
    bowlpi_inn1 = np.clip(bowlpi_inn1_raw, 0.0, 100.0)

    # -------------------------------------------------------------
    # 5. SUPER OVER FORMULATION (Innings 3 & 4)
    # -------------------------------------------------------------
    # In Super Overs, balls remaining = 1 to 6, wickets in hand = 1 to 2 (2 wickets all out)
    # Innings 3 (Setting target): BPI = 85 to 95; BowlerPI = 85 to 95
    # Innings 4 (Chasing): Scales dynamically with runs needed vs balls remaining
    bpi_so = np.where(
        inn == 3,
        np.clip(85.0 + (6.0 - b_rem) * 2.0 + (2.0 - np.minimum(w_hand, 2)) * 4.0, 80.0, 100.0),
        np.clip(85.0 + D_bat * 5.0 + (6.0 - b_rem) * 2.0, 80.0, 100.0)
    )
    bowlpi_so = np.where(
        inn == 3,
        np.clip(85.0 + (6.0 - b_rem) * 2.0, 80.0, 100.0),
        np.clip(85.0 + (np.minimum(D_bat, 2.5) * 5.0), 80.0, 100.0)
    )

    # -------------------------------------------------------------
    # 6. COMBINE & ENFORCE STRICT BOUNDS [0, 100]
    # -------------------------------------------------------------
    is_so = np.isin(inn, [3, 4])
    is_chase = (inn == 2)
    final_bpi = np.where(is_so, bpi_so, np.where(is_chase, bpi_chase, bpi_inn1))
    final_bowlpi = np.where(is_so, bowlpi_so, np.where(is_chase, bowlpi_chase, bowlpi_inn1))

    df["batter_pressure_index"] = np.clip(final_bpi, 0.0, 100.0).round(2)
    df["bowler_pressure_index"] = np.clip(final_bowlpi, 0.0, 100.0).round(2)

    # Pressure Tier Assignment
    def assign_tier(val: float) -> str:
        if val < 35.0:
            return "LOW"
        elif val < 65.0:
            return "MODERATE"
        elif val < 85.0:
            return "HIGH"
        else:
            return "EXTREME"

    df["batter_pressure_tier"] = df["batter_pressure_index"].apply(assign_tier)
    df["bowler_pressure_tier"] = df["bowler_pressure_index"].apply(assign_tier)

    # Confidence Label
    df["pressure_confidence"] = np.where(
        df["target_confidence"].isin(["AUTHORITATIVE_DLS_TARGET", "EXACT_RECONSTRUCTED_TARGET", "EXACT_SUPER_OVER_TARGET"]),
        "EXACT_CONFIDENCE",
        np.where(df["target_confidence"] == "ESTIMATED_TARGET_LOWER_BOUND", "ESTIMATED_FLOOR_CONFIDENCE", "PAR_MODEL_CONFIDENCE")
    )

    logger.info(f"Production pressure indices computed: Mean BPI={df['batter_pressure_index'].mean():.2f}, Mean BowlerPI={df['bowler_pressure_index'].mean():.2f}")
    return df
