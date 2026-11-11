"""
ClutchIQ - Loaders & Context Enrichment Module
Joins competitions, matches, teams, and players without data leakage.
"""

import logging
from typing import Dict, Tuple
import pandas as pd
import numpy as np

from src.config import FILES

logger = logging.getLogger("ClutchIQ.Loaders")


def load_raw_data() -> Dict[str, pd.DataFrame]:
    """Load original raw datasets without mutating any source files."""
    data = {}
    for name, path in FILES.items():
        logger.info(f"Loading {path.name}...")
        df = pd.read_csv(path, low_memory=False)
        data[name] = df
        logger.info(f"Loaded {path.name}: {len(df):,} rows, {len(df.columns)} cols")
    return data


def build_match_context(matches: pd.DataFrame, competitions: pd.DataFrame) -> pd.DataFrame:
    """
    Enrich match-level context including competition metadata, primary analytical scope,
    and scheduled/revised overs.
    """
    logger.info("Building match context...")
    m = matches.copy()
    c = competitions.copy()

    # Merge match with competition
    mc = m.merge(c, on="comp_id", how="left")

    # Competition scoping
    def assign_competition_scope(row) -> Tuple[str, bool]:
        name = str(row["comp_name"])
        fmt = str(row["match_format"])
        
        if "IPL" in name or "Indian Premier League" in name:
            return "IPL", True
        elif fmt == "T20I":
            return "T20I", True
        else:
            return "Other T20", False

    scope_results = mc.apply(assign_competition_scope, axis=1)
    mc["competition_category"] = [r[0] for r in scope_results]
    mc["is_primary_scope"] = [r[1] for r in scope_results]

    # Clean revised overs / balls
    # Note: first_inn_revised_overs and second_inn_revised_overs in matches.csv
    # represent revised overs if <= 20, or revised legal balls if > 20 (e.g. 114.0 = 19 ovs, 42.0 = 7 ovs).
    def normalize_scheduled_balls(val) -> int:
        if pd.isna(val) or val <= 0:
            return 120  # Default standard 20 overs = 120 legal balls
        if val <= 20:
            return int(round(val * 6))
        else:
            return int(round(val))

    mc["inn1_scheduled_legal_balls"] = mc["first_inn_revised_overs"].apply(normalize_scheduled_balls)
    mc["inn2_scheduled_legal_balls"] = mc["second_inn_revised_overs"].apply(normalize_scheduled_balls)
    mc["is_rain_affected"] = mc["first_inn_revised_overs"].notna() | mc["second_inn_revised_overs"].notna() | mc["revised_target"].notna()

    logger.info(f"Match context built: {len(mc)} matches ({mc['is_primary_scope'].sum()} in primary scope).")
    return mc


def build_player_lookup(ctpm: pd.DataFrame, pe: pd.DataFrame, bbb: pd.DataFrame) -> pd.DataFrame:
    """
    Build deduplicated player master lookup table with batting and bowling styles,
    playing experience, and team associations.
    """
    logger.info("Building player lookup table...")
    # Base from CTPM
    p_base = ctpm.groupby("player_id").agg(
        player_name=("player_name", "first"),
        teams_represented=("team_name", lambda x: list(sorted(set(x.dropna())))),
        competitions_played=("comp_name", lambda x: list(sorted(set(x.dropna())))),
    ).reset_index()

    # Extract batting style from BBB
    striker_styles = bbb.groupby("striker_id")["batting_type"].agg(lambda x: x.mode()[0] if len(x) > 0 else None)
    bowler_styles = bbb.groupby("bowler_id")["bowling_type"].agg(lambda x: x.mode()[0] if len(x) > 0 else None)
    bowler_pace_spin = bbb.groupby("bowler_id")["pace_or_spin"].agg(lambda x: x.mode()[0] if len(x) > 0 else None)

    p_base["batting_type"] = p_base["player_id"].map(striker_styles)
    p_base["bowling_type"] = p_base["player_id"].map(bowler_styles)
    p_base["pace_or_spin"] = p_base["player_id"].map(bowler_pace_spin)

    # Activity flags
    all_bbb_players = set(bbb["striker_id"].dropna().unique()) | set(bbb["bowler_id"].dropna().unique())
    p_base["has_batted_in_bbb"] = p_base["player_id"].isin(set(bbb["striker_id"].dropna().unique()))
    p_base["has_bowled_in_bbb"] = p_base["player_id"].isin(set(bbb["bowler_id"].dropna().unique()))
    p_base["is_in_bbb"] = p_base["player_id"].isin(all_bbb_players)

    logger.info(f"Player lookup built: {len(p_base)} unique players ({p_base['is_in_bbb'].sum()} active in BBB).")
    return p_base

