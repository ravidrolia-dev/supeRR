# ClutchIQ Feature Dictionary

This document defines the schema and engineered features in the ClutchIQ processed datasets under `data/processed/`.

---

## 1. `master_ball_by_ball.csv`

The master delivery-level dataset contains all original raw delivery attributes combined with match context, cumulative score accounting, and pre-delivery match state signals.

| Column Name | Data Type | Source / Derivation | Description |
| :--- | :--- | :--- | :--- |
| `match_id` | `int64` | `matches.csv` | Unique match identifier. |
| `innings` | `int64` | `ball_by_ball.csv` | Innings sequence (1, 2 = standard; 3, 4 = Super Over). |
| `overid` | `int64` | `ball_by_ball.csv` | 1-indexed over number (1 to 20). |
| `over_ball_num` | `int64` | `ball_by_ball.csv` | Delivery sequence within the over (1 to 13). |
| `innings_ball_num` | `int64` | `ball_by_ball.csv` | Sequential delivery event counter within the innings. |
| `comp_id` | `int64` | `competitions.csv` | Unique competition identifier. |
| `comp_name` | `string` | `competitions.csv` | Tournament/series name. |
| `competition_category` | `string` | Engineered | High-level categorization: `IPL`, `T20I`, or `Other T20`. |
| `is_primary_scope` | `bool` | Engineered | `True` for IPL and Senior T20I matches; `False` for Emerging Teams/Rising Stars. |
| `batter_runs` | `int64` | `runs` | Striker runs scored off the bat on this delivery. |
| `is_ambiguous_bat_runs`| `bool` | Engineered | Flag for anomalous delivery 113765 (legbye with `runs == 1`). |
| `is_legal_ball` | `bool` | Engineered | `True` if delivery counts towards the 6-ball over limit (not a wide, overstep, or beamer). |
| `legal_ball_num` | `int64` | Cumulative | Cumulative legal balls bowled in the innings up to this ball. |
| `legal_balls_bowled_before` | `int64` | Pre-delivery | Count of legal deliveries bowled before this ball. |
| `legal_balls_remaining_before` | `int64` | Pre-delivery | Scheduled innings legal balls minus legal balls bowled before. |
| `innings_phase_before` | `string` | Pre-delivery | Tactical phase before ball: `Powerplay` (balls 0-35), `Middle` (36-89), `Death` (90-119), or `SuperOver`. |
| `is_super_over` | `bool` | Engineered | `True` for innings 3 and 4. |
| `scheduled_legal_balls` | `int64` | Match Context | Total legal deliveries scheduled for the innings (120 for normal, 6 for Super Over, or revised DLS balls). |
| `bowler_extra_penalty` | `int64` | Engineered | 1-run penalty charged to bowler for wide or no-ball. |
| `bowler_runs_conceded` | `int64` | Engineered | Strict MCC Law runs charged to bowler (`batter_runs + penalty + extras_2_runs`; 0 on byes/legbyes). |
| `is_bowler_wicket` | `bool` | Engineered | `True` for Bowled, Caught, LBW, Stump, Hit Wicket. |
| `is_non_bowler_wicket` | `bool` | Engineered | `True` for RunOut, Retire Out, Obstructing the field. |
| `wickets_before_ball` | `int64` | Pre-delivery | Wickets fallen in the innings strictly before this delivery. |
| `wickets_in_hand_before`| `int64` | Pre-delivery | Batting team wickets remaining ($10 - \text{wickets\_before\_ball}$). |
| `runs_before_ball_lower_bound` | `int64` | Pre-delivery | Confirmed team runs scored before this delivery (lower bound). |
| `score_reconstruction_confidence` | `string` | Pre-delivery | `EXACT` if no prior byes/legbyes/penalties occurred; `LOWER_BOUND_ONLY` if uncertain extras occurred. |
| `target_score` | `float64` | Match Context | Target runs to win in chase (Innings 2 & 4). `NaN` in 1st innings. |
| `target_confidence` | `string` | Context | Target reliability: `AUTHORITATIVE_DLS_TARGET`, `EXACT_RECONSTRUCTED_TARGET`, `ESTIMATED_TARGET_LOWER_BOUND`, `EXACT_SUPER_OVER_TARGET`, or `NOT_APPLICABLE`. |
| `runs_remaining_before` | `float64` | Pre-delivery | Runs needed to reach target before ball. `NaN` in 1st innings. |
| `required_run_rate_before` | `float64` | Pre-delivery | Required runs per 6 legal balls. `NaN` in 1st innings. |
| `is_audit_anomaly_delivery` | `bool` | Audit Cross-ref | `True` if delivery is among the 74 isolated anomalies. |

---

## 2. `player_lookup.csv`

