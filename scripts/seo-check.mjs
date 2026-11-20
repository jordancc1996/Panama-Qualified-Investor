#!/usr/bin/env node
/**
 * Post-build SEO safety check. Scans every dist/.../index.html.
 * ERROR = exit 1. WARN = print only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://www.panamaqualifiedinvestor.com';
const FORBIDDEN = [
  'October 15, 2026',
  'Oct 15',
  'PENDING_',
  'TO BE DETERMINED',
  '[DRAFT',
  'TODO',
  'lorem ipsum',
];

const distArg = process.argv[2] || 'dist';
const distRoot = path.resolve(ROOT, distArg);
const configPath = path.join(ROOT, 'seo', 'seo-checks.config.json');

const errors = [];
const warnings = [];

function error(page, rule, message) {
  errors.push({ page, rule, message });
}

function warn(page, message) {
  warnings.push({ page, message });
}

function loadConfig() {
  const raw = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(raw);
}

function walkIndexHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walkIndexHtml(full, out);
    else if (name.name === 'index.html') out.push(full);
  }
  return out;
}

function pagePathFromFile(file) {
  const rel = path.relative(distRoot, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}

function expectedCanonical(pagePath) {
  return pagePath === '/' ? ORIGIN : ORIGIN + pagePath;
}

/** Read attribute value from a tag string; prefers matching quote style. */
function attr(tag, name) {
  const re = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  );
  const m = tag.match(re);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? null;
}

function allTags(html, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  return html.match(re) || [];
}

function titleText(html) {
  const m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim();
}

function metaDescription(html) {
  for (const tag of allTags(html, 'meta')) {
    const name = (attr(tag, 'name') || '').toLowerCase();
    if (name === 'description') return attr(tag, 'content');
  }
  return null;
}

function metaRobots(html) {
  for (const tag of allTags(html, 'meta')) {
    const name = (attr(tag, 'name') || '').toLowerCase();
    if (name === 'robots') return (attr(tag, 'content') || '').toLowerCase();
  }
  return '';
}

function hasNoindex(html) {
  return metaRobots(html).includes('noindex');
}

function canonicalHref(html) {
  for (const tag of allTags(html, 'link')) {
    const rel = (attr(tag, 'rel') || '').toLowerCase();
    if (rel.split(/\s+/).includes('canonical')) return attr(tag, 'href');
  }
  return null;
}

function ogUrl(html) {
  for (const tag of allTags(html, 'meta')) {
    const prop = (attr(tag, 'property') || '').toLowerCase();
    if (prop === 'og:url') return attr(tag, 'content');
  }
  return null;
}

function countH1(html) {
  return (html.match(/<h1\b/gi) || []).length;
}

function headingLevels(html) {
  const levels = [];
  const re = /<h([1-6])\b/gi;
  let m;
  while ((m = re.exec(html))) levels.push(Number(m[1]));
  return levels;
}

function jsonLdBlocks(html) {
  const blocks = [];
  const re = /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) blocks.push(m[1]);
  // also type before other attrs order variants already covered; handle type at end
  return blocks;
}

function imgTags(html) {
  return allTags(html, 'img');
}

function hrefs(html) {
  const out = [];
  const re = /<a\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = attr(m[0], 'href');
    if (href != null) out.push(href);
  }
  return out;
}

function stripHash(u) {
  const i = u.indexOf('#');
  return i === -1 ? u : u.slice(0, i);
}

function isInternalHref(href) {
  if (!href) return false;
  if (href.startsWith('/')) return true;
  if (href.startsWith(ORIGIN + '/') || href === ORIGIN) return true;
  return false;
}

function toDistCandidate(href) {
  let raw = stripHash(href);
  if (raw.startsWith(ORIGIN)) {
    raw = raw.slice(ORIGIN.length) || '/';
  }
  if (!raw.startsWith('/')) return null;
  // decode %20 etc.
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }
  if (raw === '/') return ['index.html'];
  const noSlash = raw.replace(/\/$/, '');
  const rel = noSlash.replace(/^\//, '');
  return [
    path.join(rel, 'index.html'),
    rel + '.html',
    rel,
  ];
}

