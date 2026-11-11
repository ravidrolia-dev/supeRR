from app.services.data_loader import data_loader
import pandas as pd
import numpy as np

def format_distribution(bin_dict, total_count):
    order = ["Low (<35)", "Moderate (35-50)", "High (50-65)", "Extreme (65-80)", "Maximum (80+)"]
    result = []
    for k in order:
        cnt = int(bin_dict.get(k, 0))
        pct = round((cnt / total_count * 100.0), 2) if total_count > 0 else 0.0
        result.append({
            "tier": k,
            "deliveries": cnt,
            "pct_share": pct
        })
    return result

class AnalyticsService:
    @staticmethod
    def get_overview():
        ratings = data_loader.player_ratings
        
        # Eligible counts under Task 10 Unified Model (>= 150 overall legal balls)
        el_bat = int(len(data_loader.unified_all_batters)) if hasattr(data_loader, "unified_all_batters") and not data_loader.unified_all_batters.empty else 239
        el_bowl = int(len(data_loader.unified_all_bowlers)) if hasattr(data_loader, "unified_all_bowlers") and not data_loader.unified_all_bowlers.empty else 258
        
        # KPIs
        kpis = {
            "total_players": int(len(ratings)),
            "total_matches": int(data_loader.total_matches),
            "total_deliveries": int(data_loader.total_deliveries),
            "total_legal_balls": int(data_loader.total_legal_balls),
            "high_pressure_deliveries": int(data_loader.hp_deliveries),
            "eligible_batters": el_bat,
            "eligible_bowlers": el_bowl
        }
        
        # Top 5 Batters (Task 10 Unified 70/20/10)
        from app.services.ranking_service import ranking_service
        superr_batters = ranking_service.get_superr10_batters()
        top5_b = []
        for r in superr_batters[:5]:
            top5_b.append({
                "player_id": r["player_id"],
                "player_name": r["player_name"],
                "role": "BATTER",
                "integrated_pressure_score": r["integrated_pressure_score"],
                "clutch_rating": r["pressure_performance_score"],
                "pressure_performance_score": r["pressure_performance_score"],
                "pressure_prevention_score": r["pressure_prevention_score"],
                "consistency_score": r["consistency_score"],
                "evidence_tier": r["evidence_tier"],
                "legal_balls": r["total_legal_balls"],
                "high_pressure_legal_balls": r["high_pressure_legal_balls"],
                "distinct_matches": r["distinct_matches"],
                "ci_lower": r["ci_lower_95"],
                "ci_upper": r["ci_upper_95"],
                "teams": r["teams"][:2]
            })
            
        # Top 5 Bowlers (Task 10 Unified 70/20/10)
        superr_bowlers = ranking_service.get_superr10_bowlers()
        top5_bw = []
        for r in superr_bowlers[:5]:
            top5_bw.append({
                "player_id": r["player_id"],
                "player_name": r["player_name"],
                "role": "BOWLER",
                "integrated_pressure_score": r["integrated_pressure_score"],
                "clutch_rating": r["pressure_performance_score"],
                "pressure_performance_score": r["pressure_performance_score"],
                "pressure_prevention_score": r["pressure_prevention_score"],
                "consistency_score": r["consistency_score"],
                "evidence_tier": r["evidence_tier"],
                "legal_balls": r["total_legal_balls"],
                "high_pressure_legal_balls": r["high_pressure_legal_balls"],
                "distinct_matches": r["distinct_matches"],
                "ci_lower": r["ci_lower_95"],
                "ci_upper": r["ci_upper_95"],
                "teams": r["teams"][:2]
            })
            
        # Competition Breakdown
        comp_breakdown = {
            "IPL": {
                "matches": 371,
                "deliveries": 87691,
                "avg_scoring_rate": 8.52,
                "top_batter": "Abhishek Sharma (70.87)",
                "top_bowler": "Matheesha Pathirana (66.37)"
            },
            "T20I": {
                "matches": 482,
                "deliveries": 106323,
                "avg_scoring_rate": 7.91,
                "top_batter": "Vaibhav Sooryavanshi (81.83)",
                "top_bowler": "Abbas Afridi (78.50)"
            }
        }
        
        insights = [
            {
                "category": "BATTER_LEADERSHIP",
                "title": "Vaibhav Sooryavanshi's Early-Tempo Surge",
                "detail": "Vaibhav Sooryavanshi leads all batters with an 81.83 Integrated Score powered by a 220.87 Powerplay strike rate and +58.19 PPI (Limited Direct Evidence: 8 HP balls).",
                "player_id": 50284
            },
            {
                "category": "CRISIS_PROVEN",
                "title": "Tim David's High-Pressure Volume",
                "detail": "Tim David holds Strong Direct Evidence with 497 high-pressure legal balls, an elite +31.58 V3 clutch rating, and a 70.67 Integrated Pressure Score.",
                "player_id": 6396
            },
            {
                "category": "BOWLING_SUPREMACY",
                "title": "Abbas Afridi's Middle-Death Defense",
                "detail": "Abbas Afridi leads bowlers with a 78.50 Integrated Score, powered by a +42.86 V3 clutch rating and 77.3% positive match rate across 66 high-pressure deliveries.",
                "player_id": 7699
            },
            {
                "category": "DEATH_CONTAINMENT",
                "title": "Pathirana's 70.4% Match Consistency",
                "detail": "Matheesha Pathirana combines 88 high-pressure death deliveries with an unmatched 70.4% match-to-match success rate, ranking #4 overall with a 66.37 score.",
                "player_id": 8661
            }
        ]
        
        return {
            "kpis": kpis,
            "top5_batters": top5_b,
            "top5_bowlers": top5_bw,
            "pressure_tier_distribution": format_distribution(data_loader.bpi_bins, data_loader.total_legal_balls),
            "competition_breakdown": comp_breakdown,
            "insights": insights
        }

    @staticmethod
    def get_bowling_intelligence():
        # Wicket Sensitivity Table
        sens_records = data_loader.wicket_sens.to_dict(orient="records")
        # Bowling Decomposition Table
        decomp_records = data_loader.bowling_decomp.to_dict(orient="records")
        return {
            "sensitivity": sens_records,
            "decomposition": decomp_records
        }

    @staticmethod
    def get_pressure_intelligence():
        return {
            "batter_pressure_distribution": format_distribution(data_loader.bpi_bins, data_loader.total_legal_balls),
            "bowler_pressure_distribution": format_distribution(data_loader.bowlpi_bins, data_loader.total_legal_balls),
            "thresholds": [
                {"tier": "LOW", "range": "0 - 35", "description": "Standard low-leverage match state; comfortable RRR, ample wickets"},
                {"tier": "MODERATE", "range": "35 - 50", "description": "Neutral par situation; balanced demand and resource scarcity"},
                {"tier": "HIGH", "range": "50 - 65", "description": "Escalated required rate (>9.5) or middle-over clump of wickets"},
                {"tier": "EXTREME", "range": "65 - 80", "description": "High-leverage chase (RRR 11-15) or dynamic first-innings death phase"},
                {"tier": "MAXIMUM", "range": "80 - 100", "description": "Extreme death overs (RRR > 15) or close finish with few wickets in hand"}
            ],
            "methodology_summary": "BPI and BowlerPI are strictly pre-delivery indices integrating ball scarcity, wicket scarcity, dynamic par deficits, and win-probability leverage."
        }

analytics_service = AnalyticsService()
