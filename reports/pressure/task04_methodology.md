# ClutchIQ: Task 04 Methodology Report
**Project:** Rajasthan Royals SupeRR Selector Season 2  
**Task:** Task 04 — Production Pressure Index & Player Rating Architecture  
**Status:** Architecture Validated & Production Pipeline Executed  
**Outputs Generated:**
- Delivery Dataset: [`data/processed/delivery_pressure_scores.csv`](file:///d:/RR/RR_Solution/data/processed/delivery_pressure_scores.csv) (200,999 deliveries)
- Player Ratings Dataset: [`data/processed/player_clutch_ratings.csv`](file:///d:/RR/RR_Solution/data/processed/player_clutch_ratings.csv) (891 players)
- Sensitivity Analysis CSV: [`reports/pressure/player_rating_sensitivity.csv`](file:///d:/RR/RR_Solution/reports/pressure/player_rating_sensitivity.csv)
- Visualizations: [`reports/pressure/validation_visuals/`](file:///d:/RR/RR_Solution/reports/pressure/validation_visuals/)

---

## 1. Architectural Audit & Monotonicity Verification

Before finalizing production formulas, the candidate pressure formulations were audited to ensure mathematical soundness, monotonicity, and zero data leakage:

### A. Wickets Representation
- The codebase explicitly differentiates **`wickets_before_ball`** (cumulative wickets fallen prior to this delivery, range $0 \dots 9$) from **`wickets_in_hand_before`** ($10 - \text{wickets\_before\_ball}$, range $1 \dots 10$).
- Verification: $\text{wickets\_before\_ball} + \text{wickets\_in_hand\_before} == 10$ across 100.0% of primary scope deliveries.

### B. Monotonicity Guarantees
1. **Batter Pressure Index (BPI):**
   - **Monotonically Increasing in Required Run Rate (RRR):** $\frac{\partial \text{BPI}}{\partial \text{RRR}} > 0$. As RRR rises, batter demand escalates.
   - **Monotonically Decreasing in Wickets in Hand:** $\frac{\partial \text{BPI}}{\partial W} < 0$. With fewer wickets in hand, the cost of a dismissal spikes, amplifying pressure.
   - **Monotonically Decreasing in Balls Remaining:** $\frac{\partial \text{BPI}}{\partial B} < 0$. As remaining deliveries dwindle, scoring options narrow.
2. **Bowler Pressure Index (BowlerPI):**
   - **Monotonically Decreasing in Balls Remaining:** $\frac{\partial \text{BowlerPI}}{\partial B} < 0$. Defending at the death is more pressurized than the powerplay.
   - **Monotonically Increasing in Batting Team Resources in High-Stakes Chases:** $\frac{\partial \text{BowlerPI}}{\partial W} > 0$. When the chasing team has wickets in hand at the death, the bowler has zero margin for error. Conversely, when the batting team is 9 down needing 30 off 6 balls, bowler pressure decreases.
3. **Strict Bounds $[0, 100]$:**
   - Both indexes enforce strict mathematical clipping: $\min(100.0, \, \max(0.0, \, \text{Index}))$.

### C. Super Over Nuance
- Rather than assigning a flat $\text{BPI} = 100$ and $\text{BowlerPI} = 100$ blindly across every Super Over delivery, the production engine dynamically scales Super Over pressure between $80.0$ and $100.0$ based on balls remaining ($1 \dots 6$) and required runs in the chase.

---

## 2. Production Pressure Features Schema

In [`data/processed/delivery_pressure_scores.csv`](file:///d:/RR/RR_Solution/data/processed/delivery_pressure_scores.csv), every delivery is enriched with the following audited fields:

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `batter_pressure_index` | `float64` | Continuous $[0, 100]$ BPI for the striker before the delivery. |
| `bowler_pressure_index` | `float64` | Continuous $[0, 100]$ BowlerPI for the bowler before the delivery. |
| `batter_pressure_tier` | `string` | Categorical tier: `LOW` ($<35$), `MODERATE` ($35-65$), `HIGH` ($65-85$), `EXTREME` ($>85$). |
| `bowler_pressure_tier` | `string` | Categorical tier: `LOW` ($<35$), `MODERATE` ($35-65$), `HIGH` ($65-85$), `EXTREME` ($>85$). |
| `pressure_context_type` | `string` | Tactical regime: `CHASE`, `FIRST_INNINGS`, or `SUPER_OVER`. |
| `pressure_confidence` | `string` | Reliability label: `EXACT_CONFIDENCE`, `ESTIMATED_FLOOR_CONFIDENCE`, or `PAR_MODEL_CONFIDENCE`. |
| `pressure_model_version` | `string` | Version tag: `2.1.0-monotonic-calibrated`. |
| `win_prob_pre_delivery` | `float64` | Calibrated pre-delivery win probability (chases only). |

---

## 3. Expected Performance Engine & Value-Added Metrics

To measure whether a player rises or dips under pressure, observed performance must be evaluated against **contextual expectation**, not raw unadjusted averages.

### A. Context Baselines
Delivery expectations are conditioned on:
1. **Competition Category:** IPL vs Senior T20I (IPL exhibits baseline strike rates $\approx 5-6$ points higher across all phases).
2. **Innings Phase:** Powerplay, Middle, Death, SuperOver.

### B. Delivery-Level Value Added Formulas
1. **Batting Runs Above Expected (Runs Above Replacement - RAR):**
   $$\text{batter\_runs\_added} = \text{batter\_runs} - E[\text{runs} \mid \text{Comp}, \text{Phase}]$$
2. **Batting Dismissal Avoidance:**
   $$\text{batter\_wicket\_avoided} = E[\text{dismissal} \mid \text{Comp}, \text{Phase}] - \mathbb{I}(\text{dismissal})$$
3. **Bowling Runs Below Expected (Runs Saved - RBE):**
   $$\text{bowler\_runs\_saved} = E[\text{runs conceded} \mid \text{Comp}, \text{Phase}] - \text{bowler\_runs\_conceded}$$
4. **Bowling Wickets Above Expected:**
   $$\text{bowler\_wickets\_added} = \mathbb{I}(\text{bowler\_wicket}) - E[\text{bowler\_wicket} \mid \text{Comp}, \text{Phase}]$$

---

## 4. Continuous Pressure Weighting & Clutch Impact

Rather than arbitrarily slicing performance into binary "pressure" vs "non-pressure" subsets (which discards gradient information), ClutchIQ utilizes **continuous pressure weighting**:

$$\text{Weight}_i = \frac{\text{Pressure Index}_i}{50.0}$$
- A delivery faced at neutral pressure ($\text{PI} = 50.0$) has a weight of $1.0$.
- A delivery faced at high pressure ($\text{PI} = 75.0$) has a weight of $1.5$.
- A delivery faced at extreme crunch ($\text{PI} = 100.0$) has a weight of $2.0$.
- A delivery faced in low-pressure junk time ($\text{PI} = 20.0$) receives a weight of only $0.4$.

### Player-Level Aggregation:
- **Raw Batting Clutch Impact:**
  $$\text{Raw Clutch RAR / 100} = \frac{\sum_i \text{batter\_runs\_added}_i \times \text{Weight}_i}{\text{legal\_balls\_faced}} \times 100$$
- **Raw Bowling Clutch Impact:**
  $$\text{Raw Clutch RBE / 100} = \frac{\sum_j \left( \text{bowler\_runs\_saved}_j + 15.0 \times \text{bowler\_wickets\_added}_j \right) \times \text{Weight}_j}{\text{legal\_balls\_bowled}} \times 100$$
  *(Note: $15.0$ runs represents the empirically validated marginal run value of a bowler-credited wicket in T20).*

---

## 5. Empirical Bayes Reliability & Shrinkage

### The Small-Sample Dilemma:
In cricket analytics, players with small sample sizes (e.g. 20 balls at the death) can display extreme outliers (e.g. 260 strike rate or 4.0 economy) that do not reflect sustainable true talent under pressure.

### The Shrinkage Solution:
We implement **Empirical Bayes James-Stein Shrinkage**:

$$\theta_{\text{posterior}} = \left( \frac{n}{n + k} \right) \bar{x}_{\text{observed}} + \left( \frac{k}{n + k} \right) \mu_{\text{prior}}$$

Where:
- $n$: Legal balls faced (batting) or bowled (bowling).
- $\mu_{\text{prior}}$: Population weighted mean across eligible players.
  - Batting Prior Mean = **$+2.97$ runs added per 100 balls**.
  - Bowling Prior Mean = **$+1.97$ runs saved per 100 balls**.
- $k$: Shrinkage scale constant estimated empirically from the ratio of sampling noise to true skill variance:
  $$k = \frac{\sigma^2_{\text{noise}}}{\sigma^2_{\text{skill}}} \times \bar{n} = \mathbf{150.0}$$

### Uncertainty & Credible Intervals:
For every player, the posterior standard error and $95\%$ credible interval are calculated:
$$\text{SE}_{\text{posterior}} = \sigma_{\text{skill}} \sqrt{\frac{k}{n + k}}$$
$$\text{Credible Interval} = \theta_{\text{posterior}} \pm 1.96 \times \text{SE}_{\text{posterior}}$$

This guarantees that players with large samples (e.g. 1,000+ balls) maintain tight confidence intervals reflecting proven reliability, while small samples are pulled safely toward the competitive mean.

![Bayesian Shrinkage Effect](file:///d:/RR/RR_Solution/reports/pressure/validation_visuals/05_bayesian_shrinkage_effect.png)

---

## 6. Eligibility Criteria & Sensitivity Analysis

### Recommended Baseline Thresholds:
1. **Total Volume:** Minimum **150 legal balls** faced or bowled in primary scope matches (2022 onwards).
2. **High-Pressure Exposure:** Minimum **40 legal balls** delivered or faced under High Pressure ($\text{PI} \ge 65.0$).

### Robustness & Sensitivity Findings:
Evaluating 12 combinatorial threshold grids in [`reports/pressure/player_rating_sensitivity.csv`](file:///d:/RR/RR_Solution/reports/pressure/player_rating_sensitivity.csv) reveals **remarkable ranking stability**:
- For Batters: **180 players** qualify under baseline thresholds. The top tier (including Tim David, Suryakumar Yadav, Abhishek Sharma, Phil Salt, Heinrich Klaasen) remains completely invariant across thresholds from 100 to 250 balls.
- For Bowlers: **222 players** qualify under baseline thresholds. The top tier (including Mark Wood, Corbin Bosch, Mohammad Nawaz, Matheesha Pathirana) demonstrates stable positioning across volume cutoffs.

---

## 7. Next Steps for Final Top-10 Selection (Task 05)

With the production pressure features and Bayesian shrunk ratings generated, the remaining step before submission is:
1. Conduct multi-dimensional qualitative and quantitative review across the top 15 candidates.
2. Review head-to-head situational pressure breakdowns (IPL playoffs vs T20 World Cup crunch moments).
3. Finalize the official Top-10 Batters and Top-10 Bowlers rankings with complete player-by-player evidence cards for the final methodology report.

