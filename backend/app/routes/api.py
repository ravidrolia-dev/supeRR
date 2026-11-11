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

@router.get("/rankings/batters")
def get_batters(competition: str = Query("combined", description="combined, ipl, or t20i")):
    return ranking_service.get_batters(competition)

@router.get("/rankings/bowlers")
def get_bowlers(competition: str = Query("combined", description="combined, ipl, or t20i")):
    return ranking_service.get_bowlers(competition)

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

