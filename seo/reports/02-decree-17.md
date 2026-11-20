# Decree 17 program-facts update

**Site:** panamaqualifiedinvestor.com  
**Repo:** panama-qualified-investor  
**Branch:** `content/decree-17`  
**Source of truth:** `src/data/program.ts`

## Verify

| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| `grep -rn "October 15\|Oct 15\|rising" src` | Clean (no matches) |
| `python3 seo/scripts/audit_html.py dist` | Pass: 16 pages, bad=0, missing=0 (descriptions 70–160) |
| FAQPage JSON-LD | Answers use Decree 17 threshold note; no October 15 claims |

## Files changed

### New

- `src/data/program.ts` — typed constants: `DECREE`, `ROUTES`, `FEES`, `HOLD_PERIOD`, `TRANSITION_NOTE`, `LAST_REVIEWED`, `REVIEWER`, threshold / routes summary strings
- `seo/scripts/audit_html.py` — meta description length audit for `dist`
- `seo/reports/02-decree-17.md` — this report
- ~~`src/components/DecreeReviewLine.astro`~~ — removed in follow-up (see below)

### Updated (components)

- `src/components/InvestmentOptions.astro` — three-card layout kept; amounts split by first-sale/resale and state/private bank
- `src/components/InvestmentTable.astro` — row minima and hold period from constants
- `src/components/Hero.astro` — subtext uses threshold note; H1 kept (`from $300,000`)
- `src/components/ProgramOverview.astro` — Decree 17 route summary
- `src/components/CTANextSteps.astro` — `$300k` stat copy
- `src/components/Comparison.astro` — Panama minimum cell
- `src/components/AdvisorModal.astro` — dropdown labels updated; option **values** unchanged
- `src/components/PressBadges.astro` — Decree 722 / 193 → `Decree 17 | 2026`
- `src/components/InvestmentDeadlineNote.astro` — label “Investment thresholds”; body from constant

### Updated (data)

- `src/data/program-faq.ts` — `REAL_ESTATE_THRESHOLD_NOTE` from `program.ts`; fees string from `FEES`
- `src/data/faq-bank.ts` — investment / hold answers
- `src/data/full-faq.ts` — financial FAQ answers

### Updated (pages)

- `src/pages/panama-qualified-investor-visa-2026.astro` — routes, FAQ, “What changed in September 2026”
- `src/pages/panama-qualified-investor-visa-cost.astro` — thresholds, meta
- `src/pages/panama-qualified-investor-visa-eligibility.astro` — investment + funds rule, meta
- `src/pages/panama-qualified-investor-visa-faq.astro` — meta
- `src/pages/panama-qualified-investor-visa-process-2026.astro` — threshold via constant
- `src/pages/americans.astro`, `canadians.astro`, `crypto-investors.astro`, `h1b.astro`, `tech-founders.astro` — body + meta
- `src/pages/who-is-the-panama-qualified-investor-visa-for.astro` — Canadians card body

## Meta descriptions (old → new)

| Page | Old | New | Chars |
| --- | --- | --- | --- |
| `/americans` | How US citizens use the Panama Qualified Investor Visa for permanent residency. Zero tax on foreign income. Real estate from $300,000, rising October 15, 2026. | How US citizens use the Panama Qualified Investor Visa for permanent residency under Decree 17 of 2026. First-sale real estate starts at US$300,000 in Panama. | 158 |
| `/canadians` | How Canadian investors use the Panama Qualified Investor Visa for permanent residency. Territorial taxation. Real estate from $300,000, rising October 15, 2026. | How Canadian investors use the Panama Qualified Investor Visa for permanent residency under Decree 17 of 2026. First-sale real estate starts at US$300,000. | 155 |
| `/crypto-investors` | Panama Qualified Investor Visa for crypto investors using realized gains as source of funds. $300,000 real estate minimum, rising to $500,000 on October 15, 2026. | Panama Qualified Investor Visa for crypto investors using realized gains as source of funds under Decree 17 of 2026. First-sale real estate from US$300,000. | 156 |
| `/h1b` | H-1B holders can skip the green card backlog. Panama Qualified Investor Visa processing is 30 to 90 days. Real estate from $300,000, rising October 15, 2026. | H-1B holders use the Panama Qualified Investor Visa to skip the green card backlog under Decree 17 of 2026. First-sale real estate begins at US$300,000. | 152 |
| `/tech-founders` | How remote-first founders use the Panama Qualified Investor Visa as a home base. Zero tax on foreign income. Real estate from $300,000, rising October 15, 2026. | How remote-first founders use the Panama Qualified Investor Visa as a home base under Decree 17 of 2026. First-sale real estate starts at US$300,000 in Panama. | 159 |
| `/panama-qualified-investor-visa-cost` | Panama Qualified Investor Visa Cost covers the $300,000 real estate minimum, rising to $500,000 on October 15, 2026, plus $5,000 application and $5,000 repatriation fees. | Panama Qualified Investor Visa Cost covers Decree 17 investment minima from US$300,000 plus US$5,000 National Treasury and US$5,000 immigration fees in 2026. | 157 |
| `/panama-qualified-investor-visa-eligibility` | Panama Qualified Investor Visa Eligibility: who qualifies? Open to all nationalities, no age or language test. $300,000 real estate, rising October 15, 2026. | Panama Qualified Investor Visa Eligibility covers who qualifies under Decree 17 of 2026. Open to all nationalities; first-sale real estate from US$300,000. | 155 |
| `/panama-qualified-investor-visa-faq` | Panama Qualified Investor Visa FAQ covers the $300,000 real estate minimum, rising to $500,000 on October 15, 2026, plus taxes, family, and processing. | Panama Qualified Investor Visa FAQ covers Decree 17 investment routes from US$300,000, US$5,000 Treasury and immigration fees, taxes, family, and processing. | 157 |

