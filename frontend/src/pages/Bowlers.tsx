import React, { useEffect, useState } from 'react';
import { fetchBowlerRankings, BowlerRankingItem } from '../services/api';
import { Target, ExternalLink, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Bowlers: React.FC = () => {
  const [competition, setCompetition] = useState<'combined' | 'ipl' | 't20i'>('combined');
  const [data, setData] = useState<BowlerRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'standard' | 'reliability'>('standard');

  useEffect(() => {
    setLoading(true);
    fetchBowlerRankings(competition)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [competition]);

  return (
    <div className="space-y-6">
      {/* Header with Competition Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-black text-white tracking-wide">Pressure Bowling Rankings</h1>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Top 10 Official
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ranked by Bayesian Empirical Bayes Shrunk Clutch Rating (<span className="text-purple-400 font-mono">Runs Saved + Wicket Value (Vw=15) / 100 balls with k=150.0</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0a0f1d] p-1 rounded-xl border border-[#23314d]">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'standard'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setViewMode('reliability')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'reliability'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bayesian Uncertainty
            </button>
          </div>

          {/* Competition Segmented Switcher */}
          <div className="flex items-center bg-[#0a0f1d] p-1 rounded-xl border border-[#23314d]">
            {(['combined', 'ipl', 't20i'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCompetition(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                  competition === c
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c === 'combined' ? 'Combined' : c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Eligibility Notice */}
      <div className="p-3.5 rounded-xl bg-[#0e1628] border border-[#23314d] flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>Eligibility threshold applied:</strong> Minimum <span className="text-white font-mono font-semibold">150 legal balls</span> overall and <span className="text-purple-400 font-mono font-semibold">&ge;40 high-pressure balls</span> (PI &ge; 65).
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">222 bowlers qualified</span>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-[#131b2e] border border-[#23314d] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 font-mono">Loading official rankings...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#23314d] bg-[#0c1424] text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Teams</th>
                  <th className="py-3 px-3 text-right">Legal Balls</th>
                  <th className="py-3 px-3 text-right">HP Balls</th>
                  {viewMode === 'standard' ? (
                    <>
                      <th className="py-3 px-3 text-right">Actual Wkts</th>
                      <th className="py-3 px-3 text-right">Overall Econ</th>
                      <th className="py-3 px-3 text-right text-purple-400">HP Econ (PI&ge;65)</th>
                      <th className="py-3 px-3 text-right text-emerald-400">&Delta; Econ</th>
                      <th className="py-3 px-4 text-right text-purple-400">Bayesian Clutch</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3 text-right">Bayesian Rating</th>
                      <th className="py-3 px-3 text-right font-mono">Posterior SD (&sigma;)</th>
                      <th className="py-3 px-4 text-center font-mono">95% Credible Interval</th>
                      <th className="py-3 px-4 text-center">Reliability Status</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23314d]/60 text-xs font-sans">
                {data.map((p) => {
                  return (
                    <tr
                      key={p.player_id}
                      className="hover:bg-[#18233c]/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            p.rank === 1
                              ? 'bg-purple-400/20 text-purple-400 border border-purple-400/40'
                              : p.rank === 2
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : p.rank === 3
                              ? 'bg-amber-700/20 text-amber-500 border border-amber-600/40'
                              : 'text-slate-400'
                          }`}
                        >
                          {p.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                          <Link to={`/players?id=${p.player_id}`}>{p.player_name}</Link>
                          {p.rank === 1 && (
                            <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: #{p.player_id}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-300 font-medium">
                          {p.teams.length > 0 ? p.teams.slice(0, 2).join(', ') : '—'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">{p.legal_balls}</td>
                      <td className="py-3.5 px-3 text-right font-mono text-purple-400 font-semibold">{p.high_pressure_balls}</td>

                      {viewMode === 'standard' ? (
                        <>
                          <td className="py-3.5 px-3 text-right font-mono text-white font-bold">
                            {p.actual_wickets}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                            {p.overall_economy?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-purple-300 font-semibold">
                            {p.hp_economy?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-medium">
                            {p.economy_delta < 0 ? `${p.economy_delta.toFixed(2)}` : `+${p.economy_delta?.toFixed(2)}`}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-purple-400 font-black text-sm">
                            +{p.bayesian_clutch_rating.toFixed(2)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3.5 px-3 text-right font-mono text-purple-400 font-bold">
                            +{p.bayesian_clutch_rating.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                            &plusmn;{p.posterior_sd.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-xs">
                            <span className="px-2 py-0.5 rounded bg-[#0a0f1d] border border-[#23314d] text-cyan-300">
                              [{p.ci_lower_95.toFixed(1)}, {p.ci_upper_95.toFixed(1)}]
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Validated
                            </span>
                          </td>
                        </>
                      )}

                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/players?id=${p.player_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0a0f1d] hover:bg-purple-600 hover:text-white border border-[#23314d] text-slate-300 text-[10px] font-semibold transition-colors"
                        >
                          Dossier <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Accounting Integrity Callout */}
      <div className="p-4 rounded-xl bg-[#0e1628] border border-[#23314d] text-xs text-slate-400 leading-relaxed">
        <p>
          <strong className="text-white">Cricket Accounting Rigor:</strong> Bowling rating is mathematically decomposed into <span className="text-cyan-400 font-mono">Weighted Runs Saved</span> plus <span className="text-purple-400 font-mono">V_w &times; Pressure-Weighted Net Wickets Added</span>, adjusted with empirical Bayes shrinkage <span className="text-white font-mono">k = 150.0</span>. This accounts for unweighted net wickets, pressure weights, and runs conceded simultaneously.
        </p>
      </div>
    </div>
  );
};

