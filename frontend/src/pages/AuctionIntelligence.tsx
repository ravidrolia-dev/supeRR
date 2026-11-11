import React, { useEffect, useState } from 'react';
import { fetchAuctionSquadFit } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Scale,
  Users,
  Award,
  Zap,
  Activity,
  Check,
  Eye,
  Ban,
  Clock,
  HelpCircle,
  Compass,
  RefreshCw,
  ArrowRightLeft
} from 'lucide-react';

export const AuctionIntelligence: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'BATTER_TARGETS' | 
    'BOWLER_TARGETS' | 
    'ROLE_ALTERNATIVES' | 
    'CONDITIONAL_WATCHLIST' | 
    'CONFIRMED_TARGETS' | 
    'OVERVIEW' | 
    'SQUAD_2026' | 
    'WEAKNESSES'
  >('BATTER_TARGETS');

  // Watchlist role toggle (Batters vs Bowlers)
  const [watchlistRole, setWatchlistRole] = useState<'BATTERS' | 'BOWLERS'>('BATTERS');

  useEffect(() => {
    setLoading(true);
    fetchAuctionSquadFit()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24 text-center text-xs text-[#64748b]">
        Loading Rajasthan Royals IPL 2027 Auction Intelligence Engine...
      </div>
    );
  }

  const summary = data.actual_2026_summary || {};
  const squad = data.squad_2026 || [];
  const weaknesses = data.weaknesses || [];
  const confirmedList = data.confirmed_shortlist || [];
  const batterTargets = data.batter_targets || [];
  const bowlerTargets = data.bowler_targets || [];
  const conditionalBatters = data.conditional_batters || [];
  const conditionalBowlers = data.conditional_bowlers || [];
  const conditionalPending = data.conditional_pending || [];
  const roleAlternatives = data.role_alternatives || [];

  // Dynamic Date and Deadline Calculations
  const officialDeadlineStr = data.official_retention_deadline || '2026-11-17T17:00:00+05:30';
  const deadlineDate = new Date(officialDeadlineStr);
  const now = new Date();
  
  // Calculate remaining time dynamically
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const diffHours = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const timeRemainingText = diffMs > 0 ? `${diffDays}d ${diffHours}h remaining` : 'Deadline Passed / Verification Active';

  // Format verified timestamp nicely
  const formattedLastVerification = data.last_verification_timestamp 
    ? new Date(data.last_verification_timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
    : 'Live Synchronized';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE_CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0fdf4] text-[#16845b] border border-[#bbf7d0]">
            <CheckCircle2 className="w-3 h-3" />
            <span>AVAILABLE_CONFIRMED</span>
          </span>
        );
      case 'CONDITIONAL_RETENTION_PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
            <Clock className="w-3 h-3" />
            <span>CONDITIONAL_RETENTION_PENDING</span>
          </span>
        );
      case 'AVAILABILITY_UNVERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
            <HelpCircle className="w-3 h-3" />
            <span>AVAILABILITY_UNVERIFIED</span>
          </span>
        );
      case 'RETAINED_UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f8fafc] text-[#475569] border border-[#e2e6ec]">
            <span>RETAINED_UNAVAILABLE</span>
          </span>
        );
      case 'RR_EXISTING_PLAYER':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]">
            <Check className="w-3 h-3" />
            <span>RR_EXISTING_PLAYER</span>
          </span>
        );
      case 'IPL_RETIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]">
            <Ban className="w-3 h-3" />
            <span>IPL_RETIRED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f5f9] text-[#64748b] border border-[#e2e6ec]">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="pb-4 border-b border-[#e2e6ec] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8] mb-2">
            Rajasthan Royals &bull; Task 11.8 Final Strategic Auction Shortlist
          </div>
          <h1 className="text-xl font-bold text-[#17263c] tracking-tight">
            RR 2027 Auction Shortlists: Top 10 Batters &amp; Top 10 Bowlers
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5">
            Full 10-player scouting shortlists strictly grounded in 2026 weaknesses, ClutchIQ ratings, and verified availability tracking.
          </p>
        </div>

        {/* Dynamic Retention Status Board */}
        <div className="p-3 rounded-md bg-[#fffbeb] border border-[#fef3c7] text-left shrink-0 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-[#b45309] tracking-wider flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Retention Window Status</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-[#fef3c7] text-[#92400e] text-[9px] font-mono">
              {timeRemainingText}
            </span>
          </div>
          <div className="text-[11px] text-[#92400e] font-medium mt-1">
            Deadline: <strong>{deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at 17:00 IST</strong>
          </div>
          <div className="text-[10px] text-[#b45309] mt-0.5 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-[#b45309]" />
            <span>Reconciled: {formattedLastVerification}</span>
          </div>
        </div>
      </div>

      {/* Strategic Separation Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-[#be185d]" />
            <span>1. Objective ClutchIQ Pressure Model (70 / 20 / 10)</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Preserves the 70% V3 Pressure + 20% PPI + 10% Consistency score. Rankings remain purely performance-driven and are never altered by franchise needs or contract status.
          </p>
        </div>

        <div className="p-4 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
          <div className="text-xs font-bold text-[#17263c] flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#16845b]" />
            <span>2. Comprehensive 10+10 Scouting Boards</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Exactly 10 batters and 10 bowlers addressing RR's core failure modes. Andre Russell is excluded (IPL-retired), while contracted candidates are tracked with clear retention notices.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e2e6ec] gap-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('BATTER_TARGETS')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'BATTER_TARGETS'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <Award className="w-4 h-4 text-[#be185d]" />
          <span>Top 10 Batters ({batterTargets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BOWLER_TARGETS')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'BOWLER_TARGETS'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <Zap className="w-4 h-4 text-[#16845b]" />
          <span>Top 10 Bowlers ({bowlerTargets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ROLE_ALTERNATIVES')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ROLE_ALTERNATIVES'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-[#d97706]" />
          <span>Dynamic Alternatives ({roleAlternatives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CONDITIONAL_WATCHLIST')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'CONDITIONAL_WATCHLIST'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <Eye className="w-4 h-4 text-[#1d4ed8]" />
          <span>Conditional Watchlist ({conditionalPending.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CONFIRMED_TARGETS')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'CONFIRMED_TARGETS'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#16845b]" />
          <span>Confirmed Available ({confirmedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>2026 Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('SQUAD_2026')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'SQUAD_2026'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Actual Squad ({squad.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('WEAKNESSES')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'WEAKNESSES'
              ? 'border-[#be185d] text-[#be185d]'
              : 'border-transparent text-[#64748b] hover:text-[#17263c]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Weaknesses ({weaknesses.length})</span>
        </button>
      </div>

      {/* TAB 1: TOP 10 TARGET BATTERS */}
      {activeTab === 'BATTER_TARGETS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]">
                  RR SCOUTING SHORTLIST
                </span>
                <h2 className="text-sm font-bold text-[#17263c]">
                  Top 10 Batters for Rajasthan Royals IPL 2027
                </h2>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Selected strictly to solve W2 (Finishing Collapse at 10.9 balls/wkt), W3 (Middle Spin Squeeze), and W5 (WK Cover). Excludes redundant openers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Player</th>
                    <th className="py-3 px-2">Nat.</th>
                    <th className="py-3 px-3">Primary Role</th>
                    <th className="py-3 px-3 text-right">ClutchIQ</th>
                    <th className="py-3 px-2 text-right">HP Balls</th>
                    <th className="py-3 px-3">2026 Franchise Association</th>
                    <th className="py-3 px-3">Scouting Availability Status</th>
                    <th className="py-3 px-4">Tactical Role &amp; RR Solution</th>
                    <th className="py-3 px-4">Next Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {batterTargets.map((b: any) => (
                    <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                      <td className="py-3 px-3 font-mono font-bold text-[#17263c]">
                        {b.rank}
                      </td>
                      <td className="py-3 px-3">
                        <Link 
                          to={`/players?id=${b.player_id}`}
                          className="font-bold text-[#17263c] hover:text-[#be185d]"
                        >
                          {b.player_name}
                        </Link>
                        <div className="text-[10px] text-[#64748b]">{b.evidence_tier?.split('(')[0]?.trim()}</div>
                      </td>
                      <td className="py-3 px-2 text-[#64748b]">{b.nationality}</td>
                      <td className="py-3 px-3 text-[#17263c] font-medium">{b.role}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#365e91]">
                        {Number(b.clutch_iq_score).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-[#17263c]">
                        {b.hp_legal_balls}
                      </td>
                      <td className="py-3 px-3 text-[11px] font-medium text-[#17263c]">
                        {b.current_franchise}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(b.scouting_status)}
                      </td>
                      <td className="py-3 px-4 text-[#17263c] max-w-xs leading-relaxed text-[11px]">
                        <div><strong className="text-[#be185d]">{b.rr_weakness_addressed}:</strong> {b.tactical_role_fit}</div>
                      </td>
                      <td className="py-3 px-4 text-[#64748b] max-w-xs leading-relaxed text-[11px]">
                        {b.next_verification_action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP 10 TARGET BOWLERS */}
      {activeTab === 'BOWLER_TARGETS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]">
                  RR SCOUTING SHORTLIST
                </span>
                <h2 className="text-sm font-bold text-[#17263c]">
                  Top 10 Bowlers for Rajasthan Royals IPL 2027
                </h2>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Selected strictly to solve W1 (Death Overs Concession: Sandeep 13.70 rpo), W3 (Finger Spin Choke), and W4 (Indian Pace Depth).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Player</th>
                    <th className="py-3 px-2">Nat.</th>
                    <th className="py-3 px-3">Primary Role</th>
                    <th className="py-3 px-3 text-right">ClutchIQ</th>
                    <th className="py-3 px-2 text-right">HP Balls</th>
                    <th className="py-3 px-3">2026 Franchise Association</th>
                    <th className="py-3 px-3">Scouting Availability Status</th>
                    <th className="py-3 px-4">Tactical Role &amp; RR Solution</th>
                    <th className="py-3 px-4">Next Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {bowlerTargets.map((b: any) => (
                    <tr key={b.player_id} className="hover:bg-[#f8fafc]">
                      <td className="py-3 px-3 font-mono font-bold text-[#17263c]">
                        {b.rank}
                      </td>
                      <td className="py-3 px-3">
                        <Link 
                          to={`/players?id=${b.player_id}`}
                          className="font-bold text-[#17263c] hover:text-[#be185d]"
                        >
                          {b.player_name}
                        </Link>
                        <div className="text-[10px] text-[#64748b]">{b.evidence_tier?.split('(')[0]?.trim()}</div>
                      </td>
                      <td className="py-3 px-2 text-[#64748b]">{b.nationality}</td>
                      <td className="py-3 px-3 text-[#17263c] font-medium">{b.role}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#16845b]">
                        {Number(b.clutch_iq_score).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-[#17263c]">
                        {b.hp_legal_balls}
                      </td>
                      <td className="py-3 px-3 text-[11px] font-medium text-[#17263c]">
                        {b.current_franchise}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(b.scouting_status)}
                      </td>
                      <td className="py-3 px-4 text-[#17263c] max-w-xs leading-relaxed text-[11px]">
                        <div><strong className="text-[#be185d]">{b.rr_weakness_addressed}:</strong> {b.tactical_role_fit}</div>
                      </td>
                      <td className="py-3 px-4 text-[#64748b] max-w-xs leading-relaxed text-[11px]">
                        {b.next_verification_action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE-SPECIFIC ALTERNATIVES & DYNAMIC SUCCESSION */}
      {activeTab === 'ROLE_ALTERNATIVES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]">
                TACTICAL CONTINGENCY ENGINE
              </span>
              <h2 className="text-sm font-bold text-[#17263c]">
                Role-Specific Targets &amp; Dynamic Alternatives (5 Audited Priorities)
              </h2>
            </div>
            <p className="text-xs text-[#64748b] mt-1">
              Guarantees that if a primary target is retained, the engine executes like-for-like role succession grounded in verified RR weakness requirements.
            </p>
          </div>

          <div className="space-y-4">
            {roleAlternatives.map((ra: any) => (
              <div key={ra.requirement_id} className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#fdf2f8] text-[#be185d] border border-[#fbcfe8]">
                      {ra.requirement_id}
                    </span>
                    <h3 className="text-sm font-bold text-[#17263c]">{ra.requirement_title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#be185d]">{ra.rr_weakness_addressed}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ra.priority === 'CRITICAL' ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]' :
                      ra.priority === 'HIGH' ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]' :
                      'bg-[#f1f5f9] text-[#475569] border border-[#e2e6ec]'
                    }`}>
                      {ra.priority}
                    </span>
                  </div>
                </div>

                {/* Candidate Comparison Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded border border-[#e2e6ec] bg-[#f8fafc] space-y-1">
                    <div className="text-[10px] font-bold text-[#be185d] uppercase tracking-wider">First-Choice Target</div>
                    <div className="font-bold text-[#17263c]">{ra.first_choice_target}</div>
                    <div className="text-[11px] font-mono font-bold text-[#365e91]">ClutchIQ: {ra.first_choice_score}</div>
                    <div className="pt-1">{getStatusBadge(ra.first_choice_status)}</div>
                  </div>

                  <div className="p-3 rounded border border-[#e2e6ec] bg-[#f8fafc] space-y-1">
                    <div className="text-[10px] font-bold text-[#1d4ed8] uppercase tracking-wider">Second-Choice Target</div>
                    <div className="font-bold text-[#17263c]">{ra.second_choice_target}</div>
                    <div className="text-[11px] font-mono font-bold text-[#365e91]">ClutchIQ: {ra.second_choice_score}</div>
                    <div className="pt-1">{getStatusBadge(ra.second_choice_status)}</div>
                  </div>

                  <div className="p-3 rounded border border-[#e2e6ec] bg-[#f8fafc] space-y-1">
                    <div className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">Free Agent / Wider Pool</div>
                    <div className="font-bold text-[#17263c]">{ra.pool_alternative_target}</div>
                    <div className="text-[11px] font-mono font-bold text-[#365e91]">ClutchIQ: {ra.pool_alternative_score}</div>
                    <div className="pt-1">{getStatusBadge(ra.pool_alternative_status)}</div>
                  </div>

                  <div className="p-3 rounded border border-[#e2e6ec] bg-[#f8fafc] space-y-1">
                    <div className="text-[10px] font-bold text-[#16845b] uppercase tracking-wider">Indian Domestic Alternative</div>
                    <div className="font-bold text-[#17263c]">{ra.domestic_alternative_target}</div>
                    <div className="text-[11px] font-mono font-bold text-[#16845b]">ClutchIQ: {ra.domestic_alternative_score}</div>
                    <div className="pt-1">{getStatusBadge(ra.domestic_alternative_status)}</div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#64748b] bg-[#fafafa] p-2.5 rounded border border-[#f1f5f9]">
                  <strong className="text-[#17263c]">Dynamic Succession Protocol:</strong> {ra.tactical_replacement_rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONDITIONAL WATCHLIST */}
      {activeTab === 'CONDITIONAL_WATCHLIST' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                  TIER 2 &bull; CONDITIONAL_RETENTION_PENDING
                </span>
                <h2 className="text-sm font-bold text-[#17263c]">
                  Active Franchise Watchlist ({conditionalPending.length} Players Under Observation)
                </h2>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Currently contracted to other IPL franchises. Tactical plans are pre-configured to execute immediately if released on November 17.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-md text-xs font-semibold">
              <button
                onClick={() => setWatchlistRole('BATTERS')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  watchlistRole === 'BATTERS'
                    ? 'bg-white text-[#be185d] shadow-xs font-bold'
                    : 'text-[#64748b] hover:text-[#17263c]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Batters ({conditionalBatters.length})</span>
              </button>
              <button
                onClick={() => setWatchlistRole('BOWLERS')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  watchlistRole === 'BOWLERS'
                    ? 'bg-white text-[#16845b] shadow-xs font-bold'
                    : 'text-[#64748b] hover:text-[#17263c]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Bowlers ({conditionalBowlers.length})</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                    <th className="py-3 px-3">Player Name</th>
                    <th className="py-3 px-3 text-right">ClutchIQ</th>
                    <th className="py-3 px-2">Evidence Tier</th>
                    <th className="py-3 px-3">2026 Franchise</th>
                    <th className="py-3 px-3 font-semibold text-[#be185d]">RR Weakness Solved</th>
                    <th className="py-3 px-4">Primary Tactical Role</th>
                    <th className="py-3 px-3">Retention Status</th>
                    <th className="py-3 px-4">Next Verification Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {(watchlistRole === 'BATTERS' ? conditionalBatters : conditionalBowlers).map((c: any) => (
                    <tr key={c.player_id} className="hover:bg-[#f8fafc]">
                      <td className="py-3 px-3">
                        <Link 
                          to={`/players?id=${c.player_id}`}
                          className="font-bold text-[#17263c] hover:text-[#be185d]"
                        >
                          {c.player_name}
                        </Link>
                        <div className="text-[10px] text-[#64748b]">{c.nationality} &bull; {c.role}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#365e91]">
                        {Number(c.clutch_iq_score).toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#f8fafc] border border-[#e2e6ec] text-[#475569]">
                          {c.evidence_tier?.split('(')[0]?.trim()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] font-medium text-[#17263c]">
                        {c.franchise_2026}
                      </td>
                      <td className="py-3 px-3 text-[11px] font-bold text-[#be185d]">
                        {c.rr_weakness_addressed}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#17263c] max-w-xs leading-relaxed">
                        {c.primary_tactical_role}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#64748b] max-w-xs leading-relaxed">
                        {c.next_verification_requirement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONFIRMED TARGETS ZERO STATE */}
      {activeTab === 'CONFIRMED_TARGETS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0fdf4] text-[#16845b] border border-[#bbf7d0]">
                TIER 1 &bull; AVAILABLE_CONFIRMED
              </span>
              <h2 className="text-sm font-bold text-[#17263c]">
                Confirmed Actionable Auction Targets ({confirmedList.length} Players)
              </h2>
            </div>
            <p className="text-xs text-[#64748b] mt-1">
              Active, IPL-eligible, and officially registered/released for the IPL 2027 Player Auction.
            </p>
          </div>

          <div className="p-8 text-center bg-white rounded-md border border-[#e2e6ec] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e6ec] flex items-center justify-center mx-auto text-[#17263c]">
              <Compass className="w-6 h-6 text-[#365e91]" />
            </div>
            
            <div className="space-y-1">
              <div className="text-base font-bold text-[#17263c]">
                Player Evaluation Complete.
              </div>
              <div className="text-xs font-semibold text-[#be185d]">
                Final acquisition shortlist pending official IPL 2027 retention, release and auction registration verification.
              </div>
            </div>

            <p className="text-xs text-[#64748b] max-w-2xl mx-auto leading-relaxed">
              Zero confirmed targets does <strong>not</strong> mean zero suitable cricketing candidates. ClutchIQ has evaluated 700+ players and identified exactly 10 Batters and 10 Bowlers directly matching RR's 2026 campaign weaknesses. Because all candidates currently hold active contracts across the 10 franchises, BCCI regulations require waiting until the <strong>November 17, 2026</strong> deadline before confirmed acquisitions can be legally designated.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('BATTER_TARGETS')}
                className="px-4 py-2 rounded bg-[#17263c] text-white text-xs font-semibold hover:bg-[#365e91] transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-[#be185d]" />
                <span>View Top 10 Batters</span>
              </button>
              <button
                onClick={() => setActiveTab('BOWLER_TARGETS')}
                className="px-4 py-2 rounded bg-[#17263c] text-white text-xs font-semibold hover:bg-[#365e91] transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-[#16845b]" />
                <span>View Top 10 Bowlers</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OVERVIEW & 2026 AUDIT */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">2026 Season Record</div>
              <div className="text-xl font-bold font-mono text-[#17263c] mt-1">9W &ndash; 7L</div>
              <div className="text-[10px] text-[#16845b] mt-0.5 font-medium">{summary.finish || '3rd Place (Playoffs)'}</div>
            </div>

            <div className="p-3.5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Powerplay Batting SR</div>
              <div className="text-xl font-bold font-mono text-[#16845b] mt-1">187.33</div>
              <div className="text-[10px] text-[#64748b] mt-0.5">Rank #1 in IPL 2026</div>
            </div>

            <div className="p-3.5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Death Concession (Overs 17-20)</div>
              <div className="text-xl font-bold font-mono text-[#be185d] mt-1">10.57 rpo</div>
              <div className="text-[10px] text-[#be185d] mt-0.5 font-medium">Sandeep: 13.70 | Deshpande: 12.38</div>
            </div>

            <div className="p-3.5 rounded-md bg-white border border-[#e2e6ec] shadow-xs">
              <div className="text-[11px] font-semibold text-[#64748b]">Defending Breakdown</div>
              <div className="text-xl font-bold font-mono text-[#be185d] mt-1">5 Losses Defending</div>
              <div className="text-[10px] text-[#64748b] mt-0.5">Failed to defend 179&ndash;194 totals in 5 matches</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16845b] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>What Worked in 2026 (Preserve &amp; Nurture)</span>
              </div>
              <ul className="text-xs text-[#64748b] space-y-2 leading-relaxed">
                <li>
                  <strong className="text-[#17263c]">Historic Powerplay Dominance:</strong> Vaibhav Sooryavanshi (776 runs, SR 238.04) and Yashasvi Jaiswal (427 runs, SR 152.50) established the most lethal opening partnership in IPL history, preventing pressure from mounting in 9 of 16 matches.
                </li>
                <li>
                  <strong className="text-[#17263c]">Jurel's Middle-Order Maturity:</strong> Dhruv Jurel scored 515 runs at a 154.65 strike rate, providing essential middle-order stability as full-time wicketkeeper.
                </li>
                <li>
                  <strong className="text-[#17263c]">Jofra Archer's Solo Heroics:</strong> Archer claimed 25 wickets with an economy of 9.12, maintaining a stellar 9.35 economy in death overs despite zero secondary support.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#be185d] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>What Broke Down in 2026 (Urgent Redressal)</span>
              </div>
              <ul className="text-xs text-[#64748b] space-y-2 leading-relaxed">
                <li>
                  <strong className="text-[#17263c]">Death-Overs Concession:</strong> Sandeep Sharma (13.70 rpo) and Tushar Deshpande (12.38 rpo) leaked runs at the death, blowing 5 defenses of 180+ scores.
                </li>
                <li>
                  <strong className="text-[#17263c]">Sam Curran Injury Void:</strong> Acquired for ₹2.40 Cr, Curran suffered a pre-season groin tear; emergency replacement Dasun Shanaka scored only 63 runs in 7 matches.
                </li>
                <li>
                  <strong className="text-[#17263c]">Spin Containment Fragility:</strong> Ravi Bishnoi (economy 9.88) conceded heavy boundaries when opposition batters charged length in middle overs.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-md bg-white border border-[#e2e6ec] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#17263c] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#365e91]" />
              <span>Tactical Autopsy of the 5 Defending Losses</span>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed">
              In 5 of RR's 7 losses (Match 50349 vs KKR, Match 50357 vs SRH, Match 50383 vs DC, Match 50373 vs GT, Match 50944 vs GT in Qualifier), Rajasthan Royals posted competitive first-innings scores between <strong>179 and 194</strong>. In all five instances, the batting foundation was squandered in overs 17–20 where the bowling attack conceded 50+ runs per match due to the lack of an express yorker execution partner for Jofra Archer.
            </p>
          </div>
        </div>
      )}

      {/* TAB 7: ACTUAL 2026 SQUAD TABLE */}
      {activeTab === 'SQUAD_2026' && (
        <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#e2e6ec]">
            <h2 className="text-sm font-bold text-[#17263c]">
              Rajasthan Royals &bull; Actual IPL 2026 Squad Roster ({squad.length} Players)
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Verified from 2026 season logs and official participation records. Distinguishes Playing XI cores from bench reserves.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e6ec] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-3">Nationality</th>
                  <th className="py-2.5 px-3">Primary Role</th>
                  <th className="py-2.5 px-3">Style</th>
                  <th className="py-2.5 px-3">2026 Status</th>
                  <th className="py-2.5 px-2 text-right">Matches</th>
                  <th className="py-2.5 px-3 text-right">Runs</th>
                  <th className="py-2.5 px-3 text-right">Bat SR</th>
                  <th className="py-2.5 px-3 text-right">Wkts</th>
                  <th className="py-2.5 px-3 text-right">Bowl Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {squad.map((p: any) => {
                  const status = p.squad_status || p['2026_squad_status'] || 'Squad Member';
                  const matches = p.matches_played ?? p.matches_in_playing_xi ?? 0;
                  const runs = p.runs_scored ?? p.runs_2026;
                  const sr = p.batting_strike_rate ?? p.strike_rate_2026;
                  const wkts = p.wickets_taken ?? p.wickets_2026;
                  const econ = p.bowling_economy ?? p.economy_2026;
                  const style = p.batting_style ? `${p.batting_style}${p.bowling_style && p.bowling_style !== 'None' ? ' • ' + p.bowling_style : ''}` : '—';

                  return (
                    <tr key={p.player_id} className="hover:bg-[#f8fafc]">
                      <td className="py-2.5 px-3 font-semibold text-[#17263c]">
                        {p.player_name}
                      </td>
                      <td className="py-2.5 px-3 text-[#64748b]">{p.nationality}</td>
                      <td className="py-2.5 px-3 text-[#17263c]">{p.primary_role}</td>
                      <td className="py-2.5 px-3 text-[#64748b] text-[11px] truncate max-w-[150px]" title={style}>{style}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          status.includes('Core') ? 'bg-[#f0fdf4] text-[#16845b] border-[#bbf7d0]' :
                          status.includes('Regular') ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]' :
                          status.includes('Injured') || status.includes('Ruled Out') ? 'bg-[#fff1f2] text-[#be185d] border-[#fecdd3]' :
                          'bg-[#f8fafc] text-[#64748b] border-[#e2e6ec]'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-[#17263c]">
                        {matches}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#365e91]">
                        {runs !== '' && runs !== null && runs !== undefined ? runs : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#17263c]">
                        {sr !== '' && sr !== null && sr !== undefined ? Number(sr).toFixed(2) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#16845b]">
                        {wkts !== '' && wkts !== null && wkts !== undefined ? wkts : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#be185d]">
                        {econ !== '' && econ !== null && econ !== undefined ? Number(econ).toFixed(2) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: IDENTIFIED SQUAD WEAKNESSES */}
      {activeTab === 'WEAKNESSES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-[#e2e6ec] shadow-xs p-4 border-b border-[#e2e6ec]">
            <h2 className="text-sm font-bold text-[#17263c]">
              Audited Rajasthan Royals 2026 Campaign Weaknesses ({weaknesses.length})
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Empirically grounded in 7 season defeats and phase-by-phase tactical breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weaknesses.map((w: any) => (
              <div key={w.weakness_id} className="bg-white rounded-md border border-[#e2e6ec] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#f1f5f9] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#be185d]">{w.weakness_id}</span>
                    <h3 className="text-sm font-bold text-[#17263c]">{w.weakness_title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.priority === 'CRITICAL' ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]' :
                    w.priority === 'HIGH' ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]' :
                    'bg-[#f1f5f9] text-[#475569] border border-[#e2e6ec]'
                  }`}>
                    {w.priority}
                  </span>
                </div>

                <div className="text-xs text-[#64748b] space-y-1.5">
                  <div><strong className="text-[#17263c]">Affected Role / Phase:</strong> {w.affected_role_or_phase}</div>
                  <div><strong className="text-[#17263c]">2026 Evidence:</strong> {w.actual_2026_evidence}</div>
                  <div><strong className="text-[#17263c]">Statistical Indicators:</strong> <span className="font-mono text-[#be185d]">{w.statistical_indicators}</span></div>
                </div>

                <div className="pt-3 border-t border-[#f1f5f9] text-xs">
                  <div className="text-[11px] font-semibold text-[#16845b] mb-0.5">2027 Solution:</div>
                  <div className="text-[#17263c]">{w.potential_2027_solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
