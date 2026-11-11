from app.services.data_loader import data_loader
import pandas as pd
import numpy as np

class RankingService:
    @staticmethod
    def get_batters(competition: str = "combined", version: str = "v3"):
        comp = competition.lower()
        v = version.lower()
        if v == "v2":
            if comp == "ipl":
                df = data_loader.top_ipl_batters.copy()
            elif comp == "t20i":
                df = data_loader.top_t20i_batters.copy()
            else:
                df = data_loader.top_combined_batters.copy()
        else: # Default v3
            if comp == "ipl":
                df = data_loader.top_ipl_batters_v3.copy()
            elif comp == "t20i":
                df = data_loader.top_t20i_batters_v3.copy()
            else:
                df = data_loader.top_combined_batters_v3.copy()
            
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
    def get_bowlers(competition: str = "combined", version: str = "v3"):
        comp = competition.lower()
        v = version.lower()
        if v == "v2":
            if comp == "ipl":
                df = data_loader.top_ipl_bowlers.copy()
            elif comp == "t20i":
                df = data_loader.top_t20i_bowlers.copy()
            else:
                df = data_loader.top_combined_bowlers.copy()
        else: # Default v3
            if comp == "ipl":
                df = data_loader.top_ipl_bowlers_v3.copy()
            elif comp == "t20i":
                df = data_loader.top_t20i_bowlers_v3.copy()
            else:
                df = data_loader.top_combined_bowlers_v3.copy()
            
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

    @staticmethod
    def get_prevention_batters():
        df = data_loader.top_prevention_batters.copy()
        items = []
        for _, r in df.iterrows():
            pid = int(r["striker_id"])
            teams = data_loader.player_teams.get(pid, [])
            comps = data_loader.player_comps.get(pid, [])
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": list(teams[:3]) if len(teams) > 0 else [],
                "competitions": list(comps[:4]) if len(comps) > 0 else ["IPL", "T20I"],
                "total_legal_balls": int(r["total_legal_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "early_mid_balls": int(r["early_mid_balls"]),
                "pp_balls": int(r["pp_balls"]),
                "pp_strike_rate": float(r["pp_sr"]),
                "pp_runs_added": float(r["pp_runs_added"]),
                "mid_balls": int(r["mid_balls"]),
                "mid_strike_rate": float(r["mid_sr"]),
                "raw_ppi": float(r["raw_ppi"]),
                "ppi_shrunk": float(r["ppi_shrunk"]),
                "chase_rrr_delta": float(r["chase_rrr_delta"]) if pd.notna(r.get("chase_rrr_delta")) else None,
                "chase_context_label": "Contextual Team Chase Impact"
            })
        return items

    @staticmethod
    def get_prevention_bowlers():
        df = data_loader.top_prevention_bowlers.copy()
        items = []
        for _, r in df.iterrows():
            pid = int(r["bowler_id"])
            teams = data_loader.player_teams.get(pid, [])
            comps = data_loader.player_comps.get(pid, [])
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": list(teams[:3]) if len(teams) > 0 else [],
                "competitions": list(comps[:4]) if len(comps) > 0 else ["IPL", "T20I"],
                "total_legal_balls": int(r["total_legal_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "early_mid_balls": int(r["early_mid_balls"]),
                "pp_balls": int(r["pp_balls"]),
                "pp_economy": float(r["pp_econ"]),
                "pp_runs_saved": float(r["pp_runs_saved"]),
                "pp_wickets": int(r["pp_wickets"]),
                "mid_balls": int(r["mid_balls"]),
                "mid_economy": float(r["mid_econ"]),
                "raw_ppi": float(r["raw_ppi"]),
                "ppi_shrunk": float(r["ppi_shrunk"]),
            })
        return items

    @staticmethod
    def get_superr10_batters():
        df = data_loader.superr10_batters.copy()
        if df.empty:
            return []
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams_str = str(r.get("teams", ""))
            teams_list = [t.strip() for t in teams_str.split(";") if t.strip()] if teams_str and teams_str != "nan" else []
            if not teams_list:
                teams_list = list(data_loader.player_teams.get(pid, []))[:3]
            comps = list(data_loader.player_comps.get(pid, []))[:4]
            items.append({
                "rank": int(r["superr_rank"]),
                "superr_rank": int(r["superr_rank"]),
                "v3_rank": int(r["v3_rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": teams_list,
                "competitions": comps if comps else ["IPL", "T20I"],
                "integrated_pressure_score": float(r["superr_score"]),
                "superr_score": float(r["superr_score"]),
                "pressure_performance_score": float(r["v3_clutch_rating"]),
                "v3_clutch_rating": float(r["v3_clutch_rating"]),
                "pressure_prevention_score": float(r["ppi_rating"]) if pd.notna(r.get("ppi_rating")) else None,
                "ppi_rating": float(r["ppi_rating"]) if pd.notna(r.get("ppi_rating")) else None,
                "consistency_score": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "consistency_pct": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "pressure_performance_contribution": float(r["clutch_contrib"]),
                "clutch_contribution": float(r["clutch_contrib"]),
                "pressure_prevention_contribution": float(r["ppi_contrib"]),
                "ppi_contribution": float(r["ppi_contrib"]),
                "consistency_contribution": float(r["cons_contrib"]),
                "total_legal_balls": int(r["legal_balls"]),
                "legal_balls": int(r["legal_balls"]),
                "high_pressure_legal_balls": int(r["hp_balls"]),
                "hp_balls": int(r["hp_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "evidence_tier": str(r.get("evidence_tier", "Moderate Direct Evidence (40-149 HP)")),
                "reliability": "Bayesian Shrunk (k=150)",
                "posterior_uncertainty": float(r["v3_posterior_se"]),
                "v3_posterior_se": float(r["v3_posterior_se"]),
                "ci_lower_95": float(r["v3_ci_lower_95"]),
                "v3_ci_lower_95": float(r["v3_ci_lower_95"]),
                "ci_upper_95": float(r["v3_ci_upper_95"]),
                "v3_ci_upper_95": float(r["v3_ci_upper_95"])
            })
        return items

    @staticmethod
    def get_superr10_bowlers():
        df = data_loader.superr10_bowlers.copy()
        if df.empty:
            return []
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams_str = str(r.get("teams", ""))
            teams_list = [t.strip() for t in teams_str.split(";") if t.strip()] if teams_str and teams_str != "nan" else []
            if not teams_list:
                teams_list = list(data_loader.player_teams.get(pid, []))[:3]
            comps = list(data_loader.player_comps.get(pid, []))[:4]
            items.append({
                "rank": int(r["superr_rank"]),
                "superr_rank": int(r["superr_rank"]),
                "v3_rank": int(r["v3_rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": teams_list,
                "competitions": comps if comps else ["IPL", "T20I"],
                "integrated_pressure_score": float(r["superr_score"]),
                "superr_score": float(r["superr_score"]),
                "pressure_performance_score": float(r["v3_clutch_rating"]),
                "v3_clutch_rating": float(r["v3_clutch_rating"]),
                "pressure_prevention_score": float(r["ppi_rating"]) if pd.notna(r.get("ppi_rating")) else None,
                "ppi_rating": float(r["ppi_rating"]) if pd.notna(r.get("ppi_rating")) else None,
                "consistency_score": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "consistency_pct": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "pressure_performance_contribution": float(r["clutch_contrib"]),
                "clutch_contribution": float(r["clutch_contrib"]),
                "pressure_prevention_contribution": float(r["ppi_contrib"]),
                "ppi_contribution": float(r["ppi_contrib"]),
                "consistency_contribution": float(r["cons_contrib"]),
                "total_legal_balls": int(r["legal_balls"]),
                "legal_balls": int(r["legal_balls"]),
                "high_pressure_legal_balls": int(r["hp_balls"]),
                "hp_balls": int(r["hp_balls"]),
                "distinct_matches": int(r["distinct_matches"]),
                "evidence_tier": str(r.get("evidence_tier", "Moderate Direct Evidence (40-149 HP)")),
                "reliability": "Bayesian Shrunk (k=150)",
                "posterior_uncertainty": float(r["v3_posterior_se"]),
                "v3_posterior_se": float(r["v3_posterior_se"]),
                "ci_lower_95": float(r["v3_ci_lower_95"]),
                "v3_ci_lower_95": float(r["v3_ci_lower_95"]),
                "ci_upper_95": float(r["v3_ci_upper_95"]),
                "v3_ci_upper_95": float(r["v3_ci_upper_95"])
            })
        return items

    @staticmethod
    def get_integrated_batters(limit: int = 25):
        df = data_loader.unified_batters.copy()
        if df.empty:
            return []
        if limit and limit > 0:
            df = df.head(limit)
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams_str = str(r.get("teams", ""))
            teams_list = [t.strip() for t in teams_str.split(";") if t.strip()] if teams_str and teams_str != "nan" else []
            if not teams_list:
                teams_list = list(data_loader.player_teams.get(pid, []))[:3]
            comps = list(data_loader.player_comps.get(pid, []))[:4]
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": teams_list,
                "competitions": comps if comps else ["IPL", "T20I"],
                "iss_score": float(r["iss_score"]),
                "clutch_contribution": float(r["clutch_contribution"]),
                "prevention_contribution": float(r["prevention_contribution"]),
                "consistency_contribution": float(r["consistency_contribution"]),
                "v3_clutch_rating": float(r["v3_clutch_rating"]) if pd.notna(r.get("v3_clutch_rating")) else None,
                "ppi_prevention_rating": float(r["ppi_prevention_rating"]) if pd.notna(r.get("ppi_prevention_rating")) else None,
                "consistency_pct": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "legal_balls": int(r["legal_balls"]),
                "hp_balls": int(r["hp_balls"]) if pd.notna(r.get("hp_balls")) else 0,
                "distinct_matches": int(r["distinct_matches"]) if pd.notna(r.get("distinct_matches")) else 0,
                "evidence_tier": str(r["evidence_tier"]),
                "category": str(r.get("category", r["evidence_tier"]))
            })
        return items

    @staticmethod
    def get_integrated_bowlers(limit: int = 25):
        df = data_loader.unified_bowlers.copy()
        if df.empty:
            return []
        if limit and limit > 0:
            df = df.head(limit)
        items = []
        for _, r in df.iterrows():
            pid = int(r["player_id"])
            teams_str = str(r.get("teams", ""))
            teams_list = [t.strip() for t in teams_str.split(";") if t.strip()] if teams_str and teams_str != "nan" else []
            if not teams_list:
                teams_list = list(data_loader.player_teams.get(pid, []))[:3]
            comps = list(data_loader.player_comps.get(pid, []))[:4]
            items.append({
                "rank": int(r["rank"]),
                "player_id": pid,
                "player_name": r["player_name"],
                "teams": teams_list,
                "competitions": comps if comps else ["IPL", "T20I"],
                "iss_score": float(r["iss_score"]),
                "clutch_contribution": float(r["clutch_contribution"]),
                "prevention_contribution": float(r["prevention_contribution"]),
                "consistency_contribution": float(r["consistency_contribution"]),
                "v3_clutch_rating": float(r["v3_clutch_rating"]) if pd.notna(r.get("v3_clutch_rating")) else None,
                "ppi_prevention_rating": float(r["ppi_prevention_rating"]) if pd.notna(r.get("ppi_prevention_rating")) else None,
                "consistency_pct": float(r["consistency_pct"]) if pd.notna(r.get("consistency_pct")) else None,
                "legal_balls": int(r["legal_balls"]),
                "hp_balls": int(r["hp_balls"]) if pd.notna(r.get("hp_balls")) else 0,
                "distinct_matches": int(r["distinct_matches"]) if pd.notna(r.get("distinct_matches")) else 0,
                "evidence_tier": str(r["evidence_tier"]),
                "category": str(r.get("category", r["evidence_tier"]))
            })
        return items

ranking_service = RankingService()
