# TASK 08 — MATCH DIFFICULTY FEATURES: CDI & DDI

## Overview

To resolve the positional and polarity biases identified in the V2 audit, the V3 experimental architecture introduces two match-context features:
1. **Chase Difficulty Index (CDI)** for the batting team in Innings 2.
2. **Defence Difficulty Index (DDI)** for the bowling team in Innings 2.

Both indices explicitly anchor against historical competition par scores calibrated from the 2021–2024 database:
- **IPL Baseline Par Score ($P_{\text{comp}}$):** $175.0$ runs
- **T20I Baseline Par Score ($P_{\text{comp}}$):** $158.0$ runs

---

## 1. Chase Difficulty Index (CDI)

### Mathematical Formulation
The Chase Difficulty Index measures how far the target score deviates from the competition expected baseline, normalized on a $[-1.0, +1.0]$ logistic scale:

$$\text{CDI} = \tanh\left(\frac{T - P_{\text{comp}}}{38.0}\right)$$

Where:
- $T$ is the target score (or par projection if target unavailable).
- $P_{\text{comp}}$ is the competition par score ($175$ for IPL, $158$ for T20I).
- Scaling factor $38.0$ ensures that a $+38$ run premium ($T=213$ in IPL) yields $\text{CDI} \approx +0.64$, and a steep target ($T=250$) approaches $\text{CDI} \approx +0.96$.

### Properties of CDI
- **Neutral Chase ($T = 175$ in IPL):** $\text{CDI} = 0.00$.
- **Difficult Chase ($T = 215$ in IPL):** $\text{CDI} = +0.78$ (Significantly elevates opening batter pressure).
- **Extreme Chase ($T = 301$ in IPL):** $\text{CDI} = +1.00$ (Maximizes match difficulty component).
- **Sub-Par Chase ($T = 120$ in IPL):** $\text{CDI} = -0.89$ (Dampens opening batter pressure).

---

## 2. Defence Difficulty Index (DDI)

### Mathematical Formulation
The Defence Difficulty Index reflects the acute pressure placed on bowlers when defending small or below-par totals, where even minor concessions drastically reduce match win probability:

$$\text{DDI} = \tanh\left(\frac{P_{\text{comp}} - T}{38.0}\right) = -\text{CDI}$$

### Correcting the Polarity Inversion
By setting $\text{DDI} \propto (P_{\text{comp}} - T)$, the bowler's match-level difficulty is directly inverted from the batter's:
- **Defending Low Total ($T = 120$ in IPL):** $\text{DDI} = +0.89$. High bowling pressure from Ball 1.
- **Defending Average Total ($T = 175$ in IPL):** $\text{DDI} = 0.00$. Standard baseline bowling pressure.
- **Defending High Total ($T = 250$ in IPL):** $\text{DDI} = -0.96$. Low bowling pressure; bowlers have a substantial cushion.

---

## 3. Dynamic Win-Probability Leverage ($L_{WP}$)

In addition to static match difficulty, V3 incorporates dynamic win-probability leverage derived from pre-delivery win probability $p$:

$$L_{WP} = 4.0 \cdot p \cdot (1 - p)$$

- When $p = 0.50$ (match evenly poised), $L_{WP} = 1.00$ (maximum sensitivity).
- When $p = 0.90$ or $0.10$ (match effectively decided), $L_{WP} = 0.36$ (leverage contracts).

---

## 4. Integration into Delivery Pressure Scores

In Innings 2, the final delivery pressure indices are formulated as a 3-dimensional synthesis:

$$\text{BPI}_{v3} = \text{Base} \times S_{\text{situation}} \times \left(1.0 + 0.40 \cdot \text{CDI} \cdot S_{\text{phase}}\right) \times \left(0.60 + 0.40 \cdot L_{WP}\right)$$

$$\text{BowlerPI}_{v3} = \text{Base} \times S_{\text{bowler\_demand}} \times \left(1.0 + 0.45 \cdot \text{DDI} \cdot S_{\text{phase}}\right) \times \left(0.60 + 0.40 \cdot L_{WP}\right)$$

Where $S_{\text{phase}}$ modulates the impact of match context (strongest in Powerplay, gradually giving way to acute ball-by-ball required run rate at the death).

