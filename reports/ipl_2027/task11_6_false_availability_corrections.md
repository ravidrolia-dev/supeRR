# Task 11.6: False Availability Audit & Candidate Correction Report

**Audit Date:** November 11, 2026  
**Auditor:** ClutchIQ Strategic Intelligence & Verification Unit  
**Authority Reference:** BCCI IPL 2027 Retention Circular (Deadline: November 17, 2026, 17:00 IST)

---

## 1. Executive Summary

A comprehensive multi-dimensional audit of the Rajasthan Royals IPL 2027 Auction Shortlist revealed critical false availability assumptions in earlier iterations. Specifically, players who were either **IPL retired** (e.g., Andre Russell, Dinesh Karthik, Dwayne Bravo) or **actively contracted to other franchises with retention pending** (e.g., Rajat Patidar, Tim David, Heinrich Klaasen) were mistakenly presented as actionable or available targets.

To eliminate phantom availability and prevent catastrophic auction misallocations, this report enforces **9 discrete availability states** across 4 independent verification axes:
1. **Nationality & IPL Eligibility**
2. **Professional Career Status**
3. **IPL Career Status**
4. **Franchise & Auction Status**

---

## 2. High-Profile Corrections & Case Studies

### A. Case 1: Andre Russell (Player ID: 1318)
- **Previous Classification:** `AVAILABLE` (Release / Open Auction Target).
- **Corrected Status:** `IPL_RETIRED`.
- **Reason for Exclusion:** 
  Andre Russell officially concluded his storied IPL playing career following the 2025 season. While he remains active in other overseas franchise tournaments (e.g., CPL, MLC, ILT20), participation in external private leagues does not confer IPL eligibility. 
- **Methodological Rule:**
  *International or foreign league activity must never be conflated with active IPL eligibility.* Russell is completely removed from all auction recommendation tables. His historical ClutchIQ score (58.68, 344 HP balls) remains preserved purely as a benchmark metric.

### B. Case 2: Rajat Patidar (Player ID: 5039)
- **Previous Classification:** `AVAILABLE` / Primary Target.
- **Corrected Status:** `CONDITIONAL_RETENTION_PENDING`.
- **Reason for Exclusion:**
  Patidar was a contracted middle-order core member of Royal Challengers Bengaluru (RCB, Team 5) throughout the 2026 season. Under BCCI directives, franchise retention declarations close on November 17, 2026. Prior to this official gazette date, treating contracted players as available acquisitions is a violation of auction protocol. Patidar is moved exclusively to the Conditional Monitoring List.

### C. Case 3: Abbas Afridi (Player ID: 7699) & Haris Rauf (Player ID: 7364)
- **Previous Classification:** High-ranked bowler prospects based on raw ClutchIQ pressure scores.
- **Corrected Status:** `NATIONALITY_INELIGIBLE`.
- **Reason for Exclusion:**
  Under longstanding BCCI operational directives and IPL operational guidelines, Pakistani nationals are ineligible to register for or participate in the IPL Player Auction. These players are quarantined in the Ineligible Registry and barred from all tactical recruitment boards.

### D. Case 4: Uncontracted Free Agents (Glenn Maxwell, Mark Wood, Harry Brook)
- **Previous Classification:** `AVAILABLE_CONFIRMED`.
- **Corrected Status:** `AVAILABILITY_UNVERIFIED`.
- **Reason for Correction:**
  Although Maxwell, Wood, and Brook did not hold 2026 IPL franchise contracts, the official 2027 Auction Registration Pool is not yet finalized or released by the BCCI. Classifying uncontracted players as "Confirmed Available" prior to published registration certificates introduces false confidence. They are placed in an Unverified/Potential Pool pending the auction register.

---

## 3. Systematic Summary Table of Corrections

| Candidate | Role | Previous Status | Audited Status | Core Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Andre Russell** | Batter | `AVAILABLE` | `IPL_RETIRED` | Officially retired from IPL; external T20 league play is legally distinct. |
| **Dinesh Karthik** | Batter | High Score | `IPL_RETIRED` | Officially announced competitive & IPL retirement after 2024. |
| **Dwayne Bravo** | Bowler | High Score | `IPL_RETIRED` | Retired from IPL playing roster; active only in coaching capacities. |
| **Abbas Afridi** | Bowler | Rank #1 | `NATIONALITY_INELIGIBLE` | Pakistani national; ineligible under BCCI IPL participation rules. |
| **Haris Rauf** | Bowler | Rank #8 | `NATIONALITY_INELIGIBLE` | Pakistani national; ineligible under BCCI IPL participation rules. |
| **Rajat Patidar** | Batter | `AVAILABLE` | `CONDITIONAL_RETENTION_PENDING` | Active RCB contract in 2026; release not established pending Nov 17. |
| **Tim David** | Batter | `AVAILABLE` | `CONDITIONAL_RETENTION_PENDING` | Contracted to RCB; retention decision pending. |
| **Heinrich Klaasen**| Batter | `AVAILABLE` | `CONDITIONAL_RETENTION_PENDING` | Contracted to SRH; retention decision pending. |
| **Matheesha Pathirana** | Bowler | `AVAILABLE` | `CONDITIONAL_RETENTION_PENDING` | Contracted to KKR; retention decision pending. |
| **Nathan Ellis** | Bowler | `AVAILABLE` | `CONDITIONAL_RETENTION_PENDING` | Contracted to CSK; retention decision pending. |
| **Glenn Maxwell** | Batter | `AVAILABLE` | `AVAILABILITY_UNVERIFIED` | Free agent; auction registration not yet confirmed by BCCI. |
| **Mark Wood** | Bowler | `AVAILABLE` | `AVAILABILITY_UNVERIFIED` | Free agent; auction registration not yet confirmed by BCCI. |

---

## 4. Architectural Rules for Strategy Dashboard

1. **No Phantom Shortlists:** When the auction registration list has not been published (current date Nov 11, 2026), the Confirmed Auction Targets table must report **0 confirmed players** rather than manufacturing an artificial list.
2. **Distinct Visibility Tiers:** The UI must feature clearly differentiated tabs:
   - *Tab A: Confirmed Auction-Eligible Targets (Currently 0 pending Nov 17).*
   - *Tab B: Conditional Targets — Retention Pending (Contracted to other franchises).*
   - *Tab C: Availability Unverified (Uncontracted free agents awaiting registration).*
   - *Tab D: Retained / Unavailable (Cornerstone stars & RR core).*
   - *Tab E: IPL Retired / Nationality Ineligible (Banned from recruitment).*

