import { getCollection, type CollectionEntry } from 'astro:content';

export type ResearchEntry = CollectionEntry<'research'>;

export function isPublishedResearch(entry: ResearchEntry): boolean {
  return entry.data.draft !== true;
}

export async function getPublishedResearch(): Promise<ResearchEntry[]> {
  const all = await getCollection('research');
  return all
    .filter(isPublishedResearch)
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export function researchHref(entry: ResearchEntry): string {
  return `/research/${entry.data.slug}`;
}

export function typeLabel(type: ResearchEntry['data']['type']): string {
  return type === 'report' ? 'Research Report' : 'Research Brief';
}

export function formatResearchDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Visible Decree 17 caveat for the Outlook report (predates the decree). */
export const OUTLOOK_STATUS_NOTE = {
  slug: 'panama-investment-outlook',
  before:
    'Research cutoff: August 31, 2026. This report predates Executive Decree 17 of 2026, which replaced Decree 193. For current investment minimums and rules, see the ',
  linkText: 'Qualified Investor Visa 2026 overview',
  linkHref: '/panama-qualified-investor-visa-2026',
  after: '.',
} as const;

export function hasOutlookStatusNote(slug: string): boolean {
  return slug === OUTLOOK_STATUS_NOTE.slug;
}
