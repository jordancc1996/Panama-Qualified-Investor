# Page trim plan (report only)

**Repo tip measured:** `origin/main` @ `ec5edce` (post styling release)  
**Viewport:** 1440×900, Chromium headless against local `astro dev`  
**Heights:** section `getBoundingClientRect().height` (FAQ accordions collapsed, as first paint)  
**Scope:** all 16 site pages except `/privacy` (15 pages)  
**Hard rules:** no fact/figure/Decree 17/disclaimer changes; cut or relocate only; new copy limited to 1–2 sentence summaries built from existing wording plus link text; keep H1/title/description/opening keyword paragraph and all unique content; keep URLs and linked anchors; ≥3 inbound internal links per page; FAQPage JSON-LD lists only questions visible on that page.  
**Publish note:** Plan file lives at `docs/page-trim-plan.md` on branch `docs/trim-plan`. No site code in this commit. Await approval before any cuts.

### Home-page map (canonical “full home” for a topic)

| Topic | Home page |
| --- | --- |
| Program / routes / thresholds / citizenship path | `/panama-qualified-investor-visa-2026` |
| Costs / government fees | `/panama-qualified-investor-visa-cost` |
| Process / documents / timeline | `/panama-qualified-investor-visa-process-2026` |
| Eligibility / dependents / disqualifiers | `/panama-qualified-investor-visa-eligibility` |
| Benefits / tax / lifestyle | `/panama-qualified-investor-visa-benefits` |
| Full Q&A | `/panama-qualified-investor-visa-faq` |
| Audience detail | `/americans`, `/canadians`, `/h1b`, `/tech-founders`, `/crypto-investors` |
| Audience index | `/who-is-the-panama-qualified-investor-visa-for` |
| Research PDFs | `/panama-qualified-investor-visa-research-papers` |
| Company | `/about` |

### Site-wide savings (estimate)

| Metric | Before (15 pages) | After (plan) | Delta |
| --- | --- | --- | --- |
| Document height sum (scrollHeight) | ~96,400 px | ~66,000 px | **≈ −30,400 px (~32%)** |
| Visible main-section words (collapsed FAQ) | ~15,000 | ~10,200 | **≈ −4,800 words (~32%)** |
| Largest single cut | `ProgramFAQSection` on 13 non-FAQ pages | removed (kept on `/faq` only) | **≈ −10,800 px / −690 visible words** (answers remain on FAQ home) |
| Second cut | Homepage full FAQ mirror (3 groups) → 4–5 Qs | FAQ-TRIM | **≈ −1,850 px** |
| Third cut | Audience “Three routes” blocks (5 pages) | SUMMARIZE | **≈ −2,500 px** |

Word counts below are **visible** text with FAQs collapsed (matches measured height). Expanded FAQ answer text is much larger and is the true duplication load; FAQ-TRIM / REMOVE of `ProgramFAQSection` addresses that.

---

## A. Loss flags (every fact at risk)

Each row is a fact that can disappear if a cut is over-applied. “Home has word-for-word?” means the canonical topic home already contains that exact wording today (`origin/main` @ `ec5edce`).

| # | Page | Section | Exact fact at risk | Home has word-for-word? |
| --- | --- | --- | --- | --- |
| 1 | `/` | `#investment` (`InvestmentTable` non-embedded lede) | “Real estate is the lowest cash outlay under Decree 17.” | **No.** Threshold note and routes live on `/panama-qualified-investor-visa-2026`, but this lowest-outlay clause is homepage-only. Keep it in the merged Program/Investment summary. |
| 2 | `/panama-qualified-investor-visa-process-2026` | “What it costs beyond the investment” closer | “We provide a complete, itemized fee breakdown during your initial consultation: no hidden costs.” | **No.** Fee dollars live on `/panama-qualified-investor-visa-cost`; this consultation closer does not. Keep it in the process costs summary. |
| 3 | `/panama-qualified-investor-visa-benefits` | “Benefits that extend to your family” | “Permanent residency also gives you access to Panama's banking system, the ability to form a Panamanian corporation (Sociedad Anónima) or simplified company (SAS), and the legal standing to purchase property, sign contracts, and access the court system.” | **No.** `/tech-founders` has a different SAS card (“Sociedad Anónima Simplificada (SAS), a streamlined corporate structure…”). Keep the benefits sentence when summarizing family/legal. |
| 4 | `/americans` | `#page-faq` + “The reality” + benefit cards | All five American FAQ answers (US tax / Social Security-Medicare / US bank accounts / part-year stay / $300,000 refundable) and the American-only reality prose and six cards | **No** as page-unique blocks. Do not REMOVE. Routes block may SUMMARIZE; FAQs and reality stay. |
| 5 | `/canadians` | `#page-faq` + “The reality” + benefit cards | All four Canadian FAQ answers (Canadian taxes / RRSP-TFSA / political stability / healthcare) and Canadian-only reality prose and six cards | **No.** Same rule as #4. |
| 6 | `/h1b` | `#page-faq` + “The reality” + benefit cards | All five H-1B FAQ answers (H-1B/green card interaction / apply while on H-1B / keep Panama after green card / $300,000 on H-1B salary / H-4 spouse work) and H-1B-only reality prose and six cards | **No.** Same rule as #4. |
| 7 | `/tech-founders` | `#page-faq` + “The reality” + benefit cards | All five founder FAQ answers (run company from Panama / US company tax / internet for remote work / bring team or hire / social scene) and founder-only reality prose and six cards | **No.** Same rule as #4. |
| 8 | `/crypto-investors` | `#page-faq` + “The reality” + benefit cards | All five crypto FAQ answers (crypto as source of funds / convert before apply / Panama tax on crypto / manage wallets outside Panama / refundability after placing into qualifying asset) and crypto-only reality prose and six cards | **No.** Same rule as #4. |
| 9 | Any page that currently shows Decree / fee / timeline facts | Duplicate instances being deleted | Decree 17 dates, `FUNDS_RULE`, `TRANSITION_NOTE`, fee amounts ($5,000 / $5,000 / $2,000), `PROCESSING_TIME` (“30 to 90 days…”), hold period | **Yes** on the mapped homes (visa / cost / process / eligibility / FAQ data modules). Delete duplicates only; never rewrite the remaining instance. |
| 10 | `/` and global chrome | `#book`, `#why`, `#investment-routes` (and other preserved ids) | Structural deep links: footer “About Panama” → `/#why`; footer/CTAs → `/#book`; footer “Investment Options” + cost/audience links → `/panama-qualified-investor-visa-2026#investment-routes` | N/A (anchors, not copy). Breaking these breaks navigation. |
| 11 | Non-FAQ pages with `ProgramFAQSection` | `#about-the-program` (default id) | Section removal drops `#about-the-program` on those pages | Program FAQ answers **yes** word-for-word on `/panama-qualified-investor-visa-faq`. Grep before delete; if any deep link remains, retarget to `/panama-qualified-investor-visa-faq#faq-general` or add a no-op bookmark there. |
| 12 | `/panama-qualified-investor-visa-2026` | `#page-faq` estate-tax question | “Does Panama have an inheritance or estate tax?” dropped from this page’s visible FAQ | **Yes** on FAQ / benefits tax cards / `faqBank.taxesBankingAndBusiness`. Safe to drop from visa page FAQ only. |

