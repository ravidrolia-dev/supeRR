# TASK 08.2 — PREDICTIVE VALIDATION & ATTRIBUTION ANALYSIS

## Executive Summary

This report delivers a non-circular, predictive validation of the Pressure Prevention Index (PPI) and audits the causal attribution of win-probability changes and chase de-escalations.

---

## 1. Non-Circular Out-of-Sample Predictive Benchmarking

To ensure true predictive validity (rather than in-sample correlation), models trained on 606 earlier matches (pre-June 2025) were evaluated against future match performances across 261 out-of-sample matches (post-June 2025) for 155 qualified overlapping batters:

| Model Architecture | Features Included | Out-of-Sample Correlation ($r$) | Out-of-Sample $R^2$ | RMSE | Analytical Evaluation |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Model A: Naive Strike Rate** | Overall Career SR | **0.474** | 0.225 | 20.85 | Good baseline, but blind to phase and match context. |
| **Model B: Powerplay Strike Rate** | Powerplay SR only | **0.407** | 0.166 | 21.64 | High variance; ignores overs 7–16 foundation. |
| **Model C: Contextual RAR Baseline** | Overall Runs Added / 100 | **0.465** | 0.216 | 20.97 | Solid baseline, but lumps death and powerplay together. |
| **Model D: Contextual RAR + Risk** | Contextual RAR + Volume + Dismissal Risk | **0.510** | **0.260** | **20.38** | **Best Performance:** Captures value added while penalizing high wicket attrition. |
| **Model E: Full PPI (Task 08.1)** | PP RAR ($50\%$) + EarlyMid ($35\%$) + Chase ($15\%$) | **0.305** | 0.093 | 22.56 | Penalized by noisy chase RRR delta and PP double counting. |
| **Model F: Corrected PPI (Audit Recommendation)** | EarlyMid RAR ($65\%$) + PP RAR ($25\%$) + Risk ($10\%$) | **0.488** | **0.238** | **20.62** | **Recommended:** Eliminates chase noise while preserving early dominance. |

### Key Validation Finding:
The chase RRR delta component ($\Delta_{\text{RRR}}$), while intuitive retrospectively, carries high match-level variance ($r = -0.205$ predictive correlation) because a batter's exit RRR is heavily confounded by partner dismissals and opponent bowling quality. Reducing chase weight and emphasizing non-death contextual runs added restores superior out-of-sample predictability.

---

## 2. Causal Attribution Audit: Individual vs Team Context

A critical limitation in retrospective analytics is the **Attribution Fallacy**: attributing a decrease in chase difficulty or an increase in win probability solely to the striker.

### Diagnostic Breakdown:
1. **Multi-Batter Confounding:**
   In a 60-run powerplay partnership off 36 balls, Batter A might score 45 off 22 while Batter B scores 12 off 14. 
   - Attributing the entire team win-probability surge to Batter A would be an over-attribution.
   - However, **delivery-level Contextual Runs Added ($\text{RAR}_i$) explicitly attributes value ball-by-ball** to the individual striker facing that specific delivery.
2. **Comfortable Chase Bias:**
   Does PPI disproportionately reward batters chasing small totals ($120\text{--}130$)?
   - *Audit Finding:* No. Contextual RAR evaluates performance against the delivery baseline $\mathbb{E}[R_i]$. In a small chase, expected runs are lower, meaning scoring singles and dots yields zero or negative runs added. Batters must score boundaries and outpace the required rate to earn a positive prevention rating.
3. **Formal Attribution Labeling:**
   - **Contextual Runs Added ($\text{RAR}$):** Individual direct attribution.
   - **Chase RRR Reduction ($\Delta_{\text{RRR}}$):** Contextual partnership/team contribution.
   - **Win Probability Added ($\text{WPA}$):** Contextual game-state shift (should never be interpreted as sole causal impact).

---

## 3. Bowling PPI Predictive Validation

Evaluating 140 overlapping qualified bowlers across the temporal train/test split:
- **Predicting Out-of-Sample Economy in Overs 1–16:**
  - Training Powerplay Runs Saved ($r = 0.442$) significantly outperforms Raw Economy ($r = 0.365$).
  - Adding the Powerplay Wicket Threat bonus improves prediction of early momentum restriction ($r = 0.468$).
- This confirms that early bowling containment and top-order strikes are highly repeatable skills from season to season.

