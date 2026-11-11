"""
ClutchIQ - Ball-by-Ball Feature Engineering Module
Builds leakage-free, chronological delivery-level features.
All 'before_ball' features strictly use historical deliveries.
"""

import logging
from typing import Dict, Any
import pandas as pd
import numpy as np

from src.config import (
    ILLEGAL_DELIVERY_TYPES,
    BOWLER_DISMISSAL_TYPES,
    NON_BOWLER_DISMISSAL_TYPES,
    PHASE_POWERPLAY_MAX_BALL,
    PHASE_MIDDLE_MAX_BALL,
)

logger = logging.getLogger("ClutchIQ.DeliveryFeatures")


def engineer_master_ball_by_ball(
    bbb: pd.DataFrame,
    match_context: pd.DataFrame,
    unresolved_deliveries: pd.DataFrame = None
) -> pd.DataFrame:
    """
    Process raw ball_by_ball.csv, joining match context, calculating legal balls,
    before-delivery states, chase dynamics, and audit anomaly flags.
    """
    logger.info("Starting master ball-by-ball feature engineering...")
    df = bbb.copy()

    # Deterministic chronological sort
    # match_id, innings, overid, over_ball_num
    df = df.sort_values(
        by=["match_id", "innings", "overid", "over_ball_num"],
        ascending=[True, True, True, True]
    ).reset_index(drop=True)

    # 1. Join Match Context
    m_cols = [
        "match_id", "comp_id", "comp_name", "match_format", "season",
        "competition_category", "is_primary_scope",
        "match_date", "stage", "venue_id", "venue_country",
        "home_team_id", "home_team", "away_team_id", "away_team",
        "toss_win_team_id", "toss_opted", "win_team_id", "result",
        "first_inn_revised_overs", "second_inn_revised_overs", "revised_target",
        "inn1_scheduled_legal_balls", "inn2_scheduled_legal_balls", "is_rain_affected"
    ]
    mc_sub = match_context[m_cols]
    df = df.merge(mc_sub, on="match_id", how="left")

    # 2. Batter Runs & Anomaly Flags
    df["batter_runs"] = df["runs"]
    
    # Anomaly flag for the 1 legbye with runs=1
    df["is_ambiguous_bat_runs"] = (df["extras_type"] == "legbyes") & (df["runs"] != 0)

    # 3. Legal Delivery Identification
    # Illegal if wide, Overstep, or other (beamers/full toss above waist)
    df["is_legal_ball"] = ~df["extras_type"].isin(ILLEGAL_DELIVERY_TYPES)

    # Cumulative legal balls in current innings
    df["legal_ball_num"] = df.groupby(["match_id", "innings"])["is_legal_ball"].cumsum()

    # 4. Super Over Flag
    df["is_super_over"] = df["innings"].isin([3, 4])

    # 5. Scheduled Legal Balls & Legal Balls Remaining
    def get_scheduled_balls(row) -> int:
        inn = row["innings"]
        if inn in [3, 4]:
            return 6  # Super Over = 1 over = 6 legal balls
        elif inn == 1:
            return int(row["inn1_scheduled_legal_balls"])
        elif inn == 2:
            return int(row["inn2_scheduled_legal_balls"])
        else:
            return 120

    df["scheduled_legal_balls"] = df.apply(get_scheduled_balls, axis=1)

    # Pre-delivery legal balls remaining:
    # Before the delivery, how many legal balls have already been bowled?
    # Shift cumulative legal balls by 1 (or subtract current delivery's legality)
    df["legal_balls_bowled_before"] = df["legal_ball_num"] - df["is_legal_ball"].astype(int)
    df["legal_balls_remaining_before"] = np.maximum(
        0, df["scheduled_legal_balls"] - df["legal_balls_bowled_before"]
    )

    # 6. Innings Phase (Before Delivery)
    # Based on legal balls bowled before delivery
    def get_innings_phase(row) -> str:
        if row["is_super_over"]:
            return "SuperOver"
        balls_done = row["legal_balls_bowled_before"]
        if balls_done < PHASE_POWERPLAY_MAX_BALL:
            return "Powerplay"
        elif balls_done < PHASE_MIDDLE_MAX_BALL:
            return "Middle"
        else:
            return "Death"

    df["innings_phase_before"] = df.apply(get_innings_phase, axis=1)

    # 7. Delivery Outcome Scoring (Post-Delivery Components)
    # Bowler extra penalty (1 run for wide, overstep, other)
    df["bowler_extra_penalty"] = df["extras_type"].isin(ILLEGAL_DELIVERY_TYPES).astype(int)

    # Bowler runs conceded (MCC Laws: Byes and Legbyes are 0)
    df["bowler_runs_conceded"] = np.where(
        df["extras_type"].isin(["byes", "legbyes", "Penalty"]),
        0,
        df["runs"] + df["bowler_extra_penalty"] + df["extras_2_runs"]
    )

    # Team runs lower bound (confirmed runs with 100% certainty)
    df["team_runs_delivery_lower_bound"] = (
        df["runs"] + df["bowler_extra_penalty"] + df["extras_2_runs"]
    )

    # Exactness indicator: True if no byes, legbyes, penalty or unrecorded multi-run wides
    df["is_delivery_run_exact"] = ~df["extras_type"].isin(["byes", "legbyes", "Penalty"])

    # 8. Wickets Classification
    df["is_bowler_wicket"] = df["is_wicket"] & df["dismissal_type"].isin(BOWLER_DISMISSAL_TYPES)
    df["is_non_bowler_wicket"] = df["is_wicket"] & df["dismissal_type"].isin(NON_BOWLER_DISMISSAL_TYPES)

    # 9. Pre-Delivery Match State (LEAKAGE PREVENTION)
    # Wickets fallen before this ball in this innings
    df["innings_wickets_cumulative"] = df.groupby(["match_id", "innings"])["is_wicket"].cumsum()
    df["wickets_before_ball"] = df["innings_wickets_cumulative"] - df["is_wicket"].astype(int)
    df["wickets_in_hand_before"] = np.maximum(0, 10 - df["wickets_before_ball"])

    # Cumulative team runs lower bound
    df["innings_runs_cumulative_lower_bound"] = df.groupby(["match_id", "innings"])["team_runs_delivery_lower_bound"].cumsum()
    df["runs_before_ball_lower_bound"] = (
        df["innings_runs_cumulative_lower_bound"] - df["team_runs_delivery_lower_bound"]
    )

    # Cumulative exactness flag
    # If any previous ball in the innings had byes/legbyes/penalties, the cumulative score is a lower bound, not exact.
    df["has_uncertain_extra_before"] = df.groupby(["match_id", "innings"])["is_delivery_run_exact"].apply(
        lambda s: (~s).shift(fill_value=False).cumsum() > 0
    ).reset_index(drop=True)

    df["score_reconstruction_confidence"] = np.where(
        df["has_uncertain_extra_before"],
        "LOWER_BOUND_ONLY",
        "EXACT"
    )

    # 10. Chase-Specific Features (Innings 2 & Innings 4)
    # Target score determination:
    # First check matches.csv 'revised_target'.
    # If not present and Innings 2, check Innings 1 total runs lower bound + 1.
    inn1_totals = df[df["innings"] == 1].groupby("match_id")["team_runs_delivery_lower_bound"].sum().to_dict()
    inn1_has_uncertain = df[df["innings"] == 1].groupby("match_id")["is_delivery_run_exact"].apply(lambda s: (~s).any()).to_dict()

    inn3_totals = df[df["innings"] == 3].groupby("match_id")["team_runs_delivery_lower_bound"].sum().to_dict()

    def get_target(row):
        inn = row["innings"]
        m_id = row["match_id"]
        
        # Super over chase (Innings 4)
        if inn == 4:
            if m_id in inn3_totals:
                return inn3_totals[m_id] + 1
            return np.nan

        # Normal chase (Innings 2)
        if inn == 2:
            rev_target = row["revised_target"]
            if pd.notna(rev_target) and rev_target > 0:
                return float(rev_target)
            if m_id in inn1_totals:
                # Target is Innings 1 score + 1
                return float(inn1_totals[m_id] + 1)
        return np.nan

    df["target_score"] = df.apply(get_target, axis=1)

    # Required runs remaining before ball (only where target is reliable)
    # If Innings 1 had uncertain extras and no revised target was provided,
    # target is a lower bound estimate.
    def get_target_confidence(row):
        inn = row["innings"]
        m_id = row["match_id"]
        if inn not in [2, 4]:
            return "NOT_APPLICABLE"
        if pd.notna(row["revised_target"]):
            return "AUTHORITATIVE_DLS_TARGET"
        if inn == 2 and not inn1_has_uncertain.get(m_id, False):
            return "EXACT_RECONSTRUCTED_TARGET"
        elif inn == 2:
            return "ESTIMATED_TARGET_LOWER_BOUND"
        elif inn == 4:
            return "EXACT_SUPER_OVER_TARGET"
        return "UNVERIFIED"

    df["target_confidence"] = df.apply(get_target_confidence, axis=1)

    # Calculate runs remaining & required run rate before delivery
    df["runs_remaining_before"] = np.where(
        df["target_score"].notna(),
        np.maximum(0, df["target_score"] - df["runs_before_ball_lower_bound"]),
        np.nan
    )

    df["required_run_rate_before"] = np.where(
        (df["target_score"].notna()) & (df["legal_balls_remaining_before"] > 0),
        np.round((df["runs_remaining_before"] / df["legal_balls_remaining_before"]) * 6.0, 2),
        np.nan
    )

    # 11. Anomaly Flags & Audit Linkage
    if unresolved_deliveries is not None and len(unresolved_deliveries) > 0:
        anom_keys = set(zip(
            unresolved_deliveries["match_id"],
            unresolved_deliveries["innings"],
            unresolved_deliveries["overid"],
            unresolved_deliveries["over_ball_num"]
        ))
        df["is_audit_anomaly_delivery"] = [
            (m, i, o, b) in anom_keys
            for m, i, o, b in zip(df["match_id"], df["innings"], df["overid"], df["over_ball_num"])
        ]
    else:
        df["is_audit_anomaly_delivery"] = False

    logger.info(f"Master ball-by-ball engineered: {len(df):,} deliveries processed.")
    return df

