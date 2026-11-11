from fastapi import APIRouter, HTTPException, Query
from app.services.ranking_service import ranking_service
from app.services.player_service import player_service
from app.services.analytics_service import analytics_service
from typing import List, Optional

router = APIRouter()

@router.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "service": "ClutchIQ Analytics API"}

@router.get("/overview")
def get_overview():
    return analytics_service.get_overview()

@router.get("/rankings/superr10/batters")
def get_superr10_batters():
    return ranking_service.get_superr10_batters()

@router.get("/rankings/superr10/bowlers")
def get_superr10_bowlers():
    return ranking_service.get_superr10_bowlers()

@router.get("/rankings/integrated/batters")
def get_integrated_batters(limit: int = Query(25, description="Number of top candidates to return")):
    return ranking_service.get_integrated_batters(limit)

@router.get("/rankings/integrated/bowlers")
def get_integrated_bowlers(limit: int = Query(25, description="Number of top candidates to return")):
    return ranking_service.get_integrated_bowlers(limit)

@router.get("/rankings/batters")
def get_batters(competition: str = Query("combined", description="combined, ipl, or t20i"), version: str = Query("v3", description="v3 (production) or v2 (historical)")):
    return ranking_service.get_batters(competition, version)

@router.get("/rankings/bowlers")
def get_bowlers(competition: str = Query("combined", description="combined, ipl, or t20i"), version: str = Query("v3", description="v3 (production) or v2 (historical)")):
    return ranking_service.get_bowlers(competition, version)

@router.get("/rankings/prevention/batters")
def get_prevention_batters():
    return ranking_service.get_prevention_batters()

@router.get("/rankings/prevention/bowlers")
def get_prevention_bowlers():
    return ranking_service.get_prevention_bowlers()

@router.get("/players/search")
def search_players(q: str = Query(..., description="Player name or ID")):
    return player_service.search_players(q)