function resolvesInDist(href) {
  const candidates = toDistCandidate(href);
  if (!candidates) return false;
  return candidates.some((c) => fs.existsSync(path.join(distRoot, c)));
}

function loadSitemapLocs() {
  const file = path.join(distRoot, 'sitemap-0.xml');
  if (!fs.existsSync(file)) return null;
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].trim());
}

function allowRule10(config, pagePath) {
  return (config.forbiddenTextAllowlist || []).some(
    (e) => e.path === pagePath && (e.rules || []).includes(10),
  );
}

function main() {
  const started = Date.now();
  if (!fs.existsSync(distRoot)) {
    console.error(`ERROR: dist root not found: ${distRoot}`);
    process.exit(2);
  }
  const config = loadConfig();
  const files = walkIndexHtml(distRoot).sort();
  if (!files.length) {
    console.error(`ERROR: no index.html under ${distRoot}`);
    process.exit(2);
  }

  for (const entry of config.forbiddenTextAllowlist || []) {
    if ((entry.rules || []).includes(10)) {
      warn(
        entry.path,
        `ALLOWLIST rule 10 active: ${entry.reason} (remove_when: ${entry.remove_when})`,
      );
    }
  }

  const sitemapLocs = loadSitemapLocs();
  if (sitemapLocs == null) {
    error('(site)', 5, 'dist/sitemap-0.xml missing');
  }
  const sitemapSet = new Set(sitemapLocs || []);

  const titles = new Map(); // title -> [paths]
  const descriptions = new Map();
  const inbound = new Map(); // pagePath -> count of internal links to it
  const pages = [];

  for (const file of files) {
    const pagePath = pagePathFromFile(file);
    inbound.set(pagePath, inbound.get(pagePath) || 0);
    const html = fs.readFileSync(file, 'utf8');
    pages.push({ file, pagePath, html });
  }

  // Pass 1: collect inbound link counts
  for (const { pagePath, html } of pages) {
    for (const href of hrefs(html)) {
      if (!isInternalHref(href)) continue;
      const stripped = stripHash(href);
      if (!stripped || stripped === '#') continue;
      let target;
      if (stripped.startsWith(ORIGIN)) {
        const p = stripped.slice(ORIGIN.length) || '/';
        target = p === '/' ? '/' : p.replace(/\/$/, '');
      } else if (stripped.startsWith('/')) {
        target = stripped === '/' ? '/' : stripped.replace(/\/$/, '');
      } else continue;
      // only count links to pages we know (index.html pages)
      if (inbound.has(target)) {
        inbound.set(target, inbound.get(target) + 1);
      }
    }
  }

  for (const { pagePath, html } of pages) {
    const noindex = hasNoindex(html);
    const expected = expectedCanonical(pagePath);

    // 1. title
    const title = titleText(html);
    if (!title) {
      error(pagePath, 1, '<title> missing');
    } else {
      const len = title.length;
      if (len < 30 || len > 60) {
        error(pagePath, 1, `<title> length ${len} (need 30-60): "${title}"`);
      }
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title).push(pagePath);
    }

    // 2. meta description
    const desc = metaDescription(html);
    if (desc == null || desc === '') {
      error(pagePath, 2, 'meta description missing');
    } else {
      const len = desc.length;
      if (len < 70 || len > 160) {
        error(pagePath, 2, `meta description length ${len} (need 70-160)`);
      }
      if (!descriptions.has(desc)) descriptions.set(desc, []);
      descriptions.get(desc).push(pagePath);
    }

    // 3. exactly one h1
    const h1n = countH1(html);
    if (h1n !== 1) {
      error(pagePath, 3, `expected exactly one <h1>, found ${h1n}`);
    }

    // 4. canonical + og:url
    const can = canonicalHref(html);
    const og = ogUrl(html);
    if (!can) {
      error(pagePath, 4, 'canonical missing');
    } else if (!can.startsWith(ORIGIN)) {
      error(pagePath, 4, `canonical must start with ${ORIGIN}: ${can}`);
    } else if (can !== expected) {
      error(pagePath, 4, `canonical ${can} != expected ${expected}`);
    }
    if (can && og !== can) {
      error(pagePath, 4, `og:url ${og} != canonical ${can}`);
    }

    // 5. sitemap membership
    if (sitemapLocs) {
      const inSm = can ? sitemapSet.has(can) : false;
      if (!noindex && can && !inSm) {
        error(pagePath, 5, `indexable page missing from sitemap: ${can}`);
      }
      if (noindex && can && inSm) {
        error(pagePath, 5, `noindex page must not appear in sitemap: ${can}`);
      }
    }

    // 6. JSON-LD
    for (const block of jsonLdBlocks(html)) {
      try {
        JSON.parse(block.trim());
      } catch (e) {
        error(pagePath, 6, `JSON-LD parse failed: ${e.message}`);
      }
    }

    // 7. img alt
    for (const tag of imgTags(html)) {
      if (!/\balt\s*=/i.test(tag)) {
        error(pagePath, 7, `img missing alt: ${tag.slice(0, 120)}`);
      }
    }

    // 8 + 9. links
    for (const href of hrefs(html)) {
      if (href === '#') {
        error(pagePath, 9, 'href="#" is forbidden');
        continue;
      }
      if (href === 'https://wa.me/' || /^https:\/\/wa\.me\/\?/.test(href)) {
        error(pagePath, 9, `WhatsApp link without number: ${href}`);
        continue;
      }
      // same-page fragment only
      if (href.startsWith('#')) continue;
      if (!isInternalHref(href)) continue;
      const forResolve = stripHash(href);
      if (!forResolve || forResolve === ORIGIN || forResolve === ORIGIN + '/') {
        // homepage
        if (!resolvesInDist(forResolve || '/')) {
          error(pagePath, 8, `internal link does not resolve: ${href}`);
        }
        continue;
      }
      if (!resolvesInDist(href)) {
        error(pagePath, 8, `internal link does not resolve: ${href}`);
      }
    }

    // 10. forbidden text
    if (!allowRule10(config, pagePath)) {
      for (const needle of FORBIDDEN) {
        if (html.includes(needle)) {
          error(pagePath, 10, `forbidden text found: ${JSON.stringify(needle)}`);
        }
      }
    }

    // 11. pending counsel on indexable pages
    if (!noindex && /pending counsel/i.test(html)) {
      error(pagePath, 11, 'forbidden text "pending counsel" on indexable page');
    }

    // 12. noindex allowlist
    if (noindex) {
      const allowed = new Set(config.noindexAllowlist || []);
      if (!allowed.has(pagePath)) {
        error(
          pagePath,
          12,
          `meta robots noindex is not allowlisted for this path (allowlist: ${[...allowed].join(', ') || '(empty)'})`,
        );
      }
    }

    // WARN: heading skips
    const levels = headingLevels(html);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        warn(
          pagePath,
          `heading level skip h${levels[i - 1]} → h${levels[i]}`,
        );
      }
    }
  }

  // unique titles / descriptions
  for (const [title, paths] of titles) {
    if (paths.length > 1) {
      for (const p of paths) {
        error(p, 1, `duplicate <title> shared with ${paths.filter((x) => x !== p).join(', ')}: "${title}"`);
      }
    }
  }
  for (const [desc, paths] of descriptions) {
    if (paths.length > 1) {
      for (const p of paths) {
        error(p, 2, `duplicate meta description shared with ${paths.filter((x) => x !== p).join(', ')}`);
      }
    }
  }

  // WARN: inbound < 3
  for (const [p, count] of inbound) {
    if (count < 3) {
      warn(p, `fewer than 3 internal links point here (${count})`);
    }
  }

  // print
  for (const w of warnings) {
    console.log(`WARN  ${w.page}  ${w.message}`);
  }
  for (const e of errors) {
    console.log(`ERROR rule ${e.rule}  ${e.page}  ${e.message}`);
  }

  const ms = Date.now() - started;
  console.log(
    `---\npages=${pages.length} errors=${errors.length} warnings=${warnings.length} time_ms=${ms}`,
  );

  if (errors.length) process.exit(1);
}

main();
