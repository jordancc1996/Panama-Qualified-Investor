import { COSTS_BEYOND_INVESTMENT, REAL_ESTATE_THRESHOLD_NOTE, programFaq, type FaqItem } from './program-faq';

export const financialFaq: FaqItem[] = [
  {
    q: "What does Panama's territorial tax system mean for me?",
    a: 'Panama generally uses a territorial tax system. Income earned within Panama is generally taxed there. <a href="/panama-qualified-investor-visa-benefits">Foreign-sourced income</a>, including investments, remote salaries, and overseas business profits, generally is not. Confirm how this applies to your situation with a qualified tax professional.',
  },
  {
    q: 'Is the $300,000 a fee or an investment?',
    a: `An investment. You own the asset. Real estate is yours to sell. Bank deposits are returned after 5 years. Securities stay in your brokerage account. ${REAL_ESTATE_THRESHOLD_NOTE}`,
  },
  {
    q: 'What are the total costs beyond the investment?',
    a: COSTS_BEYOND_INVESTMENT,
  },
  {
    q: 'Can I use a mortgage for the real estate route?',
    a: `${REAL_ESTATE_THRESHOLD_NOTE} That amount must be a direct investment. Mortgaged properties may qualify if your equity meets the threshold, but this varies. Confirm with your attorney.`,
  },
  {
    q: 'What about US taxes? Do I still pay the IRS?',
    a: 'Yes. The US taxes citizens on worldwide income regardless of residency. Panama residency does not change your <a href="/americans">US tax obligations</a>. Panama generally does not add tax on foreign-sourced income; confirm how this applies to your situation with a qualified tax professional.',
  },
  {
    q: 'Are there ongoing costs to maintain residency?',
    a: 'No government renewal fees. You maintain your qualifying investment.',
  },
];

export const practicalFaq: FaqItem[] = [
  {
    q: 'Is Panama safe?',
    a: 'Panama City is comparable to most major Latin American cities. Expat neighborhoods (Punta Pacífica, Costa del Este, Casco Viejo) are generally safe. Common-sense precautions apply. Panama has not experienced political violence or civil conflict in decades.',
  },
  {
    q: "What's the healthcare situation?",
    a: 'Panama has excellent private hospitals in Panama City, including Hospital Punta Pacífica (Pacífica Salud), which is affiliated with Johns Hopkins Medicine International. Many doctors are US or European trained. Costs are 40–70% lower than the US. International health insurance is available and affordable.',
  },
  {
    q: "How's the internet?",
    a: 'Fiber internet is widely available in Panama City, with speeds of 100–500 Mbps. Starlink is available as a backup. Sufficient for remote work, video calls, and streaming.',
  },
  {
    q: 'Can I drive with my foreign license?',
    a: 'You can use your foreign license for 90 days. After that, you can exchange it for a Panamanian license. The process is straightforward for permanent residents.',
  },
  {
    q: 'What about schooling for children?',
    a: 'Panama City has multiple international schools offering American, British, and IB curricula. Tuition ranges from $5,000–$15,000 per year depending on the school.',
  },
  {
    q: 'Is English spoken?',
    a: "Widely in business, banking, and healthcare. Panama's history with the Canal Zone means English proficiency is higher than most Latin American countries. In daily life outside expat areas, basic Spanish helps.",
  },
];

export const faqGroups = [
  {
    id: 'faq-general',
    eyebrow: 'General',
    heading: 'About the program.',
    background: 'cream' as const,
    items: programFaq,
  },
  {
    id: 'faq-financial',
    eyebrow: 'Financial',
    heading: 'Money, taxes, and costs.',
    background: 'paper' as const,
    items: financialFaq,
  },
  {
    id: 'faq-practical',
    eyebrow: 'Practical',
    heading: 'Living in Panama.',
    background: 'cream' as const,
    items: practicalFaq,
  },
];

export const allFaqs: FaqItem[] = [...programFaq, ...financialFaq, ...practicalFaq];
