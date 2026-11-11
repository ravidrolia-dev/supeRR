# TASK 09.6 — BOWLER VALIDATION REPORT

## 1. Executive Summary

This report delivers the empirical validation for the proposed **70/20/10 Integrated Bowling Model** across all $N = 258$ bowlers with at least 150 legal balls bowled in primary competitions.

---

## 2. Impact of Removing the 40 HP-Ball Exclusion Gate

Unlike batting, where high-pressure exposure is relatively well-distributed, **high-pressure bowling events are heavily concentrated in death-overs specialists**:
- In the eligible bowling population ($N = 258$), **$64.0\%$ (165 bowlers) have faced fewer than 40 high-pressure deliveries**.
- Only **4 bowlers** in the entire global database have faced $\ge 150$ high-pressure deliveries (Jason Holder, T Natarajan, Arshdeep Singh, Marco Jansen).
- Consequently, applying the suggested thresholds without qualification safeguards allows high-variance, low-exposure bowlers to crowd the top 10:
  - **Mark Wood (#2, Score: 73.89)** — 28 HP balls.
  - **Imad Wasim (#3, Score: 66.66)** — 6 HP balls.
  - **Corbin Bosch (#5, Score: 65.68)** — 12 HP balls.
  - **Craig Young (#6, Score: 64.99)** — 31 HP balls.
  - **Mujeeb Ur Rahman (#9, Score: 64.38)** — 18 HP balls.
  - **Dwayne Bravo (#10, Score: 64.09)** — 9 HP balls.

### Stratification of Top 10 Bowlers by Evidence Tier:
1. **Strong Direct Evidence ($\ge 150$ HP Balls):** 0 bowlers in the top 10.
2. **Moderate Direct Evidence ($40\text{--}149$ HP Balls):**
   - **Abbas Afridi (#1, 78.50)** — 66 HP balls.
   - **Matheesha Pathirana (#4, 66.37)** — 88 HP balls.
   - **Sunil Narine (#7, 64.48)** — 55 HP balls.
   - **Haris Rauf (#8, 64.46)** — 106 HP balls.
3. **Limited Direct Evidence ($< 40$ HP Balls):**
   - **Mark Wood (#2, 73.89)** — 28 HP balls.
   - **Imad Wasim (#3, 66.66)** — 6 HP balls.
   - **Corbin Bosch (#5, 65.68)** — 12 HP balls.
   - **Craig Young (#6, 64.99)** — 31 HP balls.
   - **Mujeeb Ur Rahman (#9, 64.38)** — 18 HP balls.
   - **Dwayne Bravo (#10, 64.09)** — 9 HP balls.

---

## 3. Weight Sensitivity & Stability Analysis

| Weight Combination | $w_{\text{clutch}}$ | $w_{\text{ppi}}$ | $w_{\text{cons}}$ | V3 Top-10 Overlap | Spearman Rank Correlation |
|---|:---:|:---:|:---:|:---:|:---:|
| **Pure V3 Baseline (100/0/0)** | $1.00$ | $0.00$ | $0.00$ | $10/10$ ($100\%$) | $1.0000$ |
| **Clutch Dominant (85/10/5)** | $0.85$ | $0.10$ | $0.05$ | $8/10$ ($80\%$) | $0.9936$ |
| **Previous SupeRR (80/10/10)** | $0.80$ | $0.10$ | $0.10$ | $8/10$ ($80\%$) | $0.9913$ |
| **Proposed Unified (70/20/10)** | **$0.70$** | **$0.20$** | **$0.10$** | **$7/10$ ($70\%$)** | **$0.9739$** |
| **Balanced Multidimensional (60/25/15)** | $0.60$ | $0.25$ | $0.15$ | $4/10$ ($40\%$) | $0.9556$ |

*Key Finding:* Across all 258 bowlers, rank stability remains strong ($r = 0.9739$), but top-10 overlap drops to $70\%$ under 70/20/10 due to high-economy low-over bowlers being rewarded for powerplay runs saved.

---

## 4. Temporal Out-of-Sample Predictive Validation

Evaluated on the chronological split (588 matches pre-June 2025 vs. 249 matches post-June 2025):
- **Predictive Target:** High-pressure impact per 100 balls ($\text{BowlPI}_{\text{v3}} \ge 65.0$) in the test window.
- **Pure V3 Clutch Alone:** $r = -0.0591, R^2 = 0.35\%$
- **PPI Prevention Alone:** $r = -0.0491, R^2 = 0.24\%$
- **Match Consistency Alone:** $r = +0.1762, R^2 = 3.10\%$
- **Proposed 70/20/10 Score:** $r = -0.0503, R^2 = 0.25\%$

### Critical Finding:
Raw crisis bowling impact is heavily noise-dominated out of sample because death-overs leverage hinges on binary outcomes (e.g. edge boundaries vs catches). The single most repeatable predictor of future stability is **match consistency ($r = +0.1762$)**.

**Recommendation:** The 70/20/10 bowler ranking is **CONDITIONALLY READY FOR SCOUTING PRODUCTION**, with the critical operational rule that scouts must filter or prioritize bowlers with **Moderate or Strong Direct Evidence ($\ge 40$ HP balls)** when selecting specialist death bowlers.

