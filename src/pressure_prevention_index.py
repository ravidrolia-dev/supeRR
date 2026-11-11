"""
Pressure Prevention Index (PPI) Module
ClutchIQ — Task 08.1

Measures player contributions to creating and maintaining favourable match conditions
before conventional high pressure develops.
"""

import logging
import numpy as np
import pandas as pd
from typing import Tuple

logger = logging.getLogger("clutch_iq.ppi")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def compute_batter_pressure_prevention(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Batter Pressure Prevention Index (PPI):
    1. Early/Powerplay runs added above expected par (RAR per 100).
    2. Chase Required Run Rate delta (reduction of RRR during their innings).
    3. Contextual early-innings strike rate and dismissal risk.
    """
    logger.info("Computing Batter Pressure Prevention profiles...")
    primary_df = df[df["is_primary_scope"]].copy()

    # Early/Mid balls (Powerplay + Middle, overs 1-16)
    early_df = primary_df[primary_df["innings_phase_before"].isin(["Powerplay", "Middle"])]
    pp_df = primary_df[primary_df["innings_phase_before"] == "Powerplay"]

    # PP Aggregates
    pp_agg = pp_df.groupby("striker_id").agg({
        "is_legal_ball": "sum",
        "batter_runs": "sum",
        "batter_runs_added": "sum",
        "is_wicket": "sum"
    }).reset_index()
    pp_agg.columns = ["striker_id", "pp_legal_balls", "pp_runs", "pp_runs_added", "pp_wickets"]
    pp_agg["pp_strike_rate"] = round((pp_agg["pp_runs"] / pp_agg["pp_legal_balls"].replace(0, 1)) * 100.0, 2)
    pp_agg["pp_rar_per_100"] = round((pp_agg["pp_runs_added"] / pp_agg["pp_legal_balls"].replace(0, 1)) * 100.0, 2)
    pp_agg["pp_dismissal_rate"] = round((pp_agg["pp_wickets"] / pp_agg["pp_legal_balls"].replace(0, 1)) * 100.0, 2)

    # Early/Mid Aggregates
    em_agg = early_df.groupby("striker_id").agg({
        "is_legal_ball": "sum",
        "batter_runs": "sum",
        "batter_runs_added": "sum",
        "is_wicket": "sum"
    }).reset_index()
    em_agg.columns = ["striker_id", "early_mid_legal_balls", "early_mid_runs", "early_mid_runs_added", "early_mid_wickets"]
    em_agg["early_mid_strike_rate"] = round((em_agg["early_mid_runs"] / em_agg["early_mid_legal_balls"].replace(0, 1)) * 100.0, 2)
    em_agg["early_mid_rar_per_100"] = round((em_agg["early_mid_runs_added"] / em_agg["early_mid_legal_balls"].replace(0, 1)) * 100.0, 2)

    # Chase RRR Acceleration/Reduction
    chase_df = primary_df[(primary_df["innings"] == 2) & (primary_df["required_run_rate_before"].notna())]
    chase_matches = chase_df.groupby(["match_id", "striker_id"]).agg({
        "required_run_rate_before": ["first", "last"],
        "is_legal_ball": "sum"
    }).reset_index()
    chase_matches.columns = ["match_id", "striker_id", "rrr_start", "rrr_end", "chase_balls"]
    chase_matches["rrr_delta"] = chase_matches["rrr_end"] - chase_matches["rrr_start"]
    chase_agg = chase_matches.groupby("striker_id").agg({
        "rrr_delta": "mean",
        "chase_balls": "sum"
    }).reset_index()
    chase_agg.columns = ["striker_id", "mean_chase_rrr_delta", "chase_legal_balls"]
    chase_agg["mean_chase_rrr_delta"] = round(chase_agg["mean_chase_rrr_delta"], 3)

    # Total legal balls across all phases
    tot_agg = primary_df.groupby("striker_id").agg({
        "striker_name": "first",
        "is_legal_ball": "sum",
        "match_id": "nunique"
    }).reset_index()
    tot_agg.columns = ["striker_id", "player_name", "total_legal_balls", "total_matches"]

    # Merge
    bat_ppi = tot_agg.merge(em_agg, on="striker_id", how="left")
    bat_ppi = bat_ppi.merge(pp_agg, on="striker_id", how="left")
    bat_ppi = bat_ppi.merge(chase_agg, on="striker_id", how="left")
    bat_ppi = bat_ppi.fillna(0)

    # Risk-adjusted Aggression Formula
    # raw_ppi combines:
    # 50% PP RAR/100 (acute early impact)
    # 35% Early/Mid RAR/100 (sustained foundation)
    # 15% Chase RRR reduction bonus (-8.0 * mean_chase_rrr_delta)
    chase_bonus = np.clip(-8.0 * bat_ppi["mean_chase_rrr_delta"].values, -15.0, 15.0)
    raw_ppi = (
        0.50 * bat_ppi["pp_rar_per_100"].values +
        0.35 * bat_ppi["early_mid_rar_per_100"].values +
        0.15 * chase_bonus
    )
    bat_ppi["raw_batter_ppi"] = round(pd.Series(raw_ppi), 2)

    # Empirical Bayes Shrinkage (k=80 on early_mid_legal_balls)
    vol = bat_ppi["early_mid_legal_balls"].values
    k = 80.0
    qual_mask = vol >= 100
    prior_mean = float(bat_ppi.loc[qual_mask, "raw_batter_ppi"].mean()) if qual_mask.sum() > 0 else 0.0
    w = vol / (vol + k)
    shrunk_ppi = w * bat_ppi["raw_batter_ppi"].values + (1.0 - w) * prior_mean
    bat_ppi["batter_ppi_shrunk"] = round(pd.Series(shrunk_ppi), 2)
    bat_ppi["is_eligible_prevention_batting"] = qual_mask

    return bat_ppi.rename(columns={"striker_id": "player_id"})


def compute_bowler_pressure_prevention(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes Bowler Pressure Prevention Index (PPI):
    1. Early/Powerplay runs saved above expected par (Runs Saved per 100).
    2. Powerplay dot ball percentage and economy control.
    3. Powerplay wicket threat bonus.
    """
    logger.info("Computing Bowler Pressure Prevention profiles...")
    primary_df = df[df["is_primary_scope"]].copy()

    early_df = primary_df[primary_df["innings_phase_before"].isin(["Powerplay", "Middle"])]
    pp_df = primary_df[primary_df["innings_phase_before"] == "Powerplay"]

    # PP Aggregates
    pp_agg = pp_df.groupby("bowler_id").agg({
        "is_legal_ball": "sum",
        "bowler_runs_conceded": "sum",
        "bowler_runs_saved": "sum",
        "is_bowler_wicket": "sum"
    }).reset_index()
    pp_agg.columns = ["bowler_id", "pp_legal_balls", "pp_runs_conceded", "pp_runs_saved", "pp_wickets"]
    pp_agg["pp_economy"] = round((pp_agg["pp_runs_conceded"] / (pp_agg["pp_legal_balls"] / 6.0).replace(0, 1)), 2)
    pp_agg["pp_rs_per_100"] = round((pp_agg["pp_runs_saved"] / pp_agg["pp_legal_balls"].replace(0, 1)) * 100.0, 2)
    pp_agg["pp_wickets_per_100"] = round((pp_agg["pp_wickets"] / pp_agg["pp_legal_balls"].replace(0, 1)) * 100.0, 2)

    # Early/Mid Aggregates
    em_agg = early_df.groupby("bowler_id").agg({
        "is_legal_ball": "sum",
        "bowler_runs_conceded": "sum",
        "bowler_runs_saved": "sum",
        "is_bowler_wicket": "sum"
    }).reset_index()
    em_agg.columns = ["bowler_id", "early_mid_legal_balls", "early_mid_runs_conceded", "early_mid_runs_saved", "early_mid_wickets"]
    em_agg["early_mid_economy"] = round((em_agg["early_mid_runs_conceded"] / (em_agg["early_mid_legal_balls"] / 6.0).replace(0, 1)), 2)
    em_agg["early_mid_rs_per_100"] = round((em_agg["early_mid_runs_saved"] / em_agg["early_mid_legal_balls"].replace(0, 1)) * 100.0, 2)

    tot_agg = primary_df.groupby("bowler_id").agg({
        "bowler_name": "first",
        "is_legal_ball": "sum",
        "match_id": "nunique"
    }).reset_index()
    tot_agg.columns = ["bowler_id", "player_name", "total_legal_balls", "total_matches"]

    bowl_ppi = tot_agg.merge(em_agg, on="bowler_id", how="left")
    bowl_ppi = bowl_ppi.merge(pp_agg, on="bowler_id", how="left")
    bowl_ppi = bowl_ppi.fillna(0)

    # Bowler PPI formula:
    # 50% PP Runs Saved + 35% Early/Mid Runs Saved + 15% PP Wicket Threat Bonus
    wkt_bonus = np.clip(bowl_ppi["pp_wickets_per_100"].values * 3.0, 0, 15.0)
    raw_ppi = (
        0.50 * bowl_ppi["pp_rs_per_100"].values +
        0.35 * bowl_ppi["early_mid_rs_per_100"].values +
        0.15 * wkt_bonus
    )
    bowl_ppi["raw_bowler_ppi"] = round(pd.Series(raw_ppi), 2)

    # Shrinkage
    vol = bowl_ppi["early_mid_legal_balls"].values
    k = 80.0
    qual_mask = vol >= 100
    prior_mean = float(bowl_ppi.loc[qual_mask, "raw_bowler_ppi"].mean()) if qual_mask.sum() > 0 else 0.0
    w = vol / (vol + k)
    shrunk_ppi = w * bowl_ppi["raw_bowler_ppi"].values + (1.0 - w) * prior_mean
    bowl_ppi["bowler_ppi_shrunk"] = round(pd.Series(shrunk_ppi), 2)
    bowl_ppi["is_eligible_prevention_bowling"] = qual_mask

    return bowl_ppi.rename(columns={"bowler_id": "player_id"})

