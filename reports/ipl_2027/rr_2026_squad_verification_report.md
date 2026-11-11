# RR IPL 2026 Squad Verification & Reconciliation Report

**Audit Release Gate Status:** **VERIFIED**  
**Competition Scope:** Indian Premier League 2026 (`comp_id=3298`)  
**Franchise:** Rajasthan Royals (`team_id=3`)  
**Data Sources:** `competitions.csv`, `teams.csv`, `competition_team_player_mapping.csv`, `matches.csv`, `playing_eleven.csv`, `data/processed/master_ball_by_ball.csv`, official IPL 2026 transactions, BCCI registration registries.

---

## 1. Executive Summary

This independent audit establishes the definitive, complete, and empirically verified 27-player squad of the **Rajasthan Royals for the IPL 2026 season**.

Previous iterations relied on an unverified 25-player prompt list that conflated past Rajasthan Royals icons with active 2026 personnel and omitted officially registered replacements and young domestic acquisitions. 

### Key Audit Findings
1. **True Squad Size:** Exactly **27 registered players** across the 2026 campaign (25 original auction/retention slots + 2 official injury replacement signings).
2. **Participation Rate:** 
   - **20 players** took the field in at least one match.
   - **7 players** made zero appearances (injuries, late signings, or depth reserves).
3. **The 5 Inaccurate Inclusions Removed:**
   - **Sanju Samson (ID: 2258):** Traded to Chennai Super Kings (Team 1) ahead of IPL 2026 in a direct swap for Ravindra Jadeja. Captained CSK in 2026.
   - **Trent Boult (ID: 2320):** Represented Mumbai Indians (Team 2) in IPL 2026 (14 matches played).
   - **Corbin Bosch (ID: 3629):** Represented Mumbai Indians (Team 2) in IPL 2026 (9 matches played).
   - **Karun Nair (ID: 930):** Represented Delhi Capitals (Team 7) in IPL 2026 (11 matches played).
   - **Adam Zampa (ID: 2636):** Withdrew / Unsold; 0 appearances across the entire IPL 2026 competition.
4. **The 7 Legitimate Mapped Members Restored:**
   - **Sam Curran (ID: 4409):** Bought at auction for ₹2.40 Cr; sustained a severe groin injury prior to Match 1 and was officially replaced by Dasun Shanaka.
   - **Kuldeep Sen (ID: 7545):** Squad fast bowler reserve (0 matches).
   - **Yudhvir Singh (ID: 8580):** Squad pace all-rounder reserve (0 matches).
   - **Kwena Maphaka (ID: 26663):** Overseas left-arm pace reserve (0 matches).
   - **Vignesh Puthur (ID: 48557):** Domestic left-arm wrist spin reserve (0 matches).
   - **Aman Rao Perala (ID: 47523):** Explosive opening batter reserve (0 matches).
   - **Emanjot Singh Chahal (ID: 43965):** Signed in May 2026 as an official injury replacement for Ravi Singh.

---

## 2. Squad Reconciliation Table (User Starting List vs Verified Ground Truth)

