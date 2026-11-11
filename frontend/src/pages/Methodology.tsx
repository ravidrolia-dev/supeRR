import React from 'react';
import { ShieldCheck, Flame, Scale, Layers, HelpCircle, Activity } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#e2e6ec]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8] mb-2">
          SupeRR 10 Unified Scouting Methodology
        </div>
        <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Methodology &amp; Reliability Framework</h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Mathematical formulation, empirical Bayes shrinkage calibration, evidence tier hierarchy, and cricket accounting boundaries.
        </p>
      </div>

      {/* 1. Unified Scoring Architecture */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#be185d]" />
          <h2 className="text-sm font-bold text-[#17263c]">1. Unified Pressure-First Scoring Architecture</h2>
        </div>
        <p className="text-xs text-[#64748b] leading-relaxed">
          ClutchIQ presents Rajasthan Royals scouts with <strong>one final primary ranking</strong> for batters and <strong>one for bowlers</strong>, synthesizing three orthogonal performance dimensions:
        </p>
        <div className="p-3.5 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c] space-y-1">
          <div className="font-semibold text-[#be185d]">
            Integrated Pressure Score = 0.70 &times; Pressure_Perf + 0.20 &times; Pressure_Prev + 0.10 &times; Consistency
          </div>
          <div className="text-[11px] text-[#64748b] font-sans pt-1">
            * All three component scores are standardized on a continuous 0–100 index prior to weighted linear combination.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded border border-[#e2e6ec] bg-[#ffffff]">
            <div className="text-[11px] font-bold text-[#be185d] uppercase tracking-wider mb-1">70% Pressure Performance</div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              V3 pre-delivery high-pressure impact (&ge;65.0 BPI). Dominant core selection criterion quantifying contextual runs and wickets in acute crisis.
            </p>
          </div>
          <div className="p-3 rounded border border-[#e2e6ec] bg-[#ffffff]">
            <div className="text-[11px] font-bold text-[#16845b] uppercase tracking-wider mb-1">20% Pressure Prevention</div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              PPI evaluating Powerplay dominance, boundary suppression, and par surplus generation that avoids crisis emergence.
            </p>
          </div>
          <div className="p-3 rounded border border-[#e2e6ec] bg-[#ffffff]">
            <div className="text-[11px] font-bold text-[#365e91] uppercase tracking-wider mb-1">10% Match Consistency</div>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              Validated match-to-match reliability measuring resistance to catastrophic low-scoring outcomes across distinct fixtures.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-[#94a3b8] italic">
          Scouting Notice: The 70/20/10 weighting structure is provisional and subject to ongoing seasonal calibration. It is designed to ensure scouts evaluate crisis ability first while recognizing the real-world value of proactive advantage creation.
        </p>
      </div>

      {/* 2. Evidence Tier Stratification */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#365e91]" />
          <h2 className="text-sm font-bold text-[#17263c]">2. Three-Tier Direct Evidence Hierarchy</h2>
        </div>
        <p className="text-xs text-[#64748b] leading-relaxed">
          The 40 high-pressure ball threshold functions as an <strong>evidence classification threshold</strong>, rather than an arbitrary exclusion rule. Players with limited direct exposure are never assigned zero clutch ability; instead, their scores are shrunk toward the empirical prior mean and labeled transparently:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                <th className="py-2.5 px-3">Evidence Tier</th>
                <th className="py-2.5 px-3 font-mono">HP Balls</th>
                <th className="py-2.5 px-3">Batter Cohort (N=239)</th>
                <th className="py-2.5 px-3">Bowler Cohort (N=258)</th>
                <th className="py-2.5 px-3">Scouting Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="py-2.5 px-3 font-semibold text-[#16845b]">Strong Direct Evidence</td>
                <td className="py-2.5 px-3 font-mono text-[#16845b]">&ge; 150</td>
                <td className="py-2.5 px-3 text-[#17263c]">93 (38.9%)</td>
                <td className="py-2.5 px-3 text-[#17263c]">4 (1.6%)</td>
                <td className="py-2.5 px-3 text-[#64748b]">Established crisis performers with narrow credible intervals.</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="py-2.5 px-3 font-semibold text-[#365e91]">Moderate Direct Evidence</td>
                <td className="py-2.5 px-3 font-mono text-[#365e91]">40 – 149</td>
                <td className="py-2.5 px-3 text-[#17263c]">92 (38.5%)</td>
                <td className="py-2.5 px-3 text-[#17263c]">89 (34.5%)</td>
                <td className="py-2.5 px-3 text-[#64748b]">Statistically meaningful exposure; reliable for primary tactical planning.</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="py-2.5 px-3 font-semibold text-[#be185d]">Limited Direct Evidence</td>
                <td className="py-2.5 px-3 font-mono text-[#be185d]">&lt; 40</td>
                <td className="py-2.5 px-3 text-[#17263c]">54 (22.6%)</td>
                <td className="py-2.5 px-3 text-[#17263c]">165 (64.0%)</td>
                <td className="py-2.5 px-3 text-[#64748b]">High posterior uncertainty. Early suppressors require verification before death-over deployment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Empirical Bayes Shrinkage */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#16845b]" />
          <h2 className="text-sm font-bold text-[#17263c]">3. Empirical Bayes Shrinkage &amp; Uncertainty Calibration</h2>
        </div>
        <p className="text-xs text-[#64748b] leading-relaxed">
          To prevent small-sample rate inflation from distorting scouting lists, raw performance is shrunk toward the empirical population prior mean using sample size weighting:
        </p>
        <div className="p-3 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c] space-y-1">
          <div>&theta;_posterior = &mu;_prior + (&theta;_raw &minus; &mu;_prior) &times; [ n_legal / (n_legal + k) ], where k = 150.0</div>
          <div>95% Credible Interval = &theta;_posterior &plusmn; 1.96 &times; &sigma;_posterior, where &sigma;_posterior = &sigma;_sample / &radic;(n_legal + k)</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="text-[11px] text-[#64748b]">Batting Baseline Prior (&mu;_bat)</div>
            <div className="text-base font-bold font-mono text-[#365e91] mt-0.5">+2.97 runs/100</div>
          </div>
          <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="text-[11px] text-[#64748b]">Bowling Baseline Prior (&mu;_bowl)</div>
            <div className="text-base font-bold font-mono text-[#16845b] mt-0.5">+1.97 runs/100</div>
          </div>
        </div>
      </div>

      {/* 4. Pre-Delivery Pressure Formulation */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#be185d]" />
          <h2 className="text-sm font-bold text-[#17263c]">4. Pre-Delivery Pressure Indices (V3)</h2>
        </div>
        <p className="text-xs text-[#64748b] leading-relaxed">
          The Batter Pressure Index (BPI) and Bowler Pressure Index (BowlerPI) quantify instantaneous match leverage and resource scarcity confronting a player strictly prior to delivery release:
        </p>
        <div className="p-3 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c] space-y-1">
          <div>BPI = 100 &times; clamp(0.40 &times; Leverage + 0.35 &times; Scarcity + 0.25 &times; Deficit, 0, 1)</div>
          <div>BowlerPI = 100 &times; clamp(0.45 &times; Leverage + 0.35 &times; DeathRisk + 0.20 &times; ParDefend, 0, 1)</div>
        </div>
        <ul className="list-disc list-inside text-xs text-[#64748b] space-y-1 leading-relaxed">
          <li><strong>Zero Lookahead Leakage:</strong> Computed strictly before the ball is bowled; future events (wickets, boundaries) never influence pre-delivery pressure.</li>
          <li><strong>High-Pressure Definition:</strong> Any delivery with <span className="font-mono text-[#be185d]">&ge; 65.0</span> is categorized as high-pressure (24.7% of all fair deliveries).</li>
          <li><strong>Wicket Replacement Value:</strong> High-pressure bowling integrates an empirical replacement value of <span className="font-mono text-[#17263c]">V_w = 15.0</span> runs per pressure-weighted net wicket.</li>
        </ul>
      </div>

      {/* 5. Boundaries and Limitations */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-2">
        <h2 className="text-sm font-bold text-[#17263c]">5. Scope, Boundaries &amp; Caveats</h2>
        <ul className="list-disc list-inside text-xs text-[#64748b] space-y-1.5 leading-relaxed">
          <li><strong>Primary Competition Scope:</strong> Covers 853 senior matches (371 IPL, 482 Men's Senior T20Is) across 2008–2024.</li>
          <li><strong>Universal Eligibility:</strong> All players with &ge; 150 overall legal deliveries are evaluated and assigned an Evidence Tier.</li>
          <li><strong>Single Primary Interface:</strong> In accordance with Rajasthan Royals scout workflow requirements, competing primary leaderboards have been superseded by the Unified SupeRR 10 ranking.</li>
          <li><strong>Provisional Framework:</strong> All unified weightings and classifications are provisional research benchmarks developed for the Rajasthan Royals SupeRR Selector Season 2 hackathon and carry no formal franchise endorsement.</li>
        </ul>
      </div>
    </div>
  );
};
