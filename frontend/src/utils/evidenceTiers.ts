export type PlayerRole = 'BATTER' | 'BOWLER';

export interface EvidenceTierInfo {
  tier: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
  rangeText: string;
}

/**
 * Centralized, role-aware evidence-tier classifier for ClutchIQ.
 * Ensures identical evidence classification across all UI components, dossiers, and comparisons.
 * 
 * Rules:
 * BATTERS:
 *  - Strong: >= 150 HP legal deliveries
 *  - Moderate: 40 - 149 HP legal deliveries
 *  - Limited: < 40 HP legal deliveries
 * 
 * BOWLERS:
 *  - Strong: >= 100 HP legal deliveries
 *  - Moderate: 25 - 99 HP legal deliveries
 *  - Limited: < 25 HP legal deliveries
 */
export function getEvidenceTier(role: PlayerRole | string, hpLegalDeliveries: number): EvidenceTierInfo {
  const isBowler = String(role).toUpperCase().includes('BOWL');
  const count = Number(hpLegalDeliveries) || 0;

  if (isBowler) {
    if (count >= 100) {
      return {
        tier: 'Strong Direct Evidence (>=100 HP)',
        shortLabel: 'Strong',
        badgeClass: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
        description: '>=100 high-pressure legal deliveries bowled',
        rangeText: '>=100 HP'
      };
    } else if (count >= 25) {
      return {
        tier: 'Moderate Direct Evidence (25-99 HP)',
        shortLabel: 'Moderate',
        badgeClass: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
        description: '25-99 high-pressure legal deliveries bowled',
        rangeText: '25-99 HP'
      };
    } else {
      return {
        tier: 'Limited Direct Evidence (<25 HP)',
        shortLabel: 'Limited',
        badgeClass: 'bg-[#fdf2f8] text-[#9d174d] border-[#fbcfe8]',
        description: '<25 high-pressure legal deliveries bowled',
        rangeText: '<25 HP'
      };
    }
  } else {
    // Batter
    if (count >= 150) {
      return {
        tier: 'Strong Direct Evidence (>=150 HP)',
        shortLabel: 'Strong',
        badgeClass: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
        description: '>=150 high-pressure legal deliveries faced',
        rangeText: '>=150 HP'
      };
    } else if (count >= 40) {
      return {
        tier: 'Moderate Direct Evidence (40-149 HP)',
        shortLabel: 'Moderate',
        badgeClass: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
        description: '40-149 high-pressure legal deliveries faced',
        rangeText: '40-149 HP'
      };
    } else {
      return {
        tier: 'Limited Direct Evidence (<40 HP)',
        shortLabel: 'Limited',
        badgeClass: 'bg-[#fdf2f8] text-[#9d174d] border-[#fbcfe8]',
        description: '<40 high-pressure legal deliveries faced',
        rangeText: '<40 HP'
      };
    }
  }
}

