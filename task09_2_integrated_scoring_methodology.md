# TASK 09.2 — INTEGRATED SCORING METHODOLOGY (ISS)

## Architectural Principle & Executive Summary

The objective of Task 09.2 is to resolve decision fragmentation for Rajasthan Royals scouts by establishing an **Integrated Scouting Score (ISS)** that unifies pressure performance, early foundation dominance, and match consistency into one coherent evaluation metric per player.

However, in accordance with strict production governance:
- **Components are not arbitrarily averaged.**
- **Components are calibrated onto standardized scales.**
- **Missing or unqualified evidence is explicitly penalized and flagged.**
- **The model was subjected to empirical temporal out-of-sample validation before release consideration.**

---

## 1. Mathematical Formulation of the Integrated Scouting Score (ISS)

For a qualified player $i$ with $\ge 100$ legal deliveries:

$$\text{ISS}_i = 50.0 + 10.0 \times \left(w_{\text{clutch}} \cdot Z_{\text{clutch}, i} + w_{\text{prev}} \cdot Z_{\text{prev}, i} + w_{\text{cons}} \cdot Z_{\text{cons}, i}\right)$$

Where:
1. **$Z_{\text{clutch}, i}$ (Standardized Pressure Performance):**
   - Derived from Bayesian Shrunk Clutch Impact under the validated V3 model:
     $$\hat{\theta}_{\text{clutch}, i} = w_i \cdot \text{RawClutch}_i + (1 - w_i) \cdot \mu_{\text{prior}}$$
   - Normalized relative to the qualified reference population ($N \ge 150$ balls, $N_{\text{HP}} \ge 40$ balls):
     $$Z_{\text{clutch}, i} = \frac{\hat{\theta}_{\text{clutch}, i} - \mu_{\text{ref\_clutch}}}{\sigma_{\text{ref\_clutch}}}$$
2. **$Z_{\text{prev}, i}$ (Standardized Early Foundation Dominance):**
   - Derived from Bayesian Shrunk Non-Death Contextual Runs Added (Overs 1–16):
     $$\hat{\theta}_{\text{prev}, i} = w_{p, i} \cdot \text{RawRAR}_{1\text{--}16, i} + (1 - w_{p, i}) \cdot \mu_{\text{prev\_prior}}$$
     $$Z_{\text{prev}, i} = \frac{\hat{\theta}_{\text{prev}, i} - \mu_{\text{ref\_prev}}}{\sigma_{\text{ref\_prev}}}$$
3. **$Z_{\text{cons}, i}$ (Standardized Match-to-Match Consistency):**
   - Percentage of distinct matches where the player generated positive contextual runs added above expectation:
     $$Z_{\text{cons}, i} = \frac{\text{PosMatchPct}_i - \mu_{\text{ref\_cons}}}{\sigma_{\text{ref\_cons}}}$$

---

## 2. Handling Missing Evidence & Eligibility Boundaries

A critical requirement is avoiding the conflation of unproven players with proven performers:

1. **Dual Qualified Cohort ($N \ge 150$, $N_{\text{HP}} \ge 40$, $N_{1\text{--}16} \ge 100$):**
   - Evaluated using full multi-dimensional weighting:
     $$w_{\text{clutch}} = 0.50, \quad w_{\text{prev}} = 0.35, \quad w_{\text{cons}} = 0.15$$
2. **Pressure Prevention Candidates ($N_{1\text{--}16} \ge 100$, but $N_{\text{HP}} < 40$):**
   - Players like **Vaibhav Sooryavanshi**, **Priyansh Arya**, and **Jake Fraser-McGurk** lack high-pressure crisis sample.
   - If their missing clutch component is set to zero ($Z_{\text{clutch}} = 0.0$, representing average population performance), their extreme early dominance ($Z_{\text{prev}} > +3.0$) still propels them to the top of an integrated ranking.
   - **Crucial Scouting Transparency:** The interface and dossier must explicitly display their clutch rating as `Unqualified (<40 HP Balls)`, preventing scouts from falsely assuming they are proven death crisis finishers.

---

## 3. Bowling Dimension Specificity

For bowlers, Task 08.3 and Task 09 demonstrated that early bowling prevention (powerplay economy and dot suppression) is highly correlated with overall economy, but wicket threat in the death overs remains the primary driver of win probability. 
Therefore, bowling ISS places a heavier emphasis on V3 pressure performance ($65\%$) relative to prevention ($20\%$) and consistency ($15\%$).

