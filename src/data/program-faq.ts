export type FaqItem = {
  q: string;
  a: string;
};

/** Canonical real estate threshold note. Use wherever $300,000 is stated as the current real estate minimum. */
export const REAL_ESTATE_THRESHOLD_NOTE =
  'The current real estate minimum is $300,000; this is scheduled to increase to $500,000 on October 15, 2026.';

/** Canonical processing time. */
export const PROCESSING_TIME =
  '30 to 90 days from document submission to provisional permit';

/** Canonical costs beyond the qualifying investment. Source: /panama-qualified-investor-visa-cost. */
export const COSTS_BEYOND_INVESTMENT =
  "A $5,000 application fee paid to Panama's National Treasury, a $5,000 repatriation deposit paid to the National Immigration Service, and $2,000 per adult dependent if applicable, split between the National Treasury and the Immigration Service. Legal and professional fees vary by firm and scope. Get a written quote. This site does not state a dollar range for legal work because that figure is not a fixed government amount.";

/**
 * Fixed "About the Program" FAQs.
 * Answers follow the dedicated FAQ page, updated to the canonical facts.
 */
export const programFaq: FaqItem[] = [
  {
    q: 'What is the Panama Qualified Investor Visa?',
    a: `A permanent residency visa requiring a <a href="/panama-qualified-investor-visa-2026">qualifying investment</a> in Panamanian real estate, listed securities, or a bank deposit. ${REAL_ESTATE_THRESHOLD_NOTE} It grants the holder the right to live and work in Panama indefinitely, with a path to citizenship after five years.`,
  },
  {
    q: 'Is this a temporary or permanent visa?',
    a: 'Permanent. You receive a provisional permit, followed by a permanent residency card. Timing varies by case. There is no renewal requirement. The residency is indefinite.',
  },
  {
    q: 'How long does the process take?',
    a: `<a href="/panama-qualified-investor-visa-process-2026">${PROCESSING_TIME}</a>. The permanent card follows after that.`,
  },
  {
    q: 'Can I include my family?',
    a: 'Yes. Spouse, <a href="/panama-qualified-investor-visa-eligibility">dependent children</a>, and qualifying parents are typically included at no additional investment. Exact dependent eligibility should be confirmed with an attorney.',
  },
  {
    q: 'Do I need to live in Panama full-time?',
    a: 'No. Panama does not enforce a strict minimum stay requirement, though maintaining some periodic presence is recommended.',
  },
  {
    q: 'Is there a language requirement?',
    a: 'No. No Spanish test or cultural exam of any kind.',
  },
  {
    q: 'Can I work in Panama?',
    a: 'Yes. Permanent residency grants full work authorization.',
  },
  {
    q: 'Can I eventually get citizenship?',
    a: 'Yes. After five continuous years of permanent residency, you can apply for naturalization. Panama allows dual citizenship.',
  },
];

export function programFaqItems(omitQuestions: string[] = []) {
  if (omitQuestions.length === 0) return programFaq;
  const skip = new Set(omitQuestions);
  return programFaq.filter((item) => !skip.has(item.q));
}