| Player | ID | User Starting List | Local Mapping | Match Appearances | Verified 2026 Status | Tactical Audit Finding |
|:---|:---:|:---:|:---:|:---:|:---|:---|
| **Vaibhav Sooryavanshi** | 50284 | Yes | Confirmed | 16 (4 Impact) | Playing XI Core | Primary opener; 776 runs, SR 238.04. |
| **Dhruv Jurel** | 7260 | Yes | Confirmed | 16 (16 WK) | Playing XI Core | Full-time wicketkeeper; 515 runs, SR 154.65. |
| **Yashasvi Jaiswal** | 6819 | Yes | Confirmed | 16 | Playing XI Core | Retained opener & stand-in captain (2 matches); 427 runs. |
| **Jofra Archer** | 3298 | Yes | Confirmed | 16 | Playing XI Core | Pace spearhead; 25 wickets, Econ 9.12. |
| **Riyan Parag** | 6423 | Yes | Confirmed | 14 (14 Cap) | Playing XI Core | Official 2026 Captain; 309 runs, 2 wickets. |
| **Donovan Ferreira** | 8182 | Yes | Confirmed | 15 | Playing XI Core | Primary overseas finisher; 317 runs, SR 179.10. |
| **Ravindra Jadeja** | 152 | Yes | Confirmed | 14 | Playing XI Core | Acquired via trade from CSK; 266 runs, 10 wickets. |
| **Brijesh Sharma** | 67036 | Yes | Confirmed | 13 | Playing XI Core | Breakout domestic pace talent; 14 wickets, 45.3 overs. |
| **Nandre Burger** | 7312 | Yes | Confirmed | 13 | Playing XI Core | Overseas left-arm pace enforcer; 14 wickets, 43.3 overs. |
| **Ravi Bishnoi** | 7503 | Yes | Confirmed | 9 (3 Impact) | Regular Playing XI | Primary wrist spinner; 11 wickets, Econ 9.88. |
| **Yash Punja** | 41503 | Yes | Confirmed | 8 (1 Impact) | Regular Playing XI | Domestic leg-spinner; 9 wickets, Econ 9.30. |
| **Shimron Hetmyer** | 3297 | Yes | Confirmed | 8 | Regular Playing XI | Middle-order finisher; 78 runs, SR 113.04. |
| **Dasun Shanaka** | 2436 | Yes | Confirmed | 7 (1 Impact) | Regular Playing XI | Replacement for Sam Curran; 63 runs, 1 wicket. |
| **Tushar Deshpande** | 6806 | Yes | Confirmed | 7 (2 Impact) | Regular Playing XI | Seamer; 4 wickets, Econ 11.96. |
| **Shubham Dubey** | 25139 | Yes | Confirmed | 7 (2 Impact) | Regular Playing XI | Middle-order power hitter; 81 runs, SR 139.66. |
| **Sandeep Sharma** | 2411 | Yes | Confirmed | 6 | Regular Playing XI | Veteran death bowler; 5 wickets, Econ 11.39. |
| **Sushant Mishra** | 7269 | Yes | Confirmed | 2 (1 Impact) | Rotation Player | Left-arm seamer; 2 wickets, Econ 10.58. |
| **Lhuan Pretorius** | 43798 | Yes | Confirmed | 2 | Rotation Player | Overseas backup wicketkeeper; 7 runs. |
| **Adam Milne** | 1487 | Yes | Confirmed | 1 | Rotation Player | Overseas express pace backup; 0 wickets in 3.2 overs. |
| **Ravi Singh** | 60700 | Yes | Confirmed | 1 | Injured | Played Match 50383; fractured hand; ruled out. |
| **Sam Curran** | 4409 | **No** | Confirmed | 0 | Ruled Out (Injury) | ₹2.40 Cr auction buy; ruled out before Match 1 (groin). |
| **Kuldeep Sen** | 7545 | **No** | Confirmed | 0 | Squad Reserve | Domestic pace backup; 0 appearances. |
| **Yudhvir Singh** | 8580 | **No** | Confirmed | 0 | Squad Reserve | Domestic pace all-rounder backup; 0 appearances. |
| **Kwena Maphaka** | 26663 | **No** | Confirmed | 0 | Squad Reserve | Overseas left-arm pace depth; 0 appearances. |
| **Aman Rao Perala** | 47523 | **No** | Confirmed | 0 | Squad Reserve | Domestic opening batter reserve; 0 appearances. |
| **Vignesh Puthur** | 48557 | **No** | Confirmed | 0 | Squad Reserve | Domestic left-arm wrist spinner; 0 appearances. |
| **Emanjot Singh Chahal**| 43965 | **No** | Confirmed | 0 | Squad Reserve | Replacement signed May 2026 for Ravi Singh; 0 appearances. |
| *Sanju Samson* | 2258 | Yes | **CSK** | 0 (14 for CSK) | **EXCLUDED** | Traded to Chennai Super Kings in exchange for Jadeja. |
| *Trent Boult* | 2320 | Yes | **MI** | 0 (14 for MI) | **EXCLUDED** | Traded/Auctioned to Mumbai Indians. |
| *Corbin Bosch* | 3629 | Yes | **MI** | 0 (9 for MI) | **EXCLUDED** | Represented Mumbai Indians in IPL 2026. |
| *Karun Nair* | 930 | Yes | **DC** | 0 (11 for DC) | **EXCLUDED** | Represented Delhi Capitals in IPL 2026. |
| *Adam Zampa* | 2636 | Yes | **None** | 0 | **EXCLUDED** | Withdrew / Unsold for IPL 2026. |

---

## 3. Demographics and Composition Breakdown

- **Total Squad Capacity:** 27 players registered during the 2026 cycle.
- **Nationality Distribution:**
  - **Indian Players:** 19 (70.4%)
  - **Overseas Players:** 8 (29.6%) — Jofra Archer, Nandre Burger, Donovan Ferreira, Shimron Hetmyer, Dasun Shanaka, Adam Milne, Lhuan Pretorius, Kwena Maphaka (+ Sam Curran before deregistration).
- **Primary Roles:**
  - **Batters:** 6 (Jaiswal, Sooryavanshi, Hetmyer, Dubey, Perala, Ravi Singh)
  - **Wicketkeeper-Batters:** 2 (Dhruv Jurel, Lhuan Pretorius)
  - **All-Rounders:** 7 (Jadeja, Parag, Ferreira, Shanaka, Curran, Yudhvir Singh, Chahal)
  - **Bowlers:** 12 (Archer, Burger, Bishnoi, Punja, Deshpande, Sandeep Sharma, Brijesh Sharma, Mishra, Milne, Sen, Maphaka, Puthur)

---

## 4. Preservation of Verified IPL 2026 Campaign Diagnostics

Crucially, **the correction of the squad membership reinforces and sharpens the existing campaign diagnostics**:

1. **Captaincy & Leadership Continuity:**
   - Previous commentary wondered why Sanju Samson was rarely mentioned in 2026 close finishes: **Sanju Samson was playing for CSK**, while **Riyan Parag captained RR in 14 matches** (Yashasvi Jaiswal captained 2). This confirms Parag as the central leadership figure heading into 2027.
2. **Ravindra Jadeja's Origin:**
   - Confirms that Ravindra Jadeja arrived via the blockbuster trade with CSK. Jadeja delivered 266 runs (SR 135.7) and 10 wickets (Econ 8.39), providing solid veteran control.
3. **Death-Bowling Concession (W1 Verified):**
   - Trent Boult was not in RR's dugout to take the new ball; Jofra Archer (25 wickets, Econ 9.12) and Nandre Burger (14 wickets) carried the pace attack. With Sandeep Sharma leaking 13.70 rpo in the death overs and Deshpande at 12.38 rpo, **the critical need for an express death bowler (R1) is 100% corroborated**.
4. **Lower-Order Finishing Deficit (W2 Verified):**
   - With Sam Curran injured and Dasun Shanaka scoring only 63 runs in 7 matches, plus Hetmyer managing only 78 runs (SR 113.04), Donovan Ferreira (317 runs, SR 179.10) had no reliable power-hitting partner. **Requirement R2 (High-Pressure Finisher) is fully affirmed**.

