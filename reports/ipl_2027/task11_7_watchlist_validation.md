# Task 11.7: Watchlist Intelligence & Dynamic Candidate Verification Report

**Verification Authority:** ClutchIQ Strategic Scouting Intelligence System  
**Audit Context:** Rajasthan Royals IPL 2027 Auction Architecture  
**BCCI Regulatory Baseline:** IPL 2027 Player Regulations & Retention Guidelines  

---

## 1. Zero-Confirmed Target Justification & Scouting System Architecture

A common flaw in automated sports recommendation engines is **phantom target manufacturing** — forcing a shortlist of names into an acquisition table before official eligibility and availability are established. 

Under strict compliance with Task 11.6 & Task 11.7 mandates:
> **"Player evaluation complete. Final acquisition shortlist pending official IPL 2027 retention, release and auction registration verification."**

### Key Structural Truths:
1. **Zero Confirmed Targets Does Not Equal Zero Suitable Candidates:** ClutchIQ has evaluated and ranked 700+ batters and bowlers under the 70% V3 Pressure + 20% PPI + 10% Consistency model. Over 20 candidates possess world-class pressure metrics that directly address Rajasthan Royals' specific failure modes.
2. **The Retention Deadline Gate:** As of the current audit timestamp, the official BCCI retention deadline is **November 17, 2026 at 17:00 IST**. All 10 IPL franchises retain unilateral rights over their contracted players until this deadline passes. 
3. **Scouting Intelligence Stance:** Rather than presenting an empty or broken interface, the page operates as a **live scouting intelligence watchlist**, tracking the 16 contracted conditional targets across Batting and Bowling units, ready to execute instant dynamic target substitution the moment official retention gazettes are published.

---

## 2. Organization of the 16 Conditional Targets

The 16 contracted candidates currently under active observation are divided into dedicated Batter and Bowler watchlists with full audit dimensions:

### A. Conditional Batter Watchlist (7 Candidates)
| Candidate | ClutchIQ Score | Evidence Tier | 2026 Franchise | RR Weakness Addressed | Primary Tactical Role | Next Verification Requirement |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **Tim David** | 70.67 | Strong Direct (497 HP) | Royal Challengers Bengaluru | W2 (Finishing Collapse) | Primary Death Finisher (#6/#7) | Official RCB retention gazette (Nov 17, 2026) |
| **Naman Dhir** | 68.69 | Strong Direct (220 HP) | Mumbai Indians | W2 (Finishing Collapse) | Domestic High-Pressure Finisher (#5/#6) | Official MI retention gazette (Nov 17, 2026) |
| **Heinrich Klaasen** | 63.07 | Strong Direct (445 HP) | Sunrisers Hyderabad | W3 (Spin Squeeze) & W5 (WK) | Elite Middle-Overs Spin Destroyer & WK | Official SRH retention gazette (Nov 17, 2026) |
| **Ashutosh Sharma** | 59.93 | Strong Direct (282 HP) | Delhi Capitals | W2 (Finishing Collapse) | Indian Death Overs Hitter (#6/#7) | Official DC retention gazette (Nov 17, 2026) |
| **Rajat Patidar** | 60.24 | Strong Direct (188 HP) | Royal Challengers Bengaluru | W3 (Spin Squeeze) | Top-to-Middle Indian Spin Disruptor (#4) | Official RCB retention gazette (Nov 17, 2026) |
| **Nicholas Pooran** | 58.45 | Strong Direct (535 HP) | Lucknow Super Giants | W2 (Finishing) & W5 (WK) | LHB Explosive Finisher & WK Reserve | Official LSG retention gazette (Nov 17, 2026) |
| **Glenn Phillips** | 57.52 | Strong Direct (202 HP) | Gujarat Titans | W2 (Finishing Collapse) | Middle Enforcer & Multi-Role Fielder | Official GT retention gazette (Nov 17, 2026) |

### B. Conditional Bowler Watchlist (9 Candidates)
| Candidate | ClutchIQ Score | Evidence Tier | 2026 Franchise | RR Weakness Addressed | Primary Tactical Role | Next Verification Requirement |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **Matheesha Pathirana** | 66.37 | Moderate Direct (82 HP) | Kolkata Knight Riders | W1 (Death Concession) | Express Sling Yorker Specialist (Overs 18 & 20) | Official KKR retention gazette (Nov 17, 2026) |
| **Nathan Ellis** | 62.66 | Moderate Direct (84 HP) | Chennai Super Kings | W1 (Death Concession) | Clutch Back-of-Hand Death Specialist | Official CSK retention gazette (Nov 17, 2026) |
| **Mohsin Khan** | 62.34 | Moderate Direct (35 HP) | Lucknow Super Giants | W1 (Death) & W4 (Indian Pace) | Indian Left-Arm Hit-The-Deck Pacer | Official LSG retention gazette (Nov 17, 2026) |
| **Josh Hazlewood** | 61.50 | Moderate Direct (63 HP) | Royal Challengers Bengaluru | W1 (Death Concession) | Hard-Length Defensive Controller | Official RCB retention gazette (Nov 17, 2026) |
| **Sunil Narine** | 64.48 | Moderate Direct (51 HP) | Kolkata Knight Riders | W3 (Finger Spin Choke) | Mystery Middle-Overs Spin Choker (Overs 7-15) | Official KKR retention gazette (Nov 17, 2026) |
| **Wanindu Hasaranga** | 61.46 | Moderate Direct (84 HP) | Lucknow Super Giants | W3 (Finger Spin Choke) | Attacking Middle Overs Wrist-Spinner | Official LSG retention gazette (Nov 17, 2026) |
| **Varun Chakravarthy** | 61.14 | Moderate Direct (73 HP) | Kolkata Knight Riders | W3 (Finger Spin Choke) | Domestic Mystery Spinner vs RHB & LHB | Official KKR retention gazette (Nov 17, 2026) |
| **Brydon Carse** | 62.46 | Moderate Direct (30 HP) | Sunrisers Hyderabad | W1 (Death) & W4 (Pace Depth) | Express Hit-The-Deck Enforcer (145+ km/h) | Official SRH retention gazette (Nov 17, 2026) |
| **Khaleel Ahmed** | 57.62 | Moderate Direct (80 HP) | Chennai Super Kings | W4 (Indian Pace Depth) | Indian Left-Arm Powerplay & Death Swing Arm | Official CSK retention gazette (Nov 17, 2026) |

---

## 3. Dynamic Replacement Logic

When a monitored candidate is retained by their parent franchise or officially declared unavailable:
1. **Immediate Removal from Actionable Shortlist:** The candidate is moved to `RETAINED_UNAVAILABLE` or `IPL_RETIRED`.
2. **Preservation of Metric Integrity:** Their ClutchIQ rating (70/20/10) is preserved as an immutable historical benchmark.
3. **Role-Fit Replacement, NOT Global Rank Substitution:** The engine does **not** pick the next highest ranked player on the global leaderboard (which would falsely recommend top-order batters like Priyansh Arya or Abhishek Sharma who duplicate Sooryavanshi/Jaiswal).
4. **Weakness-Grounded Succession:** The engine queries candidates mapped to that **exact requirement ID (R1–R5)**, evaluating overseas slot impact and domestic viability.

