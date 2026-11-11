import React, { useEffect, useState } from 'react';
import { fetchPressureIntelligence } from '../services/api';
import { Activity, ShieldAlert, Zap, Layers, Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export const PressureIntelligence: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPressureIntelligence()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-2">
        <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-400 font-mono">Loading pressure dynamics...</span>
      </div>
    );
  }

  const bpiBins = data.batter_pressure_distribution || [];
  const bowlBins = data.bowler_pressure_distribution || [];
  const thresholds = data.thresholds || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-black text-white tracking-wide">Pressure Intelligence Architecture</h1>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Validated Architecture v2.0
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Mathematical formulation of Batter Pressure Index (<span className="text-cyan-400 font-mono">BPI</span>) and Bowler Pressure Index (<span className="text-purple-400 font-mono">BowlerPI</span>)
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1628] border border-[#23314d]">
          <div className="flex items-center gap-2 mb-2 text-pink-400 font-bold text-xs">
            <Zap className="w-4 h-4" /> Strictly Pre-Delivery
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Zero future leakage. All pressure inputs (wickets lost, balls remaining, run rate deficit, win probability leverage) are evaluated immediately before delivery execution.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1628] border border-[#23314d]">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs">
            <Layers className="w-4 h-4" /> Asymmetric Roles
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Batting pressure rises quadratically as balls extinguish with high required rates. Bowler pressure spikes when defending small totals or bowling death overs to elite power-hitters.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1628] border border-[#23314d]">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" /> Super Over Isolation
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Super Overs are high-leverage micro-states audited independently and assigned a dedicated phase label, avoiding synthetic 100-index distortion of standard 20-over play.
          </p>
        </div>
      </div>

      {/* Tier Breakdown Table */}
      <div className="rounded-2xl bg-[#131b2e] border border-[#23314d] overflow-hidden">
        <div className="p-4 bg-[#0c1424] border-b border-[#23314d]">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Standardized Pressure Tiers &amp; Thresholds
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#23314d] text-[10px] font-mono uppercase text-slate-400 bg-[#0e1628]">
                <th className="py-2.5 px-4">Tier</th>
                <th className="py-2.5 px-4 font-mono">Range</th>
                <th className="py-2.5 px-4">Match Context &amp; Operational Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23314d]/60 font-sans">
              {thresholds.map((t: any) => (
                <tr key={t.tier} className="hover:bg-[#18233c]/60">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      t.tier === 'MAXIMUM' ? 'bg-rose-500/20 text-rose-400' :
                      t.tier === 'EXTREME' ? 'bg-pink-500/20 text-pink-400' :
                      t.tier === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                      t.tier === 'MODERATE' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {t.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">{t.range}</td>
                  <td className="py-3 px-4 text-slate-300">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Comparison Chart */}
      <div className="p-5 rounded-2xl bg-[#131b2e] border border-[#23314d]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
          Deliveries by Pressure Tier (185,715 Audited Legal Balls)
        </h3>
        <p className="text-[11px] text-slate-400 mb-4">
          Empirical distribution demonstrating balanced scaling without artificial clustering at boundary limits
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bpiBins}>
              <XAxis dataKey="tier" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1527', borderColor: '#23314d', borderRadius: 8, fontSize: 11 }}
                formatter={(val: any) => [val.toLocaleString(), 'Deliveries']}
              />
              <Bar dataKey="deliveries" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

