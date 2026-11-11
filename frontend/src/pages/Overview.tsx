import React, { useEffect, useState } from 'react';
import { fetchOverview, OverviewData } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, ShieldCheck, Flame, Zap } from 'lucide-react';
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
  const barColors = ['#94a3b8', '#64748b', '#365e91', '#be185d', '#831843'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Section A: Editorial Introduction */}
      <div className="border-b border-[#e2e6ec] pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#be185d] mb-1">
          SupeRR Selector Season 2 &bull; Independent analytics prototype
        </div>
        <h1 className="text-2xl font-bold text-[#17263c] tracking-tight">
          ClutchIQ — Unified Pressure-First Scouting Intelligence
        </h1>
        <p className="text-sm text-[#64748b] mt-1 max-w-3xl leading-relaxed">
          Evaluating player capability across the entire match arc using our validated three-dimensional framework: 
          <strong> 70% V3 Match Pressure Performance</strong>, <strong>20% PPI Pressure Prevention</strong>, and <strong>10% Match Consistency</strong>, 
          stratified by direct crisis evidence tiers.
        </p>
      </div>

      {/* Section B: Essential Key Statistics */}
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
            <div className="text-xs text-[#64748b]">Matches Analysed</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.total_matches.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">371 IPL &bull; 482 T20I</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
            <div className="text-xs text-[#64748b]">Legal Deliveries</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.total_legal_balls.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">Primary fair balls only</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
            <div className="text-xs text-[#64748b]">High-Pressure Balls</div>
            <div className="text-2xl font-bold text-[#be185d] mt-1 font-mono">
              {kpis.high_pressure_deliveries.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">Pressure Index &ge; 65.0</div>
          </div>

          <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
            <div className="text-xs text-[#64748b]">Eligible Scouting Cohort</div>
            <div className="text-2xl font-bold text-[#17263c] mt-1 font-mono">
              {kpis.eligible_batters + kpis.eligible_bowlers}
            </div>
            <div className="text-[11px] text-[#94a3b8] mt-0.5">239 Batters &bull; 258 Bowlers (&ge;150 balls)</div>
          </div>
        </div>

        {/* Collapsible Dataset Metadata */}
        <div className="mt-3">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="text-xs text-[#365e91] hover:text-[#25446b] flex items-center gap-1 font-medium"
          >
            {showMetadata ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showMetadata ? 'Hide methodology & evidence tier architecture' : 'View methodology & evidence tier architecture'}
          </button>

          {showMetadata && (
            <div className="mt-2 p-3.5 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#64748b] space-y-1.5 leading-relaxed">
              <div>
                <strong>Unified Architecture (70 / 20 / 10):</strong> Combines Crisis Execution (70% V3), Early Prevention (20% PPI), and Match-to-Match Consistency (10%). Calibrated onto a standardized $[0, 100]$ scale where $50.0$ represents baseline replacement equity.
              </div>
              <div>
                <strong>Three-Tier Evidence Classification:</strong> Replaces hard cutoffs with transparent exposure labels: 
                <span className="text-[#166534] font-medium"> Strong Direct Evidence (&ge;150 HP balls)</span>, 
                <span className="text-[#1e40af] font-medium"> Moderate Direct Evidence (40–149 HP balls)</span>, and 
                <span className="text-[#92400e] font-medium"> Limited Direct Evidence (&lt;40 HP balls)</span>.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section C: Primary SupeRR 10 Shortlists Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Batters */}
        <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#be185d]" />
                <h2 className="text-sm font-bold text-[#17263c]">SupeRR 10 — Batters</h2>
              </div>
              <Link
                to="/batters"
                className="text-xs font-semibold text-[#be185d] hover:underline flex items-center gap-1"
              >
                Full Leaderboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-[11px] text-[#94a3b8] pb-1">
                  <th className="py-1 text-center w-8">#</th>
                  <th className="py-1">Batter</th>
                  <th className="py-1">Evidence Tier</th>
                  <th className="py-1 text-right">HP Balls</th>
                  <th className="py-1 text-right">SupeRR Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {data.top5_batters.map((b, i) => (
                  <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                    <td className="py-2.5 text-center font-mono text-[#64748b]">{i + 1}</td>
                    <td className="py-2.5">
                      <Link to={`/players?id=${b.player_id}`} className="font-semibold text-[#17263c] hover:text-[#be185d]">
                        {b.player_name}
                      </Link>
                      <div className="text-[10px] text-[#94a3b8]">{b.teams.join(', ')}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                        b.evidence_tier?.includes('Strong') ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                        b.evidence_tier?.includes('Moderate') ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]' :
                        'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                      }`}>
                        {b.evidence_tier?.includes('Strong') ? 'Strong' : b.evidence_tier?.includes('Moderate') ? 'Moderate' : 'Limited'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#64748b]">{b.high_pressure_legal_balls || '—'}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-sm text-[#be185d]">
                      {b.integrated_pressure_score ? b.integrated_pressure_score.toFixed(1) : b.clutch_rating.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#94a3b8] pt-3 border-t border-[#f1f5f9] mt-3">
            Integrated 70% V3 Crisis + 20% PPI Prevention + 10% Consistency.
          </div>
        </div>

        {/* Top Bowlers */}
        <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e6ec] mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0369a1]" />
                <h2 className="text-sm font-bold text-[#17263c]">SupeRR 10 — Bowlers</h2>
              </div>
              <Link
                to="/bowlers"
                className="text-xs font-semibold text-[#be185d] hover:underline flex items-center gap-1"
              >
                Full Leaderboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9] text-[11px] text-[#94a3b8] pb-1">
                  <th className="py-1 text-center w-8">#</th>
                  <th className="py-1">Bowler</th>
                  <th className="py-1">Evidence Tier</th>
                  <th className="py-1 text-right">HP Balls</th>
                  <th className="py-1 text-right">SupeRR Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {data.top5_bowlers.map((b, i) => (
                  <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                    <td className="py-2.5 text-center font-mono text-[#64748b]">{i + 1}</td>
                    <td className="py-2.5">
                      <Link to={`/players?id=${b.player_id}`} className="font-semibold text-[#17263c] hover:text-[#be185d]">
                        {b.player_name}
                      </Link>
                      <div className="text-[10px] text-[#94a3b8]">{b.teams.join(', ')}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                        b.evidence_tier?.includes('Strong') ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                        b.evidence_tier?.includes('Moderate') ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]' :
                        'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                      }`}>
                        {b.evidence_tier?.includes('Strong') ? 'Strong' : b.evidence_tier?.includes('Moderate') ? 'Moderate' : 'Limited'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[#64748b]">{b.high_pressure_legal_balls || '—'}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-sm text-[#be185d]">
                      {b.integrated_pressure_score ? b.integrated_pressure_score.toFixed(1) : b.clutch_rating.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#94a3b8] pt-3 border-t border-[#f1f5f9] mt-3">
            Integrated 70% V3 Crisis Defending + 20% PPI + 10% Consistency.
          </div>
        </div>
      </div>

      {/* Section D: Evidence-Based Scouting Highlights */}
      <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs">
        <h2 className="text-sm font-bold text-[#17263c] mb-3">Scouting Highlights &amp; Evidence Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#be185d] mb-1">Early-Tempo Surge (Limited HP)</div>
              <h3 className="text-xs font-bold text-[#17263c]">Vaibhav Sooryavanshi</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Leads all batters with an 81.83 Integrated Score, driven by a 220.87 Powerplay strike rate and +58.19 PPI. Evidence Tier: Limited Direct Evidence (8 HP balls).
              </p>
            </div>
            <Link to="/players?id=50284" className="mt-3 text-xs font-semibold text-[#be185d] hover:underline flex items-center gap-1">
              Inspect Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#0369a1] mb-1">Crisis Proven Volume (Strong HP)</div>
              <h3 className="text-xs font-bold text-[#17263c]">Tim David</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Possesses Strong Direct Evidence with 497 high-pressure legal balls, sustaining an elite +31.58 V3 clutch rating and 70.67 Integrated Score across 1,210 balls.
              </p>
            </div>
            <Link to="/players?id=6396" className="mt-3 text-xs font-semibold text-[#be185d] hover:underline flex items-center gap-1">
              Inspect Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#166534] mb-1">Death Bowling Anchor (Moderate HP)</div>
              <h3 className="text-xs font-bold text-[#17263c]">Matheesha Pathirana</h3>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                Pairs 88 high-pressure death balls with an unmatched 70.4% match-to-match consistency rate and +21.29 clutch rating, earning a 66.37 SupeRR score.
              </p>
            </div>
            <Link to="/players?id=8661" className="mt-3 text-xs font-semibold text-[#be185d] hover:underline flex items-center gap-1">
              Inspect Dossier <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Section E: Pressure Distribution Chart */}
      <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#17263c]">Pre-Delivery Pressure Tier Distribution</h2>
          <p className="text-xs text-[#64748b]">Distribution across 185,715 fair legal balls, highlighting the high-pressure threshold (&ge;65.0).</p>
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
