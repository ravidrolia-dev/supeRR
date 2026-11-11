import React, { useEffect, useState } from 'react';
import { fetchPressureIntelligence } from '../services/api';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const PressureIntelligence: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    fetchPressureIntelligence()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs text-[#64748b]">Loading pressure intelligence report...</div>
    );
  }

  const bpiBins = data.batter_pressure_distribution || [];
  const thresholds = data.thresholds || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#e2e6ec]">
        <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Pressure Intelligence Architecture</h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Mathematical formulation of pre-delivery Batter Pressure Index (BPI) and Bowler Pressure Index (BowlerPI).
        </p>
      </div>

      {/* Core Analytical Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Strictly Pre-Delivery</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            All variables (wickets in hand, balls remaining, required run rate, leverage) are evaluated prior to release, eliminating lookahead leakage.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Dynamic Match Leverage</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Pressure reflects how sharply win probability shifts on a single ball, scaling dynamically rather than using arbitrary over thresholds.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Super Over Segregation</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Super Overs are treated as distinct high-leverage micro-states rather than automatically setting BPI=100 for every delivery.
          </p>
        </div>
      </div>

      {/* Standardized Pressure Tiers */}
      <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e6ec]">
          <h2 className="text-sm font-bold text-[#17263c]">Standardized Pressure Tiers &amp; Thresholds</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                <th className="py-2.5 px-4 w-28">Tier</th>
                <th className="py-2.5 px-4 w-28 font-mono">Range</th>
                <th className="py-2.5 px-4">Operational Definition &amp; Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {thresholds.map((t: any) => (
                <tr key={t.tier} className="hover:bg-[#f8fafc]">
                  <td className="py-3 px-4 font-semibold text-[#17263c]">{t.tier}</td>
                  <td className="py-3 px-4 font-mono text-[#365e91] font-medium">{t.range}</td>
                  <td className="py-3 px-4 text-[#64748b] leading-relaxed">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-md border border-[#e2e6ec] p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#17263c] mb-1">
          Delivery Distribution by Pressure Tier (185,715 Legal Balls)
        </h3>
        <p className="text-xs text-[#64748b] mb-4">
          Shows balanced empirical scaling across match states with 45,825 high-pressure deliveries (&ge;65.0).
        </p>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bpiBins}>
              <XAxis dataKey="tier" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e6ec', borderRadius: 6, fontSize: 11 }}
                formatter={(val: any) => [val.toLocaleString(), 'Deliveries']}
              />
              <Bar dataKey="deliveries" fill="#365e91" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expandable Technical Formulas */}
      <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs font-semibold text-[#365e91] hover:text-[#25446b] flex items-center justify-between w-full text-left"
        >
          <span>Mathematical Formulation Specifications</span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="mt-4 pt-3 border-t border-[#e2e6ec] text-xs text-[#64748b] space-y-3 font-mono leading-relaxed">
            <p>
              BPI = 100 &times; clamp(0.40 &times; Leverage + 0.35 &times; Scarcity + 0.25 &times; Deficit, 0, 1)
            </p>
            <p>
              BowlerPI = 100 &times; clamp(0.45 &times; Leverage + 0.35 &times; DeathRisk + 0.20 &times; ParDefend, 0, 1)
            </p>
            <p className="font-sans text-[11px] text-[#94a3b8]">
              Both indices are continuously bounded to [0, 100]. Chase confidence segregation guarantees that balls facing uncertain or estimated targets are handled with par baselines rather than unconfirmed target scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
