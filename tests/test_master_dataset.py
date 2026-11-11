"""
ClutchIQ - Unit & Regression Tests
Validates non-leakage, legal-ball progression, wickets classification,
and boundaries accounting on processed master datasets.
"""

import pytest
import pandas as pd
import numpy as np
from pathlib import Path

DATA_DIR = Path("data/processed")


@pytest.fixture(scope="module")
def master_bbb():
    path = DATA_DIR / "master_ball_by_ball.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path, low_memory=False)


@pytest.fixture(scope="module")
def match_context():
    path = DATA_DIR / "match_context.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path, low_memory=False)


def test_row_count_preservation(master_bbb):
    """Ensure zero rows from ball_by_ball.csv were dropped."""
    assert len(master_bbb) == 200_999, f"Expected 200,999 rows, got {len(master_bbb)}"


def test_no_data_leakage_in_before_features(master_bbb):
    """
    Ensure all pre-delivery features do not use the current delivery outcome.
    wickets_before_ball must strictly equal previous delivery's cumulative wickets.
    """
    sample = master_bbb[master_bbb["match_id"] == 13511].copy()
    for inn in [1, 2]:
        inn_df = sample[sample["innings"] == inn]
        shifted_wickets = inn_df["is_wicket"].shift(fill_value=0).cumsum()
        assert (inn_df["wickets_before_ball"].values == shifted_wickets.values).all()


def test_legal_balls_exclude_wides_and_noballs(master_bbb):
    """Legal balls must strictly exclude wides, oversteps, and beamers."""
    illegal = master_bbb[master_bbb["extras_type"].isin(["wide", "Overstep", "other"])]
    assert (illegal["is_legal_ball"] == False).all()

    legal = master_bbb[master_bbb["extras_type"].isna() | master_bbb["extras_type"].isin(["byes", "legbyes"])]
    assert (legal["is_legal_ball"] == True).all()


def test_bowler_runs_conceded_laws(master_bbb):
    """Bowlers must not be charged for byes or legbyes."""
    byes_lb = master_bbb[master_bbb["extras_type"].isin(["byes", "legbyes"])]
    # All byes/legbyes must have bowler_runs_conceded == 0
    assert (byes_lb["bowler_runs_conceded"] == 0).all()


def test_bowler_wickets_classification(master_bbb):
    """Bowler wickets must include Bowled, Caught, LBW, Stump, Hit Wicket only."""
    run_outs = master_bbb[master_bbb["dismissal_type"] == "RunOut"]
    assert (run_outs["is_bowler_wicket"] == False).all()
    assert (run_outs["is_non_bowler_wicket"] == True).all()

    bowled = master_bbb[master_bbb["dismissal_type"] == "Bowled"]
    assert (bowled["is_bowler_wicket"] == True).all()


def test_primary_scope_filter(match_context):
    """Ensure Emerging Teams are labeled Other T20 and excluded from primary scope."""
    other = match_context[match_context["competition_category"] == "Other T20"]
    assert (other["is_primary_scope"] == False).all()
    assert len(other) == 30

    ipl = match_context[match_context["competition_category"] == "IPL"]
    assert (ipl["is_primary_scope"] == True).all()
    assert len(ipl) == 371

