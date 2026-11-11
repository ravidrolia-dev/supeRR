# TASK 09.2 — TEMPORAL OUT-OF-SAMPLE VALIDATION REPORT

## Executive Summary

To independently verify whether combining V3 Clutch, PPI, and Consistency into a single **Integrated Scouting Score (ISS)** genuinely improves decision-making over the single-dimension baseline, an empirical temporal validation experiment was conducted.

---

## 1. Experimental Setup

- **Dataset:** 200,999 deliveries across 867 primary-scope matches.
- **Split Date:** June 6, 2025.
  - **Training Cohort:** 606 earlier matches (pre-June 2025).
  - **Test Cohort:** 261 future matches (post-June 2025).
  - **Strict Horizon Separation:** Zero delivery or match leakage from test to train.
- **Overlapping Evaluation Cohort:** 155 qualified batters who faced $\ge 80$ legal balls in training and $\ge 50$ legal balls in test.
- **Outcome Target:** Future out-of-sample Total Contextual Runs Added per 100 Balls ($\text{RAR}_{100}$) across all match overs.

---

## 2. Model Performance Benchmarks

| Evaluated Architecture | Features Included | Pearson $r$ | Spearman $\rho$ | Out-of-Sample $R^2$ | MAE | Relative Performance vs V3 Baseline |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Model 1: V3 Pressure Clutch Only** | $Z_{\text{clutch}}$ only | 0.4124 | 0.3253 | 0.1701 | 17.17 | Baseline ($R^2 = 17.0\%$). |
| **Model 2: PPI Prevention Only** | $Z_{\text{prev}}$ only | 0.4401 | 0.3533 | 0.1937 | 16.98 | $+13.8\%$ variance explained over V3 alone. |
| **Model 3: Consistency Only** | $Z_{\text{cons}}$ only | 0.3952 | 0.3340 | 0.1561 | 17.07 | Weakest standalone predictor. |
| **Model 4: ISS Proposed (60 / 25 / 15)** | $0.60 Z_c + 0.25 Z_p + 0.15 Z_{cs}$ | **0.4433** | **0.3562** | **0.1965** | **16.82** | **$+15.5\%$ gain in $R^2$ over V3 alone.** |
| **Model 5: ISS Balanced (45 / 40 / 15)** | $0.45 Z_c + 0.40 Z_p + 0.15 Z_{cs}$ | **0.4491** | **0.3633** | **0.2017** | **16.80** | **$+18.6\%$ gain in $R^2$ over V3 alone.** |
| **Model 6: ISS Empirical Optimal (35 / 45 / 20)** | $0.35 Z_c + 0.45 Z_p + 0.20 Z_{cs}$ | **0.4513** | **0.3697** | **0.2037** | **16.82** | Peak predictive stability. |

---

## 3. Key Statistical Findings

1. **Integrated Score Genuinely Outperforms Standalone V3:**
   The proposed Integrated Scouting Score raises out-of-sample $R^2$ from **$17.01\%$ to $19.65\text{--}20.17\%$**, proving that combining early match prevention with late crisis resolution captures complementary predictive information.
2. **Consistency Adds Unique Stability:**
   While match-to-match consistency is weak on its own ($R^2 = 15.61\%$), including it with a $15\text{--}20\%$ weight stabilizes ranking volatility, improving Spearman rank correlation from $\rho = 0.3253$ to $\rho = 0.3633$.
3. **The Single Leaderboard Dilemma:**
   While ISS statistically predicts future runs better, ranking unproven front-runners (like Vaibhav Sooryavanshi and Priyansh Arya) above proven international death crisis finishers (like Tim David and Heinrich Klaasen) can disorient scouts unless the component breakdown is immediately visible.

