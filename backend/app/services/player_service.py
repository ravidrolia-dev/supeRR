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
            res = {
                "player_id": pid,
                "player_name": str(r["player_name"]),
                "batting_type": clean_val(r.get("batting_type")),
                "bowling_type": clean_val(r.get("bowling_type")),
                "pace_or_spin": clean_val(r.get("pace_or_spin")),
                "batting_eligible": bool(r.get("is_eligible_for_ranking_batting", False)),
                "bowling_eligible": bool(r.get("is_eligible_for_ranking_bowling", False)),
                "batting_rating": clean_val(r.get("batting_clutch_shrunk_rating")),
                "bowling_rating": clean_val(r.get("bowling_clutch_shrunk_rating")),
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
        # Batting phase
        b_ph = data_loader.bat_phase[data_loader.bat_phase["striker_id"] == pid]
        # Bowling phase
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
        
        raw_dict = {
            "player_id": pid,
            "player_name": str(r["player_name"]),
            "batting_type": clean_val(r.get("batting_type")),
            "bowling_type": clean_val(r.get("bowling_type")),
            "pace_or_spin": clean_val(r.get("pace_or_spin")),
            "teams": teams[:6],
            "competitions": comps[:6],
            "has_batting": has_bat,
            "batting_eligible": bool(r.get("is_eligible_for_ranking_batting", False)),
            "legal_balls_faced": clean_val(r.get("legal_balls_faced")) if has_bat else None,
            "hp_balls_faced": clean_val(r.get("high_pressure_balls_batting")) if has_bat else None,
            "overall_strike_rate": clean_val(r.get("overall_strike_rate")) if has_bat else None,
            "hp_strike_rate": clean_val(r.get("high_pressure_strike_rate")) if has_bat else None,
            "strike_rate_delta": clean_val(r.get("strike_rate_delta")) if has_bat else None,
            "batting_raw_clutch": clean_val(r.get("raw_clutch_runs_added_per_100")) if has_bat else None,
            "batting_shrunk_rating": clean_val(r.get("batting_clutch_shrunk_rating")) if has_bat else None,
            "batting_ci_lower": clean_val(r.get("batting_clutch_ci_lower")) if has_bat else None,
            "batting_ci_upper": clean_val(r.get("batting_clutch_ci_upper")) if has_bat else None,
            
            "has_bowling": has_bowl,
            "bowling_eligible": bool(r.get("is_eligible_for_ranking_bowling", False)),
            "legal_balls_bowled": clean_val(r.get("legal_balls_bowled")) if has_bowl else None,
            "hp_balls_bowled": clean_val(r.get("high_pressure_balls_bowling")) if has_bowl else None,
            "overall_economy": clean_val(r.get("overall_economy")) if has_bowl else None,
            "hp_economy": clean_val(r.get("high_pressure_economy")) if has_bowl else None,
            "economy_delta": clean_val(r.get("economy_delta")) if has_bowl else None,
            "actual_wickets": clean_val(r.get("overall_wickets")) if has_bowl else None,
            "hp_wickets": clean_val(r.get("high_pressure_wickets")) if has_bowl else None,
            "bowling_raw_clutch": clean_val(r.get("raw_clutch_runs_saved_per_100")) if has_bowl else None,
            "bowling_shrunk_rating": clean_val(r.get("bowling_clutch_shrunk_rating")) if has_bowl else None,
            "bowling_ci_lower": clean_val(r.get("bowling_clutch_ci_lower")) if has_bowl else None,
            "bowling_ci_upper": clean_val(r.get("bowling_clutch_ci_upper")) if has_bowl else None,
            
            "phase_breakdown": phase_list,
            "comp_breakdown": comp_list
        }
        return raw_dict

player_service = PlayerService()
