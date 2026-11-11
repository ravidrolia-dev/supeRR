import React, { useEffect, useState } from 'react';
import { fetchPressureIntelligence } from '../services/api';
import { ChevronDown, ChevronUp, ShieldCheck, Flame, Scale, HelpCircle } from 'lucide-react';
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8] mb-2">
          V3 Match Context &amp; Prevention Framework
        </div>
        <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Pressure Intelligence Architecture</h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Dual-vector scouting intelligence: Quantifying direct performance in acute crisis (V3) alongside proactive pressure prevention (PPI).
        </p>
      </div>

      {/* The Two Distinct Scouting Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-[#fdf2f8] text-[#be185d]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17263c]">Dimension 1: Pressure Performance (70% Weight)</div>
              <div className="text-[11px] text-[#64748b] font-mono">"How well does the player perform when crisis exists?"</div>
            </div>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Evaluates contextual runs added/saved and wicket impact under pre-delivery high-pressure states (BPI &ge; 65.0).
            This is the <strong>dominant core requirement</strong> for primary scouting selection. High early-phase run volume can never substitute for lack of evidence in high-leverage deliveries.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-[#f0fdf4] text-[#16845b]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17263c]">Dimension 2: Pressure Prevention (20% Weight)</div>
              <div className="text-[11px] text-[#64748b] font-mono">"How well does the player prevent pressure from emerging?"</div>
            </div>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Measures dominance in low-pressure and Powerplay overs (overs 1–6) via boundary suppression, explosive run generation, and par surplus creation.
            PPI is strictly <strong>supporting contextual intelligence</strong>. Players like Vaibhav Sooryavanshi prevent pressure, but their profile must carry an evidence tier badge until tested in deep crisis.
          </p>
        </div>
      </div>

      {/* Core Analytical Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Strictly Pre-Delivery (Zero Leakage)</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            All variables (wickets in hand, balls remaining, required run rate, leverage) are evaluated prior to release. No outcome lookahead biases the pressure calculation.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Empirical Bayes Shrinkage (k = 150)</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Small-sample volatility is controlled through Bayesian pooling toward empirical role means, providing reliable 95% posterior credible intervals.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] mb-1">Three-Tier Direct Evidence Hierarchy</div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Instead of arbitrary exclusion cutoffs, players are stratified into Strong (&ge;150 HP balls), Moderate (40–149 HP balls), and Limited (&lt;40 HP balls) direct evidence tiers.
          </p>
        </div>
      </div>

      {/* Standardized Pressure Tiers */}
      <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#e2e6ec]">
          <h2 className="text-sm font-bold text-[#17263c]">V3 Pre-Delivery Pressure Tiers &amp; Thresholds</h2>
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
          Delivery Distribution Across Pressure Tiers (185,715 Legal Balls)
        </h3>
        <p className="text-xs text-[#64748b] mb-4">
          Empirical distribution across 853 senior matches (371 IPL, 482 T20Is). 45,820 deliveries (24.7%) qualify as High-Pressure (BPI &ge; 65.0).
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
          <span>Mathematical Formulation &amp; Unified Scoring Weights</span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="mt-4 pt-3 border-t border-[#e2e6ec] text-xs text-[#64748b] space-y-3 font-mono leading-relaxed">
            <p className="text-[#17263c] font-semibold font-sans">
              Unified Integrated Pressure Score (Provisional 70 / 20 / 10 Architecture):
            </p>
            <div className="p-3 bg-[#f8fafc] border border-[#e2e6ec] rounded text-[11px] text-[#17263c] space-y-1">
              <div>Integrated Score = 0.70 &times; Pressure_Perf + 0.20 &times; Pressure_Prev + 0.10 &times; Match_Consistency</div>
              <div>Credible Interval: Posterior &theta; &plusmn; 1.96 &times; &sigma;_posterior, where &sigma;_posterior = &sigma; / &radic;(n_legal + k)</div>
            </div>
            <p>
              BPI = 100 &times; clamp(0.40 &times; Leverage + 0.35 &times; Scarcity + 0.25 &times; Deficit, 0, 1)
            </p>
            <p>
              BowlerPI = 100 &times; clamp(0.45 &times; Leverage + 0.35 &times; DeathRisk + 0.20 &times; ParDefend, 0, 1)
            </p>
            <p className="font-sans text-[11px] text-[#94a3b8]">
              Both indices are continuously bounded to [0, 100]. The 70/20/10 weighting is provisional pending ongoing seasonal validation and ensures scouts maintain a strict pressure-first evaluation framework.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
