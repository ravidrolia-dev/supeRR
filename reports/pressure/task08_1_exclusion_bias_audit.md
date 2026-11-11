# TASK 08.1 — EXCLUSION BIAS AUDIT

## Executive Summary

An audit of the official ClutchIQ qualification threshold ($\ge 40$ high-pressure legal balls faced at $\text{BPI} \ge 65$) was conducted across all **1,257 players** and **200,999 deliveries** in the database.

The audit reveals a critical **Selection Blind Spot**:
- **59 high-volume batters** (facing $\ge 150$ total legal balls) and **36 high-volume bowlers** (bowling $\ge 150$ total legal balls) are completely excluded from the official clutch cohort.
- Among these excluded players are some of the most dominant early-innings players in T20 cricket, including **Vaibhav Sooryavanshi**, **Priyansh Arya**, **Travis Head**, **Jake Fraser-McGurk**, **Yashasvi Jaiswal**, and **Finn Allen**.
- These players are not "ineffective under pressure"; rather, their extreme scoring rates in the Powerplay ($\text{SR} > 180\text{--}220$) and rapid match resolution **actively prevent high-pressure situations from ever materializing**.

---

## 1. Case Study: Vaibhav Sooryavanshi

The dataset includes **Vaibhav Sooryavanshi** (`player_id: 50284`):
- **Matches Played:** 35 matches across IPL, T20Is, and Major T20 tournaments.
- **Total Legal Balls Faced:** 575 legal balls (612 total).
- **Total Runs Scored:** 1,509 runs at a staggering **Overall Strike Rate of 220.87**.
- **Powerplay Balls Faced:** 386 balls ($67.1\%$ of his total diet).
- **Powerplay Strike Rate:** **222.28** (858 runs off 386 balls, with $+300.44$ runs added above contextual expectation).
- **Mean Pressure Index Faced:** **33.68** (substantially below the neutral baseline of 50.0).
- **High-Pressure Balls Faced ($\text{BPI} \ge 65$):** **Only 1 delivery!**

### The Exclusion Paradox
Under the official ClutchIQ qualification rule, Vaibhav Sooryavanshi is flagged as `is_eligible_for_ranking_batting = False` because $1 < 40$. In official franchise reports, he is invisible on the clutch leaderboard despite being one of the most devastating match-winners in the database. When he bats in a chase, he slashes the required run rate by an average of **$-1.67$ RPO per match**, extinguishing match tension before the death overs.

---

## 2. The Excluded Top-Order Cohort

The following table summarizes prominent batters excluded solely due to the $< 40$ high-pressure ball requirement, despite facing substantial volume ($\ge 150$ balls) and maintaining elite early-innings strike rates:

| Player Name | Total Legal Balls | HP Balls Faced | Powerplay Balls | Powerplay Strike Rate | Powerplay Runs Added / 100 | Mean Pressure Faced | Official Clutch Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Vaibhav Sooryavanshi** | 575 | 1 | 386 | **222.28** | **+77.84** | 33.68 | Excluded ($<40$ HP) |
| **Priyansh Arya** | 469 | 0 | 353 | **192.07** | **+45.97** | 34.63 | Excluded ($<40$ HP) |
| **Ayush Mhatre** | 239 | 2 | 145 | **189.66** | **+43.76** | 39.15 | Excluded ($<40$ HP) |
| **Jake Fraser-McGurk** | 277 | 16 | 203 | **185.71** | **+44.67** | 34.21 | Excluded ($<40$ HP) |
| **Travis Head** | 1,120 | 7 | 859 | **181.61** | **+41.90** | 33.70 | Excluded ($<40$ HP) |
| **Ben Duckett** | 337 | 37 | 121 | **176.86** | **+49.74** | 39.78 | Excluded ($<40$ HP) |
| **Finn Allen** | 829 | 39 | 587 | **161.16** | **+25.35** | 34.04 | Excluded ($<40$ HP) |
| **Yashasvi Jaiswal** | 1,864 | 17 | 1,179 | **164.80** | **+17.98** | 33.81 | Excluded ($<40$ HP) |
| **Prabhsimran Singh** | 1,129 | 20 | 718 | **156.27** | **+18.42** | 37.87 | Excluded ($<40$ HP) |

---

## 3. Excluded Bowler Cohort

A parallel dynamic exists for opening and powerplay bowlers:
- **36 qualified volume bowlers** ($\ge 150$ balls bowled) have $< 40$ high-pressure deliveries.
- Examples include **Saqib Mahmood** (150 PP balls, 13 PP wkts, 7.84 econ, only 23 HP balls), **Wellington Masakadza** (126 PP balls, 7.24 econ), **Haider Ali** (108 PP balls, 5.50 econ), and **Kyle Klein** (102 PP balls, 10 PP wkts, 6.59 econ, only 18 HP balls).
- These bowlers take early wickets and choke powerplay scoring, allowing their teams to control matches from the outset without ever defending close death finishes.

---

## 4. Analytical Conclusion

1. **Failure of Monolithic Evaluation:** Relying solely on high-pressure performance creates an unintended penalty against dominant front-runners.
2. **Preservation of Methodology:** The 40 high-pressure ball threshold for *Clutch Rating* is statistically sound because measuring performance in clutch situations requires a sufficient clutch sample.
3. **The Multi-Dimensional Imperative:** Rather than lowering the clutch threshold (which would introduce statistical noise and false positives), ClutchIQ must introduce a distinct **Pressure Prevention Index (PPI)** to celebrate and evaluate front-running excellence independently.

