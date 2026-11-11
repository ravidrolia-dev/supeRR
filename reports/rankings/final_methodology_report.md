# ClutchIQ — Rajasthan Royals SupeRR Selector Season 2: Comprehensive Methodology Report

**Project Title:** ClutchIQ: Data-Driven Cricket Pressure Intelligence & Player Valuation  
**Competition:** Rajasthan Royals SupeRR Selector Season 2 Hackathon  
**Target Submission Categories:** Top-10 Batters & Top-10 Bowlers Under Pressure (IPL & Senior T20I, 2022–2026)  
**Primary Analytical Datasets:**
- [master_ball_by_ball.csv](file:///d:/RR/RR_Solution/data/processed/master_ball_by_ball.csv) (200,999 deliveries, 883 matches)
- [delivery_pressure_scores.csv](file:///d:/RR/RR_Solution/data/processed/delivery_pressure_scores.csv) (200,999 deliveries, 36 analytical columns)
- [player_clutch_ratings.csv](file:///d:/RR/RR_Solution/data/processed/player_clutch_ratings.csv) (891 players, 180 eligible batters, 222 eligible bowlers)
- [top10_combined_batters.csv](file:///d:/RR/RR_Solution/reports/rankings/top10_combined_batters.csv)
- [top10_combined_bowlers.csv](file:///d:/RR/RR_Solution/reports/rankings/top10_combined_bowlers.csv)
- [player_selection_evidence.csv](file:///d:/RR/RR_Solution/reports/rankings/player_selection_evidence.csv)
- [wicket_value_sensitivity.csv](file:///d:/RR/RR_Solution/reports/rankings/wicket_value_sensitivity.csv)

---

## 1. Executive Summary & Problem Context

In modern Twenty20 cricket, aggregated performance metrics such as batting strike rate and bowling economy rate obscure the most decisive facet of tournament cricket: **clutch execution under pressure**. A boundary scored when 12 runs are required from 3 balls carries vastly greater match-winning equity than a boundary scored during a 220-run blowout. Conversely, a dot ball bowled in the 19th over defending 10 runs represents immense value compared to a dot ball in a dead rubber.

The **Rajasthan Royals SupeRR Selector Season 2 Hackathon** tasks participants with identifying the 10 most reliable batters and 10 most reliable bowlers under pressure using IPL and senior T20I ball-by-ball data from 2022 onwards. 

To solve this challenge without human bias, external reputation, or premature heuristic ranking, we engineered **ClutchIQ**. ClutchIQ is an end-to-end, reproducible statistical pipeline built on five core pillars:
1. **Cricket Score-Accounting Truth:** Exact forensic audit of the six supplied CSV files, resolving categorical extra encodings, missing physical bye/legbye magnitudes, bowler-credited wickets, and match abandonments without fabricating scorecard totals.
2. **Context-Aware Pressure Modeling:** Formulation of strictly pre-delivery Batter Pressure Index (BPI) and Bowler Pressure Index (BowlerPI) bounded to $[0, 100]$, integrating required run rates, dynamic empirical par scores, ball/wicket scarcity, and win probability leverage.
3. **Value-Added Performance Engine:** Replacement of raw strike rate and economy rate with context-conditioned **Batter Runs Added (RAR)**, **Bowler Runs Saved (RBE)**, and **Bowler Wickets Added**, normalized separately across competitions and innings phases.
4. **Bayesian Reliability & Empirical Shrinkage:** Application of empirical Bayes shrinkage ($k=150.0$) with data-estimated priors and 95% credible intervals to prevent small-sample distortion while preserving true elite separation.
5. **Robustness & Integrity Auditing:** Independent verification of player figures, sensitivity testing across volume cutoffs and wicket values, and zero rank inversions among core leaders.

---

## 2. Cricket Accounting & Data Integrity

Before constructing performance indices, an exhaustive audit of the source files (`teams.csv`, `ball_by_ball.csv`, `competition_team_player_mapping.csv`, `competitions.csv`, `matches.csv`, `playing_eleven.csv`) was conducted:

### 2.1 Critical Data Accounting Findings
- **Striker Runs vs Team Runs:** The column `runs` represents striker runs off the bat only. It does not represent total team runs.
- **Categorical Extras Encoding:** `extras1_runs` is a 1–7 categorical code (`1`: Overstep, `2`: Wide, `3`: Legbye, `4`: Bye, `5`: Other/Beamer, `6`: No Extra, `7`: Penalty). It is not a run magnitude.
- **Missing Bye/Legbye Magnitudes:** The dataset omits physical run counts on byes and legbyes (where `runs = 0` and `extras1_runs` is 3 or 4). Rather than fabricating scorecard totals, cumulative score is tracked strictly as an exact lower-bound floor (`runs_before_ball_lower_bound`).
- **Bowler-Credited Wickets:** Bowler-credited wickets strictly include `Bowled`, `Caught`, `LBW`, `Stump`, and `Hit Wicket` (10,272 events). Non-bowler dismissals (`RunOut`, `Retire Out`, `Obstructing the field`) are strictly excluded from bowling value.
- **Match Coverage:** The 16 matches present in `matches.csv` but absent in `ball_by_ball.csv` were verified as weather-abandoned fixtures without a ball bowled.
- **Scope Restriction:** The dataset comprises 371 IPL matches and 482 senior men's T20I matches (194,014 primary-scope balls). 30 matches from the Men's Emerging Teams Asia Cup and Asia Cup Rising Stars were filtered out of primary rankings via `is_primary_scope == False`.

---

## 3. Mathematical Pressure Architecture

A valid pressure index must satisfy four mathematical axioms:
1. **Zero Future Information Leakage:** Features must rely strictly on information available before the ball is bowled.
2. **Monotonicity:** Pressure must increase strictly with higher Required Run Rate (RRR), fewer balls remaining, and fewer wickets in hand.
3. **Strict Boundedness:** Every index must be bounded strictly to $[0, 100]$.
4. **Asymmetric Incentives:** Batting pressure and bowling pressure are not symmetric; when a match is virtually lost (e.g. RRR > 25 with 1 wicket remaining), batting pressure reaches extreme levels, whereas bowler pressure diminishes.

```
+----------------------------------------------------------------------------------------------------+
|                                    CLUTCHIQ PRESSURE ENGINE                                        |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|   CHASE PRESSURE (Innings 2)                      FIRST-INNINGS PRESSURE (Innings 1)               |
|   -------------------------                       ----------------------------------               |
|   * Demand Ratio: D = RRR / 8.50                  * Dynamic Par Surface: Projected Par             |
|   * Wicket Scarcity: S_w = (10 / (W_hand + 1))^0.42 * Par Deficit: Delta_Par = 169 - Projected Par   |
|   * Ball Scarcity: S_b = (120 / (B_rem + 6))^0.25 * Phase Escalation: Powerplay -> Middle -> Death  |
|   * Match Leverage: L = Closeness * Urgency       * Wicket Tension: (10 / (W_hand + 1))^0.35       |
|                                                                                                    |
|   BPI_Chase = 42.0 * D^1.15 * S_w * S_b * L^0.35  BPI_Inn1 = 38.0 + 0.32*Delta_Par*Phase + W_tens  |
|                                                                                                    |
|   BowlerPI_Chase = 44.0 * D_bowl * S_w_bowl *     BowlerPI_Inn1 = 36.0 + 0.28*Phase + W_tens       |
|                    S_b_bowl * L^0.45 * Relief                                                      |
+----------------------------------------------------------------------------------------------------+
```

### 3.1 Pre-Delivery Win Probability & Leverage
For chases, pre-delivery win probability $P_{\text{win}}$ is calibrated using a logistic response surface:
$$\text{logit} = 1.85 + 0.35 W_{\text{hand}} - 0.26 R_{\text{req}} - 0.012 R_{\text{rem}} + 0.018 B_{\text{rem}}$$
This model achieves an out-of-sample Brier score of **0.1276** (vs 0.2494 baseline) and an **ROC AUC of 0.9006**.
Match leverage $L$ measures the closeness of the contest scaled by time scarcity:
$$\text{Closeness} = \text{clip}\left(1.0 - 1.6 |P_{\text{win}} - 0.50|, 0.20, 1.00\right)$$
$$L = \text{clip}\left(\text{Closeness} \times \left(\frac{120}{B_{\text{rem}} + 6}\right)^{0.175}, 0.30, 1.50\right)$$

### 3.2 Dynamic First-Innings Par Model
In the first innings, pressure is governed by progress against the empirical par-score expectation surface:
$$\text{Projected Par} = \text{Runs Before} + \max\left(0, 0.85 B_{\text{rem}} + 4.8(W_{\text{hand}} - 1)\right)$$
$$\text{Par Deficit} = \max\left(0, 169.0 - \text{Projected Par}\right)$$
This empirical surface achieved an out-of-sample MAE of **17.27 runs**, outperforming a static median par score (29.07 MAE) by 40.6%.

---

## 4. Expected Performance & Value-Added Metrics

Rather than penalizing batters or bowlers based on unadjusted scoring rates, every delivery outcome is evaluated against empirical league baselines conditioned on `[competition_category, innings_phase_before]`:

| Competition | Innings Phase | Expected Striker Runs | Expected Bowler Runs | Expected Bowler Wicket Prob | Expected Dot Prob | Expected Boundary Prob |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **IPL** | Powerplay | 1.3826 | 1.4233 | 0.0392 | 0.4713 | 0.2286 |
| **IPL** | Middle | 1.3444 | 1.3817 | 0.0432 | 0.3334 | 0.1620 |
| **IPL** | Death | 1.5768 | 1.6448 | 0.0693 | 0.3507 | 0.2176 |
| **T20I** | Powerplay | 1.2505 | 1.2910 | 0.0465 | 0.4977 | 0.1958 |
| **T20I** | Middle | 1.2502 | 1.2838 | 0.0479 | 0.3574 | 0.1404 |
| **T20I** | Death | 1.4506 | 1.5101 | 0.0766 | 0.3696 | 0.1886 |

### 4.1 Value-Added Formulations
- **Batter Runs Added (RAR):** $\text{RAR}_i = \text{batter\_runs}_i - \mathbb{E}[\text{batter\_runs} | \text{context}_i]$
- **Bowler Runs Saved (RBE):** $\text{RBE}_i = \mathbb{E}[\text{bowler\_runs} | \text{context}_i] - \text{bowler\_runs\_conceded}_i$
- **Bowler Wickets Added:** $\text{WA}_i = \mathbb{I}(\text{bowler\_wicket}_i) - \mathbb{E}[\text{bowler\_wicket} | \text{context}_i]$

### 4.2 Continuous Pressure Weighting
To eliminate arbitrary step-function cutoffs, each ball is weighted continuously by its normalized pressure index:
$$w_{i, \text{bat}} = \frac{\text{BPI}_i}{50.0}, \quad w_{i, \text{bowl}} = \frac{\text{BowlerPI}_i}{50.0}$$
Player raw clutch impact rates (scaled per 100 legal balls) are:
$$\text{Raw Clutch Batting} = \frac{\sum_{i=1}^N \left( \text{RAR}_i \times w_{i, \text{bat}} \right)}{\text{Legal Balls Faced}} \times 100$$
$$\text{Raw Clutch Bowling} = \frac{\sum_{i=1}^N \left( \left(\text{RBE}_i + V_w \cdot \text{WA}_i\right) \times w_{i, \text{bowl}} \right)}{\text{Legal Balls Bowled}} \times 100$$
where $V_w = 15.0$ runs represents the standard empirical T20 wicket replacement value.

---

## 5. Bayesian Reliability & Empirical Bayes Shrinkage

Raw rate metrics are vulnerable to sample size variance; a batter facing 20 balls who hits four sixes in one chase could achieve an unsustainable raw score. To resolve this, ClutchIQ applies **Empirical Bayes (James-Stein) Shrinkage**:

### 5.1 Shrinkage Formulation
$$\theta_j = \lambda_j \cdot y_j + (1 - \lambda_j) \cdot \mu_{\text{prior}}$$
$$\lambda_j = \frac{n_j}{n_j + k}$$
- **Sample Size $n_j$:** Total legal balls faced/bowled.
- **Prior Mean $\mu_{\text{prior}}$:** Volume-weighted mean of qualified players ($+2.97$ for batting, $+1.97$ for bowling).
- **Shrinkage Constant $k$:** Ratio of noise variance to true skill variance ($k = 150.0$).
- **Posterior Standard Error & 95% Credible Interval:**
  $$\text{SE}_{\text{post}, j} = \sigma_{\text{skill}} \sqrt{\frac{k}{n_j + k}}$$
  $$\text{CI}_{95\%} = \theta_j \pm 1.96 \cdot \text{SE}_{\text{post}, j}$$

---

## 6. Full Rankings Presentation & Dropdown Verification

All 10 Batters and 10 Bowlers in the final combined lists strictly exist in `competition_team_player_mapping.csv` and can be mapped directly to the Unstop dropdown menus.

### 6.1 Top 10 Combined Batters
| Rank | Player ID | Player Name | Matches | Legal Balls | HP Legal Balls | Overall SR | HP SR | Raw RAR/100 | Shrunk Rating | 95% Credible Interval |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | 37052 | **Naman Dhir** | 42 | 514 | 148 | 172.37 | 206.08 | +42.21 | **33.34** | $[20.10, 46.58]$ |
| **2** | 6396 | **Tim David** | 98 | 1,210 | 402 | 180.00 | 181.34 | +34.12 | **30.68** | $[17.94, 43.43]$ |
| **3** | 6281 | **Abhishek Sharma** | 130 | 2,239 | 93 | 187.49 | 159.14 | +29.40 | **27.74** | $[15.22, 40.25]$ |
| **4** | 1699 | **Suryakumar Yadav** | 139 | 2,748 | 439 | 167.21 | 177.45 | +26.99 | **25.75** | $[13.27, 38.22]$ |
| **5** | 5553 | **Phil Salt** | 84 | 1,628 | 66 | 170.88 | 203.03 | +24.64 | **22.81** | $[10.31, 35.31]$ |
| **6** | 4260 | **Heinrich Klaasen** | 72 | 1,408 | 359 | 167.83 | 161.28 | +23.56 | **21.58** | $[9.08, 34.09]$ |
| **7** | 838 | **Glenn Maxwell** | 75 | 953 | 163 | 161.80 | 179.75 | +22.84 | **20.17** | $[7.59, 32.74]$ |
| **8** | 8101 | **Ashutosh Sharma** | 26 | 328 | 261 | 171.95 | 179.69 | +28.03 | **20.16** | $[6.90, 33.43]$ |
| **9** | 8182 | **Donovan Ferreira** | 30 | 341 | 167 | 164.81 | 147.31 | +27.42 | **20.10** | $[6.88, 33.32]$ |
| **10** | 8301 | **Asif Khan** | 13 | 200 | 82 | 151.50 | 176.83 | +29.01 | **17.85** | $[4.07, 31.64]$ |

### 6.2 Top 10 Combined Bowlers
| Rank | Player ID | Player Name | Matches | Legal Balls | HP Legal Balls | Overall Econ | HP Econ | HP Wkts | Raw RBE/100 | Shrunk Rating | 95% Credible Interval |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | 2985 | **Mark Wood** | 13 | 281 | 113 | 8.14 | 8.18 | 14 | +101.63 | **66.95** | $[42.56, 91.34]$ |
| **2** | 3629 | **Corbin Bosch** | 19 | 367 | 107 | 8.63 | 7.12 | 13 | +74.78 | **53.66** | $[29.98, 77.34]$ |
| **3** | 2490 | **Mohammad Nawaz** | 52 | 1,004 | 189 | 7.12 | 6.48 | 23 | +57.12 | **49.95** | $[27.81, 72.10]$ |
| **4** | 22471 | **Matthew Humphreys** | 14 | 305 | 78 | 7.06 | 6.69 | 12 | +68.59 | **46.63** | $[22.95, 70.30]$ |
| **5** | 8661 | **Matheesha Pathirana** | 54 | 1,132 | 457 | 8.64 | 9.40 | 40 | +48.99 | **43.49** | $[21.57, 65.41]$ |
| **6** | 161 | **Dwayne Bravo** | 10 | 206 | 105 | 8.71 | 8.63 | 8 | +67.11 | **39.66** | $[15.17, 64.15]$ |
| **7** | 3578 | **Imad Wasim** | 14 | 246 | 51 | 6.15 | 6.47 | 6 | +57.47 | **36.45** | $[12.28, 60.62]$ |
| **8** | 5979 | **Abrar Ahmed** | 35 | 764 | 175 | 6.66 | 5.59 | 14 | +41.77 | **35.24** | $[13.78, 56.70]$ |
| **9** | 25132 | **Praful Hinge** | 7 | 156 | 79 | 11.73 | 11.24 | 11 | +59.65 | **31.38** | $[6.29, 56.46]$ |
| **10** | 34485 | **Sufiyan Muqeem** | 17 | 344 | 118 | 6.49 | 6.00 | 9 | +43.48 | **30.88** | $[8.14, 53.62]$ |

---

## 7. Sensitivity, Robustness & Limitations

### 7.1 Wicket Replacement Value Sensitivity
Simulating bowler ratings across wicket values from $V_w = 8.0$ to $20.0$ runs confirms that the **Top 5 bowlers (Mark Wood, Corbin Bosch, Mohammad Nawaz, Matthew Humphreys, Matheesha Pathirana) maintain 100% membership stability**. Wicket-heavy bowlers (Pathirana, Wood) gain relative to pure economy spinners (Imad Wasim, Rashid Khan) as $V_w$ increases, but the core elite remains invariant.

### 7.2 Sample Threshold Stability
Testing 12 threshold combinations ($100 \le \text{Volume} \le 250$ balls, $25 \le \text{HP} \le 60$ balls) yielded **zero rank inversions** among the top 4 batters and top 5 bowlers.

### 7.3 Data Limitations & Known Uncertainty
1. **Unrecorded Bye/Legbye Runs:** Cumulative match scores are calculated as lower bounds. While this does not corrupt pre-delivery ball scarcity or striker runs, chase RRR is an exact lower-bound estimate in affected matches.
2. **Opposition Strength Variance in T20Is:** While league-level scoring differences are normalized, associate-heavy fixtures introduce higher performance variance for bowlers like Matthew Humphreys. Credible intervals explicitly communicate this uncertainty.

---
**Pipeline Status:** Fully executed, validated, and reproducible.  
**Deliverables Generated:** 6 ranking CSVs, evidence dataset, sensitivity analysis, integrity audit, executive summary, and comprehensive methodology report.

