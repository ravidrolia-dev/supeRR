import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#e2e6ec]">
        <h1 className="text-xl font-bold text-[#17263c] tracking-tight">Methodology &amp; Reliability Framework</h1>
        <p className="text-xs text-[#64748b] mt-0.5">
          Mathematical formulation, empirical Bayes shrinkage calibration, and cricket accounting boundaries.
        </p>
      </div>

      {/* 1. Pressure Formulation */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#17263c]">1. Pre-Delivery Pressure Formulation</h2>
        <p className="text-xs text-[#64748b] leading-relaxed">
          The Batter Pressure Index (BPI) and Bowler Pressure Index (BowlerPI) quantify the instantaneous match leverage and resource scarcity confronting a player prior to delivery release:
        </p>
        <div className="p-3 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c] space-y-1">
          <div>BPI = 100 &times; clamp(0.40 &times; Leverage + 0.35 &times; Scarcity + 0.25 &times; Deficit, 0, 1)</div>
          <div>BowlerPI = 100 &times; clamp(0.45 &times; Leverage + 0.35 &times; DeathRisk + 0.20 &times; ParDefend, 0, 1)</div>
        </div>
        <ul className="list-disc list-inside text-xs text-[#64748b] space-y-1 leading-relaxed">
          <li><strong>Pre-Delivery State:</strong> Evaluated strictly prior to delivery release; zero future match information is utilized.</li>
          <li><strong>High-Pressure Threshold:</strong> Any delivery with <span className="font-mono text-[#d92779]">&ge; 65.0</span> is defined as high-pressure (24.7% of all fair deliveries).</li>
        </ul>
      </div>

      {/* 2. Empirical Bayes Shrinkage */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#17263c]">2. Empirical Bayes Shrinkage &amp; Prior Calibration</h2>
        <p className="text-xs text-[#64748b] leading-relaxed">
          To prevent small-sample rate inflation from skewing rankings, we apply an empirical Bayes shrinkage formulation with calibrated population prior means:
        </p>
        <div className="p-3 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c]">
          &theta;_shrunk = &mu;_prior + (&theta;_raw - &mu;_prior) &times; [ n_legal / (n_legal + k) ], where k = 150.0
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="text-[11px] text-[#64748b]">Batting Prior Mean (&mu;_bat)</div>
            <div className="text-base font-bold font-mono text-[#365e91] mt-0.5">+2.97 runs/100</div>
          </div>
          <div className="p-3 rounded bg-[#f8fafc] border border-[#f1f5f9]">
            <div className="text-[11px] text-[#64748b]">Bowling Prior Mean (&mu;_bowl)</div>
            <div className="text-base font-bold font-mono text-[#16845b] mt-0.5">+1.97 runs/100</div>
          </div>
        </div>
      </div>

      {/* 3. Bowling Decomposition */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#17263c]">3. Bowling Valuation &amp; Wicket Replacement</h2>
        <p className="text-xs text-[#64748b] leading-relaxed">
          Bowling valuation decomposes total performance into defensive run containment below par and offensive strike wickets:
        </p>
        <div className="p-3 rounded bg-[#f8fafc] border border-[#e2e6ec] font-mono text-xs text-[#17263c]">
          Raw RBE = [ (Weighted Runs Saved + V_w &times; Pressure Net Wickets Added) / n_legal ] &times; 100
        </div>
        <p className="text-xs text-[#64748b] leading-relaxed">
          Where <span className="font-mono text-[#17263c]">V_w = 15.0</span> is the empirical replacement value of a wicket in T20 match states.
        </p>
      </div>

      {/* 4. Boundaries and Limitations */}
      <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-2">
        <h2 className="text-sm font-bold text-[#17263c]">4. Scope, Boundaries &amp; Caveats</h2>
        <ul className="list-disc list-inside text-xs text-[#64748b] space-y-1.5 leading-relaxed">
          <li><strong>Data Scope:</strong> Covers 853 senior matches (371 IPL, 482 Men's Senior T20Is) across 2008–2024.</li>
          <li><strong>Sample Eligibility:</strong> Only players with &ge;150 legal deliveries overall and &ge;40 high-pressure deliveries are ranked. Unqualified secondary roles are suppressed.</li>
          <li><strong>Cross-League Divergence:</strong> IPL scoring pace (8.52 rpo) diverges from T20I (7.91 rpo); competition-specific tables should be consulted alongside combined scores.</li>
        </ul>
      </div>
    </div>
  );
};
