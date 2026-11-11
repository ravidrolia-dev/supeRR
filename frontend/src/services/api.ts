import axios from 'axios';

// Resolve base URL dynamically: use VITE_API_URL if configured, otherwise fallback to local proxy '/api'
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  integrated_pressure_score?: number;
  clutch_rating: number;
  pressure_performance_score?: number;
  pressure_prevention_score?: number | null;
  consistency_score?: number | null;
  evidence_tier?: string;
  high_pressure_metric?: number;
  metric_delta?: number | null;
  legal_balls: number;
  high_pressure_legal_balls?: number;
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

export interface IntegratedProfileData {
  integrated_pressure_score: number;
  pressure_performance_score: number;
  pressure_prevention_score: number | null;
  consistency_score: number | null;
  pressure_performance_contribution: number;
  pressure_prevention_contribution: number;
  consistency_contribution: number;
  evidence_tier: string;
  reliability: string;
  posterior_uncertainty: number;
  ci_lower_95: number;
  ci_upper_95: number;
  total_legal_balls: number;
  high_pressure_legal_balls: number;
  distinct_matches: number;
}

export interface AuctionScoutingInfo {
  status: string;
  franchise_2026: string;
  franchise_2027_status: string;
  auction_reg_status: string;
  exclusion_reason: string;
  rr_weakness_addressed: string;
  primary_tactical_role: string;
  next_verification_requirement: string;
  verification_date: string;
  is_ipl_retired: boolean;
  is_nationality_ineligible: boolean;
}

export interface PlayerProfile {
  player_id: number;
  player_name: string;
  batting_type: string | null;
  bowling_type: string | null;
  pace_or_spin: string | null;
  teams: string[];
  competitions: string[];
  auction_scouting?: AuctionScoutingInfo | null;
  
  // Task 10: Unified Integrated Scouting Profiles
  integrated_batting?: IntegratedProfileData | null;
  integrated_bowling?: IntegratedProfileData | null;

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
  batting_category?: string | null;
  bowling_category?: string | null;
  pressure_prevention_rating_batting?: number | null;
  pressure_prevention_rating_bowling?: number | null;
  pp_contextual_rar?: number | null;
  early_mid_contextual_rar?: number | null;
  chase_team_impact?: number | null;
  chase_impact_label?: string | null;
  batting_v3_clutch_rating?: number | null;
  bowling_v3_clutch_rating?: number | null;
  hp_balls_v3_batting?: number | null;
  hp_balls_v3_bowling?: number | null;
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

export interface UnifiedRankingItem {
  rank: number;
  player_id: number;
  player_name: string;
  teams: string[];
  competitions: string[];
  iss_score: number;
  clutch_contribution: number;
  prevention_contribution: number;
  consistency_contribution: number;
  v3_clutch_rating: number | null;
  ppi_prevention_rating: number | null;
  consistency_pct: number | null;
  legal_balls: number;
  hp_balls: number;
  distinct_matches: number;
  evidence_tier: string;
  category: string;
}

export interface SupeRR10Item {
  rank: number;
  superr_rank: number;
  v3_rank: number;
  player_id: number;
  player_name: string;
  teams: string[];
  competitions: string[];
  integrated_pressure_score: number;
  superr_score: number;
  pressure_performance_score: number;
  v3_clutch_rating: number;
  pressure_prevention_score: number | null;
  ppi_rating: number | null;
  consistency_score: number | null;
  consistency_pct: number | null;
  pressure_performance_contribution: number;
  clutch_contribution: number;
  pressure_prevention_contribution: number;
  ppi_contribution: number;
  consistency_contribution: number;
  total_legal_balls: number;
  legal_balls: number;
  high_pressure_legal_balls: number;
  hp_balls: number;
  distinct_matches: number;
  evidence_tier: string;
  reliability?: string;
  posterior_uncertainty: number;
  v3_posterior_se: number;
  ci_lower_95: number;
  v3_ci_lower_95: number;
  ci_upper_95: number;
  v3_ci_upper_95: number;
}

export const fetchOverview = () => api.get<OverviewData>('/overview').then(r => r.data);
export const fetchSupeRR10Batters = () => 
  api.get<SupeRR10Item[]>('/rankings/superr10/batters').then(r => r.data);
export const fetchSupeRR10Bowlers = () => 
  api.get<SupeRR10Item[]>('/rankings/superr10/bowlers').then(r => r.data);
export const fetchIntegratedBatters = (limit: number = 25) => 
  api.get<UnifiedRankingItem[]>(`/rankings/integrated/batters?limit=${limit}`).then(r => r.data);
export const fetchIntegratedBowlers = (limit: number = 25) => 
  api.get<UnifiedRankingItem[]>(`/rankings/integrated/bowlers?limit=${limit}`).then(r => r.data);
export const fetchBatterRankings = (comp: string = 'combined', version: string = 'v3') => 
  api.get<BatterRankingItem[]>(`/rankings/batters?competition=${comp}&version=${version}`).then(r => r.data);
export const fetchBowlerRankings = (comp: string = 'combined', version: string = 'v3') => 
  api.get<BowlerRankingItem[]>(`/rankings/bowlers?competition=${comp}&version=${version}`).then(r => r.data);
export const fetchPreventionBatters = () => api.get<any[]>('/rankings/prevention/batters').then(r => r.data);
export const fetchPreventionBowlers = () => api.get<any[]>('/rankings/prevention/bowlers').then(r => r.data);
export const searchPlayers = (query: string) => api.get<any[]>(`/players/search?q=${encodeURIComponent(query)}`).then(r => r.data);
export const fetchPlayerProfile = (id: number) => api.get<PlayerProfile>(`/players/${id}`).then(r => r.data);
export const comparePlayers = (role: string, ids: number[]) => api.post<{ role: string; count: number; players: PlayerProfile[] }>('/compare', { role, player_ids: ids }).then(r => r.data);
export const fetchBowlingIntelligence = () => api.get<any>('/bowling/intelligence').then(r => r.data);
export const fetchPressureIntelligence = () => api.get<any>('/pressure/intelligence').then(r => r.data);
export const fetchAuctionSquadFit = () => api.get<any>('/auction/squad-fit').then(r => r.data);

export default api;
