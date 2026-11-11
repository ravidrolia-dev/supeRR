# TASK 08 — PROPOSED ARCHITECTURE SPECIFICATION (V3)

## Architectural Principle

**"Pressure must begin when the match situation is difficult, not merely when the match is old."**

The V3 pressure model expands upon the V2 delivery state by establishing a **3-Dimensional Pressure Surface**:
1. **Dimension 1 — Situational Scarcity & Demand:** Immediate resources (balls remaining $b_{\text{rem}}$, wickets in hand $w_{\text{hand}}$, required run rate $\text{RRR}$).
2. **Dimension 2 — Match-Level Context:** Chase Difficulty Index ($\text{CDI}$) and Defence Difficulty Index ($\text{DDI}$) relative to competition par ($P_{\text{comp}}$).
3. **Dimension 3 — Dynamic Win-Probability Leverage:** Match closeness based on delivery win-probability surface $L_{WP} = 4p(1-p)$.

---

## 1. Innings 1 Formulation (Setting the Target)

In the first innings, the final target is unknown to both teams. Evaluation relies strictly on **pre-delivery projected par vs competition par**:

$$\text{Projected Par} = \text{Runs Before Delivery} + \text{Expected Remaining Runs}(b_{\text{rem}}, w_{\text{hand}})$$

Where expected remaining runs is calibrated as:
$$\text{Exp Rem} = \max\left(0, 0.88 \cdot b_{\text{rem}} + 4.6 \cdot (w_{\text{hand}} - 1)\right)$$

### First-Innings Batter Pressure ($\text{BPI}_{\text{inn1}}$):
$$\text{BPI}_{\text{inn1}} = 30.0 \times W_{\text{phase\_bat}} \times \left(1.0 + \frac{\max(0, P_{\text{comp}} - \text{Projected Par})}{35.0}\right) \times \left(\frac{10}{w_{\text{hand}} + 1}\right)^{0.34}$$

- **Powerplay base pressure:** Starts around $38\text{--}45$, rising sharply if early wickets fall ($w_{\text{hand}} \le 7$).
- **Par Deficit:** If early wickets drag projected total to 130 on a 175 track, batter pressure surges to reflect rescue requirements.

### First-Innings Bowler Pressure ($\text{BowlerPI}_{\text{inn1}}$):
$$\text{BowlerPI}_{\text{inn1}} = 22.0 \times W_{\text{phase\_bowl}} \times \left(1.0 + \frac{\max(0, \text{Projected Par} - P_{\text{comp}})}{35.0}\right) \times \left(\frac{10}{w_{\text{hand}} + 1}\right)^{0.28}$$

- Rises when batting team gets off to an explosive start and projected total exceeds par.

---

## 2. Innings 2 Formulation (The Chase)

### Chase Difficulty & Defence Difficulty Indices:
$$\text{CDI} = \tanh\left(\frac{T - P_{\text{comp}}}{38.0}\right), \quad \text{DDI} = -\text{CDI}$$

### Dynamic Leverage:
$$L_{WP} = 4.0 \cdot p \cdot (1 - p)$$

### Powerplay Dampener Adjustment:
In V2, the ball decay term was $(120 / (b_{\text{rem}} + 6))^{0.25}$, severely penalizing ball 1 ($S_{\text{balls}} = 1.0$). 
In V3, the ball exponent is smoothed to $0.18$, and supplemented by the opening chase multiplier:
$$M_{\text{open\_bat}} = 1.0 + 0.40 \cdot \text{CDI} \cdot \left(\frac{b_{\text{rem}}}{120.0}\right)^{0.75}$$

This ensures that chasing $220+$ immediately injects high pressure on opening batters from ball one, without artificially lowering pressure at the death.

### Bowler Defense Multiplier:
$$M_{\text{def\_bowl}} = 1.0 + 0.45 \cdot \text{DDI} \cdot \left(\frac{b_{\text{rem}}}{120.0}\right)^{0.75}$$

When defending $120$, $M_{\text{def\_bowl}} = 1.40$, forcing high initial pressure on opening bowlers defending low totals.

---

## 3. Scale and Normalization

All scores remain rigorously bounded:
$$\text{BPI} \in [10.0, 100.0], \quad \text{BowlerPI} \in [10.0, 100.0]$$

Pressure tiers remain consistent with the production specification:
- **Low Pressure:** $< 45.0$
- **Moderate Pressure:** $45.0 \le \text{PI} < 65.0$
- **High Pressure:** $\ge 65.0$

