# TASK 10 — CLUTCHIQ PLATFORM-WIDE AUDIT REPORT

## 1. Executive Summary & Audit Mandate

This document provides a comprehensive, rigorous inventory of every frontend page, backend API route, database service, and analytical metric across ClutchIQ ahead of the platform-wide migration to the **Unified Pressure-First Scouting Methodology (70% V3 Pressure / 20% PPI Prevention / 10% Match Consistency)**.

---

## 2. Complete Frontend Routes & Pages Inventory

| Route | Page Component | File Path | Current Methodology / State | Identified Discrepancies & Stale References | Required Alignment Actions |
|---|---|---|---|---|---|
| `/` | `Overview` | `frontend/src/pages/Overview.tsx` | Displays V2/V3 top 5 cards and raw clutch ratings. | Uses stale V2 clutch metrics; no integrated score, no evidence tier badges. | Rebuild around SupeRR 10: top integrated scores, crisis leaders, prevention candidates, tier distribution. |
| `/batters` | `Batters` | `frontend/src/pages/Batters.tsx` | SupeRR 10 Batters (Task 09.6). | Recently aligned with 70/20/10; ensure API contract matches centralized service fields. | Standardize column field names to unified naming (`integrated_pressure_score`, etc.). |
| `/bowlers` | `Bowlers` | `frontend/src/pages/Bowlers.tsx` | SupeRR 10 Bowlers (Task 09.6). | Recently aligned with 70/20/10; ensure API contract matches centralized service fields. | Standardize column field names to unified naming. |
| `/players` | `PlayerExplorer` | `frontend/src/pages/PlayerExplorer.tsx` | Searchable directory and single player dossier. | Defaults to V2 clutch rating; dossier lacks 70/20/10 breakdown; uses old Category A/B/C labels. | Add integrated score filter; restructure dossier to 9-point structure with evidence tiers. |
| `/compare` | `PlayerComparison` | `frontend/src/pages/PlayerComparison.tsx` | Side-by-side player radar and metric table. | Compares raw V2 clutch ratings and delta strike rate; no integrated score or evidence tier. | Update radar and comparison cards to compare Integrated Score, Crisis, Prevention, and Consistency. |
| `/pressure` | `PressureIntelligence` | `frontend/src/pages/PressureIntelligence.tsx` | Ball-by-ball leverage and context curves. | Conflates pressure performance with prevention. | Redesign around the two core questions: Performance in Pressure vs Prevention of Pressure. |
| `/bowling-intelligence`| `BowlingIntelligence` | `frontend/src/pages/BowlingIntelligence.tsx` | Bowling decomposition and phase analysis. | Still references historical V2 decay formulation; lacks 70/20/10 defense difficulty insights. | Anchor in V3 defending total context ($\text{DDI}$) and early-over dot suppression. |
| `/methodology` | `Methodology` | `frontend/src/pages/Methodology.tsx` | Platform methodology documentation. | Explains historical V2 delivery decay and experimental V3/PPI toggles. | Full rewrite explaining 70/20/10 weights, Bayesian shrinkage, evidence tiers, and provisional status. |

---

## 3. Backend API Route Audit

| Endpoint | File | Current Behavior | Required Changes |
|---|---|---|---|
| `GET /api/overview` | `analytics_service.py` | Returns V2 KPIs and raw top 5. | Update to return 70/20/10 SupeRR 10 summaries, evidence tier breakdown, and data quality stats. |
| `GET /api/rankings/superr10/batters` | `api.py`, `ranking_service.py` | Returns top 10 batters. | Standardize schema with unified fields (`integrated_pressure_score`, `evidence_tier`, etc.). |
| `GET /api/rankings/superr10/bowlers` | `api.py`, `ranking_service.py` | Returns top 10 bowlers. | Standardize schema with unified fields. |
| `GET /api/players/search` | `player_service.py` | Searches players by name/id. | Include `integrated_pressure_score` and `evidence_tier` in search results. |
| `GET /api/players/{id}` | `player_service.py` | Returns single player profile. | Inject full 70/20/10 integrated breakdown, evidence tier, and component contributions. |
| `POST /api/compare` | `player_service.py` | Returns comparison payloads. | Enrich player comparison objects with unified 70/20/10 dimensions and evidence tiers. |
| `GET /api/pressure/intelligence` | `analytics_service.py` | Returns pressure distribution. | Clarify pressure performance vs prevention distinction. |
| `GET /api/bowling/intelligence` | `analytics_service.py` | Returns bowling decomposition. | Align with V3 DDI and prevention runs saved. |

---

## 4. Dependencies & Architecture Changes
1. **Centralized Datasets:**
   - Pre-computed full cohorts: `data/processed/unified_all_batters_70_20_10.csv` (239 batters) and `data/processed/unified_all_bowlers_70_20_10.csv` (258 bowlers).
2. **Standardized Schema:**
   - Unified field names across API, services, and frontend types.
3. **Evidence Tier Boundaries:**
   - Strong: $\ge 150$ HP balls.
   - Moderate: $40\text{--}149$ HP balls.
   - Limited: $< 40$ HP balls.

