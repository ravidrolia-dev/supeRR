import React, { useEffect, useState } from 'react';
import { fetchBatterRankings, BatterRankingItem } from '../services/api';
import { Flame, ArrowUpDown, ExternalLink, ShieldAlert, Award, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Batters: React.FC = () => {
  const [competition, setCompetition] = useState<'combined' | 'ipl' | 't20i'>('combined');
  const [data, setData] = useState<BatterRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'standard' | 'reliability'>('standard');

  useEffect(() => {
    setLoading(true);
    fetchBatterRankings(competition)
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
            <Flame className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-black text-white tracking-wide">Pressure Batting Rankings</h1>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
              Top 10 Official
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ranked by Bayesian Empirical Bayes Shrunk Clutch Rating (<span className="text-amber-400 font-mono">RAR / 100 balls with k=150.0</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0a0f1d] p-1 rounded-xl border border-[#23314d]">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'standard'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setViewMode('reliability')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'reliability'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow'
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
                    ? 'bg-blue-600 text-white shadow'
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
          <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0" />
          <span>
            <strong>Eligibility threshold applied:</strong> Minimum <span className="text-white font-mono font-semibold">150 legal balls</span> overall and <span className="text-pink-400 font-mono font-semibold">&ge;40 high-pressure balls</span> (PI &ge; 65).
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">180 batters qualified</span>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-[#131b2e] border border-[#23314d] overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
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
                      <th className="py-3 px-3 text-right">Overall SR</th>
                      <th className="py-3 px-3 text-right text-pink-400">HP SR (PI&ge;65)</th>
                      <th className="py-3 px-3 text-right text-emerald-400">&Delta; SR</th>
                      <th className="py-3 px-3 text-right">Matches</th>
                      <th className="py-3 px-4 text-right text-amber-400">Bayesian Clutch</th>
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
                  const isTop3 = p.rank <= 3;
                  return (
                    <tr
                      key={p.player_id}
                      className="hover:bg-[#18233c]/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            p.rank === 1
                              ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
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
                        <div className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                          <Link to={`/players?id=${p.player_id}`}>{p.player_name}</Link>
                          {p.rank === 1 && (
                            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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
                      <td className="py-3.5 px-3 text-right font-mono text-pink-400 font-semibold">{p.high_pressure_balls}</td>

                      {viewMode === 'standard' ? (
                        <>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                            {p.overall_strike_rate?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-pink-300 font-semibold">
                            {p.hp_strike_rate?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-medium">
                            {p.strike_rate_delta > 0 ? `+${p.strike_rate_delta.toFixed(2)}` : p.strike_rate_delta?.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-slate-400">{p.distinct_matches}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-black text-sm">
                            +{p.bayesian_clutch_rating.toFixed(2)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3.5 px-3 text-right font-mono text-amber-400 font-bold">
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
                              High Evidence
                            </span>
                          </td>
                        </>
                      )}

                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/players?id=${p.player_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0a0f1d] hover:bg-pink-600 hover:text-white border border-[#23314d] text-slate-300 text-[10px] font-semibold transition-colors"
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

      {/* Methodology Callout */}
      <div className="p-4 rounded-xl bg-[#0e1628] border border-[#23314d] text-xs text-slate-400 leading-relaxed">
        <p>
          <strong className="text-white">Rating Formula:</strong> Batting Clutch Rating measures net Runs Added Above Replacement (<span className="text-pink-400 font-mono">RAR</span>) per 100 balls, weighted by pre-delivery pressure index (<span className="text-pink-400 font-mono">BPI</span>). Ratings are adjusted toward zero using an empirical Bayes shrinkage factor <span className="text-cyan-400 font-mono">k = 150.0</span> balls to prevent sample-size inflation.
        </p>
      </div>
    </div>
  );
};

