# ClutchIQ — Task 05.2: Audit Corrections & Statistical Reconciliation Report

**Project:** Rajasthan Royals SupeRR Selector Season 2 — ClutchIQ  
**Task Phase:** Task 05.2 Statistical Review, Discrepancy Reconciliation & Precision Corrections  
**Final Verdict:** **CONDITIONAL PASS — STATISTICALLY SOUND WITH DOCUMENTED LIMITATIONS & TERMINOLOGY CORRECTIONS**  
**Companion Artifacts:**
- [task05_2_bowling_reconciliation.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_bowling_reconciliation.csv)
- [task05_2_competition_equity.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_competition_equity.csv)
- [task05_2_uncertainty_validation.md](file:///d:/RR/RR_Solution/reports/rankings/task05_2_uncertainty_validation.md)
- [task05_1_ranking_stability.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_1_ranking_stability.csv)
- [final_methodology_report.md](file:///d:/RR/RR_Solution/reports/rankings/final_methodology_report.md)

---

## Executive Summary of Audit Corrections

Following an independent statistical review of Task 05.1 outputs, several conceptual and terminological discrepancies were identified between the narrative reports and the underlying CSV datasets. This document provides the formal mathematical and numerical corrections:

1. **Wicket Decomposition Terminology:** Corrected the conflation between *unweighted net wickets* and *pressure-weighted net wickets*. Established the exact mathematical identity for all ten top bowlers, showing how Mark Wood's $11.10$ unweighted net wickets scale to $15.42$ pressure-weighted net wickets.
2. **Clarification of Praful Hinge Wicket Percentage:** Clarified why Praful Hinge's wicket contribution was previously reported as \"160.9%\". Because Hinge conceded runs above expectation under pressure (negative runs saved: $-56.64$), his wicket value ($+149.70$) exceeds his total net value ($+93.05$). This is mathematically characterized as a multi-vector offset rather than a conventional percentage allocation.
3. **Reconciliation of Wicket-Value Sensitivity Conclusions:** Resolved the contradiction between the reported \"100% stability\" and the 60% top-5 overlap reported in `task05_1_ranking_stability.csv`. Documented the exact player migrations (Pathirana, Humphreys, Bravo, Imad Wasim) across wicket values $V_w \in [8.0, 20.0]$. Demonstrated why $V_w = 15.0$ remains the most defensible baseline for tournament valuation.
4. **Cross-Competition Equity Findings:** Disproved the informal claim that every top-5 bowler possesses balanced cross-competition exposure or $> 1,000$ balls. Documented that Mohammad Nawaz ($1,004$ balls) and Matthew Humphreys ($305$ balls) are exclusively T20I specialists. Analyzed 194 dual-league players to assess league-specific scoring differentials without introducing arbitrary, unsanctioned equivalence adjustments.
5. **Exact Separation of Sensitivity Configurations:** Reconciled the narrative reference to 12 configurations with the 29 rows in `task05_1_ranking_stability.csv`, distinguishing the 24 threshold grid permutations ($12 \times 2$ roles) from the 5 wicket-value variations.
6. **Final Classification:** **CONDITIONAL PASS**. The underlying calculations and rankings are mathematically correct and robust, but full statistical integrity requires explicit adherence to the transparent qualifications, precise terminology, and documented limitations detailed herein.

---

## 1. Correction 1: Wicket Decomposition Terminology & Reconciliation

### 1.1 The Mathematical Accounting Identity
For any bowler evaluated across $N$ deliveries ($n$ legal balls), the raw clutch rate metric per 100 legal balls is given by:
$$\text{Raw RBE} = \frac{\sum_{i=1}^N \left( \text{RBE}_i \cdot w_i \right) + V_w \sum_{i=1}^N \left( \text{WA}_i \cdot w_i \right)}{n} \times 100$$
where:
- $w_i = \text{BowlerPI}_i / 50.0$ is the continuous pressure weight.
- $\text{RBE}_i = \mathbb{E}[\text{runs}_i | \text{context}_i] - \text{runs\_conceded}_i$ is the delivery-level runs saved.
- $\text{WA}_i = \mathbb{I}(\text{bowler\_wicket}_i) - \mathbb{E}[\text{wicket}_i | \text{context}_i]$ is the delivery-level wickets added.
- $V_w = 15.0$ runs is the empirical wicket replacement value.

To avoid conflation, we formally define four distinct wicket metrics:
1. **Actual Bowler-Credited Wickets ($W_{\text{act}}$):** Total dismissals credited to the bowler (`is_bowler_wicket == True`).
2. **Expected Bowler-Credited Wickets ($W_{\text{exp}}$):** Sum of contextual baseline wicket probabilities: $\sum_{i=1}^N \mathbb{E}[\text{wicket}_i | \text{context}_i]$.
3. **Unweighted Net Wickets Added ($\Delta W_{\text{raw}}$):** Actual wickets minus expected wickets: $\Delta W_{\text{raw}} = W_{\text{act}} - W_{\text{exp}}$.
4. **Pressure-Weighted Net Wickets Added ($\Delta W_{\text{weighted}}$):** Net wickets scaled by delivery-level pressure: $\sum_{i=1}^N \text{WA}_i \cdot w_i$.

### 1.2 Exact Decomposition for Top 10 Bowlers
The complete decomposition is recorded in [task05_2_bowling_reconciliation.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_bowling_reconciliation.csv):

| Rank | Player Name | Legal Balls | Actual Wkts ($W_{\text{act}}$) | Expected Wkts ($W_{\text{exp}}$) | Unweighted Net Wkts ($\Delta W_{\text{raw}}$) | Pressure-Weighted Net Wkts ($\Delta W_{\text{weighted}}$) | Weighted Runs Saved | Wicket Value ($15 \times \Delta W_{\text{weighted}}$) | Total Value | Raw RBE / 100 Balls |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Mark Wood** | 281 | 27 | 15.90 | **+11.10** | **+15.42** | +54.31 | +231.26 | +285.58 | **+101.63** |
| **2** | **Corbin Bosch** | 367 | 33 | 20.50 | **+12.50** | **+16.08** | +33.29 | +241.15 | +274.45 | **+74.78** |
| **3** | **Mohammad Nawaz** | 1,004 | 66 | 49.89 | **+16.11** | **+28.93** | +139.56 | +433.89 | +573.45 | **+57.12** |
| **4** | **Matthew Humphreys** | 305 | 20 | 15.76 | **+4.24** | **+9.82** | +61.88 | +147.32 | +209.20 | **+68.59** |
| **5** | **Matheesha Pathirana** | 1,132 | 82 | 73.58 | **+8.42** | **+16.89** | +301.26 | +253.32 | +554.58 | **+48.99** |
| **6** | **Dwayne Bravo** | 206 | 16 | 12.69 | **+3.31** | **+5.02** | +62.95 | +75.31 | +138.26 | **+67.11** |
| **7** | **Imad Wasim** | 246 | 15 | 12.61 | **+2.39** | **+4.75** | +70.13 | +71.26 | +141.39 | **+57.47** |
| **8** | **Abrar Ahmed** | 764 | 46 | 40.18 | **+5.82** | **+9.80** | +172.14 | +146.98 | +319.12 | **+41.77** |
| **9** | **Praful Hinge** | 156 | 14 | 8.49 | **+5.51** | **+9.98** | -56.64 | +149.70 | +93.05 | **+59.65** |
| **10** | **Sufiyan Muqeem** | 344 | 23 | 18.93 | **+4.07** | **+2.46** | +112.74 | +36.85 | +149.58 | **+43.48** |

#### Mark Wood Reconciled:
- Over 281 legal balls, expected wickets were $15.90$. Wood claimed $27$ bowler wickets, producing **$+11.10$ unweighted net wickets**.
- Because Wood's wickets occurred predominantly in elevated pressure situations ($w_i > 1.0$), his **pressure-weighted net wickets scale to $+15.42$**.
- Multiplied by $15.0$ runs/wicket, his wicket value is $+231.26$ runs. Combined with $+54.31$ weighted runs saved, his total value is $+285.58$. Dividing by 281 balls and scaling per 100 balls gives exactly **$+101.63$**.
- **Correction Applied:** Every narrative reference in Task 05 reports that described $+15.42$ as \"net wickets\" is formally corrected to \"pressure-weighted net wickets\".

---

## 2. Correction 2: Clarification of Praful Hinge Wicket Percentage

In Task 05.1, the proportion of Praful Hinge's value derived from wickets was reported as **160.9%**.
- **Mathematical Root Cause:** Hinge's performance consists of two opposing vectors:
  $$\text{Total Clutch Value} = \text{Weighted Runs Saved} + \text{Wicket Run Value}$$
  $$\text{Total Value} = -56.64 + (+149.70) = +93.05 \text{ runs}$$
- Calculating a simple ratio $(149.70 / 93.05) \times 100 = 160.9\%$ creates a confusing percentage exceeding 100%.
- **Correct Formulation:** Hinge's defensive run containment was negative (he conceded an economy of $11.73$ in IPL death/powerplay overs, costing $56.64$ runs below expectation). However, his wicket-taking impact was extraordinary (14 wickets on 156 balls, generating $9.98$ pressure-weighted net wickets, or $+149.70$ run equivalents). His wickets fully compensated for his leakiness, yielding a net positive surplus of $+93.05$ runs.
- In all official reports, this is now characterized as an **offsetting multi-vector contribution** rather than an ordinary percentage share.

---

## 3. Correction 3: Reconciling Wicket-Value Sensitivity Conclusions

### 3.1 Resolving the Stability Discrepancy
- The integrity report claimed: *\"The Top 5 bowlers maintain 100% membership stability across all wicket values from 8.0 to 20.0 runs\"*.
- However, `task05_1_ranking_stability.csv` reported **60% top-5 overlap**.
- **Audit Explanation:**
  - In `wicket_value_sensitivity.csv`, rankings were evaluated after **Bayesian shrinkage** ($n / (n + 150)$) across all 222 qualified bowlers. Under Bayesian shrinkage, high-volume anchors (Pathirana with 1,132 balls, Mohammad Nawaz with 1,004 balls) retain high shrunk ratings due to their massive reliability weight ($\lambda \approx 0.88$), holding spots in the top 5.
  - In `task05_1_ranking_stability.csv`, the test was run purely on **unshrunk Raw RBE** among the 10 final bowlers.
- When evaluated on unshrunk Raw RBE:
  - At $V_w = 8.0$ runs: Dwayne Bravo (Raw RBE $50.06$) and Imad Wasim (Raw RBE $43.96$) surpass Corbin Bosch ($44.12$), Mohammad Nawaz ($36.95$), and Matheesha Pathirana ($38.55$). Top 5 becomes: **Mark Wood, Dwayne Bravo, Matthew Humphreys, Corbin Bosch, Imad Wasim** (3 of 5 match the baseline top 5, hence 60% overlap).
  - At $V_w = 15.0$ runs: The top 5 in Raw RBE are **Mark Wood, Corbin Bosch, Matthew Humphreys, Dwayne Bravo, Praful Hinge** (60% overlap with the shrunk top 5).
  - At $V_w = 20.0$ runs: Praful Hinge (Raw RBE $91.64$) rises to #3. Top 5 becomes: **Mark Wood, Corbin Bosch, Praful Hinge, Matthew Humphreys, Dwayne Bravo** (60% overlap).

### 3.2 Is $V_w = 15.0$ Defensible?
Yes. In T20 cricket, losing a wicket reduces the batting team's expected final score by $12.0$ to $18.0$ runs depending on the over (e.g. over 10: $\sim 16$ runs; over 18: $\sim 11$ runs). $V_w = 15.0$ runs represents the standard empirical replacement value. However, the report must transparently acknowledge that:
- Pure economy bowlers (Pathirana, Wasim, Nawaz) are favored under lower wicket values ($V_w \le 10$).
- High-strike-rate wicket-takers (Wood, Bosch, Hinge) are favored under higher wicket values ($V_w \ge 15$).

---

## 4. Correction 4: Cross-Competition Equity & Specialist Exposure

### 4.1 Correcting the Top-5 Exposure Footprint
Task 05.1 informally claimed that all top-5 bowlers possessed either balanced dual-league exposure or $> 1,000$ balls.
- **Empirical Audit:**
  - **Mark Wood:** Balanced (96 IPL balls / 185 T20I balls, total 281).
  - **Corbin Bosch:** Balanced (163 IPL balls / 204 T20I balls, total 367).
  - **Matheesha Pathirana:** Balanced (710 IPL balls / 422 T20I balls, total 1,132).
  - **Mohammad Nawaz:** **Exclusively T20I** (0 IPL balls / 1,004 T20I balls). Qualifies on volume ($> 1,000$ balls).
  - **Matthew Humphreys:** **Exclusively T20I** (0 IPL balls / 305 T20I balls). Does **not** have $> 1,000$ balls and does **not** have dual-league exposure.
- **Correction Applied:** The claim is corrected. Humphreys qualifies under the general eligibility cutoff ($n = 305 \ge 150$), but his ranking is acknowledged as being driven entirely by his 14 T20I matches for Ireland.

### 4.2 Cross-League Scoring Differentials
To examine whether players perform systematically differently between leagues, we evaluated the 194 players who bowled or batted $\ge 50$ balls in both IPL and T20Is ([task05_2_competition_equity.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_competition_equity.csv)):
- **Batting (94 dual-league players):**
  - Mean IPL Raw Impact: $-4.35$ runs/100 balls.
  - Mean T20I Raw Impact: $+10.55$ runs/100 balls.
  - Cross-league correlation: $r = 0.438$.
- **Bowling (100 dual-league players):**
  - Mean IPL Raw Impact: $-7.76$ runs/100 balls.
  - Mean T20I Raw Impact: $-1.15$ runs/100 balls.
  - Cross-league correlation: $r = 0.111$.
- **Statistical Implication:** Batters and bowlers systematically score higher relative to expectations in T20Is than in the IPL. This reflects the wider disparity between elite bowling lineups in the IPL (where every bowling unit is world-class) versus bilateral T20Is (which include fixtures against emerging nations).
- **Policy Decision:** We do **not** invent an ad-hoc penalty or subjective equivalence factor, as doing so would violate objective data modeling. Instead, we use competition-specific baselines and transparently highlight the wider credible intervals of single-league players in the methodology report.

---

## 5. Correction 5: Reconciling Sensitivity Configuration Counts

- **Task 05.1 Text:** Referred to \"12 threshold combinations\".
- **Actual Count in `task05_1_ranking_stability.csv`:** 29 configurations.
- **Exact Breakdown:**
  - **Threshold Grid Combinations:** 12 parameter combinations (Volume: $100, 150, 200, 250$; HP: $25, 40, 60$) evaluated separately for **2 roles** (Batters and Bowlers), producing **24 threshold configurations** (Rows 0 to 23).
  - **Wicket Value Variations:** 5 wicket replacement values ($V_w \in [8, 10, 12, 15, 20]$ runs) evaluated for Bowlers, producing **5 sensitivity configurations** (Rows 24 to 28).
  - Total $= 24 + 5 = \mathbf{29 \text{ configurations}}$.
- **Correction Applied:** The report now explicitly cites the 24 threshold combinations and 5 wicket-value sensitivity tests separately.

---

## 6. Final Audit Verdict & Deliverable Status

| Deliverable Artifact | Description | Verification Status |
| :--- | :--- | :---: |
| [task05_2_correction_report.md](file:///d:/RR/RR_Solution/reports/rankings/task05_2_correction_report.md) | Comprehensive audit corrections and mathematical reconciliations | **COMPLETE & VERIFIED** |
| [task05_2_bowling_reconciliation.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_bowling_reconciliation.csv) | Exact 10-bowler decomposition (actual, expected, unweighted net, weighted net, runs saved) | **COMPLETE & RECONCILED** |
| [task05_2_competition_equity.csv](file:///d:/RR/RR_Solution/reports/rankings/task05_2_competition_equity.csv) | Analysis of 194 dual-league players across IPL and T20Is | **COMPLETE & ANALYZED** |
| [task05_2_uncertainty_validation.md](file:///d:/RR/RR_Solution/reports/rankings/task05_2_uncertainty_validation.md) | Formal Gaussian prior/likelihood/posterior specification and bootstrap validation | **COMPLETE & VALIDATED** |

```
====================================================================================================
FINAL AUDIT CLASSIFICATION: CONDITIONAL PASS
====================================================================================================
- Mathematical Calculations: EXACT & VERIFIED (Zero changes required to top-10 tables)
- Terminology Corrections:    FULLY APPLIED (Net wickets -> Pressure-weighted net wickets)
- Sensitivity Reconciled:     DOCUMENTED (Shrunk top 5 vs raw RBE top 5 migrations explained)
- Cross-Competition Caveats: DOCUMENTED (Dual-league variance quantified without ad-hoc penalties)
- Portal Dropdown Matching:  100% COMPATIBLE (Names and Player IDs trace directly to mapping)
====================================================================================================
```

All audit requirements are fulfilled, mathematically verified, and documented with complete transparency.

