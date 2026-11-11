# Task 11.7: Dynamic Date, Status & Replacement Validation Protocol

**Verification Audit Framework:** Real-Time Contract & Deadline Synchronization  
**Regulatory Target:** BCCI IPL 2027 Player Registration & Retention Window  

---

## 1. Dynamic Date & Retention Status Engine

To ensure that time-sensitive auction data never becomes stale or misleads franchise decision-makers, all hardcoded dates and countdowns have been migrated to **dynamic system calculation**:

### Dynamic Parameters Handled:
1. **Current Audit Date:** Computed dynamically from the client system date (`new Date()`).
2. **Verified Official Retention Deadline:** Set to verified regulatory constant `2026-11-17T17:00:00+05:30` (November 17, 2026 at 17:00 IST). Updates to this deadline are accepted only upon official BCCI circular ratification.
3. **Dynamic Remaining Time:** Evaluated in real-time as `Math.ceil((deadline - currentTime) / (1000 * 60 * 60 * 24))` days / hours remaining.
4. **Last Successful Verification Timestamp:** Emits the exact UTC/ISO timestamp when the candidate eligibility dataset was reconciled against official IPL participation records.

---

## 2. Dynamic Replacement Rules & Succession Verification

| Trigger Event | Engine Behavior | Example Verification Test |
| :--- | :--- | :--- |
| **Parent Franchise Retains Target** | Target transitions from `CONDITIONAL_RETENTION_PENDING` to `RETAINED_UNAVAILABLE`. | If SRH retains Heinrich Klaasen, he is excluded from bidding and Nicholas Pooran / Prabhsimran Singh escalate to primary WK focus. |
| **Candidate Announces IPL Retirement** | Target transitions immediately to `IPL_RETIRED`. | Andre Russell declared retired; removed from all lists while preserving his 58.68 benchmark score. |
| **Overseas Slot Limit Reached** | Engine elevates Domestic Alternative Target for remaining roles. | If overseas slots are committed to Archer and Tim David, R1 death bowling shifts focus to Mohsin Khan over Nathan Ellis. |
| **Non-Role Rank Jumping Prevented** | Replacement strictly constrained to role-fit requirement matrix (R1–R5). | When a finisher becomes unavailable, the system does NOT substitute a higher-ranked opener (e.g. Priyansh Arya). |

---

## 3. Validation Checklist
- [x] Hardcoded strings replaced with dynamic `deadline`, `currentDate`, and `timeRemaining` calculations.
- [x] 16 conditional candidates organized into clean Batter (7) and Bowler (9) tabbed intelligence sub-views.
- [x] Role-specific alternative mappings defined across R1–R5 with verified eligibility statuses.
- [x] Dynamic replacement rationale documented and implemented.
- [x] Minimalist light UI design maintained with high-contrast text and clear status indicators.

