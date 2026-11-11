import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayerProfile, searchPlayers, PlayerProfile } from '../services/api';
import {
  User,
  Shield,
  Activity,
  Award,
  Zap,
  TrendingUp,
  BarChart2,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Target
} from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Search & Selector Bar */}
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-pink-400" />
            Player Intelligence Explorer
          </h1>
          <p className="text-xs text-slate-400">
            Deep forensic breakdown of pressure performance, match phases, and league splits
          </p>
        </div>

        <div className="relative w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search any player (e.g. David, Wood, Bumrah)..."
            className="w-full bg-[#0a0f1d] border border-[#23314d] focus:border-pink-500 text-xs text-slate-100 rounded-lg px-4 py-2.5 outline-none font-mono"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-11 left-0 right-0 bg-[#131b2e] border border-[#23314d] rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
              {searchResults.map((s) => (
                <button
                  key={s.player_id}
                  onClick={() => selectPlayer(s.player_id)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#1c2640] border-b border-[#23314d]/40 last:border-0 flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{s.player_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">#{s.player_id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading || !profile ? (
        <div className="py-24 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono">Loading player dossier...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Player Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172038] via-[#131b2e] to-[#0d1527] border border-[#23314d] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-pink-500/20">
                  {profile.player_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{profile.player_name}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0a0f1d] border border-[#23314d] text-slate-400">
                      #{profile.player_id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                    {profile.batting_type && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {profile.batting_type}
                      </span>
                    )}
                    {profile.bowling_type && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {profile.bowling_type} ({profile.pace_or_spin || 'Pace/Spin'})
                      </span>
                    )}
                    <span className="text-slate-400 font-mono">Teams: {profile.teams.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Shrunk Rating Display */}
              <div className="flex items-center gap-4">
                {profile.has_batting && profile.batting_shrunk_rating !== null && (
                  <div className="p-3 rounded-xl bg-[#0a0f1d] border border-amber-500/30 text-right min-w-32">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Batting Clutch</div>
                    <div className="text-lg font-black font-mono text-amber-400">
                      +{profile.batting_shrunk_rating.toFixed(2)}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      CI: [{profile.batting_ci_lower?.toFixed(1)}, {profile.batting_ci_upper?.toFixed(1)}]
                    </div>
                  </div>
                )}
                {profile.has_bowling && profile.bowling_shrunk_rating !== null && (
                  <div className="p-3 rounded-xl bg-[#0a0f1d] border border-purple-500/30 text-right min-w-32">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Bowling Clutch</div>
                    <div className="text-lg font-black font-mono text-purple-400">
                      +{profile.bowling_shrunk_rating.toFixed(2)}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      CI: [{profile.bowling_ci_lower?.toFixed(1)}, {profile.bowling_ci_upper?.toFixed(1)}]
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metric Comparison Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting Pressure Profile */}
            {profile.has_batting && (
              <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Batting Pressure Metrics</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    profile.batting_eligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {profile.batting_eligible ? 'Eligible Cohort' : 'Below Threshold'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Legal Balls Faced</div>
                    <div className="text-base font-bold text-white font-mono mt-1">{profile.legal_balls_faced}</div>
                    <div className="text-[10px] text-pink-400 font-mono mt-0.5">{profile.hp_balls_faced} High Pressure</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Overall Strike Rate</div>
                    <div className="text-base font-bold text-white font-mono mt-1">{profile.overall_strike_rate?.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Base Scoring Pace</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">High Pressure SR (PI &ge; 65)</div>
                    <div className="text-base font-bold text-pink-400 font-mono mt-1">{profile.hp_strike_rate?.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      Delta: {profile.strike_rate_delta && profile.strike_rate_delta > 0 ? `+${profile.strike_rate_delta.toFixed(2)}` : profile.strike_rate_delta?.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Raw Clutch Added / 100</div>
                    <div className="text-base font-bold text-amber-400 font-mono mt-1">
                      {profile.batting_raw_clutch !== null ? `+${profile.batting_raw_clutch.toFixed(2)}` : '—'}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Pre-shrinkage impact</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bowling Pressure Profile */}
            {profile.has_bowling && (
              <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bowling Pressure Metrics</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    profile.bowling_eligible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {profile.bowling_eligible ? 'Eligible Cohort' : 'Below Threshold'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Legal Balls Bowled</div>
                    <div className="text-base font-bold text-white font-mono mt-1">{profile.legal_balls_bowled}</div>
                    <div className="text-[10px] text-purple-400 font-mono mt-0.5">{profile.hp_balls_bowled} High Pressure</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Wickets (Total / HP)</div>
                    <div className="text-base font-bold text-white font-mono mt-1">
                      {profile.actual_wickets} <span className="text-xs text-slate-400 font-normal">/ {profile.hp_wickets} HP</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Bowler-credited wickets</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Economy (Overall / HP)</div>
                    <div className="text-base font-bold text-purple-400 font-mono mt-1">
                      {profile.overall_economy?.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ {profile.hp_economy?.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      Delta: {profile.economy_delta && profile.economy_delta < 0 ? `${profile.economy_delta.toFixed(2)}` : `+${profile.economy_delta?.toFixed(2)}`}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e1628] border border-[#23314d]/50">
                    <div className="text-[10px] text-slate-400 font-mono">Raw Clutch Saved / 100</div>
                    <div className="text-base font-bold text-purple-400 font-mono mt-1">
                      {profile.bowling_raw_clutch !== null ? `+${profile.bowling_raw_clutch.toFixed(2)}` : '—'}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Pre-shrinkage impact</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase & Competition Breakdown Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Breakdown */}
            <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-4 h-4 text-pink-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Innings Phase Performance</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">Volume and scoring impact across Powerplay, Middle, and Death</p>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profile.phase_breakdown}>
                    <XAxis dataKey="phase" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0d1527', borderColor: '#23314d', borderRadius: 8, fontSize: 11 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {profile.has_batting && (
                      <Bar dataKey="batting_balls" name="Bat Balls" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    )}
                    {profile.has_bowling && (
                      <Bar dataKey="bowling_balls" name="Bowl Balls" fill="#c084fc" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competition Breakdown (IPL vs T20I) */}
            <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Competition Split (IPL vs T20I)</h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">Cross-league exposure and strike rate / economy reconciliation</p>

              <div className="space-y-3">
                {profile.comp_breakdown.map((c) => (
                  <div key={c.competition} className="p-3.5 rounded-xl bg-[#0e1628] border border-[#23314d]/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-cyan-400">{c.competition}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.batting_balls ? `${c.batting_balls} balls faced` : ''} {c.bowling_balls ? `• ${c.bowling_balls} balls bowled` : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      {c.batting_balls ? (
                        <>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">SR</div>
                            <div className="font-bold text-white">{c.batting_sr?.toFixed(1) || '—'}</div>
                          </div>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">HP Balls</div>
                            <div className="font-bold text-pink-400">{c.batting_hp_balls || 0}</div>
                          </div>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">RAR/100</div>
                            <div className="font-bold text-amber-400">{c.batting_rar ? `+${c.batting_rar.toFixed(1)}` : '—'}</div>
                          </div>
                        </>
                      ) : null}

                      {c.bowling_balls ? (
                        <>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">Economy</div>
                            <div className="font-bold text-white">{c.bowling_econ?.toFixed(2) || '—'}</div>
                          </div>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">Wickets</div>
                            <div className="font-bold text-purple-400">{c.bowling_wickets || 0}</div>
                          </div>
                          <div className="p-2 rounded bg-[#0a0f1d]">
                            <div className="text-[9px] text-slate-400">RBE/100</div>
                            <div className="font-bold text-emerald-400">{c.bowling_rbe ? `+${c.bowling_rbe.toFixed(1)}` : '—'}</div>
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
