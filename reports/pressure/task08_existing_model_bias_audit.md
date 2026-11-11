# TASK 08 — EXISTING MODEL BIAS AUDIT

## Executive Summary

An exhaustive empirical audit of the ClutchIQ Production (V2) pressure architecture was conducted across **200,999 legal and extra deliveries** (covering 912 matches across IPL 2021–2024 and men's T20Is). 

The audit confirms **two structural architectural limitations** in the V2 model:
1. **Positional / Phase Confounding for Batters:** The V2 formula systematically conflated "innings age" with "match pressure" via the delivery decay term $(120 / (b_{\text{rem}} + 6))^{0.25}$. As a result, opening batters facing steep targets (e.g., chasing 220+) experienced artificially suppressed pressure ($\text{BPI} \approx 32\text{--}37$) on Ball 1, starving openers of high-pressure sample volume ($9.09\%$ of balls vs $37.34\%$ for finishers).
2. **Defending Total Polarity Inversion for Bowlers:** In 2nd innings, BowlerPI was calculated directly from batter required demand ($D_{\text{bowl}} = \min(D_{\text{bat}}, 2.35)$). Consequently, bowlers defending a massive cushion of 304 runs were assigned an extreme pressure index of **100.0**, while bowlers defending an acutely stressful total of 104 runs received an index of **34.58**. In reality, defending a low total creates immense bowling pressure from ball one.

---

## 1. Audit Methodology & Delivery Breakdown

The production V2 dataset evaluates deliveries according to:
$$\text{BPI} = \text{Base} \times S_{\text{balls}} \times S_{\text{wickets}} \times S_{\text{rrr}}$$

Where:
- $S_{\text{balls}} = \left(\frac{120}{b_{\text{rem}} + 6}\right)^{0.25}$
- $S_{\text{wickets}} = \left(\frac{10}{w_{\text{hand}} + 1}\right)^{0.42}$

### Innings 1 Ball 1 Neutral Constant
Across all 912 matches, the first delivery of the match in V2 received an identical, hardcoded constant:
- **$\text{BPI} = 43.81$**
- **$\text{BowlerPI} = 26.00$**
- **Variance across venues / match conditions = $0.00$**

The model was completely agnostic to whether the match took place on a high-scoring flat track (par 215) or an Eden Gardens spin minefield (par 130).

---

## 2. Empirical Role Exposure Analysis (180 Qualified Batters)

Grouping qualified batters by their median batting order position in the 2021–2024 database reveals the extent of the positional bias:

| Batting Role | Player Count ($n$) | V2 Mean Pressure Faced | V2 High-Pressure Balls (Mean) | V2 HP Balls (% of Diet) | V2 Mean Clutch Rating |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Openers (Pos 1–2)** | 34 | **40.73** | **82.2** | **9.09%** | **+4.32** |
| **Top/Middle (Pos 3–4)** | 53 | **47.66** | **132.5** | **18.02%** | **+2.22** |
| **Middle/Finishers (Pos 5–6)** | 63 | **60.53** | **242.2** | **37.34%** | **-0.94** |
| **Lower Order (Pos 7+)** | 30 | **77.51** | **227.6** | **65.79%** | **-15.46** |

### Key Positional Audit Findings:
1. **4.1x Exposure Disparity:** Finishers faced on average $37.34\%$ of their balls in the high-pressure band ($\text{BPI} \ge 65$), whereas openers faced only $9.09\%$ of their balls under high pressure.
2. **Eligibility Distortion:** Because the minimum high-pressure eligibility threshold was set at 40 balls, elite top-order batters who faced 1,000+ legal balls had trouble qualifying unless their teams suffered repeated top-order collapses.
3. **The Finisher Inflation Myth:** Although finishers faced much higher average pressure, their raw runs-added under pressure was frequently negative due to impossible required run rates ($>15$ RPO), resulting in lower shrunken ratings overall, while openers with fewer opportunities were shrunken aggressively towards the prior mean.

---

## 3. The Bowler Polarity Inversion Bug in V2

The mathematical audit uncovered a critical inverted relationship in `src/pressure_index.py`:

```python
# V2 Logic for Bowler in 2nd Innings:
d_bowl = np.minimum(d_bat, 2.35)
bowler_pi = np.clip(18.0 * d_bowl * ... )
```

### Scenario Test of the Inversion:
- **Scenario A: Defending 301 runs (Target = 302, RRR = 15.1)**
  - Batter required run rate is astronomical.
  - V2 assigned $\text{BowlerPI} = \mathbf{100.0}$ (Maximum pressure on the bowler!).
  - *Reality:* The bowling team has 301 runs in the bank; they can concede 14 an over and win easily. Pressure is low.
- **Scenario B: Defending 103 runs (Target = 104, RRR = 5.2)**
  - Batter required run rate is low.
  - V2 assigned $\text{BowlerPI} = \mathbf{34.58}$ (Low pressure on the bowler!).
  - *Reality:* Any single boundary or extra is catastrophic. The bowler must strike immediately with zero margin for error. Pressure is extreme.

This inverted logic artificially inflated death bowlers who bowled in high-scoring games and punished new-ball bowlers who defended low totals.

---

## 4. Audit Conclusion & Direction for V3

1. **Pressure must begin when the match situation is difficult, not merely when the match is old.**
2. A formal **Chase Difficulty Index (CDI)** is required to elevate opening batters chasing 200+ from ball one.
3. A **Defence Difficulty Index (DDI)** is required to reflect bowler stress when defending vulnerable totals.
4. Production V2 rankings remain untouched to ensure pipeline stability, while V3 is deployed as an audited experimental shadow model.

