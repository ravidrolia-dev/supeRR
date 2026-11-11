# ClutchIQ Feature Validation & Data Profiling Report

**Project:** Rajasthan Royals SupeRR Selector Season 2  
**Module:** Master Data Preparation & Feature Validation  
**Date:** November 10, 2026  
**Pipeline Execution:** `python -m src.pipeline`  
**Test Suite:** `pytest tests/` (6 passed, 100%)

---

## 1. Compact Data Profile & Dataset Summary

| Dataset File | Total Records | Total Attributes | Analytical Purpose | Primary Scope Filter |
| :--- | :---: | :---: | :--- | :--- |
| [`data/processed/master_ball_by_ball.csv`](file:///d:/RR/RR_Solution/data/processed/master_ball_by_ball.csv) | **200,999** | **84** | Complete delivery-level chronological dataset with context and pre-delivery state. | Retains 100% of rows; flag `is_primary_scope` filters IPL & T20I. |
| [`data/processed/match_context.csv`](file:///d:/RR/RR_Solution/data/processed/match_context.csv) | **883** | **25** | Match schedule, venue, teams, revised overs/balls, and scope flags. | 853 matches in primary scope (371 IPL + 482 T20I). 30 excluded (Other T20). |
| [`data/processed/player_lookup.csv`](file:///d:/RR/RR_Solution/data/processed/player_lookup.csv) | **1,217** | **10** | Deduplicated player master linking teams, competitions, batting and bowling styles. | 958 active players in ball-by-ball records. |
| [`data/processed/batting_features.csv`](file:///d:/RR/RR_Solution/data/processed/batting_features.csv) | **13,251** | **28** | Player-match-innings batting metrics across phases and chase pressure contexts. | Strictly primary scope (IPL + Senior T20I). |
| [`data/processed/bowling_features.csv`](file:///d:/RR/RR_Solution/data/processed/bowling_features.csv) | **9,738** | **28** | Player-match-innings bowling spells across phases, economy, and bowler-credited wickets. | Strictly primary scope (IPL + Senior T20I). |

---

## 2. Competition & Match Counts Breakdown

| Competition Category | Match Format in CSV | Match Count | Delivery Count in BBB | Analytical Status |
| :--- | :---: | :---: | :---: | :--- |
| **Senior T20I** | `T20I` | **482** | **106,327** | **PRIMARY SCOPE** |
| **IPL (2022–2026)** | `T20` | **371** | **87,687** | **PRIMARY SCOPE** |
| **Other T20 (Emerging/Rising)** | `T20` | **30** | **6,985** | **EXCLUDED FROM PRIMARY SCOPE** (`is_primary_scope == False`) |
| **Total** | — | **883** | **200,999** | **100% Accounted For** |

- *Note on Excluded Tournaments:* "Mens T20 Emerging Teams Asia Cup 2024" (15 matches, 3,519 balls) and "Asia Cup Rising Stars 2025" (15 matches, 3,466 balls) represent non-senior A-team/emerging fixtures. They are explicitly tagged with `competition_category == 'Other T20'` and filtered out of primary rankings to satisfy the hackathon problem statement.

---

## 3. Score-Reconstruction Coverage & Confidence

Because `ball_by_ball.csv` omits the physical run magnitude for byes, legbyes, penalties, and multi-run wides, delivery-level team score accumulation is tracked with explicit confidence tiers:

### A. Cumulative Innings Score Confidence
- **`EXACT` (91,599 deliveries, 45.57%):** Every previous delivery in the innings was a normal ball, wide, or no-ball with demonstrable run certainty. The cumulative team score is mathematically exact.
- **`LOWER_BOUND_ONLY` (109,400 deliveries, 54.43%):** At least one prior ball in the innings was a bye, legbye, or penalty where run magnitude was unrecorded. The cumulative score is guaranteed to be a solid lower-bound floor.

### B. Chase Target Confidence (Innings 2 & 4)
- **`NOT_APPLICABLE` (105,752 deliveries, 52.61%):** Innings 1 and Innings 3 (1st innings of Super Overs) where target does not exist.
- **`AUTHORITATIVE_DLS_TARGET` (1,641 deliveries, 0.82%):** Weather-interrupted matches where `revised_target` is officially provided in `matches.csv`.
- **`EXACT_RECONSTRUCTED_TARGET` (15,493 deliveries, 7.71%):** 2nd innings where Innings 1 contained zero uncertain fielding extras, allowing exact target determination ($\text{Inn1 Runs} + 1$).
- **`ESTIMATED_TARGET_LOWER_BOUND` (78,100 deliveries, 38.86%):** 2nd innings where Innings 1 had byes/legbyes without an official DLS revised target. Target is reconstructed from the verified lower bound.
- **`EXACT_SUPER_OVER_TARGET` (13 deliveries, <0.01%):** Super Over chases where target is Innings 3 score + 1.

---

## 4. Key Validation Results & Data Leakage Prevention

All unit and regression tests passed (`pytest tests/`, 6 passed):

1. **Zero Data Leakage:**
   - Pre-delivery features (`wickets_before_ball`, `runs_before_ball_lower_bound`, `legal_balls_bowled_before`, `legal_balls_remaining_before`, `innings_phase_before`, `runs_remaining_before`, `required_run_rate_before`) strictly depend on information available *before* the delivery.
   - For example, if a batter is dismissed on ball 5 of an over, `wickets_before_ball` on ball 5 does *not* include that dismissal; it increments on ball 6.
2. **Legal Balls Integrity:**
   - 100% of wides (7,714), oversteps (576), and beamers (264) have `is_legal_ball == False`.
   - Summing `is_legal_ball` in completed overs yields exactly 6 legal balls.
3. **Bowler Accounting Compliance:**
   - Bowlers are charged 0 runs for byes (529) and legbyes (2,748).
   - Bowler wickets strictly include Bowled, Caught, LBW, Stump, and Hit Wicket (10,272 wickets). Run-outs (600), Retire Outs (6), and Obstructing the field (3) are classified as non-bowler dismissals.

---

## 5. Anomaly Audit Linkage

- All **74 unresolved delivery anomalies** isolated during Task 1.1 are preserved and explicitly flagged in `master_ball_by_ball.csv` via:
  ```python
  df['is_audit_anomaly_delivery'] == True
  ```
- **Ambiguous Bat Runs Flag:** Delivery 113765 (Match 37099, Over 14 Ball 1) has `extras_type == 'legbyes'` and `runs == 1`. Flagged via `is_ambiguous_bat_runs == True`.
- **Rain-Affected Flag:** 34 matches with revised overs or targets are flagged via `is_rain_affected == True`.

---

## 6. Formulas That Could Not Be Fabricated (Omitted Responsibly)

In accordance with strict hackathon integrity rules:
1. **Exact Cumulative Team Score on Fielding Extras:**
   Because bye and legbye magnitudes are omitted from the source data, we did not fabricate arbitrary values (e.g., assuming every bye was 1 run). We instead provide `runs_before_ball_lower_bound` with `score_reconstruction_confidence`.
2. **Chasing Target in Incomplete Match Records:**
   In matches where Innings 1 was cut short or abandoned without DLS revised targets, `runs_remaining_before` and `required_run_rate_before` are left as `NaN` rather than inventing an unverified target.

