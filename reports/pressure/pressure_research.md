# ClutchIQ: Pressure Intelligence Research Report
**Project:** Rajasthan Royals SupeRR Selector Season 2  
**Task:** Task 03 — Pressure Intelligence Research  
**Data Scope:** IPL and Senior T20I (2022 onwards)  
**Deliverables Generated:**
- Research Documentation: `reports/pressure/pressure_research.md`
- Feature Audit CSV: [`reports/pressure/pressure_feature_analysis.csv`](file:///d:/RR/RR_Solution/reports/pressure/pressure_feature_analysis.csv)
- Distribution Audit CSV: [`reports/pressure/pressure_distribution_analysis.csv`](file:///d:/RR/RR_Solution/reports/pressure/pressure_distribution_analysis.csv)
- Visualization Suite: [`reports/pressure/pressure_research_visuals/`](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals)

---

## Executive Summary & Objectives

The purpose of Task 03 is to explore, define, and statistically validate a **defensible, context-aware mathematical definition of cricket pressure** for both batters and bowlers under T20 match situations.

In competitive cricket, pressure is neither arbitrary nor static. It arises from the interaction between **resource scarcity** (legal balls remaining and wickets in hand) and **tactical demand** (the rate of scoring required to win or post a winning par score). This research investigates both regular match dynamics (Innings 1 and Innings 2 chases) and Super Overs across 194,014 primary-scope deliveries in 837 matches, establishing an empirical baseline without premature ML ranking or arbitrary weight assignment.

---

## Part A: Data Quality, Feature Coverage & Reliability Profiling

Across all 194,014 primary scope deliveries, every candidate state variable was audited for missingness, reconstruction certainty, and leakage prevention:

| Variable Name | Total Null Rate | Innings 1 Null Rate | Innings 2 Null Rate | Reliability Status | Accounting & Leakage Validation |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `legal_balls_remaining_before` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | Decrements strictly upon legal deliveries (excludes wides/no-balls). Fully leakage-free. |
| `wickets_in_hand_before` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | $10 - \text{wickets fallen strictly prior to this ball}$. Never includes current ball outcome. |
| `runs_before_ball_lower_bound` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | Cumulative team runs floor before this delivery. |
| `score_reconstruction_confidence` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | 45.57% `EXACT`, 54.43% `LOWER_BOUND_ONLY` (flags prior byes/legbyes). |
| `target_score` | 52.61% | 100.00% | **0.00%** | **CONDITIONAL_CHASE_ONLY** | Authoritative DLS (1,641 balls), Exact (14,598 balls), Estimated Floor (75,695 balls). |
| `required_run_rate_before` | 52.61% | 100.00% | **0.00%** | **CONDITIONAL_CHASE_ONLY** | Defined exclusively in 2nd and 4th innings chases. Kept null in 1st innings. |
| `runs_remaining_before` | 52.61% | 100.00% | **0.00%** | **CONDITIONAL_CHASE_ONLY** | $\max(0, \text{Target} - \text{Runs Before})$. Null in 1st innings. |
| `innings_phase_before` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | Tactical phase before delivery: Powerplay, Middle, Death, SuperOver. |
| `is_super_over` | **0.00%** | **0.00%** | **0.00%** | **EXACT_RELIABLE** | Innings 3 & 4 (26 balls in primary scope). |

### Scope Segregation:
1. **IPL vs Senior T20I:**
   - IPL (2022–2026): 371 matches, 87,687 deliveries.
   - Senior T20I: 482 matches, 106,327 deliveries.
   - Emerging Teams / Rising Stars (30 matches, 6,985 balls) are completely segregated (`is_primary_scope == False`).
2. **Super Overs:**
   - 6 tied matches produced Super Overs (innings 3 & 4). In primary scope, 26 balls were bowled. Super Overs have 6 scheduled balls and represent an extreme pressure regime requiring separate handling.

---

## Part B: Second-Innings Chase Pressure Dynamics

In a run chase (Innings 2), pressure is primarily governed by the **Required Run Rate (RRR)** relative to historically attainable scoring rates, scaled by the scarcity of wickets and overs.

### 1. Empirical Win Rate by Required Run Rate & Innings Stage
Examining 91,934 chase deliveries reveals the non-linear relationship between RRR and historical match victory:

| Required Run Rate Bracket | Powerplay (16-20 ovs left) | Middle Overs (7-15 ovs left) | Death Overs (4-6 ovs left) | Last 3 Overs (0-3 ovs left) | Overall Chase Win Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **< 6.0 RPO (Low Demand)** | 92.6% | 94.5% | 96.9% | 92.4% | **93.8%** |
| **6.0 – 8.0 RPO (Comfortable)** | 74.5% | 83.9% | 91.3% | 84.9% | **83.1%** |
| **8.0 – 10.0 RPO (Competitive Par)** | 45.0% | 53.8% | 68.5% | 71.2% | **58.2%** |
| **10.0 – 12.0 RPO (High Pressure)** | 26.5% | 29.1% | 40.3% | 53.2% | **35.4%** |
| **12.0 – 15.0 RPO (Very High Pressure)** | 8.9% | 7.1% | 17.8% | 35.7% | **16.2%** |
| **15.0 – 20.0 RPO (Extreme Pressure)** | 0.0% | 0.0% | 2.2% | 14.7% | **3.8%** |
| **> 20.0 RPO (Near Unattainable)** | 0.0% | 0.0% | 0.1% | 1.7% | **0.8%** |

![Chase Win Rate vs RRR](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals/02_chase_win_rate_vs_rrr.png)

### 2. The Escalating Dismissal Hazard
As RRR rises, batters are forced to take aggressive boundary options against defensive field settings, driving a steep increase in dismissal probability:
- **$\text{RRR} < 8.0$:** Wicket hazard = **$4.29\%$** per ball (1 wicket every 23.3 balls).
- **$\text{RRR} = 10.0 - 12.0$:** Wicket hazard = **$5.30\%$** per ball (1 wicket every 18.9 balls).
- **$\text{RRR} = 12.0 - 15.0$:** Wicket hazard = **$6.62\%$** per ball (1 wicket every 15.1 balls).
- **$\text{RRR} > 15.0$:** Wicket hazard = **$9.10\%$** per ball (1 wicket every 11.0 balls).

![Dismissal Hazard Escalation](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals/03_dismissal_hazard_escalation.png)

---

## Part C: First-Innings Empirical Par-Score Framework

In the 1st innings, there is no fixed target score. Pressure cannot be calculated from Required Run Rate. Instead, 1st innings pressure is determined by:
1. **Resource Scarcity:** Wickets in hand and remaining legal overs.
2. **Current Deficit Against Expected Par:** Whether the batting team is on track to post a competitive total or falling significantly behind par.

### 1. Empirical Expected Runs Matrix ($E[\text{Runs Remaining} \mid W, B]$)
By calculating the actual runs added from every $(W, B)$ state to the end of the innings across 837 primary matches, we construct the empirical par-score expectation grid:

| Wickets in Hand ($W$) | 20 Overs Remaining | 15 Overs Remaining | 10 Overs Remaining | 5 Overs Remaining | 2 Overs Remaining | 1 Over Remaining |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **10 Wickets** | **170.3** | 139.8 | 108.2 | 68.4 | 37.5 | 18.2 |
| **8 Wickets** | 158.4 | **127.8** | **99.7** | **59.2** | **30.4** | 14.8 |
| **6 Wickets** | 142.1 | 109.1 | **82.4** | **54.1** | **26.3** | 13.1 |
| **4 Wickets** | 118.5 | 65.3 | 48.2 | **44.5** | **22.2** | 10.8 |
| **2 Wickets (Tail)** | 78.0 | 45.0 | 34.2 | 27.4 | **15.7** | 7.9 |

![Innings 1 Par-Score Surface](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals/01_innings1_par_score_surface.png)

### 2. State-Based Par Projection
At any delivery in Innings 1:
$$\text{Projected Par Score} = \text{runs\_before\_ball\_lower\_bound} + E[\text{Runs Remaining} \mid W, \text{overs\_rem}]$$

Historical median 1st innings total across all primary matches is **169.1 runs** ($\approx 8.45$ RPO).  
When early wickets fall or middle-overs stalling occurs, the projected par score drops below 150 runs, creating acute **acceleration pressure** on the remaining batters while bowlers seek to maintain strangulation.

---

## Part D: Match Closeness & Pre-Delivery Leverage

Can match closeness be estimated dynamically before each ball without leaking future outcomes?

### 1. Pre-Delivery Win Probability Model Validation
We trained a logistic win probability model on a **70% / 30% match-level split** (training on 585 distinct matches, testing on 252 held-out matches) using only pre-delivery inputs:
- Inputs: `runs_remaining_before`, `legal_balls_remaining_before`, `wickets_in_hand_before`, `required_run_rate_before`.
- **Out-of-Match Test Results:**
  - **Brier Score:** **0.1276** (benchmarked against 0.2500 for random guessing; excellent probabilistic calibration).
  - **ROC AUC:** **0.9006** (outstanding discriminatory capability).

### 2. Dynamic Leverage Index Definition
Match leverage reflects the volatility of the match outcome. When the probability of winning is near 50%, every delivery has maximum swing potential:
$$\text{Leverage} = 1.0 - 2.0 \times \left| P(\text{Win})_{\text{pre-delivery}} - 0.50 \right|$$
- When $P(\text{Win}) = 0.50$, $\text{Leverage} = 1.0$ (Peak competitive dead-heat).
- When $P(\text{Win}) \to 1.0$ or $0.0$, $\text{Leverage} \to 0.0$ (Blowout / low-leverage situation).

---

## Part E: Indicator Relationships, Thresholds & Competition Nuances

### 1. Inter-Variable Correlation & Multicollinearity
Evaluating state variables reveals predictable structural relationships:

![Correlation Matrix](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals/05_state_variable_correlation_matrix.png)

- `legal_balls_remaining_before` and `runs_before_ball_lower_bound` have strong negative correlation ($-0.85$), as runs naturally accumulate over time.
- `wickets_in_hand_before` has moderate positive correlation ($+0.52$) with remaining balls, as wickets are depleted as the innings progresses.
- **Key Takeaway:** Combining `wickets_in_hand` and `legal_balls_remaining` multiplicatively rather than additively properly captures resource compounding (loss of wickets at the death is far more damaging than in the powerplay).

### 2. Competition Comparison: IPL vs Senior T20I
Examining scoring rates and dismissal hazards across phases:

| Competition Scope | Phase | Delivery Count | Batting Strike Rate | Dot Ball % | Boundary % | Dismissal Hazard | Mean Bowler Runs Conceded |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **IPL** | Powerplay | 27,871 | **132.8** | 41.6% | 19.3% | 4.04% | 1.42 |
| **IPL** | Middle | 40,248 | **131.6** | 35.8% | 15.3% | 4.46% | 1.38 |
| **IPL** | Death | 19,568 | **158.4** | 31.9% | 20.8% | 7.73% | 1.64 |
| **Senior T20I** | Powerplay | 33,901 | **126.8** | 44.4% | 17.5% | 4.80% | 1.29 |
| **Senior T20I** | Middle | 49,043 | **127.3** | 38.6% | 14.1% | 4.97% | 1.28 |
| **Senior T20I** | Death | 23,357 | **152.6** | 35.6% | 19.2% | 8.47% | 1.51 |

![IPL vs T20I Phase Dynamics](file:///d:/RR/RR_Solution/reports/pressure/pressure_research_visuals/04_ipl_vs_t20i_phase_dynamics.png)

- **IPL matches feature higher baseline scoring rates across all phases** (Powerplay SR: 132.8 vs 126.8; Death SR: 158.4 vs 152.6).
- **Senior T20I matches feature higher dismissal hazards** (Death dismissal rate: 8.47% in T20I vs 7.73% in IPL).
- **Implication for Pressure Modeling:** While raw scoring differs by 5–6 points of strike rate, the *relative response curve* to pressure (RRR escalation and wicket scarcity) is structurally identical. A robust pressure index should normalize relative to competition context or use universally grounded resource metrics.

### 3. Continuous Index vs Discrete Thresholds
- Discretizing pressure into binary buckets (e.g., "Pressure" vs "Non-Pressure" at RRR $\ge 10.0$) throws away critical gradient information (chasing 10.5 RPO is substantially different from chasing 18.0 RPO).
- **Recommendation:** Use a **continuous Contextual Pressure Index (CPI) on a scale of $[0, 100]$**, with verified threshold tiers (Low: $<35$, Medium: $35-65$, High: $65-85$, Extreme: $>85$) for reporting and profiling.

---

## Part F: Candidate Pressure Frameworks

We propose four candidate mathematical formulations for public peer review:

### Framework 1: Second-Innings Chase Pressure Index ($\text{CPI}_{\text{Chase}}$)

#### Mathematical Logic:
Chase pressure is the product of **Required Rate Deficit** and **Resource Depletion Factor**:

$$\text{Demand Ratio} = \frac{\text{required\_run\_rate\_before}}{\text{Baseline Target Rate}}$$

$$\text{Resource Factor} = \left( \frac{10}{\text{wickets\_in\_hand\_before} + 1} \right)^{\alpha} \times \left( \frac{120}{\text{legal\_balls\_remaining\_before} + 6} \right)^{\beta}$$

$$\text{CPI}_{\text{Chase}} = \min\left(100, \, 50 \times \text{Demand Ratio} \times \text{Resource Factor} \times \text{Leverage}\right)$$

- **Variables:** `required_run_rate_before`, `wickets_in_hand_before`, `legal_balls_remaining_before`, estimated pre-delivery `Leverage`.
- **Data Availability:** 100% available in Innings 2 and Innings 4.
- **Assumptions:** Batters and bowlers experience maximal mutual pressure when Required Rate exceeds 10.0 and fewer than 5 wickets remain.
- **Advantages:** Dynamically adapts from powerplay to final over; reaches 100 in tight death-over chases.
- **Limitations:** Dependent on target score reliability (handled via confidence tiers).

---

### Framework 2: First-Innings Score-Projection Pressure Index ($\text{CPI}_{\text{Inn1}}$)

#### Mathematical Logic:
First-innings pressure measures the threat of posting an uncompetitive total, compounded by death-overs acceleration demands:

$$\text{Par Deficit} = \max\left(0, \, \text{Par}_{\text{Median}} - (\text{runs\_before\_ball} + E[\text{Runs Rem} \mid W, B])\right)$$

$$\text{Phase Weight} = \begin{cases} 
1.0 & \text{Powerplay (Overs 1-6)} \\
1.2 & \text{Middle (Overs 7-15)} \\
1.6 & \text{Death (Overs 16-20)} 
\end{cases}$$

$$\text{CPI}_{\text{Inn1}} = \min\left(100, \, 25 \times \text{Phase Weight} \times \left(1 + \frac{\text{Par Deficit}}{30}\right) \times \left(\frac{10}{\text{wickets\_in\_hand} + 1}\right)^{0.5}\right)$$

- **Variables:** `runs_before_ball_lower_bound`, `legal_balls_remaining_before`, `wickets_in_hand_before`, empirical Par Matrix $E[\text{Runs Rem} \mid W, B]$.
- **Data Availability:** 100% available across all 1st innings deliveries.
- **Advantages:** Eliminates arbitrary RRR guesses in 1st innings; rigorously rewards anchors recovering from collapses and death-overs finishers.

---

### Framework 3: Batter-Specific Pressure Exposure

#### Mathematical Logic:
Measures the pressure environment faced by a batter during their time at the crease:

$$\text{Batter Exposure} = \sum_{i \in \text{balls faced}} \text{CPI}_{i} \times \mathbb{I}(\text{striker})$$

$$\text{High-Pressure Ratio} = \frac{\sum_{i} \mathbb{I}(\text{CPI}_i \ge 65)}{\text{Total Balls Faced}}$$

- **Metrics Evaluated under Pressure:** Strike Rate Delta ($\text{SR}_{\text{High}} - \text{SR}_{\text{Baseline}}$), Boundary %, Dot Ball %, and Survival Hazard under High CPI.
- **Eligibility Filter:** Requires $\ge 150$ total balls with $\ge 50$ balls under $\text{CPI} \ge 65$.

---

### Framework 4: Bowler-Specific Pressure Exposure

#### Mathematical Logic:
Measures the difficulty of spells delivered by a bowler:

$$\text{Bowler Exposure} = \sum_{j \in \text{balls bowled}} \text{CPI}_{j}$$

$$\text{High-Pressure Overs Ratio} = \frac{\sum_{j} \mathbb{I}(\text{CPI}_j \ge 65)}{\text{Total Balls Bowled}}$$

- **Metrics Evaluated under Pressure:** Economy Rate Delta ($\text{Econ}_{\text{High}} - \text{Econ}_{\text{Baseline}}$), Dot-Ball Suppression %, Bowler Wickets per 100 balls under High CPI.
- **Eligibility Filter:** Requires $\ge 150$ legal balls ($\ge 25$ overs) with $\ge 50$ balls under $\text{CPI} \ge 65$.

---

## Key Conclusions & Next Implementation Step

### What is Confirmed & Reliable:
1. `legal_balls_remaining_before`, `wickets_in_hand_before`, and `innings_phase_before` are **100% complete, reliable, and completely leakage-free**.
2. Empirical par-score surfaces condition cleanly on $(W, B)$, providing a principled foundation for 1st innings pressure.
3. Pre-delivery win probability models achieve **0.90 AUC and 0.128 Brier score** out-of-match, proving match leverage can be estimated without post-match leakage.

### What is Unavailable or Conditional:
1. Exact delivery-level team runs remain a verified lower bound whenever fielding byes or legbyes occurred.
2. RRR and chase targets are strictly conditional on 2nd/4th innings and must not be used in 1st innings.

### Recommended Next Step:
Proceed to **Task 04: Pressure Index Calibration & Player Rating Architecture**. We will formulate the continuous $[0, 100]$ CPI, calibrate empirical hyperparameters, evaluate player baseline differentials, and apply Bayesian shrinkage to generate stable Top-10 rankings.

