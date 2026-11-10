import { test, expect, type Page } from '@playwright/test';

const routes = [
  '/',
  '/panama-qualified-investor-visa-2026/',
  '/panama-qualified-investor-visa-cost/',
  '/panama-qualified-investor-visa-benefits/',
  '/who-is-the-panama-qualified-investor-visa-for/',
  '/panama-qualified-investor-visa-process-2026/',
  '/panama-qualified-investor-visa-eligibility/',
  '/panama-qualified-investor-visa-faq/',
  '/panama-qualified-investor-visa-research-papers/',
  '/americans/',
  '/canadians/',
  '/h1b/',
  '/tech-founders/',
  '/crypto-investors/',
  '/about/',
  '/privacy/',
];

const widths = [1280, 1440];

type Row = {
  page: string;
  section: string;
  left: number;
  right: number;
  imbalance: number;
  layout: string;
};

async function measurePage(page: Page, path: string): Promise<Row[]> {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return [];

    const sections = Array.from(main.querySelectorAll('section, .hero, .cta, .page-hero, .top-cta, .cta-band'));
    const rows: {
      page: string;
      section: string;
      left: number;
      right: number;
      imbalance: number;
      layout: string;
    }[] = [];

    const contentSelector =
      'h1, h2, h3, p, li, img, button, a, input, select, textarea, table, label, .bcard, .card, .spec-card, .pcard';

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 24) continue;

      const nodes = Array.from(section.querySelectorAll(contentSelector)).filter((el) => {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (!nodes.length) continue;

      let minL = Infinity;
      let maxR = -Infinity;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        minL = Math.min(minL, r.left);
        maxR = Math.max(maxR, r.right);
      }

      const left = minL - rect.left;
      const right = rect.right - maxR;
      const imbalance = rect.width > 0 ? (Math.abs(right - left) / rect.width) * 100 : 0;
      const heading = section.querySelector('h1, h2');
      const body = section.querySelector('p, li');
      const hAlign = heading ? window.getComputedStyle(heading).textAlign : '';
      const bAlign = body ? window.getComputedStyle(body).textAlign : '';
      const layout =
        hAlign && bAlign && hAlign !== bAlign && hAlign !== 'start' && bAlign !== 'start'
          ? `align-mismatch:${hAlign}/${bAlign}`
          : 'ok';

      rows.push({
        page: location.pathname,
        section: (section.id || section.className || section.tagName).toString().slice(0, 48),
        left: Math.round(left),
        right: Math.round(right),
        imbalance: Math.round(imbalance * 10) / 10,
        layout,
      });
    }
    return rows;
  });
}

test.describe('layout balance', () => {
  for (const width of widths) {
    test(`sections stay within 15% at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const all: Row[] = [];

      for (const route of routes) {
        const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(res?.ok(), `${route} should load`).toBeTruthy();
        const rows = await measurePage(page, route);
        all.push(...rows);
      }

      const table = all
        .map(
          (r) =>
            `${r.page.padEnd(42)} | ${String(r.section).padEnd(28)} | L ${String(r.left).padStart(4)} | R ${String(r.right).padStart(4)} | ${String(r.imbalance).padStart(5)}% | ${r.layout}`
        )
        .join('\n');
      console.log(`\npage | section | left gap | right gap | imbalance | layout  (${width}px)\n${table}\n`);

      const failures = all.filter((r) => r.imbalance > 15);
      expect(
        failures,
        failures.map((r) => `${r.page} ${r.section} ${r.imbalance}%`).join('\n')
      ).toEqual([]);
    });
  }
});
