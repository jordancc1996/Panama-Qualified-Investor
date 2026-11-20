# 09 — Page titles shortened (8 pages)

Branch: `cursor/shorten-eight-page-titles-ebdf`  
Base: `content/homepage-meta`

## Scope

Changed only the `title` prop (or `const title` passed to `BaseLayout`) on eight pages. No description, slug, body, or style changes. Left `privacy.astro` alone.

## Titles (char counts)

| Page | Title | Chars |
|---|---|---|
| process-2026 | Panama Qualified Investor Visa Process 2026: Step by Step | 57 |
| faq | Panama Qualified Investor Visa FAQ: 2026 Answers | 48 |
| who-is | Who Is the Panama Qualified Investor Visa For? | 46 |
| h1b | Panama Qualified Investor Visa for H-1B Holders | 47 |
| canadians | Panama Qualified Investor Visa for Canadians | 44 |
| tech-founders | Panama Qualified Investor Visa for Tech Founders | 48 |
| crypto-investors | Panama Qualified Investor Visa for Crypto Investors | 51 |
| americans | Panama Qualified Investor Visa for Americans | 44 |

All eight are within 30–60 characters. No further shortening required.

## Verify

- `npm run build` passed
- `dist` `<title>`, `og:title`, and `twitter:title` match on all eight pages
- Sitewide titles unique among the eight; privacy remains out of scope at 70 chars
- `git diff` touches only `title=` / `const title` lines in the eight listed files
