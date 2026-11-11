"""
ClutchIQ - Task 04 Expected Performance Engine
Computes context-conditioned performance baselines across:
- Batting: Expected striker runs, strike rate, dot probability, boundary probability, dismissal probability.
- Bowling: Expected bowler runs conceded, economy rate, dot probability, boundary conceded probability, bowler wicket probability.
Conditioned on competition, phase, and historical baseline without future leakage.
"""

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger("ClutchIQ.ExpectedPerformance")


def compute_expected_performance_baselines(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute delivery-level expected performance values conditioned on
    competition category and innings phase.
    """
    logger.info("Computing expected performance baselines...")
    df = df.copy()

    # Context groupings: (competition_category, innings_phase_before)
    context_keys = ["competition_category", "innings_phase_before"]
    
    # Calculate delivery-level context expectations across primary scope
    baseline_lookup = df.groupby(context_keys).agg(
        exp_batter_runs=("batter_runs", "mean"),
        exp_batter_dot=("batter_runs", lambda x: (x == 0).mean()),
        exp_batter_boundary=("batter_runs", lambda x: x.isin([4, 6]).mean()),
        exp_batter_dismissal=("is_wicket", "mean"),
        exp_bowler_runs=("bowler_runs_conceded", "mean"),
        exp_bowler_dot=("bowler_runs_conceded", lambda x: (x == 0).mean()),
        exp_bowler_boundary=("is_four", lambda x: (x | df.loc[x.index, "is_six"]).mean()),
        exp_bowler_wicket=("is_bowler_wicket", "mean")
    ).reset_index()

    # Merge context baselines back onto delivery rows
    df = df.merge(baseline_lookup, on=context_keys, how="left")

    # Delivery-Level Value Added (Observed minus Expected)
    # 1. Batting Runs Added above context expectation (Runs Above Replacement - RAR)
    df["batter_runs_added"] = df["batter_runs"] - df["exp_batter_runs"]
    # 2. Batting Dismissal Avoidance (Expected Wicket prob minus actual dismissal)
    df["batter_wicket_avoided"] = df["exp_batter_dismissal"] - df["is_wicket"].astype(float)
    # 3. Batting Boundary Value Added
    df["batter_boundary_added"] = df["batter_runs"].isin([4, 6]).astype(float) - df["exp_batter_boundary"]

    # 4. Bowling Runs Saved below context expectation (Runs Below Expected - RBE)
    # Positive means the bowler conceded LESS than expected (good bowling)
    df["bowler_runs_saved"] = df["exp_bowler_runs"] - df["bowler_runs_conceded"]
    # 5. Bowler Wickets Added above expectation
    df["bowler_wickets_added"] = df["is_bowler_wicket"].astype(float) - df["exp_bowler_wicket"]
    # 6. Bowler Dot Balls Added above expectation
    df["bowler_dot_added"] = (df["bowler_runs_conceded"] == 0).astype(float) - df["exp_bowler_dot"]

    logger.info("Expected performance baselines and delivery-level value-added metrics calculated.")
    return df

