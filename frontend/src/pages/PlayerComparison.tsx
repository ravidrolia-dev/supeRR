import React, { useState, useEffect } from 'react';
import { comparePlayers, searchPlayers, PlayerProfile } from '../services/api';
import { X, AlertCircle } from 'lucide-react';
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
    const maxLower = Math.max(...intervals.map((i) => i.lower));
    const minUpper = Math.min(...intervals.map((i) => i.upper));
    return maxLower < minUpper;
  };

  const hasOverlap = checkOverlap();

  const comparisonChartData = [
    {
      metric: role === 'BATTER' ? 'HP Strike Rate' : 'HP Economy',
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
      metric: 'Raw Clutch Rate / 100',
      ...Object.fromEntries(
        players.map((p) => [
          p.player_name,
          role === 'BATTER' ? p.batting_raw_clutch : p.bowling_raw_clutch,
        ])
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2e6ec]">
        <div>
          <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Player Head-to-Head Comparison</h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Compare 2 to 3 players with aligned statistical profiles and Bayesian uncertainty intervals.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded-md border border-[#e2e6ec]">
          <button
            onClick={() => {
              setRole('BATTER');
              setSelectedIds([37052, 6396]);
            }}
            className={`px-3 py-1 rounded text-xs font-medium uppercase font-mono transition-colors ${
              role === 'BATTER' ? 'bg-[#365e91] text-white font-semibold shadow-xs' : 'text-[#64748b] hover:text-[#17263c]'
            }`}
          >
            Batters
          </button>
          <button
            onClick={() => {
              setRole('BOWLER');
              setSelectedIds([2985, 8661]);
            }}
            className={`px-3 py-1 rounded text-xs font-medium uppercase font-mono transition-colors ${
              role === 'BOWLER' ? 'bg-[#16845b] text-white font-semibold shadow-xs' : 'text-[#64748b] hover:text-[#17263c]'
            }`}
          >
            Bowlers
          </button>
        </div>
      </div>

      {/* Player Chips & Add Input */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-md bg-white border border-[#e2e6ec]">
        {players.map((p) => (
          <div
            key={p.player_id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-xs font-medium text-[#17263c]"
          >
            <span>{p.player_name}</span>
            <span className="text-[11px] font-mono text-[#94a3b8]">#{p.player_id}</span>
            <button
              onClick={() => removePlayer(p.player_id)}
              className="text-[#94a3b8] hover:text-[#c44545] p-0.5"
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
              className="bg-[#f8fafc] border border-[#e2e6ec] focus:border-[#365e91] text-xs text-[#17263c] rounded-md px-3 py-1.5 outline-none font-mono"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-9 left-0 w-64 bg-white border border-[#e2e6ec] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {searchResults.map((s) => (
                  <button
                    key={s.player_id}
                    onClick={() => addPlayer(s.player_id)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#f8fafc] border-b border-[#f1f5f9] last:border-0 flex items-center justify-between"
                  >
                    <span className="text-[#17263c] font-medium">{s.player_name}</span>
                    <span className="text-[10px] text-[#94a3b8] font-mono">#{s.player_id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistical Overlap Alert */}
      {hasOverlap && players.length >= 2 && (
        <div className="p-3.5 rounded-md bg-[#fffbeb] border border-[#fef3c7] text-xs text-[#92400e] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#b7791f] shrink-0 mt-0.5" />
          <div>
            <strong>Credible Interval Overlap:</strong> The 95% Bayesian credible intervals for these players overlap. While point estimates differ, the current sample size does not establish a statistically significant separation at the 95% confidence level.
          </div>
        </div>
      )}

      {/* Aligned Comparison Grid */}
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
              className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="pb-3 border-b border-[#e2e6ec]">
                  <h3 className="text-base font-bold text-[#17263c]">{p.player_name}</h3>
                  <div className="text-[11px] text-[#64748b] mt-0.5">
                    #{p.player_id} &bull; {p.teams.join(', ')}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">Clutch Rating:</span>
                    <span className={`font-bold font-mono ${isBatter ? 'text-[#365e91]' : 'text-[#16845b]'}`}>
                      +{rating?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">95% Credible Interval:</span>
                    <span className="font-mono text-[#17263c]">[{ciLower?.toFixed(1)}, {ciUpper?.toFixed(1)}]</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">Legal Deliveries:</span>
                    <span className="font-mono text-[#17263c]">
                      {isBatter ? p.legal_balls_faced : p.legal_balls_bowled}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">High-Pressure Legal Balls:</span>
                    <span className="font-mono font-medium text-[#d92779]">
                      {isBatter ? p.hp_balls_faced : p.hp_balls_bowled}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">Overall Rate Metric:</span>
                    <span className="font-mono text-[#17263c]">
                      {isBatter ? `${p.overall_strike_rate?.toFixed(1)} SR` : `${p.overall_economy?.toFixed(2)} Econ`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">HP Rate Metric (&ge;65):</span>
                    <span className="font-mono font-bold text-[#17263c]">
                      {isBatter ? `${p.hp_strike_rate?.toFixed(1)} SR` : `${p.hp_economy?.toFixed(2)} Econ`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                    <span className="text-[#64748b]">Metric Delta:</span>
                    <span className="font-mono font-medium text-[#16845b]">
                      {isBatter
                        ? `+${p.strike_rate_delta?.toFixed(1)}`
                        : `${p.economy_delta && p.economy_delta < 0 ? p.economy_delta.toFixed(2) : `+${p.economy_delta?.toFixed(2)}`}`}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-[#64748b]">Raw Clutch Rate / 100:</span>
                    <span className="font-mono text-[#64748b]">+{rawClutch?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Benchmark Chart */}
      {players.length >= 2 && (
        <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <h3 className="text-sm font-bold text-[#17263c] mb-1">Direct Metric Comparison</h3>
          <p className="text-xs text-[#64748b] mb-4">Benchmark rates and shrunk ratings side by side.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e6ec', borderRadius: 6, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {players.map((p, idx) => (
                  <Bar
                    key={p.player_id}
                    dataKey={p.player_name}
                    fill={idx === 0 ? '#365e91' : idx === 1 ? '#d92779' : '#16845b'}
                    radius={[2, 2, 0, 0]}
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
