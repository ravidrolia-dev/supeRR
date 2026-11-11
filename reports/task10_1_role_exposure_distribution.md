# TASK 10.1: ROLE-SPECIFIC HIGH-PRESSURE EXPOSURE DISTRIBUTION ANALYSIS
**Platform:** ClutchIQ — Rajasthan Royals SupeRR Selector Season 2  
**Audit Scope:** Empirical Exposure Distributions, Inning Phase Asymmetries, and Pace vs Spin Disaggregation  
**Date:** November 2026  

---

## 1. Executive Summary

This report establishes the empirical foundation for establishing separate, role-specific high-pressure exposure standards for batters and bowlers in ClutchIQ.

Previously, both roles were subjected to uniform thresholds:
- Minimum overall legal balls: $150$
- Moderate Direct Evidence: $40$ high-pressure legal balls
- Strong Direct Evidence: $150$ high-pressure legal balls

Our ball-by-ball analysis across 853 senior matches (185,715 fair deliveries) proves that **applying symmetric thresholds to batters and bowlers introduces severe structural bias against bowlers—particularly spinners and defensive middle-overs specialists**.

### Key Asymmetry Findings:
1. **Total High-Pressure Delivery Opportunity:**  
   Under the V3 Match Context Model ($\text{BPI} \ge 65.0$), there are **47,050 batter high-pressure deliveries** versus only **10,693 bowler high-pressure deliveries** (a 4.4 : 1 imbalance).
2. **Phase Concentration:**
   - **Batters:** HP deliveries are distributed across Middle ($24,012$, $51.0\%$) and Death ($19,574$, $41.6\%$), with $3,441$ ($7.3\%$) in the Powerplay.
   - **Bowlers:** HP deliveries are overwhelmingly concentrated in the Death phase ($7,373$, $68.9\%$), with $3,260$ ($30.5\%$) in Middle overs and only $37$ ($0.3\%$) in the Powerplay.
3. **Cohort Truncation Under Uniform 150 HP Cutoff:**
   - **Batters:** $93$ of $239$ players ($38.9\%$) met Strong Direct Evidence ($\ge 150$ HP).
   - **Bowlers:** Only **$4$ of $258$ players ($1.6\%$)** met Strong Direct Evidence ($\ge 150$ HP), rendering the tier functionally non-existent for bowling evaluations.

---

## 2. Empirical Exposure Distribution Comparison

| Exposure Metric | Batters ($\ge 150$ Legal Balls, $N=239$) | Bowlers ($\ge 150$ Legal Balls, $N=258$) | Bowlers ($\ge 120$ Legal Balls, $N=288$) |
| :--- | :---: | :---: | :---: |
| **Total Population** | 239 | 258 | 288 |
| **Mean Legal Balls** | 639.2 | 647.5 | 596.4 |
| **Mean HP Balls** | **145.2** | **37.6** | **34.3** |
| **Median HP Balls** | **107.0** | **28.0** | **24.0** |
| **10th Percentile** | 16.8 | 4.0 | 0.0 |
| **25th Percentile** | 44.5 | 12.0 | 8.0 |
| **75th Percentile** | 205.0 | 52.0 | 50.0 |
| **90th Percentile** | 323.0 | 89.0 | 86.3 |
| **95th Percentile** | 433.7 | 112.9 | 108.0 |
| **Maximum HP Balls** | 685.0 | 239.0 | 239.0 |

---

## 3. Bowling Role Disaggregation: Pace vs. Spin

The distribution of high-pressure deliveries across bowling craft reveals severe structural disparities:

| Metric | Pace Bowlers ($N=178$) | Spin Bowlers ($N=110$) | Disparity Ratio (Pace / Spin) |
| :--- | :---: | :---: | :---: |
| **Mean Total Legal Balls** | 594.4 | 599.7 | 0.99 : 1 (Equal opportunity) |
| **Mean HP Deliveries** | **42.8** | **20.6** | **2.08 : 1** |
| **Median HP Deliveries** | **31.5** | **12.0** | **2.63 : 1** |
| **Exposure $\ge 100$ HP Balls** | 19 (10.7%) | 1 (0.9%) | **11.9 : 1** |
| **Exposure $\ge 40$ HP Balls** | 69 (38.8%) | 18 (16.4%) | **2.37 : 1** |
| **Exposure $\ge 25$ HP Balls** | 104 (58.4%) | 34 (30.9%) | **1.89 : 1** |
| **Exposure $\ge 20$ HP Balls** | 117 (65.7%) | 39 (35.5%) | **1.85 : 1** |

### Tactical Scouting Root Cause:
In modern T20 cricket, captains predominantly deploy fast bowlers in death overs (overs 17–20) where bowler leverage and win-probability volatility are highest. Elite spinners (e.g. Sunil Narine, Rashid Khan, Axar Patel) are tactical controllers deployed in middle overs (overs 7–15) to strangle run rates and induce mistakes before crisis conditions emerge.

A flat 40 HP-ball threshold categorized **80.9% of spinners** as having "Limited Evidence", unfairly penalizing elite defensive spin bowlers.

---

## 4. Evaluation of the 120 vs. 150 Overall Legal Ball Standard

Testing whether reducing the minimum overall legal ball requirement from 150 to 120 benefits the bowler evaluation pool:
- Adding the 120–149 legal ball bracket adds **30 additional bowlers** (expanding the cohort from 258 to 288).
- **Exposure Quality of Added Bowlers:**
  - Mean HP balls: **6.80**.
  - Median HP balls: **0.00** (over 50% faced 0 high-pressure deliveries).
  - Only **1 out of 30** bowlers reached 25 HP balls (Usama Mir with 29).
  - Mean posterior uncertainty $\sigma_{\text{post}} = 9.92$ (near the maximum prior bounds).
- **Recommendation:** Retaining **$\ge 150$ overall legal balls** for primary rankings maintains rigorous Bayesian shrinkage stability, but admitting $\ge 120$ overall legal balls for exploratory scouting pools is viable as long as the 25 HP Moderate Evidence threshold is strictly maintained.

