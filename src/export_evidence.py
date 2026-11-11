import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('data/processed/delivery_pressure_scores.csv', low_memory=False)
mapping = pd.read_csv('competition_team_player_mapping.csv')

top_comb_bat = pd.read_csv('reports/rankings/top10_combined_batters.csv')
top_comb_bowl = pd.read_csv('reports/rankings/top10_combined_bowlers.csv')

evidence_records = []

# Batters
for _, r in top_comb_bat.iterrows():
    pid = int(r['player_id'])
    pname = str(r['player_name'])
    p_del = df[(df['striker_id'] == pid) & (df['is_primary_scope'])]
    m_info = mapping[mapping['player_id'] == pid]['comp_name'].unique().tolist()
    
    match_impacts = []
    for mid, grp in p_del.groupby('match_id'):
        leg = grp['is_legal_ball'].sum()
        if leg > 0:
            w = grp['batter_pressure_index'].values / 50.0
            val = np.sum(grp['batter_runs_added'].values * w)
            match_impacts.append((val / leg) * 100.0)
            
    match_impacts = np.array(match_impacts)
    np.random.seed(42)
    boot_means = [np.mean(np.random.choice(match_impacts, size=len(match_impacts), replace=True)) for _ in range(1000)]
    boot_ci_low = round(float(np.percentile(boot_means, 2.5)), 2)
    boot_ci_high = round(float(np.percentile(boot_means, 97.5)), 2)
    
    evidence_records.append({
        'role': 'BATTER',
        'rank': int(r['rank']),
        'player_id': pid,
        'player_name': pname,
        'competition_appearances': len(m_info),
        'competitions_list': '; '.join(m_info[:4]),
        'total_legal_balls': int(r['legal_balls']),
        'high_pressure_balls': int(r['hp_balls']),
        'high_pressure_legal_balls': int(r['hp_legal_balls']),
        'average_pressure_index': r['mean_pressure_index'],
        'overall_rate_metric': r['overall_rate_metric'],
        'hp_rate_metric': r['hp_rate_metric'],
        'rate_metric_delta': r['metric_delta'],
        'raw_clutch_impact': r['raw_clutch_impact'],
        'bayesian_clutch_rating': r['bayesian_clutch_rating'],
        'posterior_se': r['posterior_se'],
        'credible_interval_95': f"[{r['ci_lower_95']}, {r['ci_upper_95']}]",
        'interval_type': 'Bayesian 95% Credible Interval',
        'distinct_matches': int(r['distinct_matches']),
        'match_impact_std': r['match_impact_std'],
        'positive_match_pct': r['positive_match_pct'],
        'match_bootstrap_95ci': f"[{boot_ci_low}, {boot_ci_high}]",
        'selection_rationale': f"Elite pressure scoring: strikes at {r['hp_rate_metric']} under pressure across {int(r['distinct_matches'])} matches."
    })

# Bowlers
for _, r in top_comb_bowl.iterrows():
    pid = int(r['player_id'])
    pname = str(r['player_name'])
    p_del = df[(df['bowler_id'] == pid) & (df['is_primary_scope'])]
    m_info = mapping[mapping['player_id'] == pid]['comp_name'].unique().tolist()
    
    match_impacts = []
    for mid, grp in p_del.groupby('match_id'):
        leg = grp['is_legal_ball'].sum()
        if leg > 0:
            w = grp['bowler_pressure_index'].values / 50.0
            val = np.sum(grp['bowler_runs_saved'].values * w) + np.sum(grp['bowler_wickets_added'].values * w) * 15.0
            match_impacts.append((val / leg) * 100.0)
            
    match_impacts = np.array(match_impacts)
    np.random.seed(42)
    boot_means = [np.mean(np.random.choice(match_impacts, size=len(match_impacts), replace=True)) for _ in range(1000)]
    boot_ci_low = round(float(np.percentile(boot_means, 2.5)), 2)
    boot_ci_high = round(float(np.percentile(boot_means, 97.5)), 2)
    
    evidence_records.append({
        'role': 'BOWLER',
        'rank': int(r['rank']),
        'player_id': pid,
        'player_name': pname,
        'competition_appearances': len(m_info),
        'competitions_list': '; '.join(m_info[:4]),
        'total_legal_balls': int(r['legal_balls']),
        'high_pressure_balls': int(r['hp_balls']),
        'high_pressure_legal_balls': int(r['hp_legal_balls']),
        'average_pressure_index': r['mean_pressure_index'],
        'overall_rate_metric': r['overall_rate_metric'],
        'hp_rate_metric': r['hp_rate_metric'],
        'rate_metric_delta': r['metric_delta'],
        'raw_clutch_impact': r['raw_clutch_impact'],
        'bayesian_clutch_rating': r['bayesian_clutch_rating'],
        'posterior_se': r['posterior_se'],
        'credible_interval_95': f"[{r['ci_lower_95']}, {r['ci_upper_95']}]",
        'interval_type': 'Bayesian 95% Credible Interval',
        'distinct_matches': int(r['distinct_matches']),
        'match_impact_std': r['match_impact_std'],
        'positive_match_pct': r['positive_match_pct'],
        'match_bootstrap_95ci': f"[{boot_ci_low}, {boot_ci_high}]",
        'selection_rationale': f"Exceptional defensive/wicket-taking impact: holds {r['hp_rate_metric']} economy under pressure across {int(r['distinct_matches'])} matches."
    })

ev_df = pd.DataFrame(evidence_records)
ev_df.to_csv('reports/rankings/player_selection_evidence.csv', index=False)
print("Successfully saved reports/rankings/player_selection_evidence.csv! Shape:", ev_df.shape)

