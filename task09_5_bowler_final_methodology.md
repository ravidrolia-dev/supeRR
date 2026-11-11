# TASK 09.5 — BOWLER FINAL METHODOLOGY: SUPERR 10 UNDER-PRESSURE BOWLERS

## 1. Architectural Mandate & Executive Summary

Bowling in high-pressure T20 situations presents unique statistical challenges:
- High-pressure bowling events are heavily concentrated in the death overs and when defending razor-thin margins.
- In V2, a polarity distortion awarded massive pressure ratings to bowlers defending 300 runs.
- **V3 Production Model:** Introduces the Defense Difficulty Index ($\text{DDI}$) which properly inverts this relationship—defending low totals (e.g. $<140$) generates extreme stress, whereas defending high totals ($>200$) provides safety.
- **Wicket & Run Attribution:** Distinguishes bowler-credited wickets (bowled, caught, LBW, stumped) from run-outs, weighting bowler wickets at $+20.0$ runs above replacement without double-counting dot balls or economy.

**Task 09.5 establishes the definitive primary leaderboard: SupeRR 10 — Under-Pressure Bowlers.**

---

## 2. Mathematical Formulation of the Bowler SupeRR Score

For every qualified bowler $j$ satisfying $N_{\text{legal}} \ge 150$ and $N_{\text{HP}} \ge 40$:

$$\text{Score}_j = 50.0 + 10.0 \times \left(0.80 \cdot Z_{\text{clutch}, j} + 0.10 \cdot Z_{\text{ppi}, j} + 0.10 \cdot Z_{\text{cons}, j}\right)$$

### Component Breakdown:
1. **$Z_{\text{clutch}, j}$ (Crisis Defending Impact — 80%):**
   - Source: Bayesian Shrunk Bowling Impact per 100 balls under V3 pressure ($\text{BowlPI}_{\text{v3}} \ge 65.0$).
   - Standardized relative to the qualified reference population ($N=93$ bowlers):
     $$Z_{\text{clutch}, j} = \frac{\hat{\theta}_{\text{clutch}, j} - (-4.79)}{13.63}$$
2. **$Z_{\text{ppi}, j}$ (Powerplay & Middle Dot Suppression — 10%):**
   - Source: Bayesian Shrunk Runs Saved per 100 balls in non-death overs (Overs 1–16).
     $$Z_{\text{ppi}, j} = \frac{\hat{\theta}_{\text{ppi}, j} - (-1.85)}{13.75}$$
3. **$Z_{\text{cons}, j}$ (Match-to-Match Repeatability — 10%):**
   - Source: Percentage of distinct matches where the bowler achieved positive net impact ($\text{RunsSaved} + 20 \times \text{WicketsAdded} > 0$):
     $$Z_{\text{cons}, j} = \frac{\text{PosMatchPct}_j - 43.07\%}{12.70\%}$$

---

## 3. Official SupeRR 10 — Under-Pressure Bowlers

| SupeRR Rank | V3 Rank | Bowler | Teams | SupeRR Score | V3 Clutch Rating (80%) | PPI Rating (10%) | Consistency % (10%) | HP Balls | Legal Balls | 95% Credible Interval |
|:---:|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **1** | **Jasprit Bumrah** | MI, India | **67.70** | **+20.33** (+14.74 pts) | +21.69 (+2.08 pts) | 53.3% (+0.88 pts) | 132 | 1708 | [+19.80, +20.86] |
| **2** | **2** | **Sunil Narine** | KKR, West Indies | **66.48** | **+18.56** (+13.70 pts) | +12.83 (+1.31 pts) | 58.2% (+1.47 pts) | 55 | 1533 | [+18.01, +19.11] |
| **3** | **4** | **Matheesha Pathirana** | CSK, Sri Lanka | **61.67** | **+9.61** (+8.45 pts) | +1.17 (+0.30 pts) | 70.4% (+2.92 pts) | 88 | 1132 | [+8.98, +10.24] |
| **4** | **5** | **Rashid Khan** | GT, SRH, Afg | **59.89** | **+8.11** (+7.57 pts) | +9.91 (+1.06 pts) | 56.6% (+1.27 pts) | 90 | 2747 | [+7.70, +8.52] |
| **5** | **6** | **Bhuvneshwar Kumar** | SRH, India | **59.27** | **+7.27** (+7.08 pts) | +19.42 (+1.88 pts) | 48.5% (+0.31 pts) | 149 | 2221 | [+6.82, +7.72] |
| **6** | **9** | **Blessing Muzarabani** | LSG, Zimbabwe | **58.85** | **+5.79** (+6.21 pts) | +16.98 (+1.67 pts) | 54.1% (+0.97 pts) | 54 | 820 | [+5.05, +6.53] |
| **7** | **8** | **Mitchell Santner** | CSK, New Zealand | **58.72** | **+5.86** (+6.25 pts) | +16.46 (+1.62 pts) | 53.0% (+0.85 pts) | 59 | 1737 | [+5.35, +6.37] |
| **8** | **7** | **Mustafizur Rahman** | CSK, DC, Ban | **57.69** | **+7.00** (+6.92 pts) | +13.64 (+1.38 pts) | 40.8% (-0.61 pts) | 123 | 1576 | [+6.45, +7.55] |
| **9** | **3** | **Sikandar Raza** | PBKS, Zimbabwe | **57.13** | **+9.95** (+8.65 pts) | -9.44 (-0.62 pts) | 38.5% (-0.90 pts) | 58 | 1091 | [+9.30, +10.60] |
| **10** | **10** | **Maheesh Theekshana** | CSK, Sri Lanka | **56.57** | **+5.66** (+6.13 pts) | +7.66 (+0.86 pts) | 42.4% (-0.42 pts) | 99 | 2265 | [+5.21, +6.11] |

---

## 4. Key Bowler Scouting Observations

1. **Top-Tier Franchise Anchors Solidified:**
   - **Jasprit Bumrah (#1, 67.70)** and **Sunil Narine (#2, 66.48)** represent the global pinnacle of high-pressure bowling, delivering both elite death defense ($+20.33$ and $+18.56$) and powerplay run prevention ($+21.69$ and $+12.83$).
2. **Pathirana Rises to #3:**
   - **Matheesha Pathirana** records an extraordinary **$70.4\%$ positive match percentage**, the highest in the top 10 cohort. His consistency under death pressure elevates him from V3 #4 to SupeRR #3.
3. **Prevention & Consistency Penalties:**
   - **Sikandar Raza** drops from V3 #3 to SupeRR #9 because his non-death prevention is negative ($-9.44$) and his match consistency is modest ($38.5\%$). The 80/10/10 formula prevents one-dimensional clutch spikes from obscuring match-to-match volatility.

