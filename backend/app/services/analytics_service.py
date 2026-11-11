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
        
        # Eligible counts
        el_bat = int(ratings["is_eligible_for_ranking_batting"].sum())
        el_bowl = int(ratings["is_eligible_for_ranking_bowling"].sum())
        
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
        
        # Top 5 Batters
        top5_b = []
        for _, r in data_loader.top_combined_batters.head(5).iterrows():
            pid = int(r["player_id"])
            teams = list(data_loader.player_teams.get(pid, []))
            top5_b.append({
                "player_id": pid,
                "player_name": r["player_name"],
                "role": "BATTER",
                "clutch_rating": float(r["bayesian_clutch_rating"]),
                "high_pressure_metric": float(r["hp_rate_metric"]),
                "metric_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "legal_balls": int(r["legal_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "ci_lower": float(r["ci_lower_95"]),
                "ci_upper": float(r["ci_upper_95"]),
                "teams": teams[:2]
            })
            
        # Top 5 Bowlers
        top5_bw = []
        for _, r in data_loader.top_combined_bowlers.head(5).iterrows():
            pid = int(r["player_id"])
            teams = list(data_loader.player_teams.get(pid, []))
            top5_bw.append({
                "player_id": pid,
                "player_name": r["player_name"],
                "role": "BOWLER",
                "clutch_rating": float(r["bayesian_clutch_rating"]),
                "high_pressure_metric": float(r["hp_rate_metric"]),
                "metric_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "legal_balls": int(r["legal_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "ci_lower": float(r["ci_lower_95"]),
                "ci_upper": float(r["ci_upper_95"]),
                "teams": teams[:2]
            })
            
        # Competition Breakdown
        comp_breakdown = {
            "IPL": {
                "matches": 371,
                "deliveries": 87691,
                "avg_scoring_rate": 8.52,
                "top_batter": "Vipraj Nigam (24.55)",
                "top_bowler": "Mark Wood (97.60)"
            },
            "T20I": {
                "matches": 482,
                "deliveries": 106323,
                "avg_scoring_rate": 7.91,
                "top_batter": "Naman Dhir (70.33)",
                "top_bowler": "Deepak Hooda (86.73)"
            }
        }
        
        insights = [
            {
                "category": "BATTER_LEADERSHIP",
                "title": "Naman Dhir's Extreme Acceleration",
                "detail": "Naman Dhir accelerates from 158.74 SR to 206.08 under high pressure (+47.34 delta), leading all 180 eligible batters with a +33.34 rating.",
                "player_id": 37052
            },
            {
                "category": "VOLUME_RELIABILITY",
                "title": "Tim David's High-Pressure Diet",
                "detail": "Tim David faces the highest mean pressure index (60.10) with 33.8% of deliveries under high pressure, holding an elite 181.34 HP SR across 1,210 balls.",
                "player_id": 6396
            },
            {
                "category": "BOWLING_SUPREMACY",
                "title": "Mark Wood's Strike Enforcer Impact",
                "detail": "Mark Wood's +66.95 shrunk rating is powered by 27 wickets (14 at high pressure) while conceding an 8.18 economy, producing +101.63 raw runs saved/100 balls.",
                "player_id": 2985
            },
            {
                "category": "DEATH_CONTAINMENT",
                "title": "Pathirana's 40 High-Pressure Wickets",
                "detail": "Matheesha Pathirana leads world cricket with 457 high-pressure legal balls and 40 pressure wickets, generating +301.26 runs saved below expectation.",
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
