from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class OverviewKPIs(BaseModel):
    total_players: int
    total_matches: int
    total_deliveries: int
    total_legal_balls: int
    high_pressure_deliveries: int
    eligible_batters: int
    eligible_bowlers: int

class PlayerSummary(BaseModel):
    player_id: int
    player_name: str
    role: str
    clutch_rating: float
    high_pressure_metric: float
    metric_delta: Optional[float] = None
    legal_balls: int
    distinct_matches: int
    ci_lower: float
    ci_upper: float
    teams: List[str]

class OverviewResponse(BaseModel):
    kpis: OverviewKPIs
    top5_batters: List[PlayerSummary]
    top5_bowlers: List[PlayerSummary]
    pressure_tier_distribution: Dict[str, int]
    competition_breakdown: Dict[str, Dict[str, Any]]
    insights: List[Dict[str, Any]]

class RankingItem(BaseModel):
    rank: int
    player_id: int
    player_name: str
    competitions: List[str]
    legal_balls: int
    total_balls: int
    hp_balls: int
    hp_legal_balls: int
    mean_pressure_index: float
    overall_rate_metric: float
    hp_rate_metric: float
    lp_rate_metric: Optional[float] = None
    metric_delta: Optional[float] = None
    raw_clutch_impact: float
    distinct_matches: int
    match_impact_std: Optional[float] = None
    positive_match_pct: Optional[float] = None
    bayesian_clutch_rating: float
    posterior_se: float
    ci_lower_95: float
    ci_upper_95: float
    interval_type: str
    actual_bowler_wickets: Optional[int] = None
    hp_wickets: Optional[int] = None

class PlayerProfile(BaseModel):
    player_id: int
    player_name: str
    batting_type: Optional[str] = None
    bowling_type: Optional[str] = None
    pace_or_spin: Optional[str] = None
    teams: List[str]
    competitions: List[str]
    
    # Batting
    has_batting: bool
    batting_eligible: bool
    legal_balls_faced: Optional[int] = None
    hp_balls_faced: Optional[int] = None
    overall_strike_rate: Optional[float] = None
    hp_strike_rate: Optional[float] = None
    strike_rate_delta: Optional[float] = None
    batting_raw_clutch: Optional[float] = None
    batting_shrunk_rating: Optional[float] = None
    batting_ci_lower: Optional[float] = None
    batting_ci_upper: Optional[float] = None
    batting_matches: Optional[int] = None
    
    # Bowling
    has_bowling: bool
    bowling_eligible: bool
    legal_balls_bowled: Optional[int] = None
    hp_balls_bowled: Optional[int] = None
    overall_economy: Optional[float] = None
    hp_economy: Optional[float] = None
    economy_delta: Optional[float] = None
    actual_wickets: Optional[int] = None
    hp_wickets: Optional[int] = None
    bowling_raw_clutch: Optional[float] = None
    bowling_shrunk_rating: Optional[float] = None
    bowling_ci_lower: Optional[float] = None
    bowling_ci_upper: Optional[float] = None
    bowling_matches: Optional[int] = None
    
    # Phase Breakdown
    phase_breakdown: List[Dict[str, Any]]
    # Competition Breakdown
    comp_breakdown: List[Dict[str, Any]]

class ComparisonResponse(BaseModel):
    role: str
    players: List[Dict[str, Any]]
    metrics: List[Dict[str, Any]]

