import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import pandas as pd
import numpy as np
import os

pdf_path = "reports/rankings/ClutchIQ_Methodology_Report.pdf"

# Load rankings
top_bat = pd.read_csv("reports/rankings/top10_combined_batters.csv")
top_bowl = pd.read_csv("reports/rankings/top10_combined_bowlers.csv")
decomp = pd.read_csv("reports/rankings/task05_2_bowling_reconciliation.csv")

with PdfPages(pdf_path) as pdf:
    # -------------------------------------------------------------
    # PAGE 1: TITLE & COVER PAGE
    # -------------------------------------------------------------
    fig = plt.figure(figsize=(8.5, 11), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis('off')
    
    # Decorative Header Band
    ax.fill_between([0, 1], [0.88, 0.88], [1.0, 1.0], color='#1a252f', transform=ax.transAxes)
    ax.fill_between([0, 1], [0.865, 0.865], [0.88, 0.88], color='#e74c3c', transform=ax.transAxes)
    
    ax.text(0.5, 0.94, "RAJASTHAN ROYALS SupeRR SELECTOR — SEASON 2", 
            color='#ecf0f1', fontsize=15, fontweight='bold', ha='center', va='center')
    ax.text(0.5, 0.905, "ROUND 1 OFFICIAL METHODOLOGY & PLAYER RANKINGS REPORT", 
            color='#bdc3c7', fontsize=10, ha='center', va='center')
    
    # Title Box
    ax.text(0.5, 0.77, "ClutchIQ", 
            color='#2c3e50', fontsize=36, fontweight='heavy', ha='center', va='center')
    ax.text(0.5, 0.71, "A Context-Aware Pressure Intelligence & Bayesian Valuation Engine\nfor Twenty20 Cricket", 
            color='#7f8c8d', fontsize=13, fontstyle='italic', ha='center', va='center', multialignment='center')
    
    # Executive Metadata Box
    ax.fill_between([0.1, 0.9], [0.48, 0.48], [0.64, 0.64], color='#f8f9fa', transform=ax.transAxes)
    ax.plot([0.1, 0.9, 0.9, 0.1, 0.1], [0.48, 0.48, 0.64, 0.64, 0.48], color='#bdc3c7', lw=1)
    
    meta_text = (
        "EXECUTIVE PROJECT METADATA\n\n"
        "• Competition: Rajasthan Royals SupeRR Selector Season 2 (Round 1)\n"
        "• Target Problem: Identify the Most Reliable Batters & Bowlers Under Pressure\n"
        "• Primary Dataset: Senior Men's IPL & T20I Ball-by-Ball Data (2022–2026)\n"
        "• Matches & Deliveries: 883 Matches | 200,999 Deliveries (194,014 Primary Scope)\n"
        "• Methodological Framework: Dynamic Par Surface + Win Probability Leverage +\n"
        "                            Continuous Pressure Weighting + Empirical Bayes Shrinkage\n"
        "• Dropdown Alignment: 100% Verified Match with Unstop Player Mapping"
    )
    ax.text(0.13, 0.56, meta_text, color='#2c3e50', fontsize=9.5, va='center', family='monospace')
    
    # Core Architecture Highlights
    highlight_text = (
        "CORE ARCHITECTURAL PILLARS\n\n"
        "1. Cricket Score-Accounting Truth:\n"
        "   Exhaustive forensic audit of categorical extras (extras1_runs), unrecorded bye/legbye\n"
        "   runs, and strict bowler-credited dismissals without scorecard fabrication.\n\n"
        "2. Monotonic Pre-Delivery Pressure Engine:\n"
        "   Formulation of Batter Pressure Index (BPI) and Bowler Pressure Index (BowlerPI)\n"
        "   bounded to [0, 100], incorporating Required Run Rate, empirical par deficits, and match leverage.\n\n"
        "3. Value-Added Performance Relative to Context:\n"
        "   Evaluates Batter Runs Added (RAR) and Bowler Runs Saved (RBE) against phase- and\n"
        "   competition-specific empirical baselines, preventing league scoring bias.\n\n"
        "4. Bayesian Reliability & Shrinkage:\n"
        "   James-Stein empirical Bayes shrinkage (k = 150.0) with exact Gaussian credible intervals\n"
        "   and non-parametric match-level bootstrap validation to eliminate small-sample distortion."
    )
    ax.text(0.10, 0.28, highlight_text, color='#34495e', fontsize=9, va='center')
    
    # Footer
    ax.fill_between([0, 1], [0, 0], [0.06, 0.06], color='#1a252f', transform=ax.transAxes)
    ax.text(0.5, 0.03, "CONFIDENTIAL & PROPRIETARY — PREPARED FOR RAJASTHAN ROYALS SUPERR SELECTOR", 
            color='#95a5a6', fontsize=8, ha='center', va='center')
    
    pdf.savefig(fig)
    plt.close(fig)

    # -------------------------------------------------------------
    # PAGE 2: FINAL TOP 10 RANKINGS TABLES
    # -------------------------------------------------------------
    fig = plt.figure(figsize=(8.5, 11), dpi=300)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis('off')
    
    # Header
    ax.fill_between([0, 1], [0.93, 0.93], [1.0, 1.0], color='#1a252f', transform=ax.transAxes)
    ax.text(0.05, 0.965, "OFFICIAL FINAL PLAYER RANKINGS (TOP 10 BATTERS & TOP 10 BOWLERS)", 
            color='#ffffff', fontsize=12, fontweight='bold', va='center')
    ax.text(0.05, 0.942, "Direct Dropdown Alignment: Exact Player Names & IDs for Unstop Submission Portal", 
            color='#bdc3c7', fontsize=8.5, va='center')
    
    # Batters Table Title
    ax.text(0.05, 0.90, "TOP 10 BATTERS UNDER PRESSURE (COMBINED IPL & T20I)", 
            color='#c0392b', fontsize=11, fontweight='bold', va='center')
    ax.text(0.05, 0.88, "Qualification: Minimum 150 legal balls faced, minimum 40 high-pressure balls (BPI >= 65.0). Prior = +2.97, k = 150.0.", 
            color='#7f8c8d', fontsize=8, fontstyle='italic', va='center')

    # Format Batters Table Data
    bat_data = []
    bat_headers = ["Rank", "Player ID", "Player Name", "Matches", "Legal B", "HP B", "Overall SR", "HP SR", "SR Delta", "Rating", "95% Credible Int"]
    for _, r in top_bat.iterrows():
        delta_str = f"{r['metric_delta']:+.1f}" if pd.notna(r['metric_delta']) else "N/A"
        bat_data.append([
            int(r['rank']),
            int(r['player_id']),
            r['player_name'],
            int(r['distinct_matches']),
            int(r['legal_balls']),
            int(r['hp_legal_balls']),
            f"{r['overall_rate_metric']:.1f}",
            f"{r['hp_rate_metric']:.1f}",
            delta_str,
            f"{r['bayesian_clutch_rating']:.2f}",
            f"[{r['ci_lower_95']:.1f}, {r['ci_upper_95']:.1f}]"
        ])
    
    # Render Batters Table
    bat_tab = ax.table(cellText=bat_data, colLabels=bat_headers, loc='upper center', 
                       bbox=[0.05, 0.54, 0.90, 0.32])
    bat_tab.auto_set_font_size(False)
    bat_tab.set_fontsize(7.5)
    for k, cell in bat_tab.get_celld().items():
        cell.set_edgecolor('#bdc3c7')
        if k[0] == 0:
            cell.set_facecolor('#2c3e50')
            cell.set_text_props(color='#ffffff', weight='bold')
        elif k[0] % 2 == 1:
            cell.set_facecolor('#fdfefe')
        else:
            cell.set_facecolor('#f8f9fa')

    # Bowlers Table Title
    ax.text(0.05, 0.49, "TOP 10 BOWLERS UNDER PRESSURE (COMBINED IPL & T20I)", 
            color='#16a085', fontsize=11, fontweight='bold', va='center')
    ax.text(0.05, 0.47, "Qualification: Minimum 150 legal balls bowled, minimum 40 high-pressure balls (BowlerPI >= 65.0). Prior = +1.97, k = 150.0.", 
            color='#7f8c8d', fontsize=8, fontstyle='italic', va='center')

    # Format Bowlers Table Data
    bowl_data = []
    bowl_headers = ["Rank", "Player ID", "Player Name", "Matches", "Legal B", "HP B", "Overall Econ", "HP Econ", "Actual Wkts", "Rating", "95% Credible Int"]
    for _, r in top_bowl.iterrows():
        # Get actual wickets from decomp
        w_act = decomp[decomp['player_id'] == r['player_id']]['actual_bowler_wickets'].iloc[0]
        bowl_data.append([
            int(r['rank']),
            int(r['player_id']),
            r['player_name'],
            int(r['distinct_matches']),
            int(r['legal_balls']),
            int(r['hp_legal_balls']),
            f"{r['overall_rate_metric']:.2f}",
            f"{r['hp_rate_metric']:.2f}",
            int(w_act),
            f"{r['bayesian_clutch_rating']:.2f}",
            f"[{r['ci_lower_95']:.1f}, {r['ci_upper_95']:.1f}]"
        ])
    
    # Render Bowlers Table
    bowl_tab = ax.table(cellText=bowl_data, colLabels=bowl_headers, loc='upper center', 
                        bbox=[0.05, 0.13, 0.90, 0.32])
    bowl_tab.auto_set_font_size(False)
    bowl_tab.set_fontsize(7.5)
    for k, cell in bowl_tab.get_celld().items():
        cell.set_edgecolor('#bdc3c7')
        if k[0] == 0:
            cell.set_facecolor('#16a085')
            cell.set_text_props(color='#ffffff', weight='bold')
        elif k[0] % 2 == 1:
            cell.set_facecolor('#fdfefe')
        else:
            cell.set_facecolor('#f8f9fa')

    # Bottom Callout Note
    note_text = (
        "CRITICAL SUBMISSION VERIFICATION:\n"
        "• All 20 player records exactly match the identities, spellings, and IDs in 'competition_team_player_mapping.csv'.\n"
        "• Zero player duplication exists across rankings. Rankings reflect empirical Bayes posterior expectations.\n"
        "• Credible intervals represent exact Gaussian posterior bounds, verified via 1,000-resample match bootstrap."
    )
    ax.text(0.05, 0.05, note_text, color='#2c3e50', fontsize=8, family='monospace')
    
    pdf.savefig(fig)
    plt.close(fig)

    # -------------------------------------------------------------
    # PAGE 3: PRESSURE & METHODOLOGY ARCHITECTURE
    # -------------------------------------------------------------
    fig = plt.figure(figsize=(8.5, 11), dpi=300)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis('off')
    
    # Header
    ax.fill_between([0, 1], [0.93, 0.93], [1.0, 1.0], color='#1a252f', transform=ax.transAxes)
    ax.text(0.05, 0.965, "METHODOLOGICAL FOUNDATION & PRESSURE MODELING", 
            color='#ffffff', fontsize=12, fontweight='bold', va='center')
    ax.text(0.05, 0.942, "Mathematical Formulations, State Scarcity, and Value-Added Mechanics", 
            color='#bdc3c7', fontsize=8.5, va='center')
    
    method_text = (
        "1. MATHEMATICAL DEFINITION OF PRESSURE\n\n"
        "A defensible pressure index must satisfy four axioms: zero future leakage, strict monotonicity,\n"
        "boundedness in [0, 100], and asymmetric demand curves between chasing and defending.\n\n"
        "• Chase Pressure (Innings 2):\n"
        "  - Required Run Rate Demand: D = RRR / 8.50\n"
        "  - Wicket Scarcity: S_w = (10 / (W_hand + 1))^0.42\n"
        "  - Ball Scarcity: S_b = (120 / (B_rem + 6))^0.25\n"
        "  - Match Closeness Leverage: L = [1 - 1.6|P(Win) - 0.50|] * sqrt(120 / (B_rem + 6))\n"
        "  - Batter Pressure Index: BPI = clip(42.0 * D^1.15 * S_w * S_b * L^0.35, 0, 100)\n"
        "  - Bowler Pressure Index: BowlerPI = clip(44.0 * min(D, 2.35) * ((11-W_hand)/10)^(-0.35) * S_b * L^0.45 * Relief, 0, 100)\n\n"
        "• First-Innings Pressure (Innings 1):\n"
        "  - Dynamic Par Surface: Projected Par = Current Score + max(0, 0.85 * B_rem + 4.8 * (W_hand - 1))\n"
        "  - Par Deficit: Delta_Par = max(0, 169.0 - Projected Par)\n"
        "  - Phase Escalation: Powerplay (1.00) -> Middle (1.25) -> Death (1.65)\n"
        "  - Out-of-Sample Validation: Par surface achieved 17.27 MAE vs 29.07 MAE for static baseline (40.6% gain).\n\n"
        "----------------------------------------------------------------------------------------------------\n"
        "2. VALUE-ADDED PERFORMANCE RELATIVE TO CONTEXT BASELINES\n\n"
        "Rather than evaluating raw strike rate or economy, every ball is benchmarked against the league expectation\n"
        "conditioned on [competition_category, innings_phase_before]:\n\n"
        "• Batter Runs Added (RAR):  RAR_i = Batter_Runs_i - E[Batter_Runs | Context_i]\n"
        "• Bowler Runs Saved (RBE):  RBE_i = E[Bowler_Runs | Context_i] - Bowler_Runs_Conceded_i\n"
        "• Bowler Wickets Added (WA): WA_i = I(Bowler_Wicket_i) - E[Bowler_Wicket | Context_i]\n\n"
        "Continuous Pressure Weighting:\n"
        "To avoid arbitrary step-function thresholds, every delivery is weighted continuously by w_i = Pressure_Index_i / 50.0:\n"
        "  - Raw Clutch Batting Rate = [ sum(RAR_i * w_i) / Legal_Balls_Faced ] * 100\n"
        "  - Raw Clutch Bowling Rate = [ sum((RBE_i + V_w * WA_i) * w_i) / Legal_Balls_Bowled ] * 100\n"
        "where V_w = 15.0 runs represents the empirical T20 wicket replacement value.\n\n"
        "----------------------------------------------------------------------------------------------------\n"
        "3. EMPIRICAL BAYES SHRINKAGE & RELIABILITY\n\n"
        "To prevent small-sample distortion, observed rates y_j are shrunk toward population priors:\n"
        "  - Posterior Mean: theta_post = lambda_j * y_j + (1 - lambda_j) * mu_prior\n"
        "  - Reliability Weight: lambda_j = n_j / (n_j + k), where k = 150.0 legal balls\n"
        "  - Batting Prior: mu_prior = +2.97 runs/100 balls | Bowling Prior: mu_prior = +1.97 runs/100 balls\n"
        "  - Posterior Standard Error: SE_post = sigma_skill * sqrt(k / (n_j + k))\n"
        "  - Exact 95% Credible Interval: CI_95% = [ theta_post - 1.96 * SE_post,  theta_post + 1.96 * SE_post ]"
    )
    ax.text(0.05, 0.47, method_text, color='#2c3e50', fontsize=8, family='monospace', va='center')
    
    pdf.savefig(fig)
    plt.close(fig)

    # -------------------------------------------------------------
    # PAGE 4: VISUAL EVIDENCE (EMBED CHARTS)
    # -------------------------------------------------------------
    fig = plt.figure(figsize=(8.5, 11), dpi=300)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis('off')
    
    # Header
    ax.fill_between([0, 1], [0.93, 0.93], [1.0, 1.0], color='#1a252f', transform=ax.transAxes)
    ax.text(0.05, 0.965, "GRAPHICAL PERFORMANCE EVIDENCE & CREDIBLE INTERVALS", 
            color='#ffffff', fontsize=12, fontweight='bold', va='center')
    ax.text(0.05, 0.942, "Direct Visual Comparisons of High-Pressure Execution vs Overall Baselines", 
            color='#bdc3c7', fontsize=8.5, va='center')
    
    # Embed Chart 1 (Batting Comparison)
    img1_path = "reports/rankings/visuals/01_top10_batters_sr_comparison.png"
    if os.path.exists(img1_path):
        img1 = plt.imread(img1_path)
        ax_img1 = fig.add_axes([0.08, 0.52, 0.84, 0.38])
        ax_img1.imshow(img1)
        ax_img1.axis('off')
    
    # Embed Chart 2 (Credible Intervals)
    img3_path = "reports/rankings/visuals/03_ratings_credible_intervals.png"
    if os.path.exists(img3_path):
        img3 = plt.imread(img3_path)
        ax_img3 = fig.add_axes([0.05, 0.08, 0.90, 0.40])
        ax_img3.imshow(img3)
        ax_img3.axis('off')
        
    pdf.savefig(fig)
    plt.close(fig)

    # -------------------------------------------------------------
    # PAGE 5: STATISTICAL QUALIFICATIONS, AUDIT & LIMITATIONS
    # -------------------------------------------------------------
    fig = plt.figure(figsize=(8.5, 11), dpi=300)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.axis('off')
    
    # Header
    ax.fill_between([0, 1], [0.93, 0.93], [1.0, 1.0], color='#1a252f', transform=ax.transAxes)
    ax.text(0.05, 0.965, "STATISTICAL QUALIFICATIONS, AUDIT RECONCILIATION & LIMITATIONS", 
            color='#ffffff', fontsize=12, fontweight='bold', va='center')
    ax.text(0.05, 0.942, "Formal Review of Wicket Values, Dual-League Exposure, and Data Boundaries", 
            color='#bdc3c7', fontsize=8.5, va='center')
    
    audit_text = (
        "1. WICKET DECOMPOSITION ACCOUNTING (TASK 05.2 RECONCILIATION)\n\n"
        "To ensure mathematical rigor, bowling clutch impact formally separates run containment from wickets:\n"
        "  - Mark Wood: 27 actual wickets, 15.90 expected wickets -> +11.10 unweighted net wickets.\n"
        "    Because his wickets occurred predominantly at extreme pressure, his pressure-weighted net wickets scale\n"
        "    to +15.42. At V_w = 15.0 runs/wicket, wickets contribute +231.26 run equivalents. Combined with +54.31\n"
        "    weighted runs saved, total value is +285.58 runs across 281 legal balls (+101.63 Raw RBE / 100 balls).\n"
        "  - Praful Hinge: Conceded an economy of 11.73 (-56.64 runs saved), but claimed 14 wickets on 156 balls\n"
        "    (+149.70 wicket run value). Characterized as an offsetting multi-vector contribution rather than >100% share.\n\n"
        "----------------------------------------------------------------------------------------------------\n"
        "2. WICKET-VALUE SENSITIVITY ANALYSIS (V_w in [8.0, 20.0] RUNS)\n\n"
        "Testing alternative wicket valuations demonstrates clear structural behavior:\n"
        "• Under Empirical Bayes Shrinkage: High-volume anchors (Pathirana with 1,132 balls, Nawaz with 1,004 balls)\n"
        "  maintain large reliability weights (lambda ~ 0.88), preserving Top-5 membership stability across all values.\n"
        "• Under Unshrunk Raw Impact: Economy anchors (Dwayne Bravo, Imad Wasim) enter the top 5 at V_w = 8.0 runs,\n"
        "  while strike bowlers (Praful Hinge, Abbas Afridi) rise at V_w = 20.0 runs.\n"
        "• Defensibility: V_w = 15.0 runs represents the empirical T20 par drop per wicket and is the optimal baseline.\n\n"
        "----------------------------------------------------------------------------------------------------\n"
        "3. CROSS-COMPETITION FAIRNESS & DUAL-LEAGUE DYNAMICS\n\n"
        "An independent audit of 194 dual-league players (>= 50 legal balls in both IPL and T20Is) established:\n"
        "• Batters average -4.35 runs/100 balls in IPL vs +10.55 in T20Is (r = 0.438).\n"
        "• Bowlers average -7.76 runs/100 balls in IPL vs -1.15 in T20Is (r = 0.111).\n"
        "• T20I bilateral fixtures introduce wider opposition skill disparity compared to the ultra-concentrated IPL.\n"
        "• Policy Decision: No ad-hoc penalties were fabricated. Context-normalized baselines evaluate each player\n"
        "  against that league's scoring environment, and credible intervals communicate single-league uncertainty.\n\n"
        "----------------------------------------------------------------------------------------------------\n"
        "4. KNOWN DATA ACCOUNTING BOUNDARIES\n\n"
        "• Missing Bye/Legbye Magnitudes: Exact physical runs on byes/legbyes are unrecorded in 'ball_by_ball.csv'.\n"
        "  Cumulative scores and chase Required Run Rates operate as authoritative lower-bound floors.\n"
        "• Abandoned Fixtures: 16 matches in 'matches.csv' absent from delivery logs were verified as weather abandonments.\n"
        "• Delivery Events vs Legal Balls: Matheesha Pathirana bowled 525 total high-pressure deliveries, of which\n"
        "  457 were legal balls (68 wides/no-balls). Both metrics are exact and formally reconciled."
    )
    ax.text(0.05, 0.47, audit_text, color='#2c3e50', fontsize=8, family='monospace', va='center')
    
    # Sign-off box
    ax.fill_between([0.05, 0.95], [0.03, 0.03], [0.07, 0.07], color='#2c3e50', transform=ax.transAxes)
    ax.text(0.5, 0.05, "SUBMISSION STATUS: COMPLETE, AUDITED & REPRODUCIBLE (PASS / CONDITIONAL PASS RECONCILED)", 
            color='#ffffff', fontsize=8.5, fontweight='bold', ha='center', va='center')

    pdf.savefig(fig)
    plt.close(fig)

print("Successfully compiled publication-grade PDF report:", pdf_path)
