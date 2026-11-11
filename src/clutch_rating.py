"""
ClutchIQ - Task 04 Clutch Impact Engine
Aggregates delivery-level value-added metrics into player clutch impact profiles
using continuous pressure-weighting and baseline comparisons.
"""

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger("ClutchIQ.ClutchImpact")


def compute_batter_clutch_impact(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute player-level batting clutch impact:
    - Pressure exposure (mean BPI, high-pressure deliveries)
    - Continuous pressure-weighted runs added
    - High-pressure strike rate vs baseline strike rate
    - High-pressure boundary rate and dot suppression
    """
    logger.info("Computing batter clutch impact profiles...")
    
    # Filter to legal balls faced by strikers
    bat_df = df[df["is_primary_scope"]].copy()

    # Aggregate by striker
    records = []
    for p_id, grp in bat_df.groupby("striker_id"):
        p_name = grp["striker_name"].iloc[0]
        b_type = grp["batting_type"].iloc[0]
        comps = list(grp["competition_category"].unique())
        ipl_balls = len(grp[grp["competition_category"] == "IPL"])
        t20i_balls = len(grp[grp["competition_category"] == "T20I"])

        total_balls = len(grp)
        legal_balls = int(grp["is_legal_ball"].sum())
        total_runs = int(grp["batter_runs"].sum())
        overall_sr = round((total_runs / max(1, legal_balls)) * 100.0, 2)

        # High pressure deliveries (BPI >= 65)
        hp_grp = grp[grp["batter_pressure_index"] >= 65.0]
        hp_balls = len(hp_grp)
        hp_legal_balls = int(hp_grp["is_legal_ball"].sum())
        hp_runs = int(hp_grp["batter_runs"].sum())
        hp_sr = round((hp_runs / max(1, hp_legal_balls)) * 100.0, 2) if hp_legal_balls > 0 else np.nan

        # Baseline / Low pressure deliveries (BPI < 65)
        lp_grp = grp[grp["batter_pressure_index"] < 65.0]
        lp_legal_balls = int(lp_grp["is_legal_ball"].sum())
        lp_runs = int(lp_grp["batter_runs"].sum())
        lp_sr = round((lp_runs / max(1, lp_legal_balls)) * 100.0, 2) if lp_legal_balls > 0 else np.nan

        # Strike Rate Differential under Pressure
        sr_delta = round(hp_sr - lp_sr, 2) if (pd.notna(hp_sr) and pd.notna(lp_sr)) else np.nan

        # Continuous pressure weighting:
        # Weight each ball by (BPI / 50.0)
        # Pressure-weighted runs added per ball
        weights = grp["batter_pressure_index"].values / 50.0
        weighted_runs_added = np.sum(grp["batter_runs_added"].values * weights)
        weighted_rar_per_100 = round((weighted_runs_added / max(1, legal_balls)) * 100.0, 2)

        # Boundary rate under high pressure
        hp_boundary_pct = round((hp_grp["batter_runs"].isin([4, 6]).mean()) * 100.0, 2) if hp_balls > 0 else np.nan
        lp_boundary_pct = round((lp_grp["batter_runs"].isin([4, 6]).mean()) * 100.0, 2) if len(lp_grp) > 0 else np.nan

        # Mean BPI faced
        mean_bpi = round(float(grp["batter_pressure_index"].mean()), 2)

        records.append({
            "player_id": p_id,
            "player_name": p_name,
            "batting_type": b_type,
            "total_balls_faced": total_balls,
            "legal_balls_faced": legal_balls,
            "ipl_balls_faced": ipl_balls,
            "t20i_balls_faced": t20i_balls,
            "competitions_represented": comps,
            "mean_pressure_faced": mean_bpi,
            "high_pressure_balls": hp_balls,
            "high_pressure_pct": round((hp_balls / max(1, total_balls)) * 100.0, 2),
            "overall_runs": total_runs,
            "overall_strike_rate": overall_sr,
            "high_pressure_runs": hp_runs,
            "high_pressure_strike_rate": hp_sr,
            "baseline_strike_rate": lp_sr,
            "strike_rate_delta": sr_delta,
            "hp_boundary_pct": hp_boundary_pct,
            "lp_boundary_pct": lp_boundary_pct,
            "raw_clutch_runs_added_per_100": weighted_rar_per_100,
            "total_weighted_runs_added": round(weighted_runs_added, 2)
        })

    res_df = pd.DataFrame(records)
    logger.info(f"Batter clutch impact calculated for {len(res_df):,} batters.")
    return res_df


def compute_bowler_clutch_impact(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute player-level bowling clutch impact:
    - Pressure exposure (mean BowlerPI, high-pressure deliveries bowled)
    - Continuous pressure-weighted runs saved and wickets added
    - High-pressure economy rate vs baseline economy rate
    - High-pressure dot ball % and wicket strike rate
    """
    logger.info("Computing bowler clutch impact profiles...")
    bowl_df = df[df["is_primary_scope"]].copy()

    records = []
    for p_id, grp in bowl_df.groupby("bowler_id"):
        p_name = grp["bowler_name"].iloc[0]
        bowling_type = grp["bowling_type"].iloc[0]
        pace_spin = grp["pace_or_spin"].iloc[0]
        comps = list(grp["competition_category"].unique())
        ipl_balls = len(grp[grp["competition_category"] == "IPL"])
        t20i_balls = len(grp[grp["competition_category"] == "T20I"])

        total_balls = len(grp)
        legal_balls = int(grp["is_legal_ball"].sum())
        runs_conceded = int(grp["bowler_runs_conceded"].sum())
        wickets = int(grp["is_bowler_wicket"].sum())
        overall_econ = round((runs_conceded / max(1, legal_balls)) * 6.0, 2)

        # High pressure deliveries (BowlerPI >= 65)
        hp_grp = grp[grp["bowler_pressure_index"] >= 65.0]
        hp_balls = len(hp_grp)
        hp_legal_balls = int(hp_grp["is_legal_ball"].sum())
        hp_runs = int(hp_grp["bowler_runs_conceded"].sum())
        hp_wickets = int(hp_grp["is_bowler_wicket"].sum())
        hp_econ = round((hp_runs / max(1, hp_legal_balls)) * 6.0, 2) if hp_legal_balls > 0 else np.nan

        # Baseline / Low pressure deliveries (BowlerPI < 65)
        lp_grp = grp[grp["bowler_pressure_index"] < 65.0]
        lp_legal_balls = int(lp_grp["is_legal_ball"].sum())
        lp_runs = int(lp_grp["bowler_runs_conceded"].sum())
        lp_econ = round((lp_runs / max(1, lp_legal_balls)) * 6.0, 2) if lp_legal_balls > 0 else np.nan

        # Economy Differential under Pressure: (Baseline Economy minus High Pressure Economy)
        # Positive means the bowler became MORE economical under pressure (great bowling)
        econ_delta = round(lp_econ - hp_econ, 2) if (pd.notna(hp_econ) and pd.notna(lp_econ)) else np.nan

        # Continuous pressure weighting:
        # Weight each ball by (BowlerPI / 50.0)
        # Runs saved + 15.0 * wickets added (empirical wicket value in T20)
        weights = grp["bowler_pressure_index"].values / 50.0
        weighted_runs_saved = np.sum(grp["bowler_runs_saved"].values * weights)
        weighted_wickets_added = np.sum(grp["bowler_wickets_added"].values * weights)
        total_clutch_bowler_val = weighted_runs_saved + (weighted_wickets_added * 15.0)

        weighted_rbe_per_100 = round((total_clutch_bowler_val / max(1, legal_balls)) * 100.0, 2)

        # Dot-ball % under high pressure
        hp_dot_pct = round(((hp_grp["bowler_runs_conceded"] == 0).mean()) * 100.0, 2) if hp_balls > 0 else np.nan
        lp_dot_pct = round(((lp_grp["bowler_runs_conceded"] == 0).mean()) * 100.0, 2) if len(lp_grp) > 0 else np.nan

        mean_bowlpi = round(float(grp["bowler_pressure_index"].mean()), 2)

        records.append({
            "player_id": p_id,
            "player_name": p_name,
            "bowling_type": bowling_type,
            "pace_or_spin": pace_spin,
            "total_balls_bowled": total_balls,
            "legal_balls_bowled": legal_balls,
            "ipl_balls_bowled": ipl_balls,
            "t20i_balls_bowled": t20i_balls,
            "competitions_represented": comps,
            "mean_pressure_bowled": mean_bowlpi,
            "high_pressure_balls": hp_balls,
            "high_pressure_pct": round((hp_balls / max(1, total_balls)) * 100.0, 2),
            "overall_wickets": wickets,
            "overall_economy": overall_econ,
            "high_pressure_wickets": hp_wickets,
            "high_pressure_economy": hp_econ,
            "baseline_economy": lp_econ,
            "economy_delta": econ_delta,
            "hp_dot_pct": hp_dot_pct,
            "lp_dot_pct": lp_dot_pct,
            "raw_clutch_runs_saved_per_100": weighted_rbe_per_100,
            "total_weighted_runs_saved": round(total_clutch_bowler_val, 2)
        })

    res_df = pd.DataFrame(records)
    logger.info(f"Bowler clutch impact calculated for {len(res_df):,} bowlers.")
    return res_df

