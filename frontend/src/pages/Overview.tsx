import React, { useEffect, useState } from 'react';
import { fetchOverview, OverviewData } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showMetadata, setShowMetadata] = useState(false);

  useEffect(() => {
    fetchOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs text-[#64748b]">Loading intelligence overview...</div>
      </div>
    );
  }

  const kpis = data.kpis;
  const barColors = ['#94a3b8', '#64748b', '#365e91', '#d92779', '#9d174d'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Section A: Editorial Introduction */}
      <div className="border-b border-[#e2e6ec] pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#d92779] mb-1">
          SupeRR Selector Season 2 &bull; Independent analytics prototype
        </div>
        <h1 className="text-2xl font-bold text-[#17263c] tracking-tight">
          ClutchIQ — Pressure Performance Intelligence
        </h1>
        <p className="text-sm text-[#64748b] mt-1 max-w-3xl leading-relaxed">
          Identifying players who outperform expectations when match situations become difficult. Evaluated using pre-delivery leverage modeling and empirical Bayes shrinkage (<span className="font-mono text-[#17263c]">k = 150.0</span>) across elite T20 cricket.
        </p>
      </div>

      {/* Section B: Essential Key Statistics */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-md bg-white border border-[#e2e6ec]">
            <div className="text-xs text-[#64748b]">Matches Analysed</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.total_matches.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">371 IPL &bull; 482 T20I</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec]">
            <div className="text-xs text-[#64748b]">Legal Balls Analysed</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.total_legal_balls.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">Fair deliveries only</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec]">
            <div className="text-xs text-[#64748b]">High-Pressure Legal Balls</div>
            <div className="text-2xl font-bold text-[#d92779] mt-1 font-mono">
              {kpis.high_pressure_deliveries.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">24.7% of total (PI &ge; 65.0)</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec]">
            <div className="text-xs text-[#64748b]">Eligible Players</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.eligible_batters + kpis.eligible_bowlers}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">180 Batters &bull; 222 Bowlers</div>
          </div>
        </div>

        {/* Collapsible Dataset Metadata */}
        <div className="mt-3">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="text-xs text-[#365e91] hover:text-[#25446b] flex items-center gap-1 font-medium"
          >
            {showMetadata ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showMetadata ? 'Hide dataset scope & accounting details' : 'View dataset scope & accounting details'}
          </button>

          {showMetadata && (
            <div className="mt-2 p-3.5 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#64748b] space-y-1.5 leading-relaxed">
              <div>
                <strong>Accounting Breakdown:</strong> The master database encompasses <strong>194,014 total recorded deliveries</strong>, of which <strong>185,715 are legal deliveries</strong> and <strong>8,299 are extras</strong> (wides and no-balls). Rate calculations and balls-faced metrics strictly use fair legal balls as denominators.
              </div>
              <div>
                <strong>Eligibility Thresholds:</strong> Minimum 150 legal balls overall and &ge;40 high-pressure legal balls (&ge;65.0 pressure index) within the respective discipline.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section C: Leading Performers Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Batters */}
        <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-3">
              <h2 className="text-sm font-bold text-[#17263c]">Top Batters Under Pressure</h2>
              <Link
                to="/batters"
                className="text-xs font-semibold text-[#d92779] hover:underline flex items-center gap-1"
              >
                Complete Top 10 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-[11px] text-[#94a3b8] pb-1">
                  <th className="py-1 text-center w-8">#</th>
                  <th className="py-1">Player</th>
                  <th className="py-1 text-right">HP SR</th>
                  <th className="py-1 text-right">Balls</th>
                  <th className="py-1 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {data.top5_batters.map((b, i) => (
                  <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                    <td className="py-2.5 text-center font-mono text-[#64748b]">{i + 1}</td>
                    <td className="py-2.5">
                      <Link to={`/players?id=${b.player_id}`} className="font-semibold text-[#17263c] hover:text-[#d92779]">
                        {b.player_name}
                      </Link>
                      <div className="text-[10px] text-[#94a3b8]">{b.teams.join(', ')}</div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#17263c]">{b.high_pressure_metric.toFixed(1)}</td>
                    <td className="py-2.5 text-right font-mono text-[#64748b]">{b.legal_balls}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#365e91]">+{b.clutch_rating.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#94a3b8] pt-3 border-t border-[#f1f5f9] mt-3">
            Ranked by Bayesian shrunk runs added per 100 balls (k=150.0).
          </div>
        </div>

        {/* Top Bowlers */}
        <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-3">
              <h2 className="text-sm font-bold text-[#17263c]">Top Bowlers Under Pressure</h2>
              <Link
                to="/bowlers"
                className="text-xs font-semibold text-[#d92779] hover:underline flex items-center gap-1"
              >
                Complete Top 10 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-[11px] text-[#94a3b8] pb-1">
                  <th className="py-1 text-center w-8">#</th>
                  <th className="py-1">Player</th>
                  <th className="py-1 text-right">HP Econ</th>
                  <th className="py-1 text-right">Balls</th>
                  <th className="py-1 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {data.top5_bowlers.map((b, i) => (
                  <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                    <td className="py-2.5 text-center font-mono text-[#64748b]">{i + 1}</td>
                    <td className="py-2.5">
                      <Link to={`/players?id=${b.player_id}`} className="font-semibold text-[#17263c] hover:text-[#d92779]">
                        {b.player_name}
                      </Link>
                      <div className="text-[10px] text-[#94a3b8]">{b.teams.join(', ')}</div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#17263c]">{b.high_pressure_metric.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-mono text-[#64748b]">{b.legal_balls}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#16845b]">+{b.clutch_rating.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#94a3b8] pt-3 border-t border-[#f1f5f9] mt-3">
            Ranked by runs saved + wicket replacement equity (Vw=15, k=150.0).
          </div>
        </div>
      </div>

      {/* Section D: Evidence-Based Scouting Highlights (Max 3) */}
      <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs">
        <h2 className="text-sm font-bold text-[#17263c] mb-3">Key Evidence-Based Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#365e91] mb-1">Batting Acceleration</div>
              <h3 className="text-xs font-bold text-[#17263c]">Naman Dhir</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Accelerates from 158.7 to 206.1 strike rate under high pressure (+47.3 delta), generating the highest clutch score (+33.34) across 180 qualified batters.
              </p>
            </div>
            <Link to="/players?id=37052" className="mt-3 text-xs font-semibold text-[#d92779] hover:underline flex items-center gap-1">
              View Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#16845b] mb-1">High-Volume Reliability</div>
              <h3 className="text-xs font-bold text-[#17263c]">Tim David</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Faces the heaviest high-pressure diet (33.8% of balls at &ge;65 pressure), sustaining a 181.3 high-pressure strike rate across 1,210 legal deliveries.
              </p>
            </div>
            <Link to="/players?id=6396" className="mt-3 text-xs font-semibold text-[#d92779] hover:underline flex items-center gap-1">
              View Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#d92779] mb-1">Strike Wicket Impact</div>
              <h3 className="text-xs font-bold text-[#17263c]">Mark Wood</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Took 14 high-pressure wickets at an 8.18 economy, producing +101.6 raw runs saved/100 balls and leading combined bowlers with a +66.95 shrunk rating.
              </p>
            </div>
            <Link to="/players?id=2985" className="mt-3 text-xs font-semibold text-[#d92779] hover:underline flex items-center gap-1">
              View Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section E: Pressure Distribution Chart */}
      <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#17263c]">Pre-Delivery Pressure Tier Distribution</h2>
          <p className="text-xs text-[#64748b]">Distribution across 185,715 fair deliveries, highlighting the 24.7% high-pressure threshold (&ge;65.0).</p>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.pressure_tier_distribution}>
              <XAxis dataKey="tier" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e6ec', borderRadius: 6, fontSize: 11, color: '#17263c' }}
                formatter={(val: any) => [val.toLocaleString(), 'Deliveries']}
              />
              <Bar dataKey="deliveries" radius={[3, 3, 0, 0]}>
                {data.pressure_tier_distribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
