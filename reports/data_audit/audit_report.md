# Rajasthan Royals SupeRR Selector Season 2 - Data Audit Report

> **Audit Status:** COMPLETED  
> **Scope:** IPL & T20I ball-by-ball, matches, playing XIs, player mappings, and competitions (2022 onwards)  
> **Data Integrity Policy:** Zero-loss, non-destructive audit. Original files intact. Zero silent mutations.  

## 1. Executive Summary & File Catalog

| File Name | Total Rows | Total Columns | Duplicate Rows | Primary / Composite Key | Key Uniqueness |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `competitions.csv` | 141 | 4 | 0 | `comp_id` | **100% Unique** |
| `teams.csv` | 353 | 3 | 0 | `comp_id, team_id` | **100% Unique** |
| `matches.csv` | 883 | 22 | 0 | `match_id` | **100% Unique** |
| `competition_team_player_mapping.csv` | 6,413 | 6 | 0 | `comp_id, team_id, player_id` | **100% Unique** |
| `playing_eleven.csv` | 28,381 | 9 | 0 | `match_id, team_id, player_id` | **40 Duplicate Pairs (75 Rows)** |
| `ball_by_ball.csv` | 200,999 | 33 | 0 | `match_id, innings, overid, over_ball_num` | **100% Unique** |

## 2. Key Audit Findings & Problem Statement Checklist

### A. Investigation of 16 Matches in `matches.csv` Absent from `ball_by_ball.csv`
- **Root Cause:** All 16 matches were **'Match Abandoned'** prior to play commencing (weather/rain interruptions). No balls were bowled.
- **Breakdown:** 4 IPL matches (31281, 31284, 31288 in IPL 2024; 40761 in IPL 2025) and 12 T20I matches.
- **Handling Recommendation:** Retain in `matches.csv` for tournament schedule context; automatically excluded from delivery-level pressure aggregation without data loss.

### B. Duplicate Player Records in `playing_eleven.csv`
- **Root Cause:** 75 duplicate rows affecting 35 unique player-match keys across exactly **3 T20I matches** (13613, 21176, 28962).
- **Nature of Duplicates:** **Not identical duplicates.** Only the `batting_order` column differs (e.g. 1.0 vs 3.0), representing tactical batting order shifts before and during the match. All flag columns (`is_played`, `is_captain`, `is_wk`, `is_impact`) are identical.
- **BBB Validation:** Cross-referencing `ball_by_ball.csv` reveals which batting position actually took strike.
- **Handling Recommendation:** Do not blindly delete. When joining for playing XI identification, group by `(match_id, team_id, player_id)` and select the actual batting order observed in BBB or minimum position.

### C. Extras & Runs Semantics (`extras1_runs`, `extras_2_runs`, `extras_type`, `runs`)
- **CRITICAL DISCOVERY:** `extras1_runs` is **categorically encoded**, NOT numeric runs!
  - `1`: Overstep (No-ball) - 576 occurrences
  - `2`: wide - 7,714 occurrences
  - `3`: legbyes - 2,748 occurrences
  - `4`: byes - 529 occurrences
  - `5`: other (overthrows/free hit extras) - 264 occurrences
  - `6`: no extra (normal legal delivery) - 189,167 occurrences
  - `7`: Penalty - 1 occurrence
- **Batting Runs Semantics:** The `runs` column records **runs off the bat** attributed to the striker. For wides, legbyes, byes, and penalty, `runs == 0` in 100% of cases.
- **`extras_2_runs` Semantics:** Zero on 200,963 balls (99.98%). Non-zero on exactly 36 balls (20 ones, 16 fours) representing boundary extras or penalty adjustments on oversteps and 'other' extras.

### D. Boundary & Wicket Logic Consistency
- **Boundaries:** Whenever `is_four == True`, `runs == 4` (100%). Whenever `is_six == True`, `runs == 6` (100%).
  - 21 balls have `runs == 4` and `is_four == False`: Batters physically ran 4 runs between the wickets.
  - 3 balls have `runs == 6` and `is_six == False`: Overthrows added to physical runs (did not cross boundary rope on the fly).
- **Wickets & Dismissed Player ID:**
  - **1 delivery** has `is_wicket == True` but `dismissed_player_id == NaN` (Match 40709, Inning 2, Over 19 Ball 5 - 'Retire Out').
  - **12 deliveries** have `is_wicket == False` but `dismissed_player_id` populated with `dismissal_type == NaN` (aborted dismissals/reviews).

### E. Innings, Over Numbering & Super Overs
- **Innings:** Innings 1 (105,727 balls), Innings 2 (95,234 balls), Innings 3 (25 balls across 6 Super Overs), Innings 4 (13 balls across 6 Super Overs).
- **Super Overs:** 6 matches went to Super Overs (Matches 34429, 40725, 45512, 48027, 48029, 50359).
- **Over & Ball Numbering:** `overid` ranges from 1 to 20 (1-indexed). `over_ball_num` ranges from 1 to 13 due to extra deliveries extending the over.

### F. Competition Scoping (IPL vs T20I vs Emerging T20)
- **IPL Competitions (5 seasons):** IPL 2022, IPL 2023, IPL 2024, IPL 2025, IPL 2026 (371 matches, 85,732 deliveries).
- **T20I Competitions:** 134 international tournaments/bilaterals (482 matches, 108,282 deliveries).
- **Other T20 Competitions:** 2 tournaments (Mens T20 Emerging Teams Asia Cup 2024, Asia Cup Rising Stars 2025; 30 matches, 6,985 deliveries). Non-IPL, non-T20I emerging team fixtures.

## 3. Referential Integrity Matrix

| Join Condition | Valid Rows / Keys | Missing / Orphan Keys | Integrity Status |
| :--- | :--- | :--- | :--- |
| `ball_by_ball.match_id -> matches.match_id` | 200,999 balls | 0 | **100% Clean** |
| `matches.match_id -> ball_by_ball.match_id` | 867 matches | 16 (Abandoned) | **Explained (Abandoned)** |
| `matches.match_id -> playing_eleven.match_id` | 880 matches | 3 (Abandoned) | **Explained (Abandoned)** |
| `matches.comp_id -> competitions.comp_id` | 883 matches | 0 | **100% Clean** |
| `teams.comp_id -> competitions.comp_id` | 353 team-comps | 0 | **100% Clean** |
| `ctpm.player_id -> bbb.striker/bowler` | All 1,602 BBB players | 0 | **100% Clean** |

## 4. Reusability & Execution Commands

The audit pipeline is fully automated and reproducible. To run the pipeline:

```powershell
python data_audit.py
```

All generated CSV issue files and markdown summaries will be placed under `reports/data_audit/`.