---

## B. Audience pages: unique sentences after the cut + word count

Cut on each audience page: **SUMMARIZE** “Three routes to the same residency” (drop full `InvestmentDeadlineNote` + long `ROUTES_SUMMARY` duplicate; leave 1–2 sentences + links); **REMOVE** `ProgramFAQSection`. Everything else stays.

Estimated visible words after (collapsed FAQ), from the page table below: none under 600.

### `/americans` — after ≈ **~900 words** (OK, ≥600)

**Unique sentences that remain** (not on other audience pages; routes chrome excluded):

- H1: “The Panama Qualified Investor Visa for Americans: a tax-efficient Plan B that doesn't require giving anything up.”
- Subtext: “How US citizens and residents are using the Panama Qualified Investor Visa for Americans to secure permanent residency abroad, without renouncing citizenship, triggering new tax obligations, or leaving their lives behind.”
- Reality: “The conversation has shifted. Five years ago, second residency was something ultra-high-net-worth families discussed with their wealth managers. Today, it's founders, tech workers, remote professionals, and retirees asking the same question: what's my backup plan?”
- Reality: “The reasons vary. Some are watching the political landscape and want optionality. Others are thinking about retirement in a lower-cost, dollar-denominated economy. Many are simply diversifying: the same way they diversify their investments, they want to diversify where they have the legal right to live.”
- Reality: “The challenge for Americans is that most international residency programs create tax complications. The US taxes its citizens on worldwide income regardless of where they live, so moving abroad doesn't reduce your tax burden unless you renounce citizenship, which most people don't want to do.”
- Reality: “Panama is different. Its territorial tax system only taxes income earned inside Panama. If you're an American living in Panama on investment income, remote work for a US company, or capital gains from US markets, Panama doesn't tax any of it. You still file with the IRS as you always have, but you don't add a second country's tax authority on top of it.”
- Cards: “Panama's territorial system means your US-sourced income, investments, and capital gains are not taxed by Panama. You only deal with the IRS.” / “Panama uses the US dollar as its official currency. No conversion fees, no currency risk, no surprises on your bank statements.” / “Permanent residency in Panama has zero impact on your US citizenship. Keep your passport, your rights, and your voting ability.” / “Panamanian banks are accustomed to working with US clients and comply with FATCA reporting. Opening an account is straightforward.” / “Tocumen International Airport has direct flights to Miami (2.5 hrs), New York (5 hrs), Houston (4 hrs), and Los Angeles (6 hrs).” / “Panama's legal framework for property ownership and business formation is well-established. US investors have operated here for over a century, since the Canal.”
- FAQs (questions + answers stay in full): US taxes if move to Panama; Social Security or Medicare; keep US bank accounts and brokerage; part of the year in Panama; is $300,000 refundable.
- CTA: “15 minutes with an advisor who works specifically with American clients.”

### `/canadians` — after ≈ **~880 words** (OK, ≥600)

