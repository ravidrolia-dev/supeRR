import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayerProfile, searchPlayers, PlayerProfile } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const PlayerExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : 6396; // Tim David default
  const [playerId, setPlayerId] = useState<number>(initialId);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPlayerProfile(playerId)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await searchPlayers(val);
        setSearchResults(res);
      } catch (err) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectPlayer = (id: number) => {
    setPlayerId(id);
    setSearchParams({ id: id.toString() });
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2e6ec]">
        <div>
          <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Player Intelligence Explorer</h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Forensic pressure performance dossiers, phase breakdowns and empirical Bayes shrinkage.
          </p>
        </div>

        <div className="relative w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search player or ID (e.g. David, Wood)..."
            className="w-full bg-white border border-[#e2e6ec] focus:border-[#365e91] text-xs text-[#17263c] rounded-md px-3.5 py-2 outline-none shadow-xs"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-10 left-0 right-0 bg-white border border-[#e2e6ec] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((s) => (
                <button
                  key={s.player_id}
                  onClick={() => selectPlayer(s.player_id)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#f8fafc] border-b border-[#f1f5f9] last:border-0 flex items-center justify-between"
                >
                  <span className="font-semibold text-[#17263c]">{s.player_name}</span>
                  <span className="text-[11px] text-[#94a3b8] font-mono">#{s.player_id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading || !profile ? (
        <div className="py-20 text-center text-xs text-[#64748b]">Loading player profile...</div>
      ) : (
        <div className="space-y-6">
          {/* Player Header Banner */}
          <div className="p-6 rounded-md bg-white border border-[#e2e6ec] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#17263c] tracking-tight">{profile.player_name}</h2>
                <span className="text-xs font-mono text-[#94a3b8]">#{profile.player_id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#64748b]">
                {profile.batting_type && (
                  <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#17263c] border border-[#e2e6ec]">
                    {profile.batting_type}
                  </span>
                )}
                {profile.bowling_type && (
                  <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#17263c] border border-[#e2e6ec]">
                    {profile.bowling_type}
                  </span>
                )}
                {profile.teams.length > 0 && (
                  <span className="text-[#94a3b8]">&bull; {profile.teams.join(', ')}</span>
                )}
              </div>
              {/* Evidence Taxonomy Badge */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded text-xs font-medium border ${
                  profile.batting_category?.includes('Dual')
                    ? 'bg-purple-50 text-purple-700 border-purple-200 font-semibold'
                    : profile.batting_category?.includes('Prevention')
                    ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                    : profile.batting_category?.includes('Pressure Performer')
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {profile.batting_category || 'Category C: Insufficient Evidence'}
                </span>

                {/* Auction Scouting Status Badge */}
                {profile.auction_scouting && (
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    profile.auction_scouting.status === 'AVAILABLE_CONFIRMED'
                      ? 'bg-[#f0fdf4] text-[#16845b] border-[#bbf7d0]'
                      : profile.auction_scouting.status === 'CONDITIONAL_RETENTION_PENDING'
                      ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]'
                      : profile.auction_scouting.status === 'AVAILABILITY_UNVERIFIED'
                      ? 'bg-[#fffbeb] text-[#b45309] border-[#fef3c7]'
                      : profile.auction_scouting.status === 'IPL_RETIRED' || profile.auction_scouting.status === 'NATIONALITY_INELIGIBLE'
                      ? 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'
                      : 'bg-[#f8fafc] text-[#475569] border-[#e2e6ec]'
                  }`}>
                    IPL 2027: {profile.auction_scouting.status}
                  </span>
                )}

                <span className="text-[11px] text-[#94a3b8] font-mono">
                  {profile.legal_balls_faced ? `${profile.legal_balls_faced} legal balls faced` : ''}
                </span>
              </div>
            </div>

            {/* Unified Integrated Scouting Intelligence Header (Task 10) */}
            {profile.integrated_batting && (
              <div className="p-4 rounded-md bg-[#fdf2f8] border border-[#fbcfe8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#be185d]">
                      Unified Integrated Pressure Score (Batting)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      profile.integrated_batting.evidence_tier.includes('Strong') ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                      profile.integrated_batting.evidence_tier.includes('Moderate') ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]' :
                      'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                    }`}>
                      {profile.integrated_batting.evidence_tier}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">
                    70% V3 Crisis Performance ({profile.integrated_batting.pressure_performance_contribution > 0 ? `+${profile.integrated_batting.pressure_performance_contribution.toFixed(1)}` : profile.integrated_batting.pressure_performance_contribution.toFixed(1)} pts) + 
                    20% PPI Prevention ({profile.integrated_batting.pressure_prevention_contribution > 0 ? `+${profile.integrated_batting.pressure_prevention_contribution.toFixed(1)}` : profile.integrated_batting.pressure_prevention_contribution.toFixed(1)} pts) + 
                    10% Consistency ({profile.integrated_batting.consistency_contribution > 0 ? `+${profile.integrated_batting.consistency_contribution.toFixed(1)}` : profile.integrated_batting.consistency_contribution.toFixed(1)} pts)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#be185d]">
                    {profile.integrated_batting.integrated_pressure_score.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-mono text-[#64748b]">
                    95% CI: [{profile.integrated_batting.ci_lower_95.toFixed(1)}, {profile.integrated_batting.ci_upper_95.toFixed(1)}]
                  </div>
                </div>
              </div>
            )}

            {profile.integrated_bowling && (
              <div className="p-4 rounded-md bg-[#f0f9ff] border border-[#bae6fd] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0369a1]">
                      Unified Integrated Pressure Score (Bowling)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      profile.integrated_bowling.evidence_tier.includes('Strong') ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                      profile.integrated_bowling.evidence_tier.includes('Moderate') ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]' :
                      'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                    }`}>
                      {profile.integrated_bowling.evidence_tier}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">
                    70% V3 Crisis Defending ({profile.integrated_bowling.pressure_performance_contribution > 0 ? `+${profile.integrated_bowling.pressure_performance_contribution.toFixed(1)}` : profile.integrated_bowling.pressure_performance_contribution.toFixed(1)} pts) + 
                    20% PPI Prevention ({profile.integrated_bowling.pressure_prevention_contribution > 0 ? `+${profile.integrated_bowling.pressure_prevention_contribution.toFixed(1)}` : profile.integrated_bowling.pressure_prevention_contribution.toFixed(1)} pts) + 
                    10% Consistency ({profile.integrated_bowling.consistency_contribution > 0 ? `+${profile.integrated_bowling.consistency_contribution.toFixed(1)}` : profile.integrated_bowling.consistency_contribution.toFixed(1)} pts)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#0369a1]">
                    {profile.integrated_bowling.integrated_pressure_score.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-mono text-[#64748b]">
                    95% CI: [{profile.integrated_bowling.ci_lower_95.toFixed(1)}, {profile.integrated_bowling.ci_upper_95.toFixed(1)}]
                  </div>
                </div>
              </div>
            )}

            {/* Auction Scouting Status Card (Task 11) */}
            {profile.auction_scouting && (
              <div className="p-4 rounded-md bg-[#ffffff] border border-[#e2e6ec] shadow-xs space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#17263c]">IPL 2027 Auction Scouting Intelligence</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      profile.auction_scouting.status === 'AVAILABLE_CONFIRMED'
                        ? 'bg-[#f0fdf4] text-[#16845b] border border-[#bbf7d0]'
                        : profile.auction_scouting.status === 'CONDITIONAL_RETENTION_PENDING'
                        ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]'
                        : profile.auction_scouting.status === 'AVAILABILITY_UNVERIFIED'
                        ? 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]'
                        : profile.auction_scouting.status === 'IPL_RETIRED' || profile.auction_scouting.status === 'NATIONALITY_INELIGIBLE'
                        ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]'
                        : 'bg-[#f8fafc] text-[#475569] border border-[#e2e6ec]'
                    }`}>
                      {profile.auction_scouting.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748b]">
                    Retention Deadline: Nov 17, 2026 (Audit: {profile.auction_scouting.verification_date})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[#64748b]">2026 Franchise: </span>
                    <strong className="text-[#17263c]">{profile.auction_scouting.franchise_2026}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748b]">RR Weakness Solved: </span>
                    <strong className="text-[#be185d]">{profile.auction_scouting.rr_weakness_addressed || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748b]">Primary Tactical Role: </span>
                    <strong className="text-[#17263c]">{profile.auction_scouting.primary_tactical_role || 'General Cohort'}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-[#64748b] bg-[#f8fafc] p-2.5 rounded border border-[#f1f5f9] mt-2 leading-relaxed">
                  <strong className="text-[#17263c]">Audit Note / Next Requirement: </strong>
                  {profile.auction_scouting.exclusion_reason}
                  {profile.auction_scouting.next_verification_requirement && profile.auction_scouting.next_verification_requirement !== '—' && (
                    <span className="text-[#365e91] block mt-0.5">
                      <strong>Next Action:</strong> {profile.auction_scouting.next_verification_requirement}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Official Shrunk Ratings & Prevention Scores */}
            <div className="flex flex-wrap items-center gap-4">
              {/* V3 Clutch Rating */}
              {profile.batting_eligible && profile.batting_v3_clutch_rating !== null && profile.batting_v3_clutch_rating !== undefined && (
                <div className="p-3 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-right min-w-32">
                  <div className="text-[11px] text-[#64748b]">V3 Clutch Rating (Crisis)</div>
                  <div className="text-xl font-bold font-mono text-[#365e91] mt-0.5">
                    +{profile.batting_v3_clutch_rating.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">
                    {profile.hp_balls_v3_batting} HP Balls (V3)
                  </div>
                </div>
              )}

              {/* Prevention Index (PPI) */}
              {profile.pressure_prevention_rating_batting !== null && profile.pressure_prevention_rating_batting !== undefined && (
                <div className="p-3 rounded-md bg-[#fefce8] border border-[#fef08a] text-right min-w-32">
                  <div className="text-[11px] text-[#854d0e] font-medium">Prevention Index (PPI)</div>
                  <div className="text-xl font-bold font-mono text-[#a16207] mt-0.5">
                    {profile.pressure_prevention_rating_batting > 0 ? `+${profile.pressure_prevention_rating_batting.toFixed(2)}` : profile.pressure_prevention_rating_batting.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#a16207] mt-0.5">
                    Early Foundation Dominance
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3-Section Multi-Dimensional Intelligence Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Pressure Performance Dimension */}
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
              <div className="pb-2 border-b border-[#e2e6ec]">
                <h3 className="text-xs font-bold text-[#17263c] uppercase tracking-wider">1. Pressure Performance</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">Crisis resolution in high-stress deliveries (&ge;65 BPI).</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Clutch Status:</span>
                  <span className={`font-semibold ${profile.batting_eligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {profile.batting_eligible ? 'Qualified (≥150 Legal Balls)' : 'Developing / Low Sample'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">High-Pressure Legal Deliveries:</span>
                  <span className="font-mono font-medium text-[#17263c]">{profile.hp_balls_v3_batting ?? profile.hp_balls_faced ?? 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">HP Strike Rate:</span>
                  <span className="font-mono font-medium text-[#17263c]">{profile.hp_strike_rate?.toFixed(1) || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748b]">Clutch Rating (V3):</span>
                  <span className="font-mono font-bold text-[#365e91]">
                    {profile.batting_v3_clutch_rating ? `+${profile.batting_v3_clutch_rating.toFixed(2)}` : 'Bayesian Shrunk Prior'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Pressure Prevention Dimension */}
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
              <div className="pb-2 border-b border-[#e2e6ec]">
                <h3 className="text-xs font-bold text-[#17263c] uppercase tracking-wider">2. Pressure Prevention (PPI)</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">Front-running foundation building in Overs 1–16.</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Prevention Status:</span>
                  <span className="font-semibold text-emerald-600">
                    {profile.pressure_prevention_rating_batting !== null ? 'Evaluated (PPI Candidate)' : 'Insufficient Early Volume'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Powerplay RAR / 100:</span>
                  <span className="font-mono font-medium text-[#17263c]">
                    {profile.pp_contextual_rar ? `+${profile.pp_contextual_rar.toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Chase Team Impact:</span>
                  <span className="font-mono font-medium text-emerald-600">
                    {profile.chase_team_impact ? `${profile.chase_team_impact.toFixed(2)} RRR Δ` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748b]">Prevention Index (PPI):</span>
                  <span className="font-mono font-bold text-[#a16207]">
                    {profile.pressure_prevention_rating_batting ? `+${profile.pressure_prevention_rating_batting.toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Evidence Reliability Dimension */}
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
              <div className="pb-2 border-b border-[#e2e6ec]">
                <h3 className="text-xs font-bold text-[#17263c] uppercase tracking-wider">3. Evidence Reliability</h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">Sample volume, credibility and confidence intervals.</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Career Legal Balls:</span>
                  <span className="font-mono font-medium text-[#17263c]">{profile.legal_balls_faced || 0}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Evidence Tier:</span>
                  <span className="font-semibold text-[#17263c]">
                    {(profile.legal_balls_faced || 0) >= 800 ? 'High Confidence (800+ balls)' : (profile.legal_balls_faced || 0) >= 300 ? 'Moderate (300-800 balls)' : 'Developing / Low Sample'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#64748b]">Competitions:</span>
                  <span className="text-[#17263c] truncate max-w-[150px]">{profile.competitions?.join(', ') || 'IPL, T20I'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748b]">Bayesian Shrinkage (k):</span>
                  <span className="font-mono text-[#64748b]">k = 80.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Qualified Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting Overview */}
            {profile.has_batting && (
              <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-4">
                  <h3 className="text-sm font-bold text-[#17263c]">Batting Pressure Performance</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    profile.batting_eligible ? 'bg-[#f0fdf4] text-[#16845b] border border-[#dcfce7]' : 'bg-[#fef2f2] text-[#c44545] border border-[#fee2e2]'
                  }`}>
                    {profile.batting_eligible ? 'Qualified Cohort (n ≥ 150)' : 'Below Exposure Threshold'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                    <div className="text-[11px] text-[#64748b]">Legal Deliveries Faced</div>
                    <div className="text-base font-bold text-[#17263c] font-mono mt-0.5">{profile.legal_balls_faced}</div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5 font-mono">{profile.hp_balls_faced} HP Delivery Events</div>
                  </div>

                  <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                    <div className="text-[11px] text-[#64748b]">High-Pressure Legal Balls</div>
                    <div className="text-base font-bold text-[#d92779] font-mono mt-0.5">
                      {profile.hp_balls_faced}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">Denominator for HP SR</div>
                  </div>

                  <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                    <div className="text-[11px] text-[#64748b]">High-Pressure SR (&ge;65)</div>
                    <div className="text-base font-bold text-[#17263c] font-mono mt-0.5">{profile.hp_strike_rate?.toFixed(1)}</div>
                    <div className="text-[10px] text-[#16845b] font-medium mt-0.5 font-mono">
                      Delta: {profile.strike_rate_delta && profile.strike_rate_delta > 0 ? `+${profile.strike_rate_delta.toFixed(1)}` : profile.strike_rate_delta?.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                    <div className="text-[11px] text-[#64748b]">Raw Clutch Added / 100</div>
                    <div className="text-base font-bold text-[#365e91] font-mono mt-0.5">
                      {profile.batting_raw_clutch !== null ? `+${profile.batting_raw_clutch.toFixed(2)}` : '—'}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">Pre-shrinkage rate</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bowling Overview */}
            {profile.has_bowling && (
              <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-4">
                  <h3 className="text-sm font-bold text-[#17263c]">Bowling Pressure Performance</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    profile.bowling_eligible ? 'bg-[#f0fdf4] text-[#16845b] border border-[#dcfce7]' : 'bg-[#fef2f2] text-[#c44545] border border-[#fee2e2]'
                  }`}>
                    {profile.bowling_eligible ? 'Qualified Cohort (n ≥ 150)' : 'Below Exposure Threshold'}
                  </span>
                </div>

                {profile.bowling_eligible ? (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                      <div className="text-[11px] text-[#64748b]">Legal Deliveries Bowled</div>
                      <div className="text-base font-bold text-[#17263c] font-mono mt-0.5">{profile.legal_balls_bowled}</div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5 font-mono">{profile.hp_balls_bowled} HP Legal Balls</div>
                    </div>

                    <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                      <div className="text-[11px] text-[#64748b]">Wickets (Total / HP)</div>
                      <div className="text-base font-bold text-[#17263c] font-mono mt-0.5">
                        {profile.actual_wickets} <span className="text-xs text-[#64748b] font-normal">/ {profile.hp_wickets} HP</span>
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">Bowler-credited wickets</div>
                    </div>

                    <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                      <div className="text-[11px] text-[#64748b]">High-Pressure Economy</div>
                      <div className="text-base font-bold text-[#17263c] font-mono mt-0.5">{profile.hp_economy?.toFixed(2)}</div>
                      <div className="text-[10px] text-[#16845b] font-medium mt-0.5 font-mono">
                        Delta: {profile.economy_delta && profile.economy_delta < 0 ? profile.economy_delta.toFixed(2) : `+${profile.economy_delta?.toFixed(2)}`}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
                      <div className="text-[11px] text-[#64748b]">Raw Clutch Saved / 100</div>
                      <div className="text-base font-bold text-[#16845b] font-mono mt-0.5">
                        {profile.bowling_raw_clutch !== null ? `+${profile.bowling_raw_clutch.toFixed(2)}` : '—'}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">Pre-shrinkage rate</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#64748b] space-y-2">
                    <p>
                      <strong>Insufficient Bowling Exposure:</strong> {profile.player_name} has bowled {profile.legal_balls_bowled || 0} legal deliveries, which is below the minimum threshold of 150 legal balls.
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">
                      Official bowling clutch ratings are suppressed for unqualified secondary roles to prevent distortion.
                    </p>
                    <button
                      onClick={() => setShowSecondary(!showSecondary)}
                      className="text-xs font-semibold text-[#365e91] hover:underline block pt-1"
                    >
                      {showSecondary ? 'Hide unqualified raw diagnostics' : 'View unqualified raw diagnostics'}
                    </button>

                    {showSecondary && (
                      <div className="pt-2 border-t border-[#e2e6ec] text-[11px] text-[#64748b] font-mono space-y-1">
                        <div>Legal balls bowled: {profile.legal_balls_bowled || 0}</div>
                        <div>High-pressure balls bowled: {profile.hp_balls_bowled || 0}</div>
                        <div>Raw unadjusted rate: {profile.bowling_raw_clutch !== null ? `${profile.bowling_raw_clutch?.toFixed(2)}` : 'N/A'}</div>
                        <div className="text-[#c44545] font-sans">Warning: Sample size too small for statistical inference.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Phase & Competition Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Breakdown */}
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <h3 className="text-sm font-bold text-[#17263c] mb-1">Innings Phase Exposure</h3>
              <p className="text-xs text-[#64748b] mb-4">Volume distribution across Powerplay, Middle, and Death phases.</p>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.phase_breakdown}>
                    <XAxis dataKey="phase" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e6ec', borderRadius: 6, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {profile.has_batting && (
                      <Bar dataKey="batting_balls" name="Bat Balls" fill="#365e91" radius={[2, 2, 0, 0]} />
                    )}
                    {profile.bowling_eligible && (
                      <Bar dataKey="bowling_balls" name="Bowl Balls" fill="#16845b" radius={[2, 2, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competition Breakdown */}
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <h3 className="text-sm font-bold text-[#17263c] mb-1">Competition Split (IPL vs T20I)</h3>
              <p className="text-xs text-[#64748b] mb-4">Cross-competition scoring pace and exposure.</p>

              <div className="space-y-3">
                {profile.comp_breakdown.map((c) => (
                  <div key={c.competition} className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#17263c]">{c.competition}</span>
                      <span className="text-[11px] text-[#64748b] font-mono">
                        {c.batting_balls ? `${c.batting_balls} balls faced` : ''} {c.bowling_balls ? `• ${c.bowling_balls} balls bowled` : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      {c.batting_balls ? (
                        <>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">Base SR</div>
                            <div className="font-semibold text-[#17263c]">{c.batting_sr?.toFixed(1) || '—'}</div>
                          </div>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">HP Balls</div>
                            <div className="font-semibold text-[#d92779]">{c.batting_hp_balls || 0}</div>
                          </div>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">RAR/100</div>
                            <div className="font-semibold text-[#365e91]">{c.batting_rar ? `+${c.batting_rar.toFixed(1)}` : '—'}</div>
                          </div>
                        </>
                      ) : null}

                      {c.bowling_balls ? (
                        <>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">Economy</div>
                            <div className="font-semibold text-[#17263c]">{c.bowling_econ?.toFixed(2) || '—'}</div>
                          </div>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">Wickets</div>
                            <div className="font-semibold text-[#16845b]">{c.bowling_wickets || 0}</div>
                          </div>
                          <div className="p-2 rounded bg-white border border-[#f1f5f9]">
                            <div className="text-[10px] text-[#64748b]">RBE/100</div>
                            <div className="font-semibold text-[#16845b]">{c.bowling_rbe ? `+${c.bowling_rbe.toFixed(1)}` : '—'}</div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
