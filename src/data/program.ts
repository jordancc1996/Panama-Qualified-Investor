/**
 * Single source of truth for Panama Qualified Investor program facts
 * under Executive Decree No. 17 of 2026.
 *
 * Use only these values in UI copy. Do not invent processing times,
 * tax claims, or dependent-fee scope beyond what counsel has confirmed.
 */

export const DECREE = {
  name: 'Executive Decree No. 17 of 2026',
  shortLabel: 'Decree 17',
  issued: 'September 8, 2026',
  published: 'September 16, 2026',
  inForce: 'September 16, 2026',
  replaces: 'Decrees 722/2020 and 193/2024',
  /**
   * Counsel: replace with the Gaceta Oficial or MICI URL when confirmed.
   * No Decree 17 official URL is cited in this repo yet.
   */
  sourceUrl: null as string | null,
} as const;

export type InvestmentRoute = {
  id: string;
  label: string;
  minimum: number;
  minimumLabel: string;
  shortDescription: string;
};

export const ROUTES: InvestmentRoute[] = [
  {
    id: 'real-estate-first-sale',
    label: 'Real estate (first sale / new property)',
    minimum: 300_000,
    minimumLabel: 'US$300,000',
    shortDescription: 'First sale of a new property, registered in the applicant’s name.',
  },
  {
    id: 'real-estate-resale',
    label: 'Real estate (resale / secondary market)',
    minimum: 500_000,
    minimumLabel: 'US$500,000',
    shortDescription: 'Resale or secondary-market titled real estate.',
  },
  {
    id: 'securities',
    label: 'Securities on the Panama Stock Exchange',
    minimum: 500_000,
    minimumLabel: 'US$500,000',
    shortDescription: 'Securities listed on the Bolsa de Valores de Panamá.',
  },
  {
    id: 'deposit-state-bank',
    label: 'Fixed-term deposit at a state bank',
    minimum: 500_000,
    minimumLabel: 'US$500,000',
    shortDescription: 'Fixed-term deposit at Banco Nacional de Panamá or Caja de Ahorros.',
  },
  {
    id: 'deposit-private-bank',
    label: 'Fixed-term deposit at a private bank',
    minimum: 750_000,
    minimumLabel: 'US$750,000',
    shortDescription: 'Fixed-term deposit at a private bank licensed in Panama.',
  },
];

export const FEES = {
  treasury: 5_000,
  immigration: 5_000,
  perDependentEachAgency: 1_000,
  perDependentTotal: 2_000,
  /**
   * Counsel open item: confirm whether dependent fees apply to all
   * dependents or only adults. Site copy historically said "adult dependent."
   */
  dependentScopeNote: 'PENDING_COUNSEL_DEPENDENT_SCOPE',
} as const;

/** Investment must be held for this period after residency is granted. */
export const HOLD_PERIOD =
  '5 years after residency is granted, proven annually';

export const HOLD_PERIOD_SHORT = '5 years after residency is granted';

export const FUNDS_RULE =
  "Funds must be the applicant's own and come from abroad, verifiable; donations or free third-party transfers are not accepted.";

export const TRANSITION_NOTE =
  'Investments or filings made before September 16, 2026 have 6 months to qualify under the previous rules.';

/** Counsel: replace with review date (ISO or display string). */
export const LAST_REVIEWED = 'PENDING_COUNSEL_DATE';

/** Counsel: replace with reviewer name and credential. */
export const REVIEWER = 'PENDING_COUNSEL_REVIEWER';

/**
 * Canonical threshold note for FAQs and callouts.
 * Built from ROUTES / DECREE so amounts stay in sync.
 */
export const REAL_ESTATE_THRESHOLD_NOTE =
  'From US$300,000 for a first-sale property; US$500,000 for resale property, listed securities or a state-bank deposit; US$750,000 for a private-bank deposit (Executive Decree 17 of 2026).';

/** Compact three-path summary for audience pages (grouped layout). */
export const ROUTES_SUMMARY =
  'The Qualified Investor Visa has three paths under Executive Decree 17 of 2026: real estate (from US$300,000 for a first-sale property; US$500,000 for resale), listed securities from US$500,000, or a fixed-term deposit (US$500,000 at a state bank; US$750,000 at a private bank).';

export const REVIEW_LINE_TEXT = `Updated for ${DECREE.name} · Last reviewed ${LAST_REVIEWED} by ${REVIEWER}`;