- H1: “The Panama Qualified Investor Visa for Canadians: a residency that keeps pace with your ambition.”
- Subtext: “How Canadian investors and entrepreneurs are using the Panama Qualified Investor Visa for Canadians to access a dollarized economy with territorial taxation, without the wait times and complexity of European golden visas.”
- Reality: “Canada's economic landscape is shifting. Capital gains inclusion rate changes, higher housing costs in major cities, and an increasingly complex tax code are prompting more Canadians to think internationally.”
- Reality: “For investors and business owners, the math has changed. Higher capital gains taxes reduce the net return on exits, real estate, and portfolio gains. Meanwhile, the cost of living in Vancouver and Toronto now rivals London and New York, without the same access to global financial infrastructure.”
- Reality: “European golden visas are the traditional alternative, but they come with friction. Portugal's program has been restructured repeatedly. Greece requires physical presence. Malta has a lengthy due diligence process and a price tag well above $300,000. Processing times are measured in months or years, not weeks.”
- Reality: “Panama offers a cleaner path. A first-sale real estate investment from US$300,000 under Executive Decree 17 of 2026. Processing is 30 to 90 days from document submission to provisional permit. There is no language requirement, and a territorial tax system that doesn't tax income earned outside the country. For Canadians earning from global investments, remote consulting, or Canadian-registered businesses, this matters.”
- Cards: Territorial tax for Canadians; USD economy for CAD investors; faster than Europe (30–90 days); lower entry vs Portugal/Malta/Greece/UK; no physical presence trap; familiar banking / correspondent relationships.
- FAQs in full: Canadian taxes interaction; keep RRSP and TFSA; Panama politically stable; healthcare.
- CTA: advisor line specific to Canadian clients (parallel audience CTA pattern).

### `/h1b` — after ≈ **~950 words** (OK, ≥600)

- H1: “The Panama Qualified Investor Visa for H-1B holders: a permanent residency that doesn't depend on a queue, a sponsor, or a lottery.”
- Subtext: “How H-1B holders, especially those facing decade-long green card backlogs, are using the Panama Qualified Investor Visa for H-1B holders as a parallel path to permanent legal status outside the US.”
- Reality: green card backlog as structural problem; employer-tied status / 60-day layoff window; “The rational response is not to wait. It's to build a backup.”; Panama QIV independent of USCIS with no country quota / employer / lottery / queue; H-1B unaffected.
- Cards: No country quotas; no employer dependency; independent of US backlog; H-1B status unaffected; a home you actually own; family coverage / H-4 EAD contrast.
- FAQs in full: affect H-1B or green card; do this while still on H-1B; green card later / keep Panama; $300,000 realistic on H-1B salary; H-4 spouse work authorization in Panama.
- CTA: advisor line specific to H-1B clients.

### `/tech-founders` — after ≈ **~920 words** (OK, ≥600)

- H1: “The Panama Qualified Investor Visa for tech founders: base your life somewhere that matches how you build.”
- Subtext: “How remote-first founders, startup CEOs, and Web3 builders are using the Panama Qualified Investor Visa for tech founders to establish a strategic home base, with zero tax on foreign income and direct flights to both US coasts.”
- Reality: company everywhere / residency somewhere; US tax resident friction for Delaware/Cayman/Singapore income; Dubai/Lisbon/Singapore trade-offs; “Panama sits in the sweet spot…” (Americas, dollarized, territorial tax, modern finance, no 183-day proof).
- Cards: territorial tax / foreign income untaxed; Americas time zone; no minimum stay; crypto-friendly banking; SAS formation available; cost of living vs SF/NY.
- FAQs in full: run company from Panama; US company tax treatment; internet for remote work; bring team or hire locally; social scene for founders.
- CTA: advisor line specific to founder clients.

### `/crypto-investors` — after ≈ **~930 words** (OK, ≥600)

- H1: “The Panama Qualified Investor Visa for Crypto Investors: residency funded with capital you already realized.”
- Subtext: “How crypto investors are using the Panama Qualified Investor Visa to place crypto-derived capital into a qualifying investment.”
- Reality: crypto position is not by itself a residency application; source-of-funds same as other lawful sources; starting point of capital changes, not the visa; territorial tax reason crypto investors look here.
- Cards: crypto-derived capital; same source-of-funds standard; territorial taxation; dollar-denominated; three investment routes (threshold note); no language test.
- FAQs in full: crypto gains as source of funds; convert before apply; will Panama tax crypto; manage wallets/exchanges outside Panama; refundability after placing into qualifying asset.
- CTA: advisor line specific to crypto clients.

**Flag:** No audience page is projected under 600 words after the cut.

---

## C. FAQ questions that remain + FAQPage JSON-LD

Rule: visible FAQ questions on a page and that page’s `FaqJsonLd` / FAQPage schema must be the **same list**. `ProgramFAQSection` has **no** JSON-LD today (schema lives on the FAQ page only). After trim, do not leave orphan schema.

