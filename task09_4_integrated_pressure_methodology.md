# TASK 09.4 — INTEGRATED UNDER-PRESSURE BATTER METHODOLOGY

## 1. Architectural Mandate & Executive Summary

The primary objective of ClutchIQ is to identify batters who possess demonstrated, statistically validated capability to perform under high match pressure. 

In Task 09.2, we investigated an equalized multi-dimensional score (ISS: 50% Clutch, 35% Prevention, 15% Consistency). While ISS successfully identified early-game tempo dominators, it created a severe scouting hazard: players who built advantages early but had almost no high-pressure crisis sample (e.g., **Vaibhav Sooryavanshi** with only 8 HP balls, **Priyansh Arya** with 1 HP ball) ranked #1 and #2 ahead of battle-tested death finishers.

**Task 09.4 establishes the definitive single primary leaderboard: SupeRR 10 — Under-Pressure Batters.**

Under this architecture:
1. **Pressure performance remains the overwhelmingly dominant core** (80% weighting).
2. **Strict pressure eligibility is non-negotiable:**
   - Minimum 150 overall legal balls faced.
   - Minimum 40 V3 high-pressure legal balls faced ($\text{BPI}_{\text{v3}} \ge 65.0$).
   - Bayesian shrinkage reliability gate satisfied.
3. **Prevention is strictly supporting evidence (10%):** Early-innings dominance and required run-rate containment cannot substitute for direct crisis execution.
4. **Match consistency is strictly supporting evidence (10%):** Repeatability across matches provides modest evidence of resilience.

---

## 2. Mathematical Formulation of the SupeRR 10 Score

For any player $i$ satisfying the strict pressure eligibility criteria ($N_{\text{legal}} \ge 150$, $N_{\text{HP}} \ge 40$):

$$\text{Score}_i = 50.0 + 10.0 \times \left(0.80 \cdot Z_{\text{clutch}, i} + 0.10 \cdot Z_{\text{ppi}, i} + 0.10 \cdot Z_{\text{cons}, i}\right)$$

### Component 1: Standardized Pressure Performance ($Z_{\text{clutch}, i}$)
- **Weight:** $80\%$
- **Source Metric:** Empirical Bayes shrunk Contextual Runs Added per 100 high-pressure balls under the approved V3 match-context model:
  $$\hat{\theta}_{\text{clutch}, i} = w_i \cdot \text{RawRAR}_{100, \text{HP}, i} + (1 - w_i) \cdot \mu_{\text{prior}}$$
  where $w_i = \frac{N_{\text{HP}, i}}{N_{\text{HP}, i} + k}$, with empirical shrinkage constant $k = 45.0$ and $\mu_{\text{prior}} = -0.35$.
- **Standardization:** Calibrated relative to the strictly qualified pressure reference population ($N=185$ batters):
  $$Z_{\text{clutch}, i} = \frac{\hat{\theta}_{\text{clutch}, i} - \mu_{\text{ref\_clutch}}}{\sigma_{\text{ref\_clutch}}}$$
  $(\mu_{\text{ref\_clutch}} = -0.35, \sigma_{\text{ref\_clutch}} = 16.20)$.

### Component 2: Standardized Pressure Prevention ($Z_{\text{ppi}, i}$)
- **Weight:** $10\%$
- **Source Metric:** Empirical Bayes shrunk non-death contextual runs added (Overs 1–16) under the validated PPI formulation:
  $$Z_{\text{ppi}, i} = \frac{\hat{\theta}_{\text{ppi}, i} - \mu_{\text{ref\_ppi}}}{\sigma_{\text{ref\_ppi}}}$$
  $(\mu_{\text{ref\_ppi}} = -8.21, \sigma_{\text{ref\_ppi}} = 16.86)$.

### Component 3: Standardized Match Consistency ($Z_{\text{cons}, i}$)
- **Weight:** $10\%$
- **Source Metric:** Percentage of distinct matches where the batter generated net positive contextual runs added above expectation ($\text{RAR} > 0$):
  $$Z_{\text{cons}, i} = \frac{\text{PosMatchPct}_i - \mu_{\text{ref\_cons}}}{\sigma_{\text{ref\_cons}}}$$
  $(\mu_{\text{ref\_cons}} = 39.17\%, \sigma_{\text{ref\_cons}} = 13.59\%)$.

---

## 3. Strict Pressure-Performance Eligibility Gating

A fundamental principle of Task 09.4 is preventing unproven players from masquerading as clutch performers:
- Players who do not meet the minimum threshold of **$\ge 40$ V3 high-pressure legal balls** are strictly disqualified from the SupeRR 10 leaderboard.
- **Vaibhav Sooryavanshi** (575 legal balls, 8 HP balls), **Priyansh Arya** (469 legal balls, 1 HP ball), and **Ayush Mhatre** (239 legal balls, 6 HP balls) are **explicitly excluded** from the SupeRR 10.
- They are **not** assigned a penalty score of zero (which would falsely imply negative clutch skill); their status is recorded as `Insufficient Evidence (<40 HP Balls)`. Their remarkable early prevention metrics remain fully visible in their individual scouting dossiers as promising developmental attributes.

---

## 4. Component Calibration & Orthogonality

- **No Double Counting:** High-pressure balls ($\text{BPI}_{\text{v3}} \ge 65.0$) evaluate late-over crisis performance and severe chase conditions. PPI measures non-death foundation (Overs 1–16). While some early balls can reach $\text{BPI} \ge 65.0$ in steep chases, the overlap is under $4.2\%$ of balls faced.
- **Empirical Scale Alignment:** Standardizing each component into $Z$-scores with reference population mean $0$ and standard deviation $1$ ensures that the $80/10/10$ weighting is mathematically exact and not distorted by differences in variance.
- **Bayesian Posterior Uncertainty:** Posterior standard errors ($\sigma_{\text{post}}$) and 95% Bayesian Credible Intervals $[\text{CI}_{\text{lower}}, \text{CI}_{\text{upper}}]$ are retained for all ranked players, confirming statistical significance at the $95\%$ level for every member of the SupeRR 10.