@router.get("/players/{player_id}")
def get_player(player_id: int):
    profile = player_service.get_player_profile(player_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Player not found")
    return profile

@router.post("/compare")
def compare_players(payload: dict):
    player_ids = payload.get("player_ids", [])
    role = payload.get("role", "BATTER").upper()
    if not player_ids or len(player_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 player_ids to compare")
        
    profiles = []
    for pid in player_ids[:3]:
        prof = player_service.get_player_profile(pid)
        if prof:
            profiles.append(prof)
            
    if len(profiles) < 2:
        raise HTTPException(status_code=404, detail="Could not load enough valid player profiles")
        
    return {
        "role": role,
        "players": profiles
    }

@router.get("/bowling/intelligence")
def get_bowling_intelligence():
    return analytics_service.get_bowling_intelligence()

@router.get("/pressure/intelligence")
def get_pressure_intelligence():
    return analytics_service.get_pressure_intelligence()

@router.get("/auction/squad-fit")
def get_auction_squad_fit():
    import os, pandas as pd
    from app.config import settings
    reports_dir = os.path.join(settings.ROOT_DIR, "reports", "ipl_2027")
    fit_path = os.path.join(reports_dir, "rr_2027_player_squad_fit.csv")
    squad_path = os.path.join(reports_dir, "rr_2026_actual_squad.csv")
    weakness_path = os.path.join(reports_dir, "rr_2026_squad_weaknesses.csv")
    req_path = os.path.join(reports_dir, "rr_2027_auction_requirements.csv")
    batter_targets_path = os.path.join(reports_dir, "rr_2027_final_batter_targets.csv")
    bowler_targets_path = os.path.join(reports_dir, "rr_2027_final_bowler_targets.csv")
    avail_batters_path = os.path.join(reports_dir, "rr_2027_available_batter_targets.csv")
    avail_bowlers_path = os.path.join(reports_dir, "rr_2027_available_bowler_targets.csv")
    conditional_path = os.path.join(reports_dir, "rr_2027_conditional_targets.csv")
    unavailable_path = os.path.join(reports_dir, "rr_2027_unavailable_candidates.csv")
    
    # Fallback to older paths if needed
    if not os.path.exists(fit_path):
        fit_path = os.path.join(settings.ROOT_DIR, "reports", "ipl_2027_player_squad_fit.csv")
    
    squad_2026 = pd.read_csv(squad_path).fillna("").to_dict(orient="records") if os.path.exists(squad_path) else []
    weaknesses = pd.read_csv(weakness_path).fillna("").to_dict(orient="records") if os.path.exists(weakness_path) else []
    requirements = pd.read_csv(req_path).fillna("").to_dict(orient="records") if os.path.exists(req_path) else []
    
    final_batter_targets = pd.read_csv(batter_targets_path).fillna("").to_dict(orient="records") if os.path.exists(batter_targets_path) else []
    final_bowler_targets = pd.read_csv(bowler_targets_path).fillna("").to_dict(orient="records") if os.path.exists(bowler_targets_path) else []
    
    available_batters = pd.read_csv(avail_batters_path).fillna("").to_dict(orient="records") if os.path.exists(avail_batters_path) else []
    available_bowlers = pd.read_csv(avail_bowlers_path).fillna("").to_dict(orient="records") if os.path.exists(avail_bowlers_path) else []
    conditional_targets = pd.read_csv(conditional_path).fillna("").to_dict(orient="records") if os.path.exists(conditional_path) else []
    unavailable_candidates = pd.read_csv(unavailable_path).fillna("").to_dict(orient="records") if os.path.exists(unavailable_path) else []

    if os.path.exists(fit_path):
        players = pd.read_csv(fit_path).fillna("").to_dict(orient="records")
    else:
        players = []
    batters = [p for p in players if p.get("role_type") == "Batter"]
    bowlers = [p for p in players if p.get("role_type") == "Bowler"]
    
    task11_6_audit_path = os.path.join(reports_dir, "task11_6_candidate_status_audit.csv")
    task11_6_candidates = pd.read_csv(task11_6_audit_path).fillna("").to_dict(orient="records") if os.path.exists(task11_6_audit_path) else []

    role_alternatives_path = os.path.join(reports_dir, "task11_7_role_alternative_mapping.csv")
    role_alternatives = pd.read_csv(role_alternatives_path).fillna("").to_dict(orient="records") if os.path.exists(role_alternatives_path) else []

    confirmed_shortlist = [c for c in task11_6_candidates if c.get("status") == "AVAILABLE_CONFIRMED"]
    conditional_pending = [c for c in task11_6_candidates if c.get("status") == "CONDITIONAL_RETENTION_PENDING"]
    conditional_batters = [c for c in conditional_pending if c.get("role") == "Batter"]
    conditional_bowlers = [c for c in conditional_pending if c.get("role") == "Bowler"]

    availability_unverified = [c for c in task11_6_candidates if c.get("status") == "AVAILABILITY_UNVERIFIED"]
    retained_unavailable = [c for c in task11_6_candidates if c.get("status") in ["RETAINED_UNAVAILABLE", "RR_EXISTING_PLAYER"]]
    ineligible_or_retired = [c for c in task11_6_candidates if c.get("status") in ["IPL_RETIRED", "PROFESSIONAL_CRICKET_RETIRED", "NATIONALITY_INELIGIBLE"]]

    import datetime
    current_time_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    return {
        "status": "success",
        "season": "IPL 2027",
        "franchise": "Rajasthan Royals",
        "audit_date": "2026-11-12",
        "official_retention_deadline": "2026-11-17T17:00:00+05:30",
        "last_verification_timestamp": current_time_iso,
        "actual_2026_summary": {
            "total_matches": 16,
            "wins": 9,
            "losses": 7,
            "finish": "3rd Place (Playoffs: Won Eliminator, Lost Qualifier vs GT)",
            "powerplay_batting_sr": 187.33,
            "death_bowling_economy": 10.57,
            "sandeep_death_economy": 13.70
        },
        "zero_target_explanation": "Player evaluation complete. Final acquisition shortlist pending official IPL 2027 retention, release and auction registration verification.",
        "squad_2026": squad_2026,
        "weaknesses": weaknesses,
        "requirements": requirements,
        "available_batters": available_batters,
        "available_bowlers": available_bowlers,
        "conditional_targets": conditional_targets,
        "unavailable_candidates": unavailable_candidates,
        "batter_targets": final_batter_targets,
        "bowler_targets": final_bowler_targets,
        "batters": batters,
        "bowlers": bowlers,
        # Task 11.6 & 11.7 Audited Intelligence
        "task11_6_all_candidates": task11_6_candidates,
        "confirmed_shortlist": confirmed_shortlist,
        "conditional_pending": conditional_pending,
        "conditional_batters": conditional_batters,
        "conditional_bowlers": conditional_bowlers,
        "role_alternatives": role_alternatives,
        "availability_unverified": availability_unverified,
        "retained_unavailable": retained_unavailable,
        "ineligible_or_retired": ineligible_or_retired
    }

