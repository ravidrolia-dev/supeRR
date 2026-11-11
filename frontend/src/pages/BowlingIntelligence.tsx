import React, { useEffect, useState } from 'react';
import { fetchBowlingIntelligence } from '../services/api';
import { Info, ShieldCheck, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const BowlingIntelligence: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVw, setSelectedVw] = useState<number>(15);

  useEffect(() => {
    fetchBowlingIntelligence()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-[#64748b]">Loading bowling valuation engine...</div>
    );
  }

  const rawDecomp = data.decomposition || [];

  // Normalize decomposition keys
  const decomposition = rawDecomp.map((d: any) => ({
    player_id: d.player_id,
    player_name: d.player_name,
    legal_balls: d.legal_balls,
    actual_wickets: d.actual_bowler_wickets ?? d.actual_wickets ?? 0,
    expected_wickets: Number(d.expected_bowler_wickets ?? d.expected_wickets ?? 0),
    unweighted_net_wickets: Number(d.unweighted_net_wickets ?? 0),
    pressure_net_wickets: Number(d.pressure_weighted_net_wickets ?? d.pressure_net_wickets ?? 0),
    weighted_runs_saved: Number(d.weighted_runs_saved ?? 0),
    raw_rbe_per_100: Number(d.raw_clutch_runs_saved_per_100 ?? d.raw_rbe_per_100 ?? 0),
    shrunk_rating: Number(d.bayesian_clutch_rating ?? d.shrunk_rating ?? 0),
    total_clutch_value: Number(d.total_pressure_weighted_value ?? d.total_clutch_value ?? 0),
  }));

  // Chart data showing runs saved vs wicket value component
  const chartData = decomposition.map((d: any) => ({
    name: d.player_name,
    'Runs Saved (Defensive)': d.weighted_runs_saved,
    'Wicket Value (Offensive)': Number((d.pressure_net_wickets * selectedVw).toFixed(2)),
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#e2e6ec]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] mb-2">
          V3 Bowling Intelligence &amp; Evidence Architecture
        </div>
        <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Bowling Valuation &amp; Dual-Vector Accounting</h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Cricket accounting decomposition of V3 Defense Difficulty Index (DDI), defensive runs saved below par, and early-phase pressure prevention.
        </p>
      </div>

      {/* Accounting & Evidence Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#17263c] mb-1">
            <Target className="w-4 h-4 text-[#be185d]" />
            <span>Three Distinct Wicket Metrics</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Must never conflate: (1) Actual bowler wickets, (2) Unweighted net wickets (Actual &minus; Expected), and (3) Pressure-weighted net wickets.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#17263c] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#16845b]" />
            <span>Wicket Replacement (V_w = 15.0)</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            A wicket terminates batting resources. Across T20 empirical match states, 1 high-pressure wicket is worth 15.0 defensive runs saved below par.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#17263c] mb-1">
            <Award className="w-4 h-4 text-[#365e91]" />
            <span>Scouting Evidence Hierarchy</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Only 4 bowlers meet Strong Evidence (&ge;150 HP balls). 64% of bowlers operate with &lt;40 HP balls, requiring clear evidence tier tagging to prevent misidentifying early suppressors as death specialists.
          </p>
        </div>
      </div>

      {/* Primary Decomposition Chart */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#17263c]">Clutch Value Decomposition (Top 10 Combined Bowlers)</h2>
          <p className="text-xs text-[#64748b]">Total Pressure Value = Defensive Runs Saved + {selectedVw} &times; Pressure Net Wickets Added.</p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e6ec', borderRadius: 6, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Runs Saved (Defensive)" fill="#365e91" stackId="a" />
              <Bar dataKey="Wicket Value (Offensive)" fill="#16845b" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounting Table */}
      <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e6ec]">
          <h2 className="text-sm font-bold text-[#17263c]">Exhaustive Decomposition Audit</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                <th className="py-2.5 px-4">Bowler</th>
                <th className="py-2.5 px-3 text-right">Balls</th>
                <th className="py-2.5 px-3 text-right">Actual Wkts</th>
                <th className="py-2.5 px-3 text-right">Exp Wkts</th>
                <th className="py-2.5 px-3 text-right">Net Wkts</th>
                <th className="py-2.5 px-3 text-right">Pressure Net</th>
                <th className="py-2.5 px-3 text-right">Runs Saved</th>
                <th className="py-2.5 px-3 text-right">Raw RBE/100</th>
                <th className="py-2.5 px-4 text-right">Shrunk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] font-mono">
              {decomposition.map((b: any) => (
                <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                  <td className="py-2.5 px-4 font-sans font-semibold text-[#17263c]">{b.player_name}</td>
                  <td className="py-2.5 px-3 text-right text-[#64748b]">{b.legal_balls}</td>
                  <td className="py-2.5 px-3 text-right text-[#17263c] font-medium">{b.actual_wickets}</td>
                  <td className="py-2.5 px-3 text-right text-[#64748b]">{b.expected_wickets.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-[#17263c]">
                    {b.unweighted_net_wickets > 0 ? `+${b.unweighted_net_wickets.toFixed(2)}` : b.unweighted_net_wickets.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#16845b] font-medium">
                    {b.pressure_net_wickets > 0 ? `+${b.pressure_net_wickets.toFixed(2)}` : b.pressure_net_wickets.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#365e91]">
                    {b.weighted_runs_saved > 0 ? `+${b.weighted_runs_saved.toFixed(2)}` : b.weighted_runs_saved.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-[#17263c]">
                    +{b.raw_rbe_per_100.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#16845b]">
                    +{b.shrunk_rating.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#17263c]">Wicket Replacement Sensitivity (V_w)</h3>
            <p className="text-xs text-[#64748b]">Evaluation of rank resilience when weighting wickets from 8 to 20 runs.</p>
          </div>

          <div className="flex items-center gap-1.5">
            {[8, 10, 12, 15, 20].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVw(v)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  selectedVw === v ? 'bg-[#365e91] text-white font-semibold shadow-xs' : 'bg-[#f1f5f9] text-[#64748b] hover:text-[#17263c]'
                }`}
              >
                V_w = {v}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#64748b] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#365e91] shrink-0 mt-0.5" />
          <span>
            At <strong>V_w = {selectedVw}</strong>, strike enforcers like Mark Wood (+66.95 at V_w=15) and Matheesha Pathirana retain top rank stability due to elite high-pressure wicket rates. Even under lower wicket valuations (V_w=8), their volume of pressure wickets keeps them comfortably in the top tier.
          </span>
        </div>
      </div>
    </div>
  );
};
