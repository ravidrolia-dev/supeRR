import React from 'react';
import { BookOpen, ShieldCheck, Zap, AlertCircle, Database } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#23314d]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-pink-400" />
          <h1 className="text-xl font-black text-white tracking-wide">Methodology &amp; Reliability Framework</h1>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30">
            SupeRR Selector Season 2
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Comprehensive documentation of mathematical formulas, Bayesian shrinkage architecture, cricket accounting reconciliations, and statistical qualification boundaries.
        </p>
      </div>

      {/* 1. Pressure Index Axioms */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#23314d] space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          1. Mathematical Formulation of Pressure Indices
        </h2>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            The Batter Pressure Index (<span className="text-cyan-400 font-mono font-semibold">BPI &in; [0, 100]</span>) and Bowler Pressure Index (<span className="text-purple-400 font-mono font-semibold">BowlerPI &in; [0, 100]</span>) quantify the instantaneous leverage and scarcity confronting a player prior to delivery release:
          </p>
          <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#23314d] font-mono text-xs text-cyan-300 space-y-2">
            <div>BPI = 100 * clamp(0.40 * Leverage + 0.35 * Scarcity + 0.25 * Deficit, 0, 1)</div>
            <div>BowlerPI = 100 * clamp(0.45 * Leverage + 0.35 * DeathRisk + 0.20 * ParDefend, 0, 1)</div>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong>Strictly Pre-Delivery:</strong> Uses wickets in hand and balls remaining before the ball is bowled, strictly eliminating lookahead bias.</li>
            <li><strong>Chase Confidence Segregation:</strong> Deliveries with uncertain chase targets or lower bounds are segregated, ensuring RRR is only computed on exact targets.</li>
            <li><strong>High-Pressure Definition:</strong> Any delivery with <span className="text-pink-400 font-mono">PI &ge; 65.0</span> is classified as high-pressure (24.7% of all balls).</li>
          </ul>
        </div>
      </div>

      {/* 2. Empirical Bayes Shrinkage */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#23314d] space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          2. Empirical Bayes Shrinkage &amp; Uncertainty Intervals
        </h2>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Small samples in extreme pressure scenarios can produce wildly inflated raw rate stats. To isolate genuine talent from stochastic noise, we apply an empirical Bayes shrinkage model with prior centered at 0:
          </p>
          <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#23314d] font-mono text-xs text-amber-300">
            {"Rating_shrunk = Rating_raw * [ n_legal / (n_legal + k) ], where k = 150.0"}
          </div>
          <p>
            The parameter <span className="text-cyan-400 font-mono">k = 150.0</span> represents the exposure weight needed to pull a player halfway toward the population prior.
          </p>
          <div className="p-3.5 rounded-xl bg-[#0e1628] border border-amber-500/20 text-slate-300">
            <strong className="text-amber-400 font-semibold">Credible Intervals vs Bootstrap Resampling:</strong>
            <p className="mt-1">
              Bayesian credible intervals reflect conditional uncertainty around the parameter given sample size. In contrast, 1,000-iteration match-level cluster bootstrap intervals reflect out-of-sample volatility across matches. Both are reported to guarantee analytical honesty.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Cricket Accounting & Decomposition */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#23314d] space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          3. Accounting Rigor in Bowling Valuation
        </h2>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            Bowling clutch value strictly adheres to double-entry cricket accounting principles:
          </p>
          <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#23314d] font-mono text-xs text-purple-300">
            {"Raw RBE = [ (Weighted Runs Saved + V_w * Pressure Net Wickets Added) / n_legal ] * 100"}
          </div>
          <p className="text-slate-400">
            Where <span className="text-white font-mono">V_w = 15.0</span> is the empirical run value of a wicket in T20 match states.
          </p>
        </div>
      </div>

      {/* 4. Limitations & Scope */}
      <div className="p-6 rounded-2xl bg-[#131b2e] border border-[#23314d] space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          4. Scope, Boundaries &amp; Scouting Caveats
        </h2>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li><strong>Cohort Boundary:</strong> Exclusively covers IPL (2008-2024) and Senior Men's T20I matches available in the audited master dataset.</li>
            <li><strong>Minimum Exposure:</strong> Minimum 150 legal balls and 40 high-pressure balls ensures that small-sample outliers are filtered out.</li>
            <li><strong>Cross-League Translation:</strong> Dual-league players face different run-scoring environments (IPL mean 8.52 rpo vs T20I 7.91 rpo). Relative rankings should be compared within competition contexts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