| Page | Remaining visible FAQ questions (exact `q` text) | FAQPage JSON-LD |
| --- | --- | --- |
| `/` | 1. What is the Panama Qualified Investor Visa? 2. How long does the process take? 3. Can I include my family? 4. Do I need to live in Panama full-time? 5. Is the $300,000 a fee or an investment? | **Add** `FaqJsonLd` for exactly these 5 (homepage currently has **no** FaqJsonLd). Or omit schema if the trimmed FAQ block is dropped entirely (not the plan). |
| `/panama-qualified-investor-visa-2026` | 1. What investment options are available under the QIV? 2. Who issues the Qualified Investor Visa? 3. Are there nationality-based quotas? | `FaqJsonLd items={pageFaqs}` → shrink to exactly these 3 (drop estate-tax Q). |
| `/panama-qualified-investor-visa-cost` | 1. What is the application fee? 2. What is the repatriation deposit? 3. How much is the fee for an adult dependent? 4. Are legal fees included in the government charges? | Keep `FaqJsonLd` = exactly these 4 (optional later drop of one table-duplicate; if dropped, shrink schema too). |
| `/panama-qualified-investor-visa-process-2026` | 1. Do I need to travel to Panama? 2. What documents are required? 3. Do I need a Panamanian attorney? 4. What happens after approval? | Keep `FaqJsonLd` = exactly these 4 (already excludes “How much are the government fees?”). |
| `/panama-qualified-investor-visa-eligibility` | **None.** Current `#page-faq` set is 100% the same bank as process; **REMOVE** the visible page FAQ and its schema. Application Qs remain on process + FAQ home. | **Remove** `FaqJsonLd` from this page. |
| `/panama-qualified-investor-visa-benefits` | 1. Does Panama tax worldwide income? 2. Can a resident open a bank account in Panama? 3. Can a permanent resident operate a business in Panama? | Keep `FaqJsonLd` = exactly these 3. |
| `/panama-qualified-investor-visa-faq` | Full `programFaq` (8) + `financialFaq` (6) + `practicalFaq` (6) as rendered today | Keep `FaqJsonLd items={allFaqs}` matching those three visible groups. |
| `/who-is-the-panama-qualified-investor-visa-for` | 1. How do I choose which guide to read? 2. What if none of the five guides describe my situation? | Keep `FaqJsonLd` = exactly these 2. |
| `/americans` | 1. Do I still have to pay US taxes if I move to Panama? 2. Does this affect my Social Security or Medicare? 3. Can I keep my US bank accounts and brokerage? 4. What if I only want to spend part of the year in Panama? 5. Is $300,000 refundable if I change my mind? | Keep `FaqJsonLd items={faqs}` = exactly these 5. |
| `/canadians` | 1. How does this interact with Canadian taxes? 2. Can I keep my RRSP and TFSA? 3. Is Panama politically stable? 4. What about healthcare? | Keep `FaqJsonLd` = exactly these 4. |
| `/h1b` | 1. Does getting Panama residency affect my H-1B or green card case? 2. Can I do this while I'm still in the US on an H-1B? 3. What if I get my green card later? Do I lose the Panama residency? 4. Is $300,000 realistic on an H-1B salary? 5. My spouse is on H-4 and can't work. Does Panama help? | Keep `FaqJsonLd` = exactly these 5. |
| `/tech-founders` | 1. Can I run my company from Panama? 2. What about my US company? Does this change anything? 3. Is the internet reliable enough for remote work? 4. Can I bring my team or hire locally? 5. What's the social scene like for founders? | Keep `FaqJsonLd` = exactly these 5. |
| `/crypto-investors` | 1. Can I use crypto gains as my source of funds? 2. Do I need to convert crypto before I apply? 3. Will Panama tax my crypto? 4. Can I keep managing wallets and exchanges from outside Panama? 5. If I place realized crypto into a qualifying asset, is that capital refundable? | Keep `FaqJsonLd` = exactly these 5. |
| `/about` | None | No FAQ schema. |
| `/panama-qualified-investor-visa-research-papers` | None (after Program FAQ REMOVE) | No FAQ schema. |

**Confirmation:** After implementation, each page’s FAQPage JSON-LD must list **exactly** the questions in its row above (empty = no FAQPage schema).

---

## D. Anchors kept + every link that targets one

### Anchors to keep (do not remove or rename)

| Anchor | Page(s) where id lives | Links that target it (from `origin/main`) |
| --- | --- | --- |
| `#main` | All pages (`<main id="main">`) | `BaseLayout` skip link: `href="#main"` |
| `#top` | `/` (`Hero`), each audience hero | In-page / skip patterns; keep on heroes |
| `#why` | `/` (`WhyPanama`) | Footer Resources: `/#why` (“About Panama”) |
| `#audiences` | `/` (`Audiences`) | In-page; keep for homepage audience jump |
| `#benefits` | `/` (`Benefits`) | In-page |
| `#program` | `/` (`ProgramOverview`) | In-page; keep if section remains or merges |
| `#investment` | `/` (`InvestmentTable` non-embedded) | In-page; **keep id on merged Program/Investment block** if sections merge |
| `#process` | `/` (`ProcessSteps`) | In-page |
| `#eligibility` | `/` (`Eligibility`) | In-page |
| `#book` | `/` (`CTANextSteps`) | Footer `/#book` (“Speak to an Advisor”, “Contact”); audience hero CTAs `/#book` (americans, canadians, h1b, tech-founders, crypto-investors); who-is-for FAQ answer `/#book`; `MobileCTABar` `href="#book"` (homepage) |
| `#faq-general` | `/` (trimmed FAQ) and `/panama-qualified-investor-visa-faq` | Homepage + FAQ home group anchors; keep on FAQ home; keep on `/` if trimmed FAQ uses this id |
| `#faq-financial` | `/panama-qualified-investor-visa-faq` (and currently `/` via `CategorizedSiteFaq`) | FAQ home group; on `/` retire only if nothing links to `/#faq-financial` (no footer/nav hits today) |
| `#faq-practical` | `/panama-qualified-investor-visa-faq` (and currently `/`) | Same as financial |
| `#investment-routes` | `/panama-qualified-investor-visa-2026` | Footer “Investment Options”; homepage `InvestmentTable` CTA; cost page body + table; all five audience route pointers; visa page FAQ answer `#investment-routes` |
| `#page-faq` | Program + audience pages that keep a page FAQ | In-page FAQ section id; **eligibility** may drop the section (no inbound `#page-faq` links found); keep on pages that retain FAQs |
| `#about-the-program` | Default `ProgramFAQSection` id on non-FAQ pages | No footer/nav hits found. If section REMOVEd, grep again; retarget any rare deep link to `/panama-qualified-investor-visa-faq#faq-general` |
| `#preferred-sources-heading` | Footer `PreferredSourcesCTA` | a11y label (heading id) |
| `#papers-email` | Research papers notify form | Form label `for` / input id |

