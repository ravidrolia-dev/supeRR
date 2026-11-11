# TASK 09.5 — BATTER FINAL METHODOLOGY: SUPERR 10 UNDER-PRESSURE BATTERS

## 1. Architectural Mandate & Executive Summary

The primary objective of ClutchIQ is to identify batters with verified, statistically proven capability to perform under intense match pressure.

Following comprehensive sensitivity testing and temporal out-of-sample validation:
- **Pressure performance remains the dominant selection factor (80% weighting).**
- **Strict pressure eligibility is non-negotiable:**
  - Minimum 150 overall legal balls faced.
  - Minimum 40 V3 high-pressure legal balls faced ($\text{BPI}_{\text{v3}} \ge 65.0$).
  - Full Bayesian reliability shrinkage applied.
- **Pressure prevention (10% PPI) and match-to-match consistency (10%) are strictly supporting characteristics.**
- Aggressive early-match destroyers lacking crisis sample (e.g. **Vaibhav Sooryavanshi**, **Priyansh Arya**, **Ayush Mhatre**) are barred from the SupeRR 10, preventing early advantages from substituting for crisis execution.

---

## 2. Mathematical Formulation of the Batter SupeRR Score

For every qualified batter $i$ satisfying $N_{\text{legal}} \ge 150$ and $N_{\text{HP}} \ge 40$:

$$\text{Score}_i = 50.0 + 10.0 \times \left(0.80 \cdot Z_{\text{clutch}, i} + 0.10 \cdot Z_{\text{ppi}, i} + 0.10 \cdot Z_{\text{cons}, i}\right)$$

### Component Breakdown:
1. **$Z_{\text{clutch}, i}$ (Crisis Execution — 80%):**
   - Source: Empirical Bayes shrunk Contextual Runs Added per 100 balls under V3 match-context pressure ($\text{BPI}_{\text{v3}} \ge 65.0$).
   - Standardized relative to the qualified reference population ($N=185$ batters):
     $$Z_{\text{clutch}, i} = \frac{\hat{\theta}_{\text{clutch}, i} - (-0.35)}{16.20}$$
2. **$Z_{\text{ppi}, i}$ (Early Foundation Dominance — 10%):**
   - Source: Empirical Bayes shrunk non-death contextual runs added (Overs 1–16).
     $$Z_{\text{ppi}, i} = \frac{\hat{\theta}_{\text{ppi}, i} - (-8.21)}{16.86}$$
3. **$Z_{\text{cons}, i}$ (Match-to-Match Repeatability — 10%):**
   - Source: Percentage of distinct matches with net positive runs added above expectation:
     $$Z_{\text{cons}, i} = \frac{\text{PosMatchPct}_i - 39.17\%}{13.59\%}$$

---

## 3. Official SupeRR 10 — Under-Pressure Batters

| SupeRR Rank | V3 Rank | Batter | Teams | SupeRR Score | V3 Clutch Rating (80%) | PPI Rating (10%) | Consistency % (10%) | HP Balls | Legal Balls | 95% Credible Interval |
|:---:|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **1** | **Naman Dhir** | MI, Punjab | **69.83** | **+34.13** (+17.03 pts) | +2.13 (+0.72 pts) | 66.7% (+2.09 pts) | 220 | 514 | [+34.60, +38.72] |
| **2** | **2** | **Tim David** | MI, Singapore | **69.83** | **+31.58** (+15.77 pts) | +33.87 (+2.61 pts) | 59.2% (+1.46 pts) | 497 | 1210 | [+31.22, +34.00] |
| **3** | **3** | **Abhishek Sharma** | SRH, Sunrisers | **69.69** | **+30.12** (+15.05 pts) | +39.18 (+2.92 pts) | 62.3% (+1.72 pts) | 117 | 2239 | [+29.61, +31.69] |
| **4** | **5** | **Finn Allen** | RCB, New Zealand | **67.38** | **+26.91** (+13.46 pts) | +25.35 (+2.10 pts) | 63.5% (+1.82 pts) | 46 | 829 | [+26.34, +29.68] |
| **5** | **4** | **Suryakumar Yadav** | MI, India | **66.99** | **+27.24** (+13.62 pts) | +12.30 (+1.32 pts) | 66.2% (+2.05 pts) | 521 | 2748 | [+26.66, +28.54] |
| **6** | **6** | **Phil Salt** | KKR, DC, England | **66.32** | **+25.25** (+12.64 pts) | +26.84 (+2.19 pts) | 59.5% (+1.49 pts) | 89 | 1628 | [+24.55, +26.99] |
| **7** | **7** | **Heinrich Klaasen** | SRH, South Africa | **64.20** | **+23.02** (+11.54 pts) | -4.19 (+0.34 pts) | 69.4% (+2.32 pts) | 445 | 1408 | [+22.21, +24.79] |
| **8** | **9** | **Rilee Rossouw** | PBKS, DC, SA | **63.45** | **+21.76** (+10.92 pts) | +15.65 (+1.52 pts) | 53.8% (+1.01 pts) | 70 | 415 | [+20.80, +25.30] |
| **9** | **8** | **Glenn Maxwell** | RCB, Australia | **63.22** | **+22.50** (+11.28 pts) | +15.75 (+1.53 pts) | 46.7% (+0.41 pts) | 228 | 953 | [+21.59, +24.73] |
| **10** | **11** | **Josh Inglis** | Australia, PBKS | **63.18** | **+20.03** (+10.06 pts) | +23.29 (+1.98 pts) | 55.4% (+1.14 pts) | 48 | 903 | [+18.52, +23.10] |

*Tie-Breaker Rule:* Naman Dhir and Tim David both round to 69.83. Naman Dhir is awarded #1 based on raw crisis impact (+34.13 vs +31.58, clutch contribution +17.03 vs +15.77).

