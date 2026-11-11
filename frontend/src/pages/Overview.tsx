import React, { useEffect, useState } from 'react';
import { fetchOverview, OverviewData } from '../services/api';
import {
  Flame,
  Target,
  Users,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const Overview: React.FC = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-mono">Loading ClutchIQ analytical engine...</p>
        </div>
      </div>
    );
  }

  const kpis = data.kpis;
  const colors = ['#38bdf8', '#3b82f6', '#f59e0b', '#f97316', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c1a3e] via-[#121c38] to-[#0d1527] border border-[#23314d] relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">
              Official Scouting Dossier
            </span>
            <span className="text-xs text-slate-400 font-mono">IPL & Senior T20I Cohort</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ClutchIQ — Pressure Performance & Scouting Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Quantifying high-leverage clutch impact across 853 elite T20 matches using empirical Bayes shrinkage (<span className="text-pink-400 font-mono">k = 150.0</span>) and pre-delivery dynamic leverage. Objectively isolating true match-winning execution when win probability is volatile.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-pink-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Audited Matches</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{kpis.total_matches.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">371 IPL / 482 T20I</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Legal Balls</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{kpis.total_legal_balls.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">{kpis.total_deliveries.toLocaleString()} recorded</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">High Pressure Balls</span>
            <ShieldAlert className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl font-black text-pink-400 font-mono">{kpis.high_pressure_deliveries.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">24.7% of total balls (PI &ge; 65)</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Eligible Batters</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">{kpis.eligible_batters}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">&ge;150 balls &amp; &ge;40 HP balls</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Eligible Bowlers</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400 font-mono">{kpis.eligible_bowlers}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">&ge;150 balls &amp; &ge;40 HP balls</div>
        </div>

        <div className="p-4 rounded-xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Shrinkage Factor</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">k = 150.0</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Laplacian / Bayes prior</div>
        </div>
      </div>

      {/* Top 5 Batters & Bowlers Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batters Top 5 */}
        <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Top 5 Pressure Batters</h2>
            </div>
            <Link
              to="/batters"
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              View Full Top 10 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data.top5_batters.map((b, i) => (
              <Link
                key={b.player_id}
                to={`/players?id=${b.player_id}`}
                className="p-3 rounded-xl bg-[#0e1628] hover:bg-[#18233c] border border-[#23314d]/60 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-2">
                      {b.player_name}
                      <span className="text-[10px] font-mono text-slate-400">{b.teams.join(', ')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono flex items-center gap-3">
                      <span>HP SR: <span className="text-white font-medium">{b.high_pressure_metric.toFixed(1)}</span></span>
                      <span>SR Delta: <span className="text-emerald-400 font-medium">+{b.metric_delta?.toFixed(1)}</span></span>
                      <span>Balls: {b.legal_balls}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black font-mono text-amber-400">
                    +{b.clutch_rating.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    95% CI: [{b.ci_lower.toFixed(1)}, {b.ci_upper.toFixed(1)}]
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bowlers Top 5 */}
        <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Top 5 Pressure Bowlers</h2>
            </div>
            <Link
              to="/bowlers"
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              View Full Top 10 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data.top5_bowlers.map((b, i) => (
              <Link
                key={b.player_id}
                to={`/players?id=${b.player_id}`}
                className="p-3 rounded-xl bg-[#0e1628] hover:bg-[#18233c] border border-[#23314d]/60 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-2">
                      {b.player_name}
                      <span className="text-[10px] font-mono text-slate-400">{b.teams.join(', ')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono flex items-center gap-3">
                      <span>HP Econ: <span className="text-white font-medium">{b.high_pressure_metric.toFixed(2)}</span></span>
                      <span>Econ &Delta;: <span className="text-emerald-400 font-medium">{b.metric_delta?.toFixed(2)}</span></span>
                      <span>Balls: {b.legal_balls}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black font-mono text-purple-400">
                    +{b.clutch_rating.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    95% CI: [{b.ci_lower.toFixed(1)}, {b.ci_upper.toFixed(1)}]
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Pressure Tier Distribution & Scouting Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Distribution Chart */}
        <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ActivityIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Pressure Index Distribution</h3>
            </div>
            <p className="text-[11px] text-slate-400">185,715 legal balls categorized by pre-delivery pressure tiers</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pressure_tier_distribution}>
                <XAxis dataKey="tier" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1527', borderColor: '#23314d', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [val.toLocaleString(), 'Deliveries']}
                />
                <Bar dataKey="deliveries" radius={[4, 4, 0, 0]}>
                  {data.pressure_tier_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between border-t border-[#23314d] pt-2">
            <span>High Pressure threshold: &ge; 65.0</span>
            <span className="text-pink-400 font-semibold">45,825 Balls (24.7%)</span>
          </div>
        </div>

        {/* Key Scouting Insights */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Scouting Intelligence Highlights</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Audited Key Findings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.insights.map((ins, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0e1628] border border-[#23314d]/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      {ins.category.replace('_', ' ')}
                    </span>
                    <Link
                      to={`/players?id=${ins.player_id}`}
                      className="text-[10px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                    >
                      Dossier <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{ins.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{ins.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#0a0f1d] border border-amber-500/20 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-amber-400 font-semibold">Dual-League Equivalence Note:</strong> IPL and T20I exhibit statistically divergent scoring environments (IPL mean 8.52 rpo vs T20I 7.91 rpo). Player clutch ratings incorporate league-standardized baselines to prevent cross-competition dilution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
