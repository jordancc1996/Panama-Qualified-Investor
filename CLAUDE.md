## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Content Publishing Rules

Every new article added to src/pages MUST pass
the 5-location keyword check before being committed.

### The 5-Location Keyword Rule

PRIMARY TARGET KEYWORD must appear in ALL FIVE locations:

1. TITLE — starts with keyword, format "[Keyword] - [Angle]",
 no em dashes, no site name
2. META TITLE — same as title + " | [Site Name]"
3. META DESCRIPTION — keyword in first 5-7 words, 150-160 chars,
 one specific number/date/dollar amount, no em dashes
4. URL/SLUG — reflects the keyword (never change existing slugs
 without explicit approval)
5. FIRST SENTENCE of intro/opening — keyword in first 10 words,
 specific and informative, no em dashes

### Workflow for Every New Article

STEP 1: Identify primary keyword — show it to the human
STEP 2: Check all 5 locations — show this table:
 Keyword: [keyword]
 Title ✓/✗ | MetaTitle ✓/✗ | Description ✓/✗ | Slug ✓/✗ | Intro ✓/✗
STEP 3: Fix all ✗ before writing the file
STEP 4: Human approves
STEP 5: Write file and commit

NEVER commit an article with any ✗ in the 5-location check.

### Red Flags to Catch Automatically
- Description copy-pasted from a different article
- First sentence starting with context not keyword
- Title that buries keyword at the end
- Description under 140 or over 165 characters
- Em dashes in any SEO field
- First sentence starting with "This article will..." or "In this guide..."
