"""
ClutchIQ - Aggregated Batting and Bowling Features Module
Aggregates delivery-level records into player-match-innings profiles
with separate pressure-phase metrics, strictly without data leakage.
"""

import logging
import pandas as pd
import numpy as np

logger = logging.getLogger("ClutchIQ.AggregatedFeatures")


def build_batting_features(m_bbb: pd.DataFrame) -> pd.DataFrame:
    """
    Build player-match-innings batting features preserving context,
    phase breakdowns, and pressure indicators.
    """
    logger.info("Building batting features table...")
    # Filter to primary analytical scope (IPL + Senior T20I)
    df = m_bbb[m_bbb["is_primary_scope"]].copy()

    # Group by match, innings, team, striker
    group_cols = [
        "match_id", "comp_id", "comp_name", "season", "competition_category",
        "match_date", "innings", "is_super_over", "batting_team_id",
        "striker_id", "striker_name", "batting_type"
    ]

    # Calculate overall innings metrics for batter
    bat_summary = df.groupby(group_cols).agg(
        batting_order=("batting_order", "min"),
        total_balls_faced=("runs", "count"),
        legal_balls_faced=("is_legal_ball", "sum"),
        runs_scored=("batter_runs", "sum"),
        fours=("is_four", "sum"),
        sixes=("is_six", "sum"),
        dots=("batter_runs", lambda s: (s == 0).sum()),
        dismissed_count=("is_wicket", lambda w: (w & (df.loc[w.index, "dismissed_player_id"] == df.loc[w.index, "striker_id"])).sum()),
    ).reset_index()

    # Add strike rates
    bat_summary["strike_rate"] = np.where(
        bat_summary["legal_balls_faced"] > 0,
        np.round((bat_summary["runs_scored"] / bat_summary["legal_balls_faced"]) * 100.0, 2),
        0.0
    )
    bat_summary["dot_ball_percentage"] = np.where(
        bat_summary["total_balls_faced"] > 0,
        np.round((bat_summary["dots"] / bat_summary["total_balls_faced"]) * 100.0, 2),
        0.0
    )
    bat_summary["boundary_runs"] = (bat_summary["fours"] * 4) + (bat_summary["sixes"] * 6)
    bat_summary["boundary_run_percentage"] = np.where(
        bat_summary["runs_scored"] > 0,
        np.round((bat_summary["boundary_runs"] / bat_summary["runs_scored"]) * 100.0, 2),
        0.0
    )

    # Phase breakdowns (Powerplay, Middle, Death)
    for phase in ["Powerplay", "Middle", "Death"]:
        phase_df = df[df["innings_phase_before"] == phase]
        phase_agg = phase_df.groupby(group_cols).agg(
            **{
                f"balls_faced_{phase.lower()}": ("is_legal_ball", "sum"),
                f"runs_{phase.lower()}": ("batter_runs", "sum"),
                f"fours_{phase.lower()}": ("is_four", "sum"),
                f"sixes_{phase.lower()}": ("is_six", "sum"),
            }
        ).reset_index()
        bat_summary = bat_summary.merge(phase_agg, on=group_cols, how="left")
        bat_summary[f"balls_faced_{phase.lower()}"] = bat_summary[f"balls_faced_{phase.lower()}"].fillna(0).astype(int)
        bat_summary[f"runs_{phase.lower()}"] = bat_summary[f"runs_{phase.lower()}"].fillna(0).astype(int)
        bat_summary[f"fours_{phase.lower()}"] = bat_summary[f"fours_{phase.lower()}"].fillna(0).astype(int)
        bat_summary[f"sixes_{phase.lower()}"] = bat_summary[f"sixes_{phase.lower()}"].fillna(0).astype(int)

    # Chase context (Innings 2 & 4)
    chase_df = df[df["innings"].isin([2, 4])]
    chase_agg = chase_df.groupby(group_cols).agg(
        mean_rrr_faced=("required_run_rate_before", "mean"),
        high_rrr_balls_faced=("required_run_rate_before", lambda r: (r >= 10.0).sum()),
        runs_under_high_rrr=("batter_runs", lambda r: r[df.loc[r.index, "required_run_rate_before"] >= 10.0].sum()),
    ).reset_index()
    bat_summary = bat_summary.merge(chase_agg, on=group_cols, how="left")
    bat_summary["mean_rrr_faced"] = bat_summary["mean_rrr_faced"].round(2)
    bat_summary["high_rrr_balls_faced"] = bat_summary["high_rrr_balls_faced"].fillna(0).astype(int)
    bat_summary["runs_under_high_rrr"] = bat_summary["runs_under_high_rrr"].fillna(0).astype(int)

    logger.info(f"Batting features table built: {len(bat_summary):,} batter innings.")
    return bat_summary


