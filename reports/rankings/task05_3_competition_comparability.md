# ClutchIQ — Task 05.3: Cross-Competition Comparability Analysis

**Project:** Rajasthan Royals SupeRR Selector Season 2 — ClutchIQ  
**Task Phase:** Task 05.3 Cross-Competition Statistical Comparability  
**Status:** COMPLETE & EMPIRICALLY CHARACTERIZED  
**Audited Datasets:**
- [task05_2_competition_equity.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_competition_equity.csv) (194 dual-league players)
- [task05_1_cross_competition_audit.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_1_cross_competition_audit.csv) (20 combined top-10 leaders)

---

## 1. Executive Summary: The Comparability Question

A foundational question in the evaluation of T20 cricket performance is whether performance in domestic franchise leagues (the Indian Premier League) and bilateral international fixtures (senior men's T20 Internationals) can be treated as directly interchangeable.

In Task 04 and Task 05, ClutchIQ introduced **context-conditioned performance baselines** $\mathbb{E}[\text{performance} | \text{competition}, \text{phase}]$, which explicitly account for the macro scoring environment of each competition (e.g. IPL Death overs average $1.58$ runs/ball vs T20I Death overs $1.45$ runs/ball).

However, **separate contextual baselines do not automatically guarantee statistical exchangeability**. To resolve whether the combined rankings represent an absolute measure of equivalent performance or a model-based pooled index, we conducted an empirical comparability study across all **194 players who faced or bowled at least 50 legal balls in both competitions**.

### Core Verdict:
1. **Systematic Upward Shift in T20I Batting:** Dual-league batters score an average of **$+14.90$ runs/100 balls higher relative to expectation in T20Is than in the IPL** ($p < 0.001$).
2. **Weak Cross-Competition Correlation:** 
   - Batting clutch impact Pearson correlation between IPL and T20I is **$r = 0.438$** (Spearman rank correlation $r_s = 0.337$).
   - Bowling clutch impact Pearson correlation between IPL and T20I is **$r = 0.111$** (Spearman rank correlation $r_s = 0.182$).
3. **High Directional Volatility:**
   - **33.0% of batters** change direction (positive clutch impact in one league, negative in the other).
   - **47.0% of bowlers** change direction (nearly half flip signs between leagues).
4. **Methodological Classification:** The combined ranking cannot be defended as an absolute measure of cross-competition equivalence. Instead, it is statistically defensible as a **pooled, competition-adjusted empirical index** that measures cumulative value delivered within each player's actual schedule.

---

## 2. Paired Statistical Analysis of Dual-League Players

We analyzed all 194 players with $\ge 50$ legal balls in both IPL and T20Is (94 batters, 100 bowlers).

### 2.1 Paired Differences Summary Table
| Metric Category | Dual-League Batters ($n = 94$) | Dual-League Bowlers ($n = 100$) |
| :--- | :---: | :---: |
| **Mean IPL Raw Impact** | $-4.35$ runs / 100 balls | $-7.76$ runs / 100 balls |
| **Mean T20I Raw Impact** | $+10.55$ runs / 100 balls | $-1.15$ runs / 100 balls |
| **Paired Mean Difference ($\text{T20I} - \text{IPL}$)** | **$+14.90$ runs / 100 balls** | **$+6.61$ runs / 100 balls** |
| **95% Confidence Interval of Mean Difference** | $[+8.14, +21.67]$ ($t = 4.32, p < 0.0001$) | $[-4.27, +17.49]$ ($t = 1.19, p = 0.236$) |
| **Median Difference ($\text{T20I} - \text{IPL}$)** | **$+10.53$ runs / 100 balls** | **$+1.26$ runs / 100 balls** |
| **Standard Deviation of Difference** | $33.46$ | $55.52$ |
| **Pearson Correlation ($r$)** | **$0.438$** | **$0.111$** |
| **Spearman Rank Correlation ($r_s$)** | **$0.337$** | **$0.182$** |
| **Directional Sign Flip Rate** | **$33.0\%$** (31 / 94 players) | **$47.0\%$** (47 / 100 players) |

---

## 3. Threshold Sensitivity Analysis

To examine whether the low correlations and directional flips were driven by small sample sizes at the 50-ball boundary, we evaluated paired differences across progressively higher minimum-volume cutoffs ($75, 100, 150$ balls in both competitions):

| Minimum Balls in Each League | Player Cohort | Paired Mean Diff ($\text{T20I} - \text{IPL}$) | Paired Median Diff | Pearson $r$ | Spearman $r_s$ | Sign Flip % |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **$\ge 50$ Balls** | Batters ($n=94$) | $+14.90$ | $+10.53$ | $0.438$ | $0.337$ | 33.0% |
| | Bowlers ($n=100$) | $+6.61$ | $+1.26$ | $0.111$ | $0.182$ | 47.0% |
| **$\ge 75$ Balls** | Batters ($n=80$) | $+15.19$ | $+8.57$ | $0.292$ | $0.299$ | 30.0% |
| | Bowlers ($n=88$) | $+0.31$ | $+0.39$ | $0.204$ | $0.185$ | 50.0% |
| **$\ge 100$ Balls** | Batters ($n=75$) | $+13.20$ | $+8.45$ | $0.132$ | $0.231$ | 32.0% |
| | Bowlers ($n=80$) | $+2.36$ | $+0.59$ | $0.166$ | $0.201$ | 46.2% |
| **$\ge 150$ Balls** | Batters ($n=62$) | $+9.39$ | $+7.44$ | $0.273$ | $0.261$ | 27.4% |
| | Bowlers ($n=73$) | $+1.48$ | $+0.65$ | $0.137$ | $0.183$ | 46.6% |

### Key Findings on Threshold Sensitivity:
1. **Persistent Batting Premium in T20Is:** Even among players facing $\ge 150$ legal balls in both tournaments ($n=62$ elite players), batters still perform an average of **$+9.39$ runs/100 balls better in T20Is than in the IPL**.
2. **Persistent Bowling Uncorrelation:** For bowlers, the correlation between IPL clutch impact and T20I clutch impact never exceeds $r = 0.204$ regardless of sample size threshold, and the sign flip rate remains locked at **$46.6\% - 50.0\%$**. Bowling performance under pressure in the IPL provides virtually zero predictive power for bowling performance under pressure in bilateral T20Is, and vice versa.

---

## 4. Why Does Performance Differ Between Competitions?

We investigated five potential structural drivers:

### 4.1 Structural Driver 1: Opposition Strength & Lineup Depth (Primary Driver)
- **IPL Lineup Density:** In the IPL, every franchise features 8 to 9 capable batters and 5 to 6 world-class bowling options. A death-overs bowler faces international finishers on every delivery.
- **T20I Heterogeneity:** Senior T20Is include bilateral tours, tri-series, and continental qualifiers. While fixtures between top full members (India, Australia, England) mirror IPL intensity, many T20Is involve secondary attacks, rotational squads, or associate nations. Top batters find greater boundary accessibility under pressure in international cricket than against IPL specialist death units.

### 4.2 Structural Driver 2: Tactical Role Variation
Players frequently occupy different batting positions or bowling phases for their IPL franchise versus their national team:
- **Corbin Bosch:** Bowled primary death overs for South Africa in T20Is (Raw RBE: $+104.29$), but operated primarily in middle overs in the IPL (Raw RBE: $+37.85$).
- **Naman Dhir:** Batted as an aggressive finisher in T20Is (SR: $240.38$, Raw RAR: $+132.68$), while playing a broader middle-order stabilization role in the IPL (SR: $164.35$, Raw RAR: $+25.04$).

### 4.3 Structural Driver 3: Venue & Pitch Characteristics
IPL matches are concentrated across specific Indian venues with known pitch and boundary parameters (e.g. Wankhede, Chinnaswamy), whereas T20Is span heterogeneous global conditions (Caribbean slow turners, Australian large boundaries, English seaming tracks).

---

## 5. Statistical Defensibility of the Combined Ranking

Given the empirical finding that performance across competitions is weakly correlated ($r \approx 0.11 - 0.44$), is a single combined Top-10 ranking statistically defensible?

### 5.1 What the Data Cannot Establish
The data **cannot** establish that a rating of $+30.0$ achieved exclusively in T20Is is functionally equivalent to $+30.0$ achieved in the IPL. An assertion that international cricket and franchise cricket represent identical test environments is refuted by the paired data.

### 5.2 What the Data Does Establish
The combined ranking **is statistically defensible under a defined pooled-index formulation**:
1. **Within-League Relative Value:** On every delivery, a player's outcome is evaluated against the empirical baseline of that specific league and phase. An IPL delivery is judged against IPL par; a T20I delivery is judged against T20I par.
2. **Volume-Weighted Aggregation:** The combined raw rate represents the volume-weighted average of the player's value added across their actual professional schedule.
3. **Transparent Classification:** The combined ranking must be explicitly presented as a **model-based pooled clutch index**, while the competition-specific tables ([top10_ipl_batters.csv](file:///d:/RR/RR_Solution/reports/rankings/top10_ipl_batters.csv) and [top10_t20i_batters.csv](file:///d:/RR/RR_Solution/reports/rankings/top10_t20i_batters.csv)) must be provided to evaluate league-specific specialists without cross-competition confounding.