Master profile table linking all players across competitions and team assignments.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `player_id` | `int64` | Primary key representing the player. |
| `player_name` | `string` | Canonical player name. |
| `teams_represented` | `list` | All teams represented by the player in the dataset. |
| `competitions_played` | `list` | Competitions where the player appeared. |
| `batting_type` | `string` | Batting hand (`RHB`, `LHB`). |
| `bowling_type` | `string` | Primary bowling action (e.g. `Right-arm Fast`, `Leg-Break`). |
| `pace_or_spin` | `string` | Bowling classification (`Pace` or `Spin`). |
| `has_batted_in_bbb` | `bool` | `True` if player has faced at least 1 delivery in `ball_by_ball.csv`. |
| `has_bowled_in_bbb` | `bool` | `True` if player has delivered at least 1 ball in `ball_by_ball.csv`. |
| `is_in_bbb` | `bool` | `True` if player participated in any ball-by-ball delivery. |

---

## 3. `match_context.csv`

Match-level metadata and revised over schedules.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `match_id` | `int64` | Primary match key. |
| `comp_id` | `int64` | Competition ID. |
| `comp_name` | `string` | Competition series name. |
| `match_format` | `string` | Official match format (`IPL`, `T20I`, `T20`). |
| `season` | `int64` | Match season / year. |
| `competition_category` | `string` | Analytical grouping: `IPL`, `T20I`, or `Other T20`. |
| `is_primary_scope` | `bool` | Filter flag for IPL and senior T20I matches. |
| `inn1_scheduled_legal_balls` | `int64` | Scheduled legal balls for Innings 1 (adjusted for rain). |
| `inn2_scheduled_legal_balls` | `int64` | Scheduled legal balls for Innings 2 (adjusted for rain). |
| `is_rain_affected` | `bool` | `True` if DLS or revised overs were applied. |
| `revised_target` | `float64` | Official DLS target score from `matches.csv` (if applicable). |

---

## 4. `batting_features.csv`

Player-match-innings batting profiles for IPL and Senior T20I matches.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `match_id`, `innings`, `striker_id` | Composite Key | Identifies the batter's innings. |
| `batting_order` | `float64` | Starting position at the crease. |
| `total_balls_faced` | `int64` | Total deliveries faced (including wides/no-balls). |
| `legal_balls_faced` | `int64` | Legal deliveries faced (advancing the over). |
| `runs_scored` | `int64` | Runs off the bat. |
| `fours`, `sixes`, `dots` | `int64` | Boundary and dot-ball counts. |
| `strike_rate` | `float64` | Batting strike rate per 100 legal balls. |
| `dot_ball_percentage` | `float64` | Percentage of deliveries faced resulting in 0 runs. |
| `boundary_run_percentage`| `float64` | Percentage of total runs scored from boundaries. |
| `balls_faced_powerplay`, `runs_powerplay` | `int64` | Performance in Powerplay (Overs 1-6). |
| `balls_faced_middle`, `runs_middle` | `int64` | Performance in Middle Overs (Overs 7-15). |
| `balls_faced_death`, `runs_death` | `int64` | Performance at the Death (Overs 16-20). |
| `mean_rrr_faced` | `float64` | Average required run rate faced during run chase. |
| `high_rrr_balls_faced` | `int64` | Deliveries faced when required run rate $\ge 10.0$ RPO. |
| `runs_under_high_rrr` | `int64` | Runs scored when required run rate $\ge 10.0$ RPO. |

---

## 5. `bowling_features.csv`

Player-match-innings bowling profiles for IPL and Senior T20I matches.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `match_id`, `innings`, `bowler_id` | Composite Key | Identifies the bowler's spell. |
| `total_balls_bowled` | `int64` | Total delivery events bowled. |
| `legal_balls_bowled` | `int64` | Legal deliveries bowled. |
| `overs_bowled` | `float64` | Cricket overs notation (e.g. 4.0, 3.3). |
| `runs_conceded` | `int64` | Strict MCC Law runs charged to bowler. |
| `bowler_wickets` | `int64` | Wickets credited to bowler (excluding run outs). |
| `economy_rate` | `float64` | Bowler economy rate per 6 legal balls. |
| `dot_ball_percentage` | `float64` | Percentage of deliveries conceding 0 runs. |
| `wides_conceded`, `no_balls_conceded` | `int64` | Illegal deliveries bowled. |
| `balls_bowled_powerplay`, `wickets_powerplay` | `int64` | Powerplay bowling performance. |
| `balls_bowled_middle`, `wickets_middle` | `int64` | Middle overs bowling performance. |
| `balls_bowled_death`, `wickets_death` | `int64` | Death overs bowling performance. |

