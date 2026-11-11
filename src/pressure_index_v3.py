"""
ClutchIQ - Task 08 Production Pressure Engine V3 (Research & Experimental Architecture)
Incorporates Match-Level Context Difficulty:
- Dimension 1: Situational Scarcity & Demand (Balls, Wickets, RRR/Deficit)
- Dimension 2: Match-Level Difficulty (Chase Difficulty Index CDI & Defence Difficulty Index DDI)
- Dimension 3: Dynamic Match Win-Probability Leverage

Features:
- Actor-specific perspective (Batter vs Bowler)
- Opening-pressure awareness from ball 1 without lookahead leakage
- Strictly bounded to [0, 100]
"""

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger("ClutchIQ.PressureEngineV3")

PRESSURE_MODEL_VERSION = "3.0.0-match-difficulty-calibrated"

# Historical Par Scoring Environments (1st Innings 2008-2024 empirical medians)
BASELINE_PAR = {
    "IPL": 175.0,
    "T20I": 158.0,
    "Other T20": 150.0
}


def compute_match_difficulty_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Chase Difficulty Index (CDI) and Defence Difficulty Index (DDI).
    Evaluated from the start of the innings, strictly pre-delivery.
    """
    df = df.copy()
    
    # 1. Base Expected Par for the match context
    comp = df["competition_category"].fillna("IPL").values
    base_par = np.array([BASELINE_PAR.get(c, 165.0) for c in comp])
    
    # 2. Target Score & Chase Difficulty Index (CDI)
    # Available in Innings 2 (and 4)
    target = np.where(df["target_score"].notna(), df["target_score"].values, base_par)
    inn = df["innings"].values
    
    # Target ratio relative to baseline par: 1.0 = par, 1.4 = +40% above par (e.g. 245 vs 175)
    target_ratio = target / base_par
    
    # Initial Chase Difficulty [-1.0, 1.0]:
    # 0.0 at par, +1.0 at +50% above par (262+ in IPL), -1.0 at -50% below par (87- in IPL)
    cdi_initial = np.clip((target_ratio - 1.0) / 0.50, -1.0, 1.0)
    
    # Dynamic Evolving CDI: incorporates evolving RRR relative to initial RRR
    # In chase, initial required rate is target / 20.0
    fallback_rrr = target / 20.0
    rrr_clean = np.where(df["required_run_rate_before"].notna(), df["required_run_rate_before"].values, fallback_rrr)
    rrr_clean = np.clip(rrr_clean, 0, 36)
    base_rrr = base_par / 20.0 # ~8.75 in IPL, 7.9 in T20I
    
    cdi_dynamic = np.clip((rrr_clean / base_rrr - 1.0) / 0.75, -1.0, 1.0)
    
    # Blend: 50% initial match-level target difficulty + 50% current evolving chase state
    cdi_combined = 0.50 * cdi_initial + 0.50 * cdi_dynamic
    df["chase_difficulty_index"] = np.where(np.isin(inn, [2, 4]), np.round(cdi_combined, 4), np.nan)
    
    # 3. Defence Difficulty Index (DDI)
    # From defending bowling team's perspective in Innings 2:
    # Defending a tiny total (e.g. 110) creates immense bowling pressure from ball 1 (DDI = +0.74)
    # Defending a massive total (e.g. 250) creates very low bowling pressure from ball 1 (DDI = -0.86)
    # As the chase progresses, if defending team takes wickets, DDI decreases; if batters cruise, DDI increases.
    w_hand = df["wickets_in_hand_before"].clip(1, 10).values
    b_rem = df["legal_balls_remaining_before"].clip(1, 120).values
    
    # DDI Initial is inverse of target difficulty:
    ddi_initial = -cdi_initial
    
    # Dynamic DDI evolves based on win probability / batting resources remaining:
    # If chasing team is comfortably ahead (RRR <= 7.0 and w_hand >= 8), defending is nearly impossible (DDI -> +1.0)
    # If chasing team is crushed (RRR >= 16.0 or w_hand <= 3), defending is easy (DDI -> -1.0)
    ddi_dynamic = np.clip((base_rrr - rrr_clean) / 6.0 + (w_hand - 5.0) / 10.0, -1.0, 1.0)
    ddi_combined = 0.50 * ddi_initial + 0.50 * ddi_dynamic
    df["defence_difficulty_index"] = np.where(np.isin(inn, [2, 4]), np.round(ddi_combined, 4), np.nan)
    
    return df


def compute_pressure_indices_v3(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes V3 Pressure Indices (BPI_v3 and BowlerPI_v3).
    Evaluates:
    - Dimension 1: Situational Scarcity & Demand
    - Dimension 2: Match Difficulty (CDI / DDI)
    - Dimension 3: Dynamic Leverage
    """
    logger.info("Computing Pressure Indices V3 (Match-Context Calibrated)...")
    df = compute_match_difficulty_features(df)
    
    w_hand = df["wickets_in_hand_before"].clip(1, 10).values
    b_rem = df["legal_balls_remaining_before"].clip(1, 120).values
    inn = df["innings"].values
    phase = df["innings_phase_before"].values
    comp = df["competition_category"].fillna("IPL").values
    base_par = np.array([BASELINE_PAR.get(c, 165.0) for c in comp])
    
    cdi = df["chase_difficulty_index"].fillna(0.0).values
    ddi = df["defence_difficulty_index"].fillna(0.0).values
    
    # -------------------------------------------------------------
    # 1. DYNAMIC MATCH WIN PROBABILITY & LEVERAGE
    # -------------------------------------------------------------
    fallback_rrr = base_par / 20.0
    rrr_clean = np.where(df["required_run_rate_before"].notna(), df["required_run_rate_before"].values, fallback_rrr)
    rrr_clean = np.clip(rrr_clean, 0, 36)
    runs_rem = (rrr_clean * (b_rem / 6.0)).clip(0, 300)
    
    # Calibrated pre-delivery logit surface
    logit = 1.95 + 0.36 * w_hand - 0.28 * rrr_clean - 0.010 * runs_rem + 0.015 * b_rem
    p_win_pre = 1.0 / (1.0 + np.exp(-np.clip(logit, -10, 10)))
    df["win_prob_v3"] = np.where(np.isin(inn, [2, 4]), np.round(p_win_pre, 4), np.nan)
    
    # Leverage: peaks when match is tight (p_win = 0.50) and balls are expiring
    closeness = 1.0 - 1.5 * np.abs(p_win_pre - 0.50)
    closeness = np.clip(closeness, 0.25, 1.00)
    time_factor = (120.0 / (b_rem + 10.0))**0.20
    leverage = np.clip(closeness * time_factor, 0.30, 1.40)
    
    # -------------------------------------------------------------
    # 2. CHASE FORMULATION (Innings 2 & 4)
    # -------------------------------------------------------------
    # Base demand ratio
    base_rrr = base_par / 20.0
    D_bat = rrr_clean / base_rrr # 1.0 at par rate
    
    # Resource Scarcity
    S_w_bat = (10.0 / (w_hand + 1.0))**0.38
    S_b_bat = (120.0 / (b_rem + 10.0))**0.22
    
    # Batter Chase V3:
    # Situational base (40) * Demand * Scarcities * Leverage
    # Match difficulty offset: +18 * CDI (chasing 250+ gives +15 to +18 BPI from ball 1!)
    bpi_chase_sit = 40.0 * (D_bat**1.05) * S_w_bat * S_b_bat * (leverage**0.30)
    bpi_chase_v3 = bpi_chase_sit + 16.0 * cdi
    bpi_chase_v3 = np.clip(bpi_chase_v3, 5.0, 100.0)
    
    # Bowler Chase V3 (DEFENDING TEAM'S PERSPECTIVE):
    # Bowler pressure is driven by DDI (Difficulty of Defending)!
    # When defending 120, DDI = +0.62 -> Bowler pressure is high (zero margin for error)!
    # When defending 250, DDI = -0.86 -> Bowler pressure is low (huge cushion)!
    # As wickets fall (w_hand decreases), bowler pressure drops because defence is succeeding.
    S_w_bowl = (w_hand / 10.0)**0.40 # More wickets in hand for batter = more pressure on bowler
    # Bowler situational pressure: highest when match is close or batting team has wickets
    bowl_close = 48.0 * (leverage**0.40) * S_w_bowl
    # Match difficulty offset: +20 * DDI
    bowlpi_chase_v3 = bowl_close + 18.0 * ddi
    
    # Relief when batting team is doomed (e.g. 8 wickets down and RRR > 18)
    relief = np.where((w_hand <= 2) & (rrr_clean > 18.0), 0.60, 1.0)
    bowlpi_chase_v3 = np.clip(bowlpi_chase_v3 * relief, 5.0, 100.0)
    
    # -------------------------------------------------------------
    # 3. FIRST-INNINGS FORMULATION (Innings 1)
    # -------------------------------------------------------------
    # In first innings, neither team knows the final target.
    # Evaluation uses strictly pre-delivery score relative to expected par for current state.
    phase_weights_bat = {"Powerplay": 1.05, "Middle": 1.25, "Death": 1.60}
    phase_weights_bowl = {"Powerplay": 1.10, "Middle": 1.25, "Death": 1.55}
    
    pw_b = np.array([phase_weights_bat.get(p, 1.20) for p in phase])
    pw_bw = np.array([phase_weights_bowl.get(p, 1.20) for p in phase])
    
    # Empirical Expected Remaining Runs surface:
    exp_rem = np.maximum(0, 0.88 * b_rem + 4.6 * (w_hand - 1))
    if "runs_before_ball_lower_bound" in df.columns:
        runs_before = df["runs_before_ball_lower_bound"].values
    else:
        # Fallback approximation from overs bowled
        balls_bowled = np.maximum(0, 120 - b_rem)
        runs_before = balls_bowled * 1.35
    projected_par = runs_before + exp_rem
    
    par_deficit = np.maximum(0, base_par - projected_par)
    par_surplus = np.maximum(0, projected_par - base_par)
    
    # Batter 1st Innings:
    # Base pressure begins around 40-45 in powerplay, rises if wickets fall early or at death
    bpi_inn1_v3 = 30.0 * pw_b * (1.0 + par_deficit / 35.0) * ((10.0 / (w_hand + 1.0))**0.34)
    bpi_inn1_v3 = np.clip(bpi_inn1_v3, 10.0, 100.0)
    
    # Bowler 1st Innings:
    # High when batting team is ahead of par or power hitters are active with wickets in hand
    bowlpi_inn1_v3 = 28.0 * pw_bw * (1.0 + par_surplus / 35.0) * ((w_hand / 10.0)**0.40)
    bowlpi_inn1_v3 = np.clip(bowlpi_inn1_v3, 10.0, 100.0)
    
    # -------------------------------------------------------------
    # 4. SUPER OVER FORMULATION (Innings 3 & 4)
    # -------------------------------------------------------------
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
    # 5. ASSEMBLE FINAL V3 INDICES
    # -------------------------------------------------------------
    is_so = np.isin(inn, [3, 4])
    is_chase = (inn == 2)
    
    final_bpi = np.where(is_so, bpi_so, np.where(is_chase, bpi_chase_v3, bpi_inn1_v3))
    final_bowlpi = np.where(is_so, bowlpi_so, np.where(is_chase, bowlpi_chase_v3, bowlpi_inn1_v3))
    
    df["batter_pressure_index_v3"] = np.clip(final_bpi, 0.0, 100.0).round(2)
    df["bowler_pressure_index_v3"] = np.clip(final_bowlpi, 0.0, 100.0).round(2)
    
    # Tier assignment
    def assign_tier(val: float) -> str:
        if val < 35.0:
            return "LOW"
        elif val < 65.0:
            return "MODERATE"
        elif val < 85.0:
            return "HIGH"
        else:
            return "EXTREME"
            
    df["batter_pressure_tier_v3"] = df["batter_pressure_index_v3"].apply(assign_tier)
    df["bowler_pressure_tier_v3"] = df["bowler_pressure_index_v3"].apply(assign_tier)
    
    logger.info(f"V3 Indices computed: Mean BPI_v3={df['batter_pressure_index_v3'].mean():.2f}, Mean BowlerPI_v3={df['bowler_pressure_index_v3'].mean():.2f}")
    return df
