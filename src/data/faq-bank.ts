import { COSTS_BEYOND_INVESTMENT, REAL_ESTATE_THRESHOLD_NOTE, type FaqItem } from './program-faq';

export type FaqBankTopic =
  | 'investmentRequirements'
  | 'applicationAndLegalProcess'
  | 'taxesBankingAndBusiness'
  | 'propertyOwnershipAndRentalIncome'
  | 'lifeInPanama'
  | 'workingWithGlp';

export type FaqBank = Record<FaqBankTopic, FaqItem[]>;

/**
 * Page-specific FAQ source bank. Pick items by topic when wiring a page.
 *
 * investmentRequirements and propertyOwnershipAndRentalIncome describe the
 * REAL ESTATE route. Use them only on real-estate or property-focused pages.
 * Do not present them as the only qualifying option on general program pages.
 * The program also has listed securities ($500,000) and a fixed-term bank
 * deposit ($750,000).
 */
export const faqBank: FaqBank = {
  investmentRequirements: [
    {
      q: 'What is the minimum investment?',
      a: `The program has three routes: titled real estate, listed securities from $500,000, and a fixed-term bank deposit from $750,000. ${REAL_ESTATE_THRESHOLD_NOTE}`,
    },
    {
      q: 'Can I use more than one property to meet the minimum?',
      a: `Yes. Multiple properties may be combined if their total registered value meets or exceeds US$300,000. ${REAL_ESTATE_THRESHOLD_NOTE}`,
    },
    {
      q: 'Can I finance part of the investment with a mortgage?',
      a: `Financing may be permitted if at least US$300,000 of the applicant's own funds is registered in the purchase. ${REAL_ESTATE_THRESHOLD_NOTE} Applicants should confirm the structure with their attorney before entering into a transaction.`,
    },
    {
      q: 'What types of properties qualify?',
      a: `Qualifying properties may include city, beach, island, and golf developments priced at US$300,000 or more, provided they meet the program's legal requirements (referred to in source material as GLP properties). ${REAL_ESTATE_THRESHOLD_NOTE}`,
    },
    {
      q: 'Are pre-construction properties eligible?',
      a: "Pre-construction properties may qualify if the legal documentation certifies the investor's ownership interest. The specific documents and ownership structure should be reviewed by a Panamanian attorney.",
    },
  ],
  applicationAndLegalProcess: [
    {
      q: 'What documents are required?',
      a: 'Applicants generally need a valid passport, a criminal background check, proof of the qualifying investment, and birth or marriage certificates when applicable. A Panamanian attorney prepares the application forms and confirms any additional documents required for the applicant and dependents.',
    },
    {
      q: 'Do I need to travel to Panama?',
      a: 'Yes. Applicants must appear in Panama at least once for biometrics and other immigration formalities.',
    },
    {
      q: 'Do I need a Panamanian attorney?',
      a: 'Yes. The QIP requires representation by a licensed Panamanian lawyer.',
    },
    {
      q: 'How much are the government fees?',
      a: COSTS_BEYOND_INVESTMENT,
    },
    {
      q: 'What happens after approval?',
      a: 'After approval, the applicant receives a permanent residency card. A tax residency certificate may also be available if the applicant needs one and meets the relevant requirements.',
    },
  ],
  taxesBankingAndBusiness: [
    {
      q: 'Does Panama tax worldwide income?',
      a: 'Panama generally uses a territorial tax system. Income earned within Panama is generally taxed there. Foreign-sourced income generally is not. The tax treatment of foreign income depends on the facts of each case; confirm how this applies to your situation with a qualified tax professional.',
    },
    {
      q: 'Can a resident open a bank account in Panama?',
      a: 'Residency may make the account-opening process easier, but banks apply their own due diligence, documentation, and approval requirements. Residency does not guarantee an account will be opened.',
    },
    {
      q: 'Can a permanent resident operate a business in Panama?',
      a: 'Permanent residents may be able to operate businesses or invest in Panama within applicable legal and regulatory frameworks. Certain professions and activities may require additional permits, licenses, or authorizations.',
    },
    {
      q: 'Does Panama have an inheritance or estate tax?',
      a: 'Panama does not impose an inheritance or estate tax, per the source material. Estate planning and asset treatment can involve other taxes, fees, and legal requirements, so applicants should obtain tailored advice.',
    },
    {
      q: 'Is Panama safe for expatriates?',
      a: 'Panama is viewed as one of the more stable countries in Latin America and has established banking and legal systems. Safety conditions vary by location, so prospective residents should assess the specific communities where they plan to live or invest.',
    },
  ],
  propertyOwnershipAndRentalIncome: [
    {
      q: 'Can I rent out my property?',
      a: 'Yes. Owners may rent their property long-term or short-term, subject to local zoning rules, building regulations, and other applicable requirements.',
    },
    {
      q: 'Does GLP provide property management services?',
      a: 'Yes. GLP offers property management and rental services for investors.',
    },
    {
      q: 'What rental yield can I expect?',
      a: 'Rental yields vary by property type, location, operating costs, and market conditions. Source material gives an estimated annual range of 4% to 8% for some city, beach, and island properties. This range is not guaranteed; investors should request property-specific financial projections.',
    },
    {
      q: 'Can I sell the property and keep my residency?',
      a: 'The qualifying investment should be maintained for the required minimum period. After that period, the property may be sold without affecting residency, subject to applicable rules at the time of sale. Confirm the required holding period with an attorney.',
    },
    {
      q: 'Can I purchase the property through a corporation or trust?',
      a: 'In many cases, a property may be purchased through a corporation or trust if the applicant remains the beneficial owner. The permitted structure depends on program rules and individual circumstances; have a Panamanian attorney review the arrangement before purchase.',
    },
  ],
  lifeInPanama: [
    {
      q: 'What is healthcare like in Panama?',
      a: 'Panama has both private and public healthcare systems. Panama City has major private hospitals, and healthcare costs may be lower than in many parts of North America and Europe. Access, quality, and cost vary by provider and location.',
    },
    {
      q: 'Are international schools available?',
      a: 'Yes. Panama offers American, British, French, German, and International Baccalaureate schools, among other educational options.',
    },
    {
      q: 'What is the cost of living like?',
      a: 'Living costs are often lower than in major cities in the United States and Europe. Actual expenses depend on location, housing, transportation, healthcare, schooling, and lifestyle.',
    },
  ],
  workingWithGlp: [
    {
      q: 'Why invest through Panama Qualified Investor?',
      a: 'Panama Qualified Investor is connected with experienced developers in Panama who, per the source material, have more than 30 years of experience and have delivered more than 20,000 units, including projects in master-planned communities.',
    },
  ],
};
