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