def build_bowling_features(m_bbb: pd.DataFrame) -> pd.DataFrame:
    """
    Build player-match-innings bowling features preserving context,
    phase breakdowns, legal overs bowled, runs conceded, and bowler wickets.
    """
    logger.info("Building bowling features table...")
    df = m_bbb[m_bbb["is_primary_scope"]].copy()

    group_cols = [
        "match_id", "comp_id", "comp_name", "season", "competition_category",
        "match_date", "innings", "is_super_over", "bowling_team_id",
        "bowler_id", "bowler_name", "bowling_type", "pace_or_spin"
    ]

    bowl_summary = df.groupby(group_cols).agg(
        total_balls_bowled=("runs", "count"),
        legal_balls_bowled=("is_legal_ball", "sum"),
        runs_conceded=("bowler_runs_conceded", "sum"),
        bowler_wickets=("is_bowler_wicket", "sum"),
        total_wickets_in_over=("is_wicket", "sum"),
        wides_conceded=("extras_type", lambda e: (e == "wide").sum()),
        no_balls_conceded=("extras_type", lambda e: e.isin(["Overstep", "other"]).sum()),
        dot_balls=("bowler_runs_conceded", lambda r: (r == 0).sum()),
        fours_conceded=("is_four", "sum"),
        sixes_conceded=("is_six", "sum"),
    ).reset_index()

    # Legal overs bowled (e.g. 24 balls = 4.0 overs, 21 balls = 3.3 overs)
    def to_cricket_overs(legal_balls: int) -> float:
        ovs = legal_balls // 6
        rem = legal_balls % 6
        return float(f"{ovs}.{rem}")

    bowl_summary["overs_bowled"] = bowl_summary["legal_balls_bowled"].apply(to_cricket_overs)
    bowl_summary["economy_rate"] = np.where(
        bowl_summary["legal_balls_bowled"] > 0,
        np.round((bowl_summary["runs_conceded"] / bowl_summary["legal_balls_bowled"]) * 6.0, 2),
        0.0
    )
    bowl_summary["dot_ball_percentage"] = np.where(
        bowl_summary["legal_balls_bowled"] > 0,
        np.round((bowl_summary["dot_balls"] / bowl_summary["legal_balls_bowled"]) * 100.0, 2),
        0.0
    )

    # Phase breakdowns (Powerplay, Middle, Death)
    for phase in ["Powerplay", "Middle", "Death"]:
        phase_df = df[df["innings_phase_before"] == phase]
        phase_agg = phase_df.groupby(group_cols).agg(
            **{
                f"balls_bowled_{phase.lower()}": ("is_legal_ball", "sum"),
                f"runs_conceded_{phase.lower()}": ("bowler_runs_conceded", "sum"),
                f"wickets_{phase.lower()}": ("is_bowler_wicket", "sum"),
                f"dots_{phase.lower()}": ("bowler_runs_conceded", lambda r: (r == 0).sum()),
            }
        ).reset_index()
        bowl_summary = bowl_summary.merge(phase_agg, on=group_cols, how="left")
        bowl_summary[f"balls_bowled_{phase.lower()}"] = bowl_summary[f"balls_bowled_{phase.lower()}"].fillna(0).astype(int)
        bowl_summary[f"runs_conceded_{phase.lower()}"] = bowl_summary[f"runs_conceded_{phase.lower()}"].fillna(0).astype(int)
        bowl_summary[f"wickets_{phase.lower()}"] = bowl_summary[f"wickets_{phase.lower()}"].fillna(0).astype(int)
        bowl_summary[f"dots_{phase.lower()}"] = bowl_summary[f"dots_{phase.lower()}"].fillna(0).astype(int)

    logger.info(f"Bowling features table built: {len(bowl_summary):,} bowler spells.")
    return bowl_summary

