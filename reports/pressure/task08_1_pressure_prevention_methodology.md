# TASK 08.1 — PRESSURE PREVENTION INDEX (PPI) METHODOLOGY

## Architectural Purpose

The **Pressure Prevention Index (PPI)** evaluates a player's ability to create, maintain, or expand an advantageous match position before conventional high-pressure states develop.

It quantifies early-match dominance while avoiding simple strike-rate or economy biases through **contextual expectations**, **risk-adjusted metrics**, and **Empirical Bayes shrinkage**.

---

## 1. Batter Pressure Prevention Index

### Mathematical Specification
Batter PPI evaluates three distinct operational pillars across non-death overs (Powerplay and Middle overs, Overs 1–16):

$$\text{Raw Batter PPI} = 0.50 \cdot \text{RAR}_{\text{PP}} + 0.35 \cdot \text{RAR}_{\text{EarlyMid}} + 0.15 \cdot \Delta_{\text{RRR\_Bonus}}$$

Where:
1. **$\text{RAR}_{\text{PP}}$ (Powerplay Runs Added per 100 Balls):**
   $$\text{RAR}_{\text{PP}} = \frac{\sum_{i \in \text{PP}} (R_i - \mathbb{E}[R_i])}{N_{\text{legal\_PP}}} \times 100$$
   Evaluates run generation above contextual delivery expectations during the field-restriction overs.
2. **$\text{RAR}_{\text{EarlyMid}}$ (Overs 1–16 Runs Added per 100 Balls):**
   Evaluates foundation-building across the first 16 overs, rewarding batters who maintain positive run differentials before the death overs.
3. **$\Delta_{\text{RRR\_Bonus}}$ (Chase Acceleration / De-escalation):**
   $$\Delta_{\text{RRR\_Bonus}} = \text{clip}\left(-8.0 \cdot \Delta_{\text{RRR}}, -15.0, +15.0\right)$$
   Where $\Delta_{\text{RRR}} = \text{RRR}_{\text{exit}} - \text{RRR}_{\text{entry}}$. A batter who enters at $9.5$ RPO and exits at $7.5$ RPO achieves $\Delta_{\text{RRR}} = -2.0$, receiving a $+15.0$ point de-escalation bonus.

### Risk Adjustment
Because raw strike rate can be inflated by reckless dismissals, $\mathbb{E}[R_i]$ incorporates contextual bowler quality and field state, while excessive early dismissals dampen cumulative runs added.

### Empirical Bayes Shrinkage for PPI
To prevent small-sample volatility, raw PPI is shrunken toward the qualified population mean:
$$\text{PPI}_{\text{shrunk}} = w_i \cdot \text{Raw PPI}_i + (1 - w_i) \cdot \mu_{\text{prior}}$$
$$w_i = \frac{N_{\text{EarlyMid}}}{N_{\text{EarlyMid}} + k_{\text{PPI}}}$$
With minimum volume $N_{\text{EarlyMid}} \ge 100$ legal balls and shrinkage constant $k_{\text{PPI}} = 80.0$.

---

## 2. Bowler Pressure Prevention Index

### Mathematical Specification
Bowler PPI evaluates early wicket suppression and economy control during the opposition's building phase:

$$\text{Raw Bowler PPI} = 0.50 \cdot \text{RS}_{\text{PP}} + 0.35 \cdot \text{RS}_{\text{EarlyMid}} + 0.15 \cdot \text{WktBonus}_{\text{PP}}$$

Where:
1. **$\text{RS}_{\text{PP}}$ (Powerplay Runs Saved per 100 Balls):**
   $$\text{RS}_{\text{PP}} = \frac{\sum_{i \in \text{PP}} (\mathbb{E}[\text{RunsConceded}_i] - \text{RunsConceded}_i)}{N_{\text{legal\_bowl\_PP}}} \times 100$$
2. **$\text{RS}_{\text{EarlyMid}}$ (Overs 1–16 Runs Saved per 100 Balls):**
   Sustained containment during overs 1–16.
3. **$\text{WktBonus}_{\text{PP}}$ (Powerplay Wicket Threat):**
   $$\text{WktBonus}_{\text{PP}} = \text{clip}\left(3.0 \cdot \text{WicketsPer100}_{\text{PP}}, 0.0, 15.0\right)$$
   Directly credits new-ball bowlers who dismantle the opposition top order early.

Shrinkage applies identical Bayesian parameters ($N_{\text{EarlyMid}} \ge 100$, $k = 80.0$).

---

## 3. Evidence Reliability & Eligibility Framework

ClutchIQ establishes a clear three-tier taxonomy:

### Category A: Qualified Pressure Performer
- Meets official clutch threshold: $\ge 150$ total legal balls and $\ge 40$ high-pressure deliveries ($\text{BPI} \ge 65$).
- Evaluated on **Clutch Rating**.

### Category B: Pressure Prevention Candidate
- Meets early volume threshold: $\ge 100$ early/mid legal balls (Overs 1–16).
- Fails clutch threshold: $< 40$ high-pressure deliveries.
- Evaluated on **Pressure Prevention Index (PPI)**.

### Dual Qualifier: Both Dimensions
- Meets both Category A and Category B requirements.
- Enables complete multi-dimensional scouting (e.g., Abhishek Sharma, Tim David, Phil Salt).

### Category C: Insufficient Evidence
- Fails both exposure thresholds. Retained in database without official ranking.

