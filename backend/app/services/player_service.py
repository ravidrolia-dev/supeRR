from app.services.data_loader import data_loader
import pandas as pd
import numpy as np

def clean_val(v):
    if v is None:
        return None
    if isinstance(v, (bool, np.bool_)):
        return bool(v)
    if isinstance(v, (float, np.floating)):
        if np.isnan(v) or np.isinf(v):
            return None
        return float(v)
    if isinstance(v, (int, np.integer)):
        return int(v)
    if pd.isna(v):
        return None
    return str(v) if not isinstance(v, (list, dict)) else v

def clean_dict(d):
    return {k: clean_val(v) for k, v in d.items()}

class PlayerService:
    @staticmethod
    def search_players(query: str, limit: int = 20):
        q = str(query).lower().strip()
        ratings = data_loader.player_ratings
        
        # Check by name or id
        if q.isdigit():
            matches = ratings[ratings["player_id"] == int(q)]
        else:
            matches = ratings[ratings["player_name"].str.lower().str.contains(q, na=False)]
            
        results = []
        for _, r in matches.head(limit).iterrows():
            pid = int(r["player_id"])
            teams = data_loader.player_teams.get(pid, [])
            
            # Check unified records
            u_bat = data_loader.unified_all_batters[data_loader.unified_all_batters["player_id"] == pid]
            u_bowl = data_loader.unified_all_bowlers[data_loader.unified_all_bowlers["player_id"] == pid]
            
            bat_score = float(u_bat["integrated_pressure_score"].iloc[0]) if len(u_bat) > 0 else None
            bat_tier = str(u_bat["evidence_tier"].iloc[0]) if len(u_bat) > 0 else None
            bowl_score = float(u_bowl["integrated_pressure_score"].iloc[0]) if len(u_bowl) > 0 else None
            bowl_tier = str(u_bowl["evidence_tier"].iloc[0]) if len(u_bowl) > 0 else None
            
            res = {
                "player_id": pid,
                "player_name": str(r["player_name"]),
                "batting_type": clean_val(r.get("batting_type")),
                "bowling_type": clean_val(r.get("bowling_type")),
                "pace_or_spin": clean_val(r.get("pace_or_spin")),
                "batting_eligible": bool(r.get("is_eligible_for_ranking_batting", False)) or (bat_score is not None),
                "bowling_eligible": bool(r.get("is_eligible_for_ranking_bowling", False)) or (bowl_score is not None),
                "integrated_pressure_score_batting": bat_score,
                "evidence_tier_batting": bat_tier,
                "integrated_pressure_score_bowling": bowl_score,
                "evidence_tier_bowling": bowl_tier,
                "batting_rating": clean_val(r.get("batting_clutch_shrunk_rating")) if bool(r.get("is_eligible_for_ranking_batting", False)) else None,
                "bowling_rating": clean_val(r.get("bowling_clutch_shrunk_rating")) if bool(r.get("is_eligible_for_ranking_bowling", False)) else None,
                "teams": list(teams[:3]) if len(teams) > 0 else []
            }
            results.append(res)
        return results

    @staticmethod
    def get_player_profile(player_id: int):
        ratings = data_loader.player_ratings
        p_match = ratings[ratings["player_id"] == player_id]
        if len(p_match) == 0:
            return None
        r = p_match.iloc[0]
        
        pid = int(r["player_id"])
        teams = list(data_loader.player_teams.get(pid, []))
        comps = list(data_loader.player_comps.get(pid, []))
        
        # Phase Breakdown
        phase_list = []
        b_ph = data_loader.bat_phase[data_loader.bat_phase["striker_id"] == pid]
        bw_ph = data_loader.bowl_phase[data_loader.bowl_phase["bowler_id"] == pid]
        
        all_phases = ["Powerplay", "Middle", "Death", "SuperOver"]
        for ph in all_phases:
            b_row = b_ph[b_ph["innings_phase_before"] == ph]
            bw_row = bw_ph[bw_ph["innings_phase_before"] == ph]
            
            p_dict = {"phase": ph}
            if len(b_row) > 0:
                b_l = int(b_row["balls"].iloc[0])
                b_r = int(b_row["runs"].iloc[0])
                p_dict["batting_balls"] = b_l
                p_dict["batting_runs"] = b_r
                p_dict["batting_sr"] = round((b_r / b_l) * 100.0, 2) if b_l > 0 else None
                p_dict["batting_hp_balls"] = int(b_row["hp_balls"].iloc[0])
                p_dict["batting_rar"] = round((float(b_row["w_rar"].iloc[0]) / b_l) * 100.0, 2) if b_l > 0 else None
            if len(bw_row) > 0:
                bw_l = int(bw_row["balls"].iloc[0])
                bw_r = int(bw_row["runs_c"].iloc[0])
                bw_w = int(bw_row["wkts"].iloc[0])
                p_dict["bowling_balls"] = bw_l
                p_dict["bowling_runs"] = bw_r
                p_dict["bowling_wickets"] = bw_w
                p_dict["bowling_econ"] = round((bw_r / bw_l) * 6.0, 2) if bw_l > 0 else None
                p_dict["bowling_hp_balls"] = int(bw_row["hp_balls"].iloc[0])
                tot_val = float(bw_row["w_rbe"].iloc[0]) + float(bw_row["w_wkt"].iloc[0]) * 15.0
                p_dict["bowling_rbe"] = round((tot_val / bw_l) * 100.0, 2) if bw_l > 0 else None
                
            if "batting_balls" in p_dict or "bowling_balls" in p_dict:
                phase_list.append(clean_dict(p_dict))
                
        # Comp Breakdown
        comp_list = []
        b_c = data_loader.bat_comp[data_loader.bat_comp["striker_id"] == pid]
        bw_c = data_loader.bowl_comp[data_loader.bowl_comp["bowler_id"] == pid]
        for c_cat in ["IPL", "T20I"]:
            c_dict = {"competition": c_cat}
            b_row = b_c[b_c["competition_category"] == c_cat]
            bw_row = bw_c[bw_c["competition_category"] == c_cat]
            if len(b_row) > 0:
                b_l = int(b_row["balls"].iloc[0])
                b_r = int(b_row["runs"].iloc[0])
                c_dict["batting_balls"] = b_l
                c_dict["batting_runs"] = b_r
                c_dict["batting_sr"] = round((b_r / b_l) * 100.0, 2) if b_l > 0 else None
                c_dict["batting_hp_balls"] = int(b_row["hp_balls"].iloc[0])
                c_dict["batting_rar"] = round((float(b_row["w_rar"].iloc[0]) / b_l) * 100.0, 2) if b_l > 0 else None
            if len(bw_row) > 0:
                bw_l = int(bw_row["balls"].iloc[0])
                bw_r = int(bw_row["runs_c"].iloc[0])
                bw_w = int(bw_row["wkts"].iloc[0])
                c_dict["bowling_balls"] = bw_l
                c_dict["bowling_runs"] = bw_r
                c_dict["bowling_wickets"] = bw_w
                c_dict["bowling_econ"] = round((bw_r / bw_l) * 6.0, 2) if bw_l > 0 else None
                c_dict["bowling_hp_balls"] = int(bw_row["hp_balls"].iloc[0])
                tot_val = float(bw_row["w_rbe"].iloc[0]) + float(bw_row["w_wkt"].iloc[0]) * 15.0
                c_dict["bowling_rbe"] = round((tot_val / bw_l) * 100.0, 2) if bw_l > 0 else None
            if "batting_balls" in c_dict or "bowling_balls" in c_dict:
                comp_list.append(clean_dict(c_dict))

        has_bat = bool(pd.notna(r.get("legal_balls_faced")) and r.get("legal_balls_faced", 0) > 0)
        has_bowl = bool(pd.notna(r.get("legal_balls_bowled")) and r.get("legal_balls_bowled", 0) > 0)
        bat_eligible = bool(r.get("is_eligible_for_ranking_batting", False))
        bowl_eligible = bool(r.get("is_eligible_for_ranking_bowling", False))
        
        # Pull distinct HP legal balls from rankings if available
        hp_legal_faced = clean_val(r.get("high_pressure_balls_batting"))
        hp_legal_bowled = clean_val(r.get("high_pressure_balls_bowling"))
        
        # Check top combined tables for exact hp_legal_balls count
        m_b = data_loader.top_combined_batters[data_loader.top_combined_batters["player_id"] == pid]
        if len(m_b) > 0:
            hp_legal_faced = int(m_b["hp_legal_balls"].iloc[0])
            
        m_bw = data_loader.top_combined_bowlers[data_loader.top_combined_bowlers["player_id"] == pid]
        if len(m_bw) > 0:
            hp_legal_bowled = int(m_bw["hp_legal_balls"].iloc[0])

        # Pull multi-dimensional category and PPI information
        cat_row = data_loader.player_categories[data_loader.player_categories["player_id"] == pid]
        bat_cat = str(cat_row["batting_category"].iloc[0]) if len(cat_row) > 0 and pd.notna(cat_row["batting_category"].iloc[0]) else "Category C: Insufficient Evidence"
        bowl_cat = str(cat_row["bowling_category"].iloc[0]) if len(cat_row) > 0 and pd.notna(cat_row["bowling_category"].iloc[0]) else "Category C: Insufficient Evidence"

        ppi_row = data_loader.player_ppi[data_loader.player_ppi["player_id"] == pid]
        bat_ppi_shrunk = float(ppi_row["batter_ppi_shrunk"].iloc[0]) if len(ppi_row) > 0 and pd.notna(ppi_row["batter_ppi_shrunk"].iloc[0]) else None
        bowl_ppi_shrunk = float(ppi_row["bowler_ppi_shrunk"].iloc[0]) if len(ppi_row) > 0 and pd.notna(ppi_row["bowler_ppi_shrunk"].iloc[0]) else None
        pp_rar = float(ppi_row["pp_rar_per_100"].iloc[0]) if len(ppi_row) > 0 and pd.notna(ppi_row["pp_rar_per_100"].iloc[0]) else None
        em_rar = float(ppi_row["early_mid_rar_per_100"].iloc[0]) if len(ppi_row) > 0 and pd.notna(ppi_row["early_mid_rar_per_100"].iloc[0]) else None
        chase_delta = float(ppi_row["mean_chase_rrr_delta"].iloc[0]) if len(ppi_row) > 0 and pd.notna(ppi_row["mean_chase_rrr_delta"].iloc[0]) else None

        # V3 ratings lookup
        v3_row = data_loader.player_ratings_v3[data_loader.player_ratings_v3["player_id"] == pid]
        bat_v3_rating = float(v3_row["batting_clutch_shrunk_rating"].iloc[0]) if len(v3_row) > 0 and pd.notna(v3_row["batting_clutch_shrunk_rating"].iloc[0]) and bat_eligible else None
        bowl_v3_rating = float(v3_row["bowling_clutch_shrunk_rating"].iloc[0]) if len(v3_row) > 0 and pd.notna(v3_row["bowling_clutch_shrunk_rating"].iloc[0]) and bowl_eligible else None
        v3_hp_bat = int(v3_row["high_pressure_balls_batting"].iloc[0]) if len(v3_row) > 0 and pd.notna(v3_row["high_pressure_balls_batting"].iloc[0]) else None
        v3_hp_bowl = int(v3_row["high_pressure_balls_bowling"].iloc[0]) if len(v3_row) > 0 and pd.notna(v3_row["high_pressure_balls_bowling"].iloc[0]) else None

        # Task 10: Unified 70/20/10 Integrated Score Lookup
        u_bat = data_loader.unified_all_batters[data_loader.unified_all_batters["player_id"] == pid]
        u_bowl = data_loader.unified_all_bowlers[data_loader.unified_all_bowlers["player_id"] == pid]

        integrated_bat = None
        if len(u_bat) > 0:
            b_row = u_bat.iloc[0]
            integrated_bat = {
                "integrated_pressure_score": float(b_row["integrated_pressure_score"]),
                "pressure_performance_score": float(b_row["pressure_performance_score"]),
                "pressure_prevention_score": float(b_row["pressure_prevention_score"]) if pd.notna(b_row["pressure_prevention_score"]) else None,
                "consistency_score": float(b_row["consistency_score"]) if pd.notna(b_row["consistency_score"]) else None,
                "pressure_performance_contribution": float(b_row["pressure_performance_contribution"]),
                "pressure_prevention_contribution": float(b_row["pressure_prevention_contribution"]),
                "consistency_contribution": float(b_row["consistency_contribution"]),
                "evidence_tier": str(b_row["evidence_tier"]),
                "reliability": "Bayesian Shrunk (k=150)",
                "posterior_uncertainty": float(b_row["posterior_uncertainty"]),
                "ci_lower_95": float(b_row["ci_lower_95"]),
                "ci_upper_95": float(b_row["ci_upper_95"]),
                "total_legal_balls": int(b_row["total_legal_balls"]),
                "high_pressure_legal_balls": int(b_row["high_pressure_legal_balls"]),
                "distinct_matches": int(b_row["distinct_matches"])
            }

        integrated_bowl = None
        if len(u_bowl) > 0:
            bw_row = u_bowl.iloc[0]
            integrated_bowl = {
                "integrated_pressure_score": float(bw_row["integrated_pressure_score"]),
                "pressure_performance_score": float(bw_row["pressure_performance_score"]),
                "pressure_prevention_score": float(bw_row["pressure_prevention_score"]) if pd.notna(bw_row["pressure_prevention_score"]) else None,
                "consistency_score": float(bw_row["consistency_score"]) if pd.notna(bw_row["consistency_score"]) else None,
                "pressure_performance_contribution": float(bw_row["pressure_performance_contribution"]),
                "pressure_prevention_contribution": float(bw_row["pressure_prevention_contribution"]),
                "consistency_contribution": float(bw_row["consistency_contribution"]),
                "evidence_tier": str(bw_row["evidence_tier"]),
                "reliability": "Bayesian Shrunk (k=150)",
                "posterior_uncertainty": float(bw_row["posterior_uncertainty"]),
                "ci_lower_95": float(bw_row["ci_lower_95"]),
                "ci_upper_95": float(bw_row["ci_upper_95"]),
                "total_legal_balls": int(bw_row["total_legal_balls"]),
                "high_pressure_legal_balls": int(bw_row["high_pressure_legal_balls"]),
                "distinct_matches": int(bw_row["distinct_matches"])
            }

        # Task 11: Auction Scouting Status Lookup
        auction_meta = None
        import os
        from app.config import settings
        audit_p = os.path.join(settings.ROOT_DIR, "reports", "ipl_2027", "task11_6_candidate_status_audit.csv")
        if os.path.exists(audit_p):
            try:
                adf = pd.read_csv(audit_p)
                p_aud = adf[adf["player_id"] == pid]
                if len(p_aud) > 0:
                    a_row = p_aud.iloc[0]
                    auction_meta = {
                        "status": str(a_row.get("status", "")),
                        "franchise_2026": str(a_row.get("franchise_2026", "")),
                        "franchise_2027_status": str(a_row.get("franchise_2027_status", "")),
                        "auction_reg_status": str(a_row.get("auction_reg_status", "")),
                        "exclusion_reason": str(a_row.get("exclusion_reason", "")),
                        "rr_weakness_addressed": str(a_row.get("rr_weakness_addressed", "")),
                        "primary_tactical_role": str(a_row.get("primary_tactical_role", "")),
                        "next_verification_requirement": str(a_row.get("next_verification_requirement", "")),
                        "verification_date": str(a_row.get("verification_date", "2026-11-12")),
                        "is_ipl_retired": str(a_row.get("status", "")) == "IPL_RETIRED",
                        "is_nationality_ineligible": str(a_row.get("status", "")) == "NATIONALITY_INELIGIBLE"
                    }
            except Exception:
                pass

        raw_dict = {
            "player_id": pid,
            "player_name": str(r["player_name"]),
            "batting_type": clean_val(r.get("batting_type")),
            "bowling_type": clean_val(r.get("bowling_type")),
            "pace_or_spin": clean_val(r.get("pace_or_spin")),
            "teams": teams[:6],
            "competitions": comps[:6],
            "auction_scouting": auction_meta,

            # Unified Integrated Scouting Data (Task 10)
            "integrated_batting": integrated_bat,
            "integrated_bowling": integrated_bowl,
            
            # Multi-Dimensional Classifications
            "batting_category": bat_cat,
            "bowling_category": bowl_cat,
            "pressure_prevention_rating_batting": bat_ppi_shrunk,
            "pressure_prevention_rating_bowling": bowl_ppi_shrunk,
            "pp_contextual_rar": pp_rar,
            "early_mid_contextual_rar": em_rar,
            "chase_team_impact": chase_delta,
            "chase_impact_label": "Contextual Team Chase Impact",
            
            # V3 Ratings
            "batting_v3_clutch_rating": bat_v3_rating,
            "bowling_v3_clutch_rating": bowl_v3_rating,
            "hp_balls_v3_batting": v3_hp_bat,
            "hp_balls_v3_bowling": v3_hp_bowl,

            "has_batting": has_bat,
            "batting_eligible": bat_eligible,
            "legal_balls_faced": clean_val(r.get("legal_balls_faced")) if has_bat else None,
            "total_balls_faced": clean_val(r.get("total_balls_faced")) if has_bat else None,
            "hp_legal_balls_faced": hp_legal_faced if has_bat else None,
            "hp_balls_faced": clean_val(r.get("high_pressure_balls_batting")) if has_bat else None,
            "overall_strike_rate": clean_val(r.get("overall_strike_rate")) if has_bat else None,
            "hp_strike_rate": clean_val(r.get("high_pressure_strike_rate")) if has_bat else None,
            "strike_rate_delta": clean_val(r.get("strike_rate_delta")) if has_bat else None,
            "batting_raw_clutch": clean_val(r.get("raw_clutch_runs_added_per_100")) if has_bat else None,
            "batting_shrunk_rating": clean_val(r.get("batting_clutch_shrunk_rating")) if bat_eligible else None,
            "batting_ci_lower": clean_val(r.get("batting_clutch_ci_lower")) if bat_eligible else None,
            "batting_ci_upper": clean_val(r.get("batting_clutch_ci_upper")) if bat_eligible else None,
            
            "has_bowling": has_bowl,
            "bowling_eligible": bowl_eligible,
            "legal_balls_bowled": clean_val(r.get("legal_balls_bowled")) if has_bowl else None,
            "total_balls_bowled": clean_val(r.get("total_balls_bowled")) if has_bowl else None,
            "hp_legal_balls_bowled": hp_legal_bowled if has_bowl else None,
            "hp_balls_bowled": clean_val(r.get("high_pressure_balls_bowling")) if has_bowl else None,
            "overall_economy": clean_val(r.get("overall_economy")) if has_bowl else None,
            "hp_economy": clean_val(r.get("high_pressure_economy")) if has_bowl else None,
            "economy_delta": clean_val(r.get("economy_delta")) if has_bowl else None,
            "actual_wickets": clean_val(r.get("overall_wickets")) if has_bowl else None,
            "hp_wickets": clean_val(r.get("high_pressure_wickets")) if has_bowl else None,
            "bowling_raw_clutch": clean_val(r.get("raw_clutch_runs_saved_per_100")) if has_bowl else None,
            "bowling_shrunk_rating": clean_val(r.get("bowling_clutch_shrunk_rating")) if bowl_eligible else None,
            "bowling_ci_lower": clean_val(r.get("bowling_clutch_ci_lower")) if bowl_eligible else None,
            "bowling_ci_upper": clean_val(r.get("bowling_clutch_ci_upper")) if bowl_eligible else None,
            
            "phase_breakdown": phase_list,
            "comp_breakdown": comp_list
        }
        return raw_dict

player_service = PlayerService()
