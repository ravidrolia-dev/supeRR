from app.services.data_loader import data_loader
import pandas as pd
import numpy as np

class RankingService:
    @staticmethod
    def get_batters(competition: str = "combined"):
        comp = competition.lower()
        if comp == "ipl":
            df = data_loader.top_ipl_batters.copy()
        elif comp == "t20i":
            df = data_loader.top_t20i_batters.copy()
        else:
            df = data_loader.top_combined_batters.copy()
            
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams = data_loader.player_teams.get(pid, [])
            comps = data_loader.player_comps.get(pid, [])
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": list(teams[:3]) if len(teams) > 0 else [],
                "competitions": list(comps[:4]) if len(comps) > 0 else ["IPL", "T20I"],
                "legal_balls": int(r["legal_balls"]),
                "total_balls": int(r["total_balls"]),
                "hp_balls": int(r["hp_balls"]),
                "hp_legal_balls": int(r["hp_legal_balls"]),
                "high_pressure_balls": int(r["hp_legal_balls"]),
                "mean_pressure_index": float(r["mean_pressure_index"]),
                "overall_strike_rate": float(r["overall_rate_metric"]),
                "overall_rate_metric": float(r["overall_rate_metric"]),
                "hp_strike_rate": float(r["hp_rate_metric"]),
                "hp_rate_metric": float(r["hp_rate_metric"]),
                "lp_rate_metric": float(r["lp_rate_metric"]) if pd.notna(r.get("lp_rate_metric")) else None,
                "strike_rate_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "metric_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "raw_clutch_impact": float(r["raw_clutch_impact"]),
                "distinct_matches": int(r["distinct_matches"]),
                "match_impact_std": float(r["match_impact_std"]) if pd.notna(r.get("match_impact_std")) else None,
                "positive_match_pct": float(r["positive_match_pct"]) if pd.notna(r.get("positive_match_pct")) else None,
                "bayesian_clutch_rating": float(r["bayesian_clutch_rating"]),
                "posterior_se": float(r["posterior_se"]),
                "posterior_sd": float(r["posterior_se"]),
                "ci_lower_95": float(r["ci_lower_95"]),
                "ci_upper_95": float(r["ci_upper_95"]),
                "interval_type": str(r["interval_type"])
            })
        return items

    @staticmethod
    def get_bowlers(competition: str = "combined"):
        comp = competition.lower()
        if comp == "ipl":
            df = data_loader.top_ipl_bowlers.copy()
        elif comp == "t20i":
            df = data_loader.top_t20i_bowlers.copy()
        else:
            df = data_loader.top_combined_bowlers.copy()
            
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams = data_loader.player_teams.get(pid, [])
            comps = data_loader.player_comps.get(pid, [])
            
            # Lookup actual wickets from decomp if combined, or ratings
            act_w = 0
            match_d = data_loader.bowling_decomp[data_loader.bowling_decomp["player_id"] == pid]
            if len(match_d) > 0:
                act_w = int(match_d["actual_bowler_wickets"].iloc[0])
            else:
                p_r = data_loader.player_ratings[data_loader.player_ratings["player_id"] == pid]
                if len(p_r) > 0 and pd.notna(p_r["overall_wickets"].iloc[0]):
                    act_w = int(p_r["overall_wickets"].iloc[0])
                    
            hp_w = int(r.get("hp_wickets", 0)) if "hp_wickets" in r and pd.notna(r["hp_wickets"]) else 0
            
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": list(teams[:3]) if len(teams) > 0 else [],
                "competitions": list(comps[:4]) if len(comps) > 0 else ["IPL", "T20I"],
                "legal_balls": int(r["legal_balls"]),
                "total_balls": int(r["total_balls"]),
                "hp_balls": int(r["hp_balls"]),
                "hp_legal_balls": int(r["hp_legal_balls"]),
                "high_pressure_balls": int(r["hp_legal_balls"]),
                "mean_pressure_index": float(r["mean_pressure_index"]),
                "overall_economy": float(r["overall_rate_metric"]),
                "overall_rate_metric": float(r["overall_rate_metric"]),
                "hp_economy": float(r["hp_rate_metric"]),
                "hp_rate_metric": float(r["hp_rate_metric"]),
                "lp_rate_metric": float(r["lp_rate_metric"]) if pd.notna(r.get("lp_rate_metric")) else None,
                "economy_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "metric_delta": float(r["metric_delta"]) if pd.notna(r.get("metric_delta")) else None,
                "raw_clutch_impact": float(r["raw_clutch_impact"]),
                "distinct_matches": int(r["distinct_matches"]),
                "match_impact_std": float(r["match_impact_std"]) if pd.notna(r.get("match_impact_std")) else None,
                "positive_match_pct": float(r["positive_match_pct"]) if pd.notna(r.get("positive_match_pct")) else None,
                "bayesian_clutch_rating": float(r["bayesian_clutch_rating"]),
                "posterior_se": float(r["posterior_se"]),
                "posterior_sd": float(r["posterior_se"]),
                "ci_lower_95": float(r["ci_lower_95"]),
                "ci_upper_95": float(r["ci_upper_95"]),
                "interval_type": str(r["interval_type"]),
                "actual_wickets": act_w,
                "actual_bowler_wickets": act_w,
                "hp_wickets": hp_w
            })
        return items

ranking_service = RankingService()
