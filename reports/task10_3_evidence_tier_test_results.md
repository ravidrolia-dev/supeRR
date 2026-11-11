# TASK 10.3: AUTOMATED EVIDENCE TIER & EXPOSURE TEST RESULTS
**Platform:** ClutchIQ — Rajasthan Royals SupeRR Selector Season 2  
**Test Suite:** End-to-End Automated Verification of Evidence Tiers and HP Legal Delivery Counts  
**Result:** **100% PASSED (All Assertions Verified)**  
**Date:** November 2026  

---

## 1. Test Execution Summary

An automated validation suite was executed against the running backend API and frontend TypeScript classifier. The test suite validated:
1. Exact integer alignment of high-pressure legal delivery counts.
2. Prevention of delivery-event count leakage into evidence classification.
3. Accurate assignment of evidence tiers under role-specific boundaries.
4. Correctness of Haris Rauf boundary condition (99 legal balls $\to$ Moderate, 100 legal balls $\to$ Strong).

---

## 2. Automated Test Results Table

| Player Name | Player ID | Role | HP Legal Balls | HP Delivery Events | Expected Tier | Actual API Tier | Test Status |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **Mark Wood** | 2985 | Bowler | 27 | 28 | Moderate Direct Evidence (25-99 HP) | Moderate Direct Evidence (25-99 HP) | **PASS** |
| **Corbin Bosch** | 3629 | Bowler | 11 | 12 | Limited Direct Evidence (<25 HP) | Limited Direct Evidence (<25 HP) | **PASS** |
| **Sunil Narine** | 781 | Bowler | 51 | 55 | Moderate Direct Evidence (25-99 HP) | Moderate Direct Evidence (25-99 HP) | **PASS** |
| **Jasprit Bumrah**| 2933 | Bowler | 125 | 132 | Strong Direct Evidence (>=100 HP) | Strong Direct Evidence (>=100 HP) | **PASS** |
| **Haris Rauf** | 7364 | Bowler | 99 | 106 | Moderate Direct Evidence (25-99 HP) | Moderate Direct Evidence (25-99 HP) | **PASS** |
| *Synthetic Boundary Test* | 7364 | Bowler | 100 | N/A | Strong Direct Evidence (>=100 HP) | Strong Direct Evidence (>=100 HP) | **PASS** |

---

## 3. Detailed Boundary Condition Verification

### Case Audit: Haris Rauf (ID: 7364)
- **Legal High-Pressure Balls:** 99 deliveries.
- **Total High-Pressure Delivery Events (Including Wides & No-Balls):** 106 events.
- **Threshold Rule:**
  - Moderate Evidence: $25\text{--}99$ HP legal deliveries.
  - Strong Evidence: $\ge 100$ HP legal deliveries.
- **Verification:**  
  Because Haris Rauf bowled exactly **99 legal deliveries**, he is classified as **`Moderate Direct Evidence (25-99 HP)`**. If delivery events had been incorrectly substituted ($106$), he would have erroneously received "Strong Direct Evidence". The test confirms that no count substitution occurs in the API or UI.

### Case Audit: Mark Wood (ID: 2985)
- **Legal High-Pressure Balls:** 27 deliveries (Events: 28).
- **Threshold Rule:** $25\text{--}99$ HP legal deliveries.
- **Verification:**  
  With 27 legal deliveries, Wood is cleanly above the 25 HP threshold and properly classified as **`Moderate Direct Evidence (25-99 HP)`**.

---

## 4. Frontend & API Certification
- **FastAPI Endpoint `/api/rankings/superr10/bowlers`:** All 10 returned records output exact legal delivery counts and calibrated bowler tier strings.
- **Vite Production Build:** Compiled successfully with **0 errors and 0 warnings**.

