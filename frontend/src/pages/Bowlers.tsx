import React, { useEffect, useState } from 'react';
import { fetchBowlerRankings, BowlerRankingItem } from '../services/api';
import { Link } from 'react-router-dom';

export const Bowlers: React.FC = () => {
  const [competition, setCompetition] = useState<'combined' | 'ipl' | 't20i'>('combined');
  const [data, setData] = useState<BowlerRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'standard' | 'uncertainty'>('standard');

  useEffect(() => {
    setLoading(true);
    fetchBowlerRankings(competition)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [competition]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2e6ec]">
        <div>
          <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Bowler Pressure Rankings</h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Top 10 qualified bowlers evaluated by Empirical Bayes Shrunk Clutch Rating (k = 150.0).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded-md border border-[#e2e6ec]">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'standard' ? 'bg-white text-[#17263c] shadow-xs font-semibold' : 'text-[#64748b] hover:text-[#17263c]'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setViewMode('uncertainty')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'uncertainty' ? 'bg-white text-[#17263c] shadow-xs font-semibold' : 'text-[#64748b] hover:text-[#17263c]'
              }`}
            >
              Uncertainty Intervals
            </button>
          </div>

          {/* Competition Segmented Switcher */}
          <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded-md border border-[#e2e6ec]">
            {(['combined', 'ipl', 't20i'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCompetition(c)}
                className={`px-3 py-1 rounded text-xs font-medium uppercase font-mono transition-colors ${
                  competition === c ? 'bg-[#16845b] text-white font-semibold shadow-xs' : 'text-[#64748b] hover:text-[#17263c]'
                }`}
              >
                {c === 'combined' ? 'Combined' : c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Threshold Notice */}
      <div className="p-3 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#64748b] flex items-center justify-between">
        <span>
          <strong>Eligibility:</strong> Minimum 150 legal balls overall and &ge;40 high-pressure legal balls (&ge;65.0 pressure index).
        </span>
        <span className="font-mono text-[#17263c]">222 qualified bowlers</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#64748b]">Loading official rankings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                  <th className="py-2.5 px-4 text-center w-10">#</th>
                  <th className="py-2.5 px-4">Player</th>
                  <th className="py-2.5 px-4">Teams</th>
                  <th className="py-2.5 px-3 text-right">Legal Balls</th>
                  <th className="py-2.5 px-3 text-right">HP Legal Balls</th>
                  {viewMode === 'standard' ? (
                    <>
                      <th className="py-2.5 px-3 text-right">Actual Wkts</th>
                      <th className="py-2.5 px-3 text-right">Base Econ</th>
                      <th className="py-2.5 px-3 text-right">HP Econ (&ge;65)</th>
                      <th className="py-2.5 px-3 text-right">&Delta; Econ</th>
                      <th className="py-2.5 px-4 text-right">Clutch Rating</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-3 text-right">Rating</th>
                      <th className="py-2.5 px-3 text-right font-mono">SE (&sigma;)</th>
                      <th className="py-2.5 px-4 text-center font-mono">95% Credible Interval</th>
                      <th className="py-2.5 px-4 text-center">Reliability</th>
                    </>
                  )}
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {data.map((p) => (
                  <tr key={p.player_id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-[#64748b]">{p.rank}</td>
                    <td className="py-3 px-4">
                      <Link to={`/players?id=${p.player_id}`} className="font-semibold text-[#17263c] hover:text-[#d92779]">
                        {p.player_name}
                      </Link>
                      <div className="text-[10px] text-[#94a3b8] font-mono">#{p.player_id}</div>
                    </td>
                    <td className="py-3 px-4 text-[#64748b]">
                      {p.teams && p.teams.length > 0 ? p.teams.slice(0, 2).join(', ') : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#17263c]">{p.legal_balls}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#d92779] font-medium">{p.high_pressure_balls}</td>

                    {viewMode === 'standard' ? (
                      <>
                        <td className="py-3 px-3 text-right font-mono font-medium text-[#17263c]">{p.actual_wickets}</td>
                        <td className="py-3 px-3 text-right font-mono text-[#64748b]">{p.overall_economy?.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-[#17263c]">{p.hp_economy?.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono text-[#16845b] font-medium">
                          {p.economy_delta < 0 ? p.economy_delta?.toFixed(2) : `+${p.economy_delta?.toFixed(2)}`}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#16845b]">
                          +{p.bayesian_clutch_rating.toFixed(2)}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#16845b]">
                          +{p.bayesian_clutch_rating.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#64748b]">&plusmn;{p.posterior_sd.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono text-[#17263c]">
                          [{p.ci_lower_95.toFixed(1)}, {p.ci_upper_95.toFixed(1)}]
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16845b] border border-[#dcfce7] font-medium">
                            Qualified
                          </span>
                        </td>
                      </>
                    )}

                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/players?id=${p.player_id}`}
                        className="text-xs text-[#365e91] hover:underline font-medium"
                      >
                        Dossier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
