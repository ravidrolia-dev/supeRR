import React, { useState, useEffect } from 'react';
import { comparePlayers, searchPlayers, PlayerProfile } from '../services/api';
import { GitCompare, Plus, X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PlayerComparison: React.FC = () => {
  const [role, setRole] = useState<'BATTER' | 'BOWLER'>('BATTER');
  const [selectedIds, setSelectedIds] = useState<number[]>([37052, 6396]); // Naman Dhir & Tim David
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (selectedIds.length > 0) {
      setLoading(true);
      comparePlayers(role, selectedIds)
        .then((res) => setPlayers(res.players))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setPlayers([]);
    }
  }, [role, selectedIds]);

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

  const addPlayer = (id: number) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removePlayer = (id: number) => {
    setSelectedIds(selectedIds.filter((p) => p !== id));
  };

  // Check credible interval overlap
  const checkOverlap = () => {
    if (players.length < 2) return false;
    const intervals = players.map((p) => ({
      name: p.player_name,
      lower: role === 'BATTER' ? p.batting_ci_lower ?? 0 : p.bowling_ci_lower ?? 0,
      upper: role === 'BATTER' ? p.batting_ci_upper ?? 0 : p.bowling_ci_upper ?? 0,
    }));
    // Overlap exists if max of lowers < min of uppers
    const maxLower = Math.max(...intervals.map((i) => i.lower));
    const minUpper = Math.min(...intervals.map((i) => i.upper));
    return maxLower < minUpper;
  };

  const hasOverlap = checkOverlap();

  const comparisonChartData = [
    {
      metric: 'HP Strike Rate / Econ',
      ...Object.fromEntries(
        players.map((p) => [
          p.player_name,
          role === 'BATTER' ? p.hp_strike_rate : p.hp_economy,
        ])
      ),
    },
    {
      metric: 'Clutch Shrunk Rating',
      ...Object.fromEntries(
        players.map((p) => [
          p.player_name,
          role === 'BATTER' ? p.batting_shrunk_rating : p.bowling_shrunk_rating,
        ])
      ),
    },
    {
      metric: 'Raw Clutch / 100 Balls',
      ...Object.fromEntries(
        players.map((p) => [
          p.player_name,
          role === 'BATTER' ? p.batting_raw_clutch : p.bowling_raw_clutch,
        ])
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-pink-400" />
            Head-to-Head Pressure Comparison
          </h1>
          <p className="text-xs text-slate-400">
            Side-by-side analytical benchmarking with Bayesian uncertainty intervals
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0a0f1d] p-1 rounded-xl border border-[#23314d]">
            <button
              onClick={() => {
                setRole('BATTER');
                setSelectedIds([37052, 6396]);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                role === 'BATTER'
                  ? 'bg-amber-500 text-slate-900 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Batters
            </button>
            <button
              onClick={() => {
                setRole('BOWLER');
                setSelectedIds([2985, 8661]); // Mark Wood & Matheesha Pathirana
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                role === 'BOWLER'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bowlers
            </button>
          </div>
        </div>
      </div>

      {/* Player Chips & Add Input */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-[#0e1628] border border-[#23314d]">
        {players.map((p) => (
          <div
            key={p.player_id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131b2e] border border-pink-500/40 text-xs text-white"
          >
            <span className="font-bold">{p.player_name}</span>
            <span className="text-[10px] font-mono text-slate-400">#{p.player_id}</span>
            <button
              onClick={() => removePlayer(p.player_id)}
              className="text-slate-400 hover:text-pink-400 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {selectedIds.length < 3 && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="+ Add player to compare..."
              className="bg-[#0a0f1d] border border-[#23314d] focus:border-pink-500 text-xs text-slate-100 rounded-lg px-3 py-1.5 outline-none font-mono"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-9 left-0 w-64 bg-[#131b2e] border border-[#23314d] rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                {searchResults.map((s) => (
                  <button
                    key={s.player_id}
                    onClick={() => addPlayer(s.player_id)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#1c2640] border-b border-[#23314d]/40 last:border-0 flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{s.player_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{s.player_id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistical Overlap Alert */}
      {hasOverlap && players.length >= 2 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-amber-400 font-semibold">Credible Interval Overlap Detected:</strong> The 95% Bayesian credible intervals for the compared players overlap. While point estimates differ, statistical indistinguishability cannot be rejected with 95% confidence without additional exposure data.
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((p) => {
          const isBatter = role === 'BATTER';
          const rating = isBatter ? p.batting_shrunk_rating : p.bowling_shrunk_rating;
          const ciLower = isBatter ? p.batting_ci_lower : p.bowling_ci_lower;
          const ciUpper = isBatter ? p.batting_ci_upper : p.bowling_ci_upper;
          const rawClutch = isBatter ? p.batting_raw_clutch : p.bowling_raw_clutch;

          return (
            <div
              key={p.player_id}
              className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#23314d]">
                  <div>
                    <h3 className="text-base font-black text-white">{p.player_name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">
                      #{p.player_id} • {p.teams.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-black font-mono ${isBatter ? 'text-amber-400' : 'text-purple-400'}`}>
                      +{rating?.toFixed(2)}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">Clutch Rating</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2.5 mt-4 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">Legal Balls:</span>
                    <span className="text-white font-medium">{isBatter ? p.legal_balls_faced : p.legal_balls_bowled}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">High-Pressure Balls:</span>
                    <span className="text-pink-400 font-bold">{isBatter ? p.hp_balls_faced : p.hp_balls_bowled}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">Overall Metric:</span>
                    <span className="text-white font-medium">
                      {isBatter ? `${p.overall_strike_rate?.toFixed(2)} SR` : `${p.overall_economy?.toFixed(2)} Econ`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">High-Pressure Metric:</span>
                    <span className="text-pink-300 font-bold">
                      {isBatter ? `${p.hp_strike_rate?.toFixed(2)} SR` : `${p.hp_economy?.toFixed(2)} Econ`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">Metric Delta:</span>
                    <span className="text-emerald-400 font-bold">
                      {isBatter
                        ? `+${p.strike_rate_delta?.toFixed(2)}`
                        : `${p.economy_delta && p.economy_delta < 0 ? p.economy_delta.toFixed(2) : `+${p.economy_delta?.toFixed(2)}`}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">Raw Clutch / 100:</span>
                    <span className="text-cyan-400 font-medium">+{rawClutch?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#23314d]/40">
                    <span className="text-slate-400">95% Credible Interval:</span>
                    <span className="text-slate-200">[{ciLower?.toFixed(1)}, {ciUpper?.toFixed(1)}]</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Benchmark Chart */}
      {players.length >= 2 && (
        <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Direct Metric Benchmarking
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1527', borderColor: '#23314d', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {players.map((p, idx) => (
                  <Bar
                    key={p.player_id}
                    dataKey={p.player_name}
                    fill={idx === 0 ? '#ec4899' : idx === 1 ? '#38bdf8' : '#f59e0b'}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

