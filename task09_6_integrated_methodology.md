# TASK 09.6 — UNIFIED PRESSURE-FIRST SCOUTING METHODOLOGY

## 1. Architectural Mandate & Executive Summary

The objective of Task 09.6 is to establish a unified pressure-first scouting framework that provides **one final integrated ranking for batters and one for bowlers**.

In previous iterations (Task 09.4 and 09.5), a rigid filter requiring $\ge 40$ high-pressure legal balls was used as an absolute exclusion rule. While this safeguarded the leaderboards against small-sample noise, it created an unbridgeable selection divide: dynamic early-innings tempo dominators who prevented high-pressure crises from developing were entirely invisible to scouts on the primary leaderboard.

**Task 09.6 replaces the hard 40 HP-ball cutoff with a continuous, evidence-stratified scoring architecture:**
1. **Unified Baseline Eligibility:**
   - Minimum **150 overall legal balls** faced (batting) or bowled (bowling).
   - Valid primary competition scope (IPL and T20I Senior Men's).
   - Non-zero match activity.
2. **Scoring Architecture (70 / 20 / 10):**
   - **70% V3 Pressure Performance:** Dominant anchor measuring contextual execution under high match pressure ($\text{BPI}_{\text{v3}} \ge 65.0$ / $\text{BowlPI}_{\text{v3}} \ge 65.0$).
   - **20% PPI Pressure Prevention:** Non-death (Overs 1–16) foundation building, powerplay dominance, and required run rate containment.
   - **10% Match-to-Match Consistency:** Repeatability across distinct matches (percentage of games with net positive contextual contribution).
3. **Three-Tier Evidence Classification:**
   - **Strong Direct Evidence ($\ge 150$ HP Balls):** Veteran crisis executors with multi-season high-pressure volume.
   - **Moderate Direct Evidence ($40\text{--}149$ HP Balls):** Proven pressure performers with sufficient statistical reliability.
   - **Limited Direct Evidence ($< 40$ HP Balls):** Early-tempo specialists or emerging players whose high score is primarily driven by foundation dominance or small-sample crisis spikes.

---

## 2. Mathematical Formulation

For any player $k$ meeting the 150 overall legal ball threshold:

$$\text{SupeRR Score}_k = 50.0 + 10.0 \times \left(0.70 \cdot Z_{\text{clutch}, k} + 0.20 \cdot Z_{\text{ppi}, k} + 0.10 \cdot Z_{\text{cons}, k}\right)$$

### Component Standardization:
All components are calibrated relative to the full eligible population ($\ge 150$ legal balls):

#### Batting Reference Population ($N = 239$ Batters):
- $Z_{\text{clutch}, i} = \frac{\hat{\theta}_{\text{clutch}, i} - (-0.35)}{16.20}$ (where $\hat{\theta}_{\text{clutch}}$ is empirical Bayes shrunk clutch impact per 100 balls).
- $Z_{\text{ppi}, i} = \frac{\hat{\theta}_{\text{ppi}, i} - (-8.21)}{16.86}$ (where $\hat{\theta}_{\text{ppi}}$ is shrunk non-death contextual runs added per 100 balls).
- $Z_{\text{cons}, i} = \frac{\text{PosPct}_i - 39.17\%}{13.59\%}$ (percentage of distinct matches with net positive runs added).

#### Bowling Reference Population ($N = 258$ Bowlers):
- $Z_{\text{clutch}, j} = \frac{\hat{\theta}_{\text{clutch}, j} - (-4.79)}{13.63}$ (where $\hat{\theta}_{\text{clutch}}$ is empirical Bayes shrunk bowling impact per 100 balls).
- $Z_{\text{ppi}, j} = \frac{\hat{\theta}_{\text{ppi}, j} - (-1.85)}{13.75}$ (where $\hat{\theta}_{\text{ppi}}$ is shrunk non-death runs saved per 100 balls).
- $Z_{\text{cons}, j} = \frac{\text{PosPct}_j - 43.07\%}{12.70\%}$ (percentage of distinct matches with net positive impact).

---

## 3. Reliability & Evidence Safeguards

### A. The Shrinkage Mechanism
To prevent small samples from dominating, Bayesian shrinkage is applied to raw performance metrics:
$$\hat{\theta}_k = w_k \cdot \text{RawImpact}_k + (1 - w_k) \cdot \mu_{\text{prior}}, \quad w_k = \frac{N_{\text{legal}, k}}{N_{\text{legal}, k} + k_0}$$
- Players are never assigned a zero score due to low sample size; their rating shrinks gracefully toward the baseline prior mean.

### B. The Direct-Pressure Evidence Dilemma & Safeguards
Removing the 40 HP-ball exclusion rule introduces a significant scouting phenomenon:
- **Vaibhav Sooryavanshi** (575 legal balls, 8 HP balls) scores $81.83$ to rank #1 among batters.
- **Priyansh Arya** (469 legal balls, 1 HP ball) scores $72.15$ to rank #2 among batters.
- **Mark Wood** (281 legal balls, 28 HP balls) scores $73.89$ to rank #2 among bowlers.

**Mandatory Safeguard:**
To ensure scouts do not mistake early-innings destroyers for battle-tested death finishers, the **Evidence Tier must be displayed prominently alongside the score**:
- A scout seeking an elite death finisher looks for **Strong Direct Evidence** (e.g. **Tim David**, **Naman Dhir**, **Suryakumar Yadav**).
- A scout seeking a transformative powerplay aggressor looks for **Limited Direct Evidence** high-flyers (e.g. **Vaibhav Sooryavanshi**, **Priyansh Arya**).
- The highest-ranked dual-qualified asset across all phases remains **Abhishek Sharma** (#3, 70.87, Moderate Direct Evidence with 117 HP balls).

