# TASK 10.2: THRESHOLD SENSITIVITY & STABILITY AUDIT
**Platform:** ClutchIQ — Rajasthan Royals SupeRR Selector Season 2  
**Audit Scope:** Multi-Cutoff Sensitivity Analysis, Evidence-Tier Shifts, and Top-10 Rank Resilience  
**Audit Finding:** **PASS** (Confirmed Optimal Threshold Calibration)  
**Date:** November 2026  

---

## 1. Executive Summary

This report presents an independent sensitivity audit evaluating alternative eligibility and evidence-tier thresholds:
- **Batters:** Evaluated across Moderate thresholds of **30, 40, and 50** HP deliveries.
- **Bowlers:** Evaluated across Moderate thresholds of **20, 25, 30, and 40** HP deliveries.
- **Universal Overall Sample Size:** Tested at **120 versus 150** legal deliveries.

### Core Audit Conclusion: **PASS**
The adopted standards—**40 HP for Batters** and **25 HP for Bowlers** with a universal **150 Legal Ball** overall requirement—represent the statistically optimal trade-off between Bayesian shrinkage stability, population diversity, and resistance to role bias.

---

## 2. Batter Threshold Sensitivity Matrix ($N=239$)

| Moderate Threshold | Qualified Players | % Cohort | Strong Tier ($\ge 150$) | Moderate Tier | Limited Tier | Mean $\sigma_{\text{post}}$ | Top 10 Turnover vs 40 HP |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **30 HP Balls** | 195 | 81.6% | 93 (38.9%) | 102 (42.7%) | 44 (18.4%) | 9.25 | 0 changes (100% stable) |
| **40 HP (Adopted)**| **183** | **76.6%** | **93 (38.9%)** | **92 (38.5%)** | **54 (22.6%)** | **9.17** | **Baseline (0 changes)** |
| **50 HP Balls** | 172 | 72.0% | 93 (38.9%) | 79 (33.1%) | 67 (28.0%) | 9.09 | 0 changes (100% stable) |

### Key Observations:
1. **Zero Top-10 Rank Churn:** The SupeRR 10 Under-Pressure Batters leaderboard is **100% identical** across all three thresholds. Because the ranking uses the unified continuous score rather than hard exclusion cutoffs, threshold variations only alter evidence tier labels, not rank order.
2. **Optimal Boundary:** 40 HP deliveries cleanly separates explosive openers with minimal middle/death experience (e.g. Vaibhav Sooryavanshi: 8 HP, Priyansh Arya: 1 HP) from established top-order anchors who navigate into middle-over pressure (e.g. Abhishek Sharma: 66 HP, Travis Head: 68 HP).

---

## 3. Bowler Threshold Sensitivity Matrix ($N=258$)

| Moderate Threshold | Qualified Players | % Cohort | Strong Tier ($\ge 100$) | Moderate Tier | Limited Tier | Spin In Moderate | Top 10 Turnover vs 25 HP |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **20 HP Balls** | 156 | 60.5% | 24 (9.3%) | 132 (51.2%) | 102 (39.5%) | 39 (35.5%) | 0 changes |
| **25 HP (Adopted)**| **147** | **57.0%** | **24 (9.3%)** | **123 (47.7%)** | **111 (43.0%)** | **35 (31.8%)** | **Baseline (0 changes)** |
| **30 HP Balls** | 125 | 48.4% | 24 (9.3%) | 101 (39.1%) | 133 (51.6%) | 29 (26.4%) | 0 changes |
| **40 HP (Legacy)** | 93 | 36.0% | 24 (9.3%) | 69 (26.7%) | 165 (64.0%) | 18 (16.4%) | 0 changes |

### Pace vs. Spin Representation Under Each Threshold:
- At **40 HP (Legacy):** Only 18 spin bowlers qualify for Moderate Evidence, relegating **83.6% of spinners** to Limited Evidence.
- At **25 HP (Adopted):** 35 spin bowlers qualify for Moderate Evidence, providing an equitable distribution that allows scouts to identify elite defensive spinners (e.g. Sunil Narine, Axar Patel, Mujeeb Ur Rahman).
- At **20 HP:** Expands spin qualification slightly (+4 spinners), but admits bowlers with as few as 3 distinct matches, marginally increasing posterior uncertainty.

---

## 4. Evaluation of the Universal 150 Legal Ball Requirement

We tested whether lowering the overall legal ball requirement from 150 to 120 produces a viable expansion for bowlers:
- **Cohort Expansion:** Adds 30 bowlers (total $N=288$).
- **Sample Quality Analysis of Added Bowlers:**
  - 18 of the 30 bowlers (60.0%) faced **0 high-pressure deliveries**.
  - Mean HP deliveries = **6.8 balls**.
  - Mean posterior uncertainty $\sigma_{\text{post}} = 9.92$ (approaching prior width).
- **Audit Decision:** Retaining **$\ge 150$ overall legal balls** for primary rankings is strongly validated. Admitting bowlers with 120–149 legal balls introduces high Bayesian shrinkage penalties and dilutes the credibility of the primary leaderboard.

