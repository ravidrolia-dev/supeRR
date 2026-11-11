# TASK 10.2: EXPOSURE DEFINITION RECONCILIATION AUDIT
**Platform:** ClutchIQ — Rajasthan Royals SupeRR Selector Season 2  
**Audit Scope:** Rigorous Definition Audit of Delivery Events, Legal Balls, Pressure Scores, and Scope  
**Audit Finding:** **PASS** (Clear Disaggregation Established Across Platform)  
**Date:** November 2026  

---

## 1. Executive Summary & Audit Mandate

In sports analytics and algorithmic ranking pipelines, conflating distinct delivery quantities introduces severe credibility hazards. This audit reconciles and formally delineates five distinct counting definitions used across ClutchIQ:
1. **Total Delivery Events:** Raw ball-by-ball rows in the master log, including extras (wides, no-balls) and secondary tournaments.
2. **Primary Scope Delivery Events:** Deliveries filtered strictly to senior competitive fixtures (Indian Premier League and Men's Senior T20 Internationals, 2008–2024).
3. **Primary Legal Deliveries:** Fair deliveries satisfying cricket scoring rules (`is_legal_ball == True`), excluding wides and no-balls from rate denominators.
4. **High-Pressure Legal Deliveries:** Fair legal deliveries within primary scope where the pre-delivery Pressure Index satisfies $\text{PI} \ge 65.0$.
5. **High-Pressure All-Event Deliveries:** Delivery events (including illegal deliveries) where $\text{PI} \ge 65.0$.

### Certification Finding: **PASS**
All backend calculations, API payloads, and frontend components have been verified to use **Primary Legal Deliveries** for rate baselines and **High-Pressure Legal Deliveries** for sample evidence classification.

---

## 2. Definitional Comparison Matrix

| Exposure Dimension | Operational Definition | Operational Role in ClutchIQ | Example: Jasprit Bumrah | Example: Vaibhav Sooryavanshi |
| :--- | :--- | :--- | :---: | :---: |
| **1. Total Delivery Events** | All ball-by-ball records logged across raw datasets. | Master data ingestion logging. | 1,780 balls bowled | 714 balls faced |
| **2. Primary Scope Events** | All events within official IPL and Men's Senior T20I matches. | Competition scope gating. | 1,780 balls bowled | 612 balls faced |
| **3. Primary Legal Balls** | Fair deliveries (`is_legal_ball == True`) in primary scope. | **Universal Eligibility Filter** ($\ge 150$ balls) and Bayesian shrinkage sample size ($n_{\text{legal}}$). | **1,708 balls bowled** | **575 balls faced** |
| **4. V3 HP Legal Deliveries** | Fair deliveries where pre-delivery $\text{PI}_{\text{V3}} \ge 65.0$. | **Role-Specific Evidence Classification** (Batters: 150/40; Bowlers: 100/25). | **125 balls bowled** | **8 balls faced** |
| **5. V3 HP All Events** | All deliveries (including wides/no-balls) with $\text{PI}_{\text{V3}} \ge 65.0$. | Diagnostic leverage accounting. | 132 balls bowled | 8 balls faced |
| **6. V2 Legacy HP Balls** | Historical V2 deliveries with $\text{PI}_{\text{V2}} \ge 65.0$. | Archived baseline for model progression analysis. | 486 balls bowled | 1 ball faced |

---

## 3. Why V2 and V3 Exposure Counts Diverge

A key point of confusion in earlier audits was why bowler high-pressure delivery counts dropped drastically between V2 and V3 (e.g., Jasprit Bumrah dropping from 486 to 125 HP balls, and Mark Wood dropping from 113 to 27 HP balls).

### The Root Cause: Pre-Delivery Defense Difficulty Index ($\text{DDI}$)
1. **Flaw of V2 Bowler Pressure:**  
   V2 used a symmetrical formula that tied bowler pressure directly to batting leverage. If a batting team was chasing 10 rpo in the 14th over, V2 marked every delivery as "High Pressure" for the bowler, even if the bowling team had already secured 6 wickets and held an 85% win probability.
2. **Correction in V3:**  
   V3 introduces the **Defense Difficulty Index ($\text{DDI}$)**. High pressure for a bowler occurs strictly when:
   - Win probability volatility on the delivery is high ($\Delta \text{WP} > 0.08$).
   - The batting team has wickets in hand and par deficit is narrow.
   - Acute death overs risk exists (overs 17–20 with required run rate escalating).
3. **Result:**  
   Under V3, empty, low-leverage overs bowled when the match is effectively won are eliminated from the high-pressure count. This concentrates the sample into **genuine acute crisis deliveries**, establishing a far more rigorous standard of performance.

---

## 4. Frontend & API Label Verification

| Interface Location | Displayed Quantity | Exact Underlying Metric | Audit Status |
| :--- | :--- | :--- | :---: |
| **Leaderboard Table (Batters)** | `Total Balls` | Primary Legal Deliveries Faced | **PASS** |
| **Leaderboard Table (Batters)** | `Evidence Tier` | Stratified on V3 HP Legal Balls Faced ($\ge 150, 40\text{--}149, <40$) | **PASS** |
| **Leaderboard Table (Bowlers)** | `Total Balls` | Primary Legal Deliveries Bowled | **PASS** |
| **Leaderboard Table (Bowlers)** | `Evidence Tier` | Stratified on V3 HP Legal Balls Bowled ($\ge 100, 25\text{--}99, <25$) | **PASS** |
| **Player Dossier (Hero Card)** | `X / Y HP Balls` | $X = \text{V3 HP Legal Deliveries}$, $Y = \text{Primary Legal Deliveries}$ | **PASS** |
| **Methodology Documentation** | Tier Specifications | Explicitly documents the separate $150/40$ and $100/25$ HP thresholds | **PASS** |

