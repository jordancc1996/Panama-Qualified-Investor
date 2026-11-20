# Audience internal links

**Site:** panamaqualifiedinvestor.com  
**Repo:** panama-qualified-investor  
**Branch:** `cursor/audience-links-7d2f`  
**Base:** `content/decree-17` (PR #3)

## Links added

| Source page | Sentence / placement | Target |
| --- | --- | --- |
| `/panama-qualified-investor-visa-benefits` | Tax section: "tax resident (for example, the US or Canada)" | `/americans`, `/canadians` |
| `/panama-qualified-investor-visa-cost` | Investment paragraph: documented gains as source of funds | `/crypto-investors` |
| `/panama-qualified-investor-visa-cost` | Overview: government fees same for every nationality | `/canadians` |
| `/panama-qualified-investor-visa-eligibility` | No Business Plan card: US investor visas comparison | `/americans` |
| `/panama-qualified-investor-visa-eligibility` | No Business Plan card: residency without a local hiring plan | `/tech-founders` |
| `/panama-qualified-investor-visa-2026` | Overview: "live, work, start a business" | `/tech-founders` |
| `/panama-qualified-investor-visa-2026` | FAQ: nationality-based quotas vs capped work visas | `/h1b` |
| `/panama-qualified-investor-visa-faq` (via `full-faq.ts`) | Territorial tax answer: Canadians earning abroad | `/canadians` |
| `/panama-qualified-investor-visa-faq` (via `full-faq.ts`) | Mortgage / own funds answer: digital-asset gains | `/crypto-investors` |
| `/panama-qualified-investor-visa-process-2026` | Initial consultation: parallel path for H-1B holders | `/h1b` |
| `/panama-qualified-investor-visa-process-2026` | Document collection: documented digital-asset gains | `/crypto-investors` |

## Meta description

| Page | Change |
| --- | --- |
| `/who-is-the-panama-qualified-investor-visa-for` | Meta description now includes crypto investors (title unchanged). Length 141. |

## Verify

| Check | Result |
| --- | --- |
| `npm run build` | Pass (16 pages) |
| `npm test` | Pass (7 tests) |
| `python3 seo/scripts/audit_html.py dist` | Pass: 16 pages, bad=0, missing=0 |
| Audience inbound ≥ 5 | Pass (see table below) |
| Broken internal links | 0 |
| `git diff \| grep -E '^[+-].*(class=\|<style)'` | No hits |

### Audience inbound counts (from `dist`)

| Audience | Inbound pages | Sources |
| --- | --- | --- |
| `/americans` | 6 | `/`, benefits, eligibility, faq, tech-founders, who-is |
| `/canadians` | 5 | `/`, benefits, cost, faq, who-is |
| `/tech-founders` | 5 | `/`, 2026, benefits, eligibility, who-is |
| `/h1b` | 5 | `/`, 2026, eligibility, process-2026, who-is |
| `/crypto-investors` | 5 | `/`, cost, faq, process-2026, who-is |

## Screenshots

Saved under the project store at `media/audience-links/` (benefits and cost at 375px and 1280px).