**Not required as preserved content anchors** (UI chrome only, but do not break if referenced): modal/form control ids, `#navbar`, `#mobile-nav`, `#mobile-cta-bar`, `#monthly-email`, top-cta field ids, `#advisor-*` / `#book-*` form fields.

URLs: **no slug changes**.

---

## 1. `/` (Homepage)

**Before → after:** ~9,816 px / ~1,500 words → **~6,400 px / ~900 words** (−35% / −40%)

**Target shape:** hero; why Panama; five audiences (short, linked); three routes + thresholds as one compact summary → `/panama-qualified-investor-visa-2026` + `/panama-qualified-investor-visa-cost`; process as a short step list → `/panama-qualified-investor-visa-process-2026`; 4–5 top FAQs → `/panama-qualified-investor-visa-faq`; advisor CTA (`#book`). Benefits, eligibility, and detailed cost become summaries + links (already mostly true; FAQ is the main cut).

| Section (order) | Words | ~Height | Shared sentences | Home for content | Action |
| --- | --- | --- | --- | --- | --- |
| Hero `#top` — “Permanent residency in Panama from $300,000.” | 62 | 820 px | ~33% (threshold note / route phrasing shared with audience + program pages) | `/` (entry) + routes home `/panama-qualified-investor-visa-2026` | **KEEP** (H1 + keyword opening). Keep `InvestmentDeadlineNote` or point thresholds via link; do not rewrite Decree figures. |
| Monthly updates | 8 | 185 px | 0% (UI chrome) | n/a | **KEEP** once (see inventory). |
| Why Panama `#why` | 68 | 607 px | ~0% unique lede | `/` (short) + benefits detail `/panama-qualified-investor-visa-benefits` | **KEEP** |
| Section divider | 0 | 17 px | — | — | **KEEP** or drop if adjacent sections merge |
| Audiences `#audiences` | 50 | 719 px | ~0% | audience pages + `/who-is-the-panama-qualified-investor-visa-for` | **KEEP** (already short + linked) |
| Benefits `#benefits` | 62 | 513 px | thematic overlap with benefits page (not exact sentences) | `/panama-qualified-investor-visa-benefits` | **KEEP** as summary + existing “See all benefits” link (already matches target) |
| Program `#program` | 57 | 486 px | thematic overlap with visa page | `/panama-qualified-investor-visa-2026` | **SUMMARIZE / MERGE** with Investment into one “routes + thresholds” block (see below) |
| Investment `#investment` | 62 | 486 px | ~25% (threshold note) | `/panama-qualified-investor-visa-2026` + cost `/panama-qualified-investor-visa-cost` | **SUMMARIZE / MERGE** into Program; keep `#investment` id on the merged section or a child so in-page targets stay valid |
| Process `#process` | 52 | 486 px | ~20% (“30 to 90 days…”) | `/panama-qualified-investor-visa-process-2026` | **KEEP** but upgrade body to a **short step list** using existing process titles only (Consultation; Documents; Investment; Filing; Biometrics; Card), 1 line each from process page wording, plus link. Do not invent new steps. |
| Eligibility `#eligibility` | 44 | 460 px | thematic overlap | `/panama-qualified-investor-visa-eligibility` | **KEEP** as summary + link (already matches target) |
| FAQ General `#faq-general` | 53* | 834 px | **~92%** identical to `/faq` + 12 other pages | `/panama-qualified-investor-visa-faq` | **FAQ-TRIM** (see below) |
| FAQ Financial `#faq-financial` | 57* | 708 px | **~74%** same as FAQ home | `/panama-qualified-investor-visa-faq` | **FAQ-TRIM / REMOVE** from homepage set |
| FAQ Practical `#faq-practical` | 29* | 708 px | **~87%** same as FAQ home | `/panama-qualified-investor-visa-faq` | **FAQ-TRIM / REMOVE** from homepage set |
| Advisor CTA `#book` | 176 | 1,048 px | ~0% | `/` | **KEEP** |
| TopCTA (subscribe) | 61 | 815 px | **100%** sitewide | n/a | **KEEP** once |

\*Collapsed visible words; expanded answers duplicate the FAQ page.

**FAQ-TRIM (homepage):** Keep **5** questions only, all linking onward to `/panama-qualified-investor-visa-faq` (see section C). Preserve `#faq-general` on the trimmed block. Add FAQPage JSON-LD for **only** those 5.

**SUMMARIZE confirmations**

| Cut | Facts exist on home? |
| --- | --- |
| Full 8-question Program FAQ + financial + practical on `/` | Yes on `/panama-qualified-investor-visa-faq` (`programFaq`, `financialFaq`, `practicalFaq` in `src/data/full-faq.ts`). |
| Separate Program vs Investment sections | Routes/thresholds fully on `/panama-qualified-investor-visa-2026` overview + `#investment-routes` and comparison table. Cost fees fully on `/panama-qualified-investor-visa-cost`. |
| **At risk if over-merged:** homepage-only lede “Real estate is the lowest cash outlay under Decree 17” | Keep that clause in the merged summary or it is lost (not on visa page in that wording). |

---

## 2. `/panama-qualified-investor-visa-2026` (Visa / routes home)

