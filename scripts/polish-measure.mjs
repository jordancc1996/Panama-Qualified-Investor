/**
 * Pre-change measurement for Website Polish.
 * Visits representative routes at multiple viewports and records metrics.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321';
const OUT = process.env.POLISH_OUT || '/tmp/polish-measure.json';

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
  '/about/',
  '/privacy/',
];

const viewports = [375, 390, 768, 1024, 1280, 1440, 1920];

function countMap(arr) {
  const m = {};
  for (const v of arr) {
    const k = String(v);
    m[k] = (m[k] || 0) + 1;
  }
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

async function measureAt(page, width) {
  await page.setViewportSize({ width, height: 900 });
  const pageReports = [];

  for (const route of routes) {
    const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(250);

    const data = await page.evaluate(() => {
      const colorProps = [
        'color',
        'backgroundColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
        'outlineColor',
      ];
      const colors = [];
      const radii = [];
      const shadows = [];
      const buttons = [];
      const typeSamples = [];
      const paragraphWidths = [];
      const sections = [];
      const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;

      const all = Array.from(document.querySelectorAll('body *')).slice(0, 2500);
      for (const el of all) {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden') continue;
        for (const p of colorProps) {
          const v = s[p];
          if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
          colors.push(v);
        }
        if (s.borderRadius && s.borderRadius !== '0px') radii.push(s.borderRadius);
        if (s.boxShadow && s.boxShadow !== 'none') shadows.push(s.boxShadow);
      }

      document.querySelectorAll('a.btn, button.btn, .btn, button.hero-cta, button.emphasis, .mobile-cta a, .mobile-cta button').forEach((el) => {
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t) buttons.push(t.slice(0, 80));
      });

      const pickType = (sel, label) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const s = getComputedStyle(el);
        typeSamples.push({
          label,
          family: s.fontFamily,
          size: s.fontSize,
          weight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
        });
      };
      pickType('h1', 'h1');
      pickType('h2', 'h2');
      pickType('h3', 'h3');
      pickType('main p, .lede, .subtext', 'body-ish');
      pickType('.eyebrow, .kicker', 'eyebrow');
      pickType('footer h2, footer h3, footer .col-title, footer .title', 'footer-heading');

      document.querySelectorAll('main p, .prose p, .lede, .subtext').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 40) paragraphWidths.push(Math.round(r.width));
      });

      const sectionEls = Array.from(
        document.querySelectorAll('main section, main .hero, main .cta, main .page-hero, main .top-cta, main .cta-band')
      );
      const contentSelector =
        'h1, h2, h3, p, li, img, button, a, input, select, textarea, table, label, .bcard, .card, .spec-card, .pcard';

      for (const section of sectionEls) {
        const rect = section.getBoundingClientRect();
        if (rect.width < 40 || rect.height < 24) continue;
        const nodes = Array.from(section.querySelectorAll(contentSelector)).filter((el) => {
          const style = getComputedStyle(el);
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
        const hAlign = heading ? getComputedStyle(heading).textAlign : '';
        const bAlign = body ? getComputedStyle(body).textAlign : '';
        const padT = parseFloat(getComputedStyle(section).paddingTop) || 0;
        const padB = parseFloat(getComputedStyle(section).paddingBottom) || 0;
        sections.push({
          id: (section.id || section.className || section.tagName).toString().slice(0, 64),
          height: Math.round(rect.height),
          padT: Math.round(padT),
          padB: Math.round(padB),
          left: Math.round(left),
          right: Math.round(right),
          imbalance: Math.round(imbalance * 10) / 10,
          hAlign,
          bAlign,
          alignMismatch: Boolean(hAlign && bAlign && hAlign !== bAlign && hAlign !== 'start' && bAlign !== 'start'),
        });
      }

      const header = document.querySelector('header.navbar, .navbar');
      const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;
      const footer = document.querySelector('footer');
      const footerH = footer ? Math.round(footer.getBoundingClientRect().height) : 0;

      const gradients = [];
      document.querySelectorAll('body *').forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg && bg.includes('gradient')) gradients.push(bg.slice(0, 160));
      });

      return {
        ok: true,
        title: document.title,
        overflowX,
        headerH,
        footerH,
        colors: countMap(colors).slice(0, 40),
        radii: countMap(radii).slice(0, 20),
        shadows: countMap(shadows).slice(0, 15),
        buttons: countMap(buttons),
        typeSamples,
        paragraphWidths: {
          max: paragraphWidths.length ? Math.max(...paragraphWidths) : 0,
          over760: paragraphWidths.filter((w) => w > 760).length,
          sample: paragraphWidths.slice(0, 12),
        },
        sections,
        gradients: countMap(gradients).slice(0, 12),
        imbalanceFailures: sections.filter((s) => s.imbalance > 15),
        alignMismatches: sections.filter((s) => s.alignMismatch),
      };

      function countMap(arr) {
        const m = {};
        for (const v of arr) {
          const k = String(v);
          m[k] = (m[k] || 0) + 1;
        }
        return Object.entries(m)
          .sort((a, b) => b[1] - a[1])
          .map(([value, count]) => ({ value, count }));
      }
    });

    pageReports.push({
      route,
      status: res?.status() ?? 0,
      ...data,
    });
  }

  return pageReports;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const report = {
  base: BASE,
  measuredAt: new Date().toISOString(),
  viewports: {},
};

// Full metrics at 1440; balance + overflow at all widths for key pages
report.viewports[1440] = await measureAt(page, 1440);

for (const width of viewports.filter((w) => w !== 1440)) {
  await page.setViewportSize({ width, height: 900 });
  const slim = [];
  for (const route of ['/', '/panama-qualified-investor-visa-cost/', '/panama-qualified-investor-visa-faq/', '/americans/']) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(150);
    const data = await page.evaluate(() => {
      const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
      const sectionEls = Array.from(
        document.querySelectorAll('main section, main .hero, main .cta, main .page-hero, main .top-cta, main .cta-band')
      );
      const contentSelector =
        'h1, h2, h3, p, li, img, button, a, input, select, textarea, table, label, .bcard, .card, .spec-card, .pcard';
      const sections = [];
      for (const section of sectionEls) {
        const rect = section.getBoundingClientRect();
        if (rect.width < 40 || rect.height < 24) continue;
        const nodes = Array.from(section.querySelectorAll(contentSelector)).filter((el) => {
          const style = getComputedStyle(el);
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
        sections.push({
          id: (section.id || section.className || section.tagName).toString().slice(0, 64),
          left: Math.round(left),
          right: Math.round(right),
          imbalance: Math.round(imbalance * 10) / 10,
        });
      }
      return { overflowX, imbalanceFailures: sections.filter((s) => s.imbalance > 15), sectionCount: sections.length };
    });
    slim.push({ route, ...data });
  }
  report.viewports[width] = slim;
}

await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log('Wrote', OUT);

// Print summary
const full = report.viewports[1440];
const allFail = [];
const allAlign = [];
const overflows = [];
for (const p of full) {
  for (const f of p.imbalanceFailures || []) allFail.push({ route: p.route, ...f });
  for (const a of p.alignMismatches || []) allAlign.push({ route: p.route, ...a });
  if (p.overflowX) overflows.push(p.route);
}
console.log('\n=== 1440px imbalance failures (>15%) ===');
console.log(allFail.length ? allFail.map((f) => `${f.route} | ${f.id} | L${f.left} R${f.right} ${f.imbalance}%`).join('\n') : 'none');
console.log('\n=== align mismatches ===');
console.log(allAlign.length ? allAlign.map((a) => `${a.route} | ${a.id} | ${a.hAlign}/${a.bAlign}`).join('\n') : 'none');
console.log('\n=== overflow-x ===', overflows.length ? overflows.join(', ') : 'none');

const home = full.find((p) => p.route === '/');
if (home) {
  console.log('\n=== homepage type ===');
  console.log(JSON.stringify(home.typeSamples, null, 2));
  console.log('\n=== top radii ===');
  console.log(JSON.stringify(home.radii, null, 2));
  console.log('\n=== shadows ===');
  console.log(JSON.stringify(home.shadows, null, 2));
  console.log('\n=== buttons ===');
  console.log(JSON.stringify(home.buttons, null, 2));
  console.log('\n=== paragraph widths ===');
  console.log(JSON.stringify(home.paragraphWidths, null, 2));
  console.log('\n=== header/footer ===', home.headerH, home.footerH);
  console.log('\n=== top colors (first 15) ===');
  console.log(JSON.stringify(home.colors.slice(0, 15), null, 2));
}
