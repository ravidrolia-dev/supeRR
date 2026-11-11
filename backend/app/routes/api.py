from fastapi import APIRouter, HTTPException, Query
from app.services.ranking_service import ranking_service
from app.services.player_service import player_service
from app.services.analytics_service import analytics_service
from typing import List, Optional

router = APIRouter()

@router.get("/health")
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