**Before → after:** ~7,249 px / ~1,240 words → **~5,400 px / ~1,050 words** (−26% / −15%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Page hero (H1 + opening) | 32 | 630 | 0% | this page | **KEEP** |
| Monthly updates | 8 | 185 | — | n/a | **KEEP** once |
| What is the Qualified Investor Visa? | 254 | 1,024 | ~0% exact; themes elsewhere | **this page** | **KEEP** (canonical overview; Decree 17 dates, FUNDS_RULE, TRANSITION_NOTE) |
| Three ways to qualify `#investment-routes` | 238 | 870 | ~7% (threshold note) | **this page** | **KEEP** (canonical routes) |
| Comparing the three routes (table) | 97 | 718 | 0% | **this page** | **KEEP** |
| From permanent resident to citizen | 94 | 589 | thematic with benefits | **this page** (citizenship path) | **KEEP** (fullest citizenship wording) |
| Page FAQ `#page-faq` (4 Qs) | 32* | 581 | ~7% | FAQ home for general Qs; route Q unique here | **FAQ-TRIM** to 3 route/nationality Qs; drop estate-tax Q |
| About the Program `#about-the-program` | 53* | 834 | **~92%** | `/panama-qualified-investor-visa-faq` | **REMOVE** |
| CtaBand | 10 | 140 | 0% | — | **KEEP** |
| TopCTA | 61 | 815 | 100% | — | **KEEP** once |

**REMOVE confirm:** All 8 `programFaq` answers exist on `/panama-qualified-investor-visa-faq`. No unique fact in that block on this page.

**At risk:** None if Program FAQ removed; inheritance answer remains on FAQ / benefits.

---

## 3. `/panama-qualified-investor-visa-cost` (Cost home)

**Before → after:** ~6,953 px / ~930 words → **~5,300 px / ~800 words** (−24% / −14%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 27 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| Two parts, not one number | 57 | 415 | 0% | **this page** | **KEEP** |
| Capital you place… | 105 | 669 | ~29% (threshold + routes pointer) | routes on visa page; fees here | **KEEP** (already points to `#investment-routes`; do not restate route bodies) |
| Government fees (3 cards) | 82 | 536 | 0% unique layout | **this page** | **KEEP** |
| Legal and professional fees | 81 | 493 | 0% | **this page** | **KEEP** |
| How the pieces add up (table) | 113 | 791 | 0% | **this page** | **KEEP** |
| Page FAQ `#page-faq` (4 fee Qs) | 36* | 581 | 0% vs other page FAQs | **this page** / also on FAQ via COSTS_BEYOND_INVESTMENT | **KEEP** all 4 (see section C) |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| CtaBand | 10 | 140 | — | — | **KEEP** |
| TopCTA | 61 | 815 | 100% | — | **KEEP** |

**REMOVE confirm:** Program FAQ fully on `/panama-qualified-investor-visa-faq`. Fee facts ($5,000 / $5,000 / $2,000) live in this page’s cards + table and in `COSTS_BEYOND_INVESTMENT`.

---

## 4. `/panama-qualified-investor-visa-process-2026` (Process home)

**Before → after:** ~7,359 px / ~1,160 words → **~5,200 px / ~900 words** (−29% / −22%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 29 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| What to expect, week by week (6 steps) | 408 | 1,659 | ~0% | **this page** | **KEEP** |
| What you need to prepare (docs) | 141 | 941 | ~0% | **this page** | **KEEP** |
| What it costs beyond the investment | 149 | 710 | **~44%** (`REAL_ESTATE_THRESHOLD_NOTE` + `COSTS_BEYOND_INVESTMENT`) | `/panama-qualified-investor-visa-cost` | **SUMMARIZE** |
| Page FAQ `#page-faq` (application Qs) | 26* | 581 | **100%** same bank as eligibility page FAQ | process-related → keep 4 here; full set → `/faq` | **FAQ-TRIM** (see section C) |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

**SUMMARIZE → cost home:** Replace the long costs prose with 1–2 sentences from existing wording, e.g. reuse: “The qualifying investment is yours; it is not a fee.” + pointer that application fee, repatriation deposit, and dependent fee are itemized on the cost page. **Keep** “We provide a complete, itemized fee breakdown during your initial consultation: no hidden costs.”

---

## 5. `/panama-qualified-investor-visa-eligibility` (Eligibility home)

**Before → after:** ~6,891 px / ~940 words → **~5,200 px / ~800 words** (−25% / −15%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 28 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| What you must have | 158 | 975 | ~13% (threshold) | **this page** | **KEEP** |
| Barriers that don't exist here | 142 | 692 | ~10% | **this page** | **KEEP** |
| Who can be included | 100 | 626 | ~25% (family wording also on benefits) | **this page** (dependents home) | **KEEP** |
| Who does not qualify | 83 | 549 | 0% | **this page** | **KEEP** |
| Page FAQ `#page-faq` | 25* | 581 | **100%** vs process page FAQ set | `/faq` + process | **REMOVE** (duplicate of process; see section C) |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

**At risk:** None for unique eligibility cards/disqualifiers if those sections stay.

---

## 6. `/panama-qualified-investor-visa-benefits` (Benefits home)

**Before → after:** ~6,455 px / ~1,020 words → **~4,900 px / ~850 words** (−24% / −17%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 28 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| Territorial tax system… | 247 | 966 | ~19% (tax sentences echo FAQ/crypto) | **this page** | **KEEP** |
| What daily life looks like | 150 | 716 | ~0% | **this page** | **KEEP** |
| Benefits that extend to your family | 151 | 787 | ~25% (dependents + citizenship) | dependents → eligibility; citizenship → visa; fees → cost | **SUMMARIZE** (keep banking/SA/SAS sentence) |
| Page FAQ `#page-faq` (3 tax/banking Qs) | 31* | 518 | ~10% | FAQ home also has tax Qs | **KEEP** these 3 |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

---

## 7. `/panama-qualified-investor-visa-faq` (FAQ home)

**Before → after:** ~4,883 px / ~900 words → **~4,883 px / ~900 words** (no content cut; this is the full Q&A home)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 22 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| About the Program `#faq-general` | 53* | 834 | shared outward (source of truth) | **this page** | **KEEP** (sole full Program FAQ) |
| Money, taxes, and costs `#faq-financial` | 57* | 708 | shared outward | **this page** | **KEEP** |
| Living in Panama `#faq-practical` | 29* | 708 | shared outward | **this page** | **KEEP** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

**Schema:** `FaqJsonLd` already uses `allFaqs` matching the three visible groups.

---

## 8. `/who-is-the-panama-qualified-investor-visa-for`

**Before → after:** ~5,835 px / ~950 words → **~4,600 px / ~820 words** (−21% / −14%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 36 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| Audience cards grid | 396 | 1,337 | teaser copy overlaps audience pages (paraphrase, not identical) | each audience page | **KEEP** (index role) |
| The QIV is open to all nationalities | 104 | 577 | thematic with eligibility | eligibility for quotas | **KEEP** (unique framing) |
| Page FAQ `#page-faq` (2 Qs) | 23* | 455 | 0% | this page | **KEEP** (already ≤5; on-topic) |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

**SEO:** Audience pages rely on this page + homepage `#audiences` for inbound links. Do not remove those links when trimming card copy.

---

## 9–13. Audience pages (shared pattern)

Pages: `/americans`, `/canadians`, `/h1b`, `/tech-founders`, `/crypto-investors`  
**Each before:** ~6,770–6,960 px / ~1,090–1,210 words  
**Each after:** ~4,700–4,900 px / ~850–950 words (**≈ −30% height / −20% words**)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero `#top` + keyword opening + advisor button | 40–61 | 630 | 0% | this audience page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| “The reality” prose | 190–250 | 840–1,000 | low (audience-unique) | **this page** | **KEEP** |
| Why Panama works for [audience] (6 cards) | 150–200 | 830–930 | low–20% (dollar / territorial themes) | **this page** | **KEEP** |
| Three routes to the same residency | **103** | **665** | **~80%** identical across all 5 + threshold note | `/panama-qualified-investor-visa-2026` (+ cost / process links) | **SUMMARIZE** |
| Page FAQ `#page-faq` (4–5 audience Qs) | 27–63* | 580–644 | low (audience-unique) | audience Qs stay here; general → `/faq` | **KEEP** all 4–5 audience-specific Qs |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| Audience CtaBand | 25–28 | 420–450 | ~50% template | this page | **KEEP** |
| TopCTA | 61 | 815 | 100% | — | **KEEP** |

**SUMMARIZE routes block:** Replace `InvestmentDeadlineNote` + full `ROUTES_SUMMARY` paragraph + process note with 1–2 sentences from existing wording + “See the full breakdown of all three routes” + process link. Drop the duplicate deadline aside on audience pages (thresholds remain on visa/cost homes and homepage hero).

**At risk per audience:** None in routes cut if links remain. **Do not trim** audience-specific FAQ answers or reality prose.

**Inbound SEO (≥3):** Keep homepage `#audiences` links, who-is-for cards, and existing cross-links.

---

## 14. `/about`

**Before → after:** ~3,767 px / ~190 words → **~3,767 px / ~190 words** (already lean)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 27 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| Information on one visa program | 32 | 387 | 0% | this page | **KEEP** |
| Partnerships | 19 | 359 | 0% | this page | **KEEP** |
| Research | 34 | 387 | 0% | papers page for PDFs | **KEEP** |
| CtaBand / TopCTA | 71 | 955 | — | — | **KEEP** |

No Program FAQ today. No trim required beyond inventory.

---

## 15. `/panama-qualified-investor-visa-research-papers`

**Before → after:** ~3,983 px / ~390 words → **~3,150 px / ~340 words** (−21% / −13%)

| Section | Words | ~Height | Shared % | Home | Action |
| --- | --- | --- | --- | --- | --- |
| Hero + opening | 30 | 630 | 0% | this page | **KEEP** |
| Monthly | 8 | 185 | — | — | **KEEP** |
| Paper list | 42 | 428 | 0% | **this page** | **KEEP** |
| Notify Me form | 18 | 228 | subscribe-like (extra) | — | **KEEP** papers notify + **KEEP** TopCTA |
| About the Program | 53* | 834 | ~92% | `/faq` | **REMOVE** |
| TopCTA | 61 | 815 | 100% | — | **KEEP** |

**At risk:** None.

---

## Estimated before → after by page

| Page | Height before | Height after | Words before | Words after |
| --- | ---: | ---: | ---: | ---: |
| `/` | 9,816 | ~6,400 | ~1,500 | ~900 |
| `/panama-qualified-investor-visa-2026` | 7,249 | ~5,400 | ~1,240 | ~1,050 |
| `/panama-qualified-investor-visa-cost` | 6,953 | ~5,300 | ~930 | ~800 |
| `/panama-qualified-investor-visa-process-2026` | 7,359 | ~5,200 | ~1,160 | ~900 |
| `/panama-qualified-investor-visa-eligibility` | 6,891 | ~5,200 | ~940 | ~800 |
| `/panama-qualified-investor-visa-benefits` | 6,455 | ~4,900 | ~1,020 | ~850 |
| `/panama-qualified-investor-visa-faq` | 4,883 | ~4,883 | ~900 | ~900 |
| `/who-is-the-panama-qualified-investor-visa-for` | 5,835 | ~4,600 | ~950 | ~820 |
| `/americans` | 6,773 | ~4,800 | ~1,120 | ~900 |
| `/canadians` | 6,767 | ~4,800 | ~1,090 | ~880 |
| `/h1b` | 6,962 | ~4,900 | ~1,210 | ~950 |
| `/tech-founders` | 6,822 | ~4,850 | ~1,150 | ~920 |
| `/crypto-investors` | 6,878 | ~4,850 | ~1,170 | ~930 |
| `/about` | 3,767 | ~3,767 | ~190 | ~190 |
| `/panama-qualified-investor-visa-research-papers` | 3,983 | ~3,150 | ~390 | ~340 |
| **Total (15)** | **~96,400** | **~66,000** | **~15,000** | **~10,200** |

`/privacy` excluded from plan (unchanged).

---

## Preserved anchors (summary)

See **section D** for the full keep-list and every inbound hash link. Highest-risk ids: `#book`, `#why`, `#investment-routes`, `#main`, `#investment` (if homepage sections merge).

---

## At risk of loss (must preserve if cutting)

See **section A** for the full loss-flag table. Short list:

1. Homepage Investment lede: “Real estate is the lowest cash outlay under Decree 17…”  
2. Process costs closer: “We provide a complete, itemized fee breakdown during your initial consultation: no hidden costs.”  
3. Benefits banking/SA/SAS paragraph  
4. Audience-specific FAQs and “reality” prose — never REMOVE  
5. Decree 17 dates, `FUNDS_RULE`, `TRANSITION_NOTE`, fee amounts, `PROCESSING_TIME`, hold period — never rewrite; only delete duplicate instances  
6. `#book`, `#why`, `#investment-routes` — structural  

---

## TopCTA / Preferred Sources / MonthlyUpdates inventory

| Block | Current placement | Count per page | Proposal |
| --- | --- | --- | --- |
| **TopCTA** (newsletter: first/last/phone/email/LinkedIn) | End of `<main>` on all 15 planned pages (+ privacy) | **1** | **KEEP once per page.** No design change. Do not add a second TopCTA. |
| **PreferredSourcesCTA** | `Footer.astro` above footer columns (all pages via layout) | **1** | **KEEP once per page** (footer). No design change. |
| **MonthlyUpdates** | After hero on all 15 planned pages | **1** | **KEEP once per page** (compact). |
| **Papers “Notify Me”** | Research papers only | **1** extra email form | **KEEP** (paper-specific subject). |
| **CTANextSteps `#book`** | Homepage only | **1** | **KEEP** (advisor meeting, not newsletter). |
| **CtaBand** / audience cta-band | Program + about + audience pages | **1** | **KEEP** (advisor CTA, not subscribe). |

No page currently mounts two TopCTAs or two Preferred Sources blocks.

---

## FAQ schema rule (implementation note for later)

| Page type | Visible FAQs after trim | JSON-LD |
| --- | --- | --- |
| `/panama-qualified-investor-visa-faq` | Full `programFaq` + `financialFaq` + `practicalFaq` | `allFaqs` (current) |
| Homepage | 5 selected Qs | Add matching FaqJsonLd **only** for those Qs |
| Program/audience pages | page-specific Qs only (see section C) | Existing `FaqJsonLd` — shrink or remove to match |
| About / papers / eligibility (after REMOVE) | none | no FAQ schema |

`ProgramFAQSection` must not remain visible off `/faq` after trim (it is the largest duplicate cluster). Privacy currently mounts it too; out of trim scope unless a later pass aligns privacy.

---

## Biggest duplicate clusters (for exec focus)

1. **`ProgramFAQSection` (“About the Program”, 8 Qs)** on homepage + 12 other non-FAQ pages (~834 px collapsed each; full answers duplicated). **Home:** `/panama-qualified-investor-visa-faq`. **Action:** REMOVE everywhere else; FAQ-TRIM homepage to 5.  
2. **Audience “Three routes…” block** identical on 5 audience pages (~665 px, ~80% shared sentences + shared `ROUTES_SUMMARY` / threshold note). **Home:** `/panama-qualified-investor-visa-2026`. **Action:** SUMMARIZE.  
3. **Homepage full FAQ mirror** (`CategorizedSiteFaq` = same three groups as `/faq`). **Action:** FAQ-TRIM.  
4. **Process “costs beyond investment”** restates `COSTS_BEYOND_INVESTMENT`. **Home:** `/panama-qualified-investor-visa-cost`. **Action:** SUMMARIZE.  
5. **Benefits family/citizenship** overlaps eligibility + visa. **Action:** SUMMARIZE with links.  
6. **TopCTA copy** 100% shared on every page — intentional chrome; keep once each, no content-home issue.

---

## SEO inbound check (post-trim)

All program pages stay linked from global **Navbar** + **Footer** program/resources columns → well above 3 inbound.  
Audience pages: keep homepage `#audiences` links, who-is-for cards, and existing cross-links from visa/eligibility/benefits/cost/process.  
After removing Program FAQ answer-links from non-FAQ pages, re-run `seo-check` inbound rule before merge.

---

## Out of scope / next step

This document is the **approved planning artifact** on branch `docs/trim-plan` (`docs/page-trim-plan.md`). No site code changes in this publish. Await approval before any cuts.
