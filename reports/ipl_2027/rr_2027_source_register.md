# SOURCE REGISTER: IPL 2026 ACTUAL PERFORMANCE & 2027 AUCTION ENGINE
**Platform:** ClutchIQ — Rajasthan Royals SupeRR Selector Season 2  
**Purpose:** Formal Audit Register Delineating Observed Facts, Statistical Findings, and Auction Assumptions  
**Document Code:** `reports/ipl_2027/rr_2027_source_register.md`  
**Date:** November 2026  

---

## 1. Observed Historical Facts (Ground Truth)

All performance data cited in this strategy is verified from local master delivery databases:
- **Primary Delivery Log:** `data/processed/delivery_pressure_scores_v3.csv` (185,715 fair legal deliveries, 200,999 delivery events).
- **Match Context Log:** `data/processed/match_context.csv` (853 total senior T20 fixtures: 371 IPL, 482 T20I).
- **Rajasthan Royals IPL 2026 Fixtures:** Exactly **16 matches** contested (14 league, 1 Eliminator, 1 Qualifier). Record: **9 Wins, 7 Losses**.
- **Player Sample Sizes in 2026:**
  - Vaibhav Sooryavanshi: 16 matches, 326 legal balls, 776 runs, strike rate 238.04.
  - Yashasvi Jaiswal: 16 matches, 280 legal balls, 427 runs, strike rate 152.50.
  - Jofra Archer: 16 matches, 360 legal balls bowled, 547 runs conceded, 25 wickets, economy 9.12.
  - Sandeep Sharma: 6 matches, 118 legal balls bowled, 224 runs conceded, 5 wickets, death economy 13.70.
  - Shimron Hetmyer: 7 matches, 69 legal balls, 78 runs, strike rate 113.04.

---

## 2. Statistical Findings (ClutchIQ Algorithms)

The following metrics represent statistical outputs derived via ClutchIQ's validated V3 Match Context Model:
- **Death Phase Concession in Losses:** In 5 of RR's 7 losses, RR set first innings totals between 179 and 194, but lost due to secondary pace bowlers conceding $>12.50\text{ rpo}$ in overs 17–20.
- **Batting Phase Efficiency:** Powerplay strike rate was **187.33 (League #1)**; Death overs batting was fragile (**10.94 balls per dismissal**).
- **Bayesian Posterior Reliability:**
  - Tim David: 497 HP legal balls, $\sigma_{\text{post}} = 4.31$, 95% CI $[23.1, 40.1]$.
  - Matheesha Pathirana: 82 HP legal balls, $\sigma_{\text{post}} = 4.60$, 95% CI $[12.3, 30.3]$.
  - Mark Wood: 27 HP legal balls, $\sigma_{\text{post}} = 7.93$, 95% CI $[17.3, 48.4]$.

---

## 3. Scouting Interpretations (Tactical Judgments)

These points represent expert cricket analytics interpretations:
- **Interpretation A:** Sandeep Sharma's death overs decline in 2026 (13.70 rpo) is a structural regression rather than bad luck, attributable to reduced dipping knuckle-ball deception.
- **Interpretation B:** Vaibhav Sooryavanshi's 776 runs at 238.04 SR mean RR's top-order opening spot is completely saturated, rendering other top-order openers redundant.
- **Interpretation C:** Pairing Matheesha Pathirana's sling yorkers with Jofra Archer creates an asymmetric death-bowling partnership that eliminates RR's primary 2026 failure mode.

---

## 4. Future Auction Assumptions & Regulatory Disclaimers

> [!WARNING]
> **Pending Official Regulatory Notice:**
> - Official BCCI / IPL Governing Council directives regarding IPL 2027 retention ceilings, purse sizes, and Right-to-Match (RTM) card allocations remain pending.
> - No player price tags, auction budgets, or rival franchise bid ceilings are fabricated.
> - Player availability is subject to official mega-auction retention registrations.
> - This strategy is an independent analytical proposal developed for the Rajasthan Royals SupeRR Selector Season 2 hackathon and does not imply official franchise adoption.

