import type { FaqItem } from '../data/program-faq';

function visibleText(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** FAQPage JSON-LD from the same items rendered in the visible accordion. */
export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: visibleText(item.a),
      },
    })),
  };
}
