import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface KPI {
  total_players: number;
  total_matches: number;
  total_deliveries: number;
  total_legal_balls: number;
  high_pressure_deliveries: number;
  eligible_batters: number;
  eligible_bowlers: number;
}

export interface PlayerSummary {
  player_id: number;
  player_name: string;
  role: string;
  clutch_rating: number;
  high_pressure_metric: number;
  metric_delta: number | null;
  legal_balls: number;
  distinct_matches: number;
  ci_lower: number;
  ci_upper: number;
  teams: string[];
}

export interface PressureBin {
  tier: string;
  range: string;
  deliveries: number;
  pct_share: number;
}

export interface OverviewData {
  kpis: KPI;
  top5_batters: PlayerSummary[];
  top5_bowlers: PlayerSummary[];
  pressure_tier_distribution: PressureBin[];
  competition_breakdown: Record<string, any>;
  insights: Array<{
    category: string;
    title: string;
    detail: string;
    player_id: number;
  }>;
}

export interface BatterRankingItem {
  rank: number;
  player_id: number;
  player_name: string;
  competition: string;
  legal_balls: number;
  high_pressure_balls: number;
  overall_strike_rate: number;
  hp_strike_rate: number;
  strike_rate_delta: number;
  distinct_matches: number;
  bayesian_clutch_rating: number;
  posterior_sd: number;
  ci_lower_95: number;
  ci_upper_95: number;
  teams: string[];
}

export interface BowlerRankingItem {
  rank: number;
  player_id: number;
  player_name: string;
  competition: string;
  legal_balls: number;
  high_pressure_balls: number;
  overall_economy: number;
  hp_economy: number;
  economy_delta: number;
  actual_wickets: number;
  distinct_matches: number;
  bayesian_clutch_rating: number;
  posterior_sd: number;
  ci_lower_95: number;
  ci_upper_95: number;
  teams: string[];
}

export interface PhaseBreakdown {
  phase: string;
  batting_balls?: number;
  batting_runs?: number;
  batting_sr?: number;
  batting_hp_balls?: number;
  batting_rar?: number;
  bowling_balls?: number;
  bowling_runs?: number;
  bowling_wickets?: number;
  bowling_econ?: number;
  bowling_hp_balls?: number;
  bowling_rbe?: number;
}

export interface CompBreakdown {
  competition: string;
  batting_balls?: number;
  batting_runs?: number;
  batting_sr?: number;
  batting_hp_balls?: number;
  batting_rar?: number;
  bowling_balls?: number;
  bowling_runs?: number;
  bowling_wickets?: number;
  bowling_econ?: number;
  bowling_hp_balls?: number;
  bowling_rbe?: number;
}

export interface PlayerProfile {
  player_id: number;
  player_name: string;
  batting_type: string | null;
  bowling_type: string | null;
  pace_or_spin: string | null;
  teams: string[];
  competitions: string[];
  has_batting: boolean;
  batting_eligible: boolean;
  legal_balls_faced: number | null;
  hp_balls_faced: number | null;
  overall_strike_rate: number | null;
  hp_strike_rate: number | null;
  strike_rate_delta: number | null;
  batting_raw_clutch: number | null;
  batting_shrunk_rating: number | null;
  batting_ci_lower: number | null;
  batting_ci_upper: number | null;
  has_bowling: boolean;
  bowling_eligible: boolean;
  legal_balls_bowled: number | null;
  hp_balls_bowled: number | null;
  overall_economy: number | null;
  hp_economy: number | null;
  economy_delta: number | null;
  actual_wickets: number | null;
  hp_wickets: number | null;
  bowling_raw_clutch: number | null;
  bowling_shrunk_rating: number | null;
  bowling_ci_lower: number | null;
  bowling_ci_upper: number | null;
  phase_breakdown: PhaseBreakdown[];
  comp_breakdown: CompBreakdown[];
}

export const fetchOverview = () => api.get<OverviewData>('/overview').then(r => r.data);
export const fetchBatterRankings = (comp: string = 'combined') => api.get<BatterRankingItem[]>(`/rankings/batters?competition=${comp}`).then(r => r.data);
export const fetchBowlerRankings = (comp: string = 'combined') => api.get<BowlerRankingItem[]>(`/rankings/bowlers?competition=${comp}`).then(r => r.data);
export const searchPlayers = (query: string) => api.get<any[]>(`/players/search?q=${encodeURIComponent(query)}`).then(r => r.data);
export const fetchPlayerProfile = (id: number) => api.get<PlayerProfile>(`/players/${id}`).then(r => r.data);
export const comparePlayers = (role: string, ids: number[]) => api.post<{ role: string; count: number; players: PlayerProfile[] }>('/compare', { role, player_ids: ids }).then(r => r.data);
export const fetchBowlingIntelligence = () => api.get<any>('/bowling/intelligence').then(r => r.data);
export const fetchPressureIntelligence = () => api.get<any>('/pressure/intelligence').then(r => r.data);

export default api;

