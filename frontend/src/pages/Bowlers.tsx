import React, { useEffect, useState } from 'react';
import { fetchSupeRR10Bowlers, SupeRR10Item } from '../services/api';
import { Link } from 'react-router-dom';
import { getEvidenceTier } from '../utils/evidenceTiers';

export const Bowlers: React.FC = () => {
  const [data, setData] = useState<SupeRR10Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComponentBreakdown, setShowComponentBreakdown] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSupeRR10Bowlers()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Primary Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2e6ec]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#17263c] tracking-tight">SupeRR 10 — Under-Pressure Bowlers</h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]">
              Unified Pressure-First Leaderboard
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1 max-w-3xl">
            One unified primary ranking evaluating bowlers across the full match arc: 
            <strong> 70% V3 Match Pressure Performance</strong>, <strong>20% PPI Pressure Prevention</strong>, and <strong>10% Match Consistency</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComponentBreakdown(!showComponentBreakdown)}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#e2e6ec] bg-white text-[#17263c] hover:bg-[#f8fafc] transition-colors shadow-xs"
          >
            {showComponentBreakdown ? 'Hide Component Details' : 'Show Component Details'}
          </button>
        </div>
      </div>

      {/* Unified Eligibility & Evidence Tier Guide */}
      <div className="p-3.5 rounded-md bg-[#f8fafc] border border-[#e2e6ec] text-xs text-[#475569] flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
          <span>
            <strong>Unified Scoring Model (70/20/10):</strong> 70% V3 Match Pressure + 20% PPI Prevention + 10% Consistency. Objective rankings remain separate from franchise availability. For RR-specific auction strategy, visit{' '}
            <Link to="/auction" className="text-[#16845b] font-bold hover:underline">
              RR Auction Strategy &rarr;
            </Link>
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#64748b]">
          Evaluated Population: 258 Eligible Bowlers
        </span>
      </div>

      {/* Primary SupeRR 10 Table */}
      <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#64748b]">Loading SupeRR 10 leaderboard...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                  <th className="py-3 px-4 text-center w-12">Rank</th>
                  <th className="py-3 px-4">Bowler</th>
                  <th className="py-3 px-4">Evidence Tier</th>
                  <th className="py-3 px-3 text-right">HP Legal Balls</th>
                  <th className="py-3 px-3 text-right">Overall Legal Balls</th>
                  <th className="py-3 px-3 text-right font-semibold text-[#0369a1]">
                    V3 Clutch <span className="font-normal text-[10px] text-[#64748b]">(70%)</span>
                  </th>
                  {showComponentBreakdown && (
                    <>
                      <th className="py-3 px-3 text-right text-[#b45309]">
                        PPI <span className="font-normal text-[10px] text-[#64748b]">(20%)</span>
                      </th>
                      <th className="py-3 px-3 text-right text-[#15803d]">
                        Consistency <span className="font-normal text-[10px] text-[#64748b]">(10%)</span>
                      </th>
                      <th className="py-3 px-4 text-center font-mono">95% Credible Interval</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-right font-bold text-sm text-[#be185d]">SupeRR Score</th>
                  <th className="py-3 px-4 text-center">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {data.map((p) => (
                  <tr key={p.player_id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-[#17263c]">
                      #{p.superr_rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link to={`/players?id=${p.player_id}`} className="font-semibold text-sm text-[#17263c] hover:text-[#be185d]">
                        {p.player_name}
                      </Link>
                      <div className="text-[11px] text-[#64748b]">
                        {p.teams && p.teams.length > 0 ? p.teams.slice(0, 2).join(', ') : `ID #${p.player_id}`}
                        <span className="ml-2 font-mono text-[10px] text-[#94a3b8]">(V3 Rank: #{p.v3_rank})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {(() => {
                        const tierInfo = getEvidenceTier('BOWLER', p.hp_balls);
                        return (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${tierInfo.badgeClass}`}>
                            {tierInfo.tier}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#be185d]">
                      {p.hp_balls}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[#64748b]">
                      {p.legal_balls}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-[#0369a1]">
                      +{p.v3_clutch_rating.toFixed(2)}
                      <span className="block text-[10px] font-normal text-[#64748b]">
                        +{p.clutch_contribution.toFixed(1)} pts
                      </span>
                    </td>
                    {showComponentBreakdown && (
                      <>
                        <td className="py-3.5 px-3 text-right font-mono text-[#b45309]">
                          {p.ppi_rating !== null ? (p.ppi_rating > 0 ? `+${p.ppi_rating.toFixed(1)}` : p.ppi_rating.toFixed(1)) : '—'}
                          <span className="block text-[10px] font-normal text-[#64748b]">
                            +{p.ppi_contribution.toFixed(1)} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-[#15803d]">
                          {p.consistency_pct !== null ? `${p.consistency_pct.toFixed(1)}%` : '—'}
                          <span className="block text-[10px] font-normal text-[#64748b]">
                            +{p.consistency_contribution.toFixed(1)} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#475569]">
                          [{p.v3_ci_lower_95.toFixed(1)}, {p.v3_ci_upper_95.toFixed(1)}]
                        </td>
                      </>
                    )}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-base text-[#be185d]">
                      {p.superr_score.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/players?id=${p.player_id}`}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-[#f1f5f9] text-[#17263c] hover:bg-[#be185d] hover:text-white transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Methodology Explainer Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-4 rounded-md border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-semibold text-[#0369a1] uppercase tracking-wider mb-1">
            70% — Crisis Defending (V3)
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Evaluates contextual runs saved and bowler-credited wickets when defending difficult totals and bowling under crisis pressure (&ge;65.0 BowlPI).
          </p>
        </div>
        <div className="bg-white p-4 rounded-md border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-1">
            20% — Early Prevention (PPI)
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Measures non-death overs (1–16) run containment and dot balls. Rewards bowlers who restrict boundaries early and choke opponent momentum.
          </p>
        </div>
        <div className="bg-white p-4 rounded-md border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-semibold text-[#15803d] uppercase tracking-wider mb-1">
            10% — Match Consistency
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Percentage of distinct matches with net positive bowling impact. Confirms repeatable reliability across multiple fixtures.
          </p>
        </div>
      </div>
    </div>
  );
};