`ogDescription` matched `description` on each of the above pages.

## Counsel open items

1. **`LAST_REVIEWED` / `REVIEWER`** — still `PENDING_COUNSEL_DATE` / `PENDING_COUNSEL_REVIEWER` in `src/data/program.ts`. **Not rendered** (DecreeReviewLine removed until counsel confirms).
2. **`DECREE.sourceUrl`** — `null`. No Gaceta Oficial / MICI URL was present in the repo.
3. **Processing time** — site still says “30 to 90 days from document submission to provisional permit” (`PROCESSING_TIME`). Brief marked this for counsel confirm; left unchanged.
4. **Dependent fee scope** — amounts match FACTS (US$1,000 to each agency / US$2,000 total). Copy still says “adult dependent” as before. Confirm whether fees apply to all dependents or only adults (`FEES.dependentScopeNote`).
5. **Tax / territorial claims** — left unchanged (not in FACTS). Appear on hero CTA stats, Comparison, audience pages, benefits, etc.
6. **Hero H1** — “Permanent residency in Panama from $300,000.” kept pending counsel confirmation that first-sale remains the public floor.
7. **Possible conflict** — open PR branch `style/polish` may also touch shared components; this PR is content-only.

## Notes

- Three-card investment layout kept; five Decree 17 routes are grouped (real estate / securities / bank deposit with sub-amounts).
- Advisor modal option values kept stable for FormCarry submissions.
- Site-separation: no links or shared branding with other Panama domains.

## Follow-up: remove DecreeReviewLine (2026-11-20)

**Commit on `content/decree-17`:** `88802bb` — *Remove unreviewed Decree 17 review line until counsel confirms.*  
**Also:** rebased `cursor/audience-links-7d2f` onto updated `content/decree-17` and `--force-with-lease` pushed (`7f8e1ab`).

### Changes

- Removed `<DecreeReviewLine />` + import from:
  - `panama-qualified-investor-visa-2026.astro`
  - `panama-qualified-investor-visa-cost.astro`
  - `panama-qualified-investor-visa-eligibility.astro`
  - `panama-qualified-investor-visa-faq.astro`
  - `panama-qualified-investor-visa-process-2026.astro`
- Deleted `src/components/DecreeReviewLine.astro`
- Kept `LAST_REVIEWED`, `REVIEWER`, `REVIEW_LINE_TEXT` in `src/data/program.ts` with comment: *Do not render until counsel supplies the date and reviewer.*

### Verify

| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| `rg DecreeReviewLine src` | No matches |
| `PENDING_COUNSEL` / `Last reviewed` / `DecreeReviewLine` in program-page `dist` HTML | No matches |
| `rg "October 15\|Oct 15\|rising" src` | No matches |
| `python3 seo/scripts/audit_html.py dist` | Pass: 16 pages, bad=0, missing=0 |

### Pushes

- `content/decree-17` → origin (updates PR #3)
- `cursor/audience-links-7d2f` → origin `--force-with-lease` (updates PR #5)
