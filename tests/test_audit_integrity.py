
import pytest
import pandas as pd
import numpy as np

def test_audit_reconciliation_csv_exists():
    df = pd.read_csv('reports/pressure/player_metric_reconciliation.csv')
    assert len(df) == 15
    assert 'audit_status' in df.columns
    assert (df['audit_status'] == 'VERIFIED').all()

def test_audit_bayesian_comparison_csv_exists():
    df = pd.read_csv('reports/pressure/bayesian_method_comparison.csv')
    assert len(df) == 30
    assert 'spearman_A_vs_B' in df.columns
    assert (df['spearman_A_vs_B'] > 0.99).all()

def test_audit_robustness_csv_exists():
    df = pd.read_csv('reports/pressure/rating_robustness_audit.csv')
    assert len(df) == 24
    assert (df['rank_inversions_top5'] == 0).all()

def test_tim_david_recalculation():
    deliv = pd.read_csv('data/processed/delivery_pressure_scores.csv', low_memory=False)
    ratings = pd.read_csv('data/processed/player_clutch_ratings.csv')
    td_del = deliv[(deliv['striker_id'] == 6396) & (deliv['is_primary_scope'])]
    td_rat = ratings[ratings['player_id'] == 6396].iloc[0]
    
    assert td_del['is_legal_ball'].sum() == td_rat['legal_balls_faced']
    assert td_del['batter_runs'].sum() == td_rat['overall_runs']
    hp_del = td_del[td_del['batter_pressure_index'] >= 65.0]
    assert hp_del['batter_runs'].sum() == td_rat['high_pressure_runs']
    assert round((hp_del['batter_runs'].sum() / hp_del['is_legal_ball'].sum()) * 100, 2) == td_rat['high_pressure_strike_rate']

def test_mark_wood_recalculation():
    deliv = pd.read_csv('data/processed/delivery_pressure_scores.csv', low_memory=False)
    ratings = pd.read_csv('data/processed/player_clutch_ratings.csv')
    mw_del = deliv[(deliv['bowler_id'] == 2985) & (deliv['is_primary_scope'])]
    mw_rat = ratings[ratings['player_id'] == 2985].iloc[0]
    
    assert mw_del['is_legal_ball'].sum() == mw_rat['legal_balls_bowled']
    assert mw_del['bowler_runs_conceded'].sum() == 381
    assert mw_del['is_bowler_wicket'].sum() == mw_rat['overall_wickets']
    hp_del = mw_del[mw_del['bowler_pressure_index'] >= 65.0]
    assert hp_del['is_bowler_wicket'].sum() == mw_rat['high_pressure_wickets']
    assert hp_del['is_bowler_wicket'].sum() == 14
