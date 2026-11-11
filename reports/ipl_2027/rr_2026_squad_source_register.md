# RR IPL 2026 Squad Source Register & Data Provenance

## 1. Primary Empirical Dataset Sources

| Source File | Entity Established | Record Count / Identifier | Audit Role |
|:---|:---|:---:|:---|
| `competitions.csv` | Official competition metadata | `comp_id = 3298` (IPL 2026, Format: T20, Season: 2026) | Primary competition anchor |
| `teams.csv` | Official franchise entity | `team_id = 3` (Rajasthan Royals, comp_id = 3298) | Franchise identity validation |
| `competition_team_player_mapping.csv` | Official competition roster registration | 27 player records for `(comp_id=3298, team_id=3)` | Authoritative squad membership baseline |
| `matches.csv` | Season fixture registry | 16 match records involving Team 3 (14 League, 2 Playoffs) | Competition scope and fixture verification |
| `playing_eleven.csv` | Matchday Playing XI and bench registrations | 400 roster rows for Team 3 across 16 matches (25 per match) | On-field participation, Captaincy, WK, Impact status |
| `data/processed/master_ball_by_ball.csv` | Granular delivery-level execution | 3,788 deliveries involving Rajasthan Royals in IPL 2026 | Ball-by-ball batting and bowling statistical verification |
| `data/processed/player_lookup.csv` | Canonical player identities & skill styles | 27 mapped players joined by canonical `player_id` | Role, batting style, bowling style baseline |

---

## 2. External Verification & Official Transaction Sources

| Player Name | Player ID | Documented Event | External Source Reference |
|:---|:---:|:---|:---|
| **Ravindra Jadeja** | 152 | Pre-season trade from CSK to RR in exchange for Sanju Samson | IPL Governing Council Trade Window Announcement 2025/2026; official franchise press release |
| **Sanju Samson** | 2258 | Pre-season trade from RR to CSK | CSK official squad announcement 2026; Match scorecards comp_id 3298 Team 1 |
| **Sam Curran** | 4409 | Acquired at auction for ₹2.40 Cr; ruled out prior to matchday 1 with groin injury | IPL Auction 2026 Official Results; IPL Medical Committee Release |
| **Dasun Shanaka** | 2436 | Signed as official injury replacement for Sam Curran | BCCI official replacement press release (March 2026); ₹2.00 Cr signing |
| **Ravi Singh** | 60700 | Played match 50383 vs DC; suffered fractured hand | RR official injury bulletin (May 2026) |
| **Emanjot Singh Chahal** | 43965 | Signed as official injury replacement for Ravi Singh | BCCI official replacement registration (May 2026); listed on RR roster for matches 50390, 50943, 50944 |
| **Trent Boult** | 2320 | Acquired by Mumbai Indians | IPL 2026 Match scorecards comp_id 3298 Team 2 |
| **Corbin Bosch** | 3629 | Acquired by Mumbai Indians | IPL 2026 Match scorecards comp_id 3298 Team 2 |
| **Karun Nair** | 930 | Acquired by Delhi Capitals | IPL 2026 Match scorecards comp_id 3298 Team 7 |
| **Aman Rao Perala** | 47523 | Domestic auction signing; U.S.-to-India passport clearance 2025; List-A 200 vs Bengal | Hyderabad Cricket Association records; IPL 2026 Player Auction list |

---

## 3. Discrepancy Resolution Protocol

1. **Conflict:** User starting list included Sanju Samson, Corbin Bosch, Trent Boult, Karun Nair, Adam Zampa.
   - **Resolution:** Cross-referenced against `playing_eleven.csv` and `matches.csv` for `comp_id=3298`. Samson (CSK), Bosch (MI), Boult (MI), and Nair (DC) actively played for rival franchises in 2026. Zampa did not participate. All five were removed from RR's 2026 roster with fully documented justifications.
2. **Conflict:** User starting list omitted 7 mapped players (Curran, Sen, Yudhvir, Maphaka, Perala, Puthur, Chahal).
   - **Resolution:** Restored all 7 players based on authoritative `competition_team_player_mapping.csv` and BCCI player transaction bulletins. Verified that non-appearance in playing XI was due to bench reserve status or medical deregistration.

