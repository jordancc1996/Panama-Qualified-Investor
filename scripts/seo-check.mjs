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

/** Astro static redirects emit a tiny HTML shim; skip them in page rules. */
function isRedirectHtml(html) {
  return (
    /http-equiv\s*=\s*["']refresh["']/i.test(html) ||
    /<title[^>]*>\s*Redirecting to:/i.test(html)
  );
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

function collectByType(node, typeName, out) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) collectByType(item, typeName, out);
    return;
  }
  const t = node['@type'];
  const types = Array.isArray(t) ? t : t ? [t] : [];
  if (types.includes(typeName)) out.push(node);
  if (node['@graph']) collectByType(node['@graph'], typeName, out);
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

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return { fm: '', body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm: '', body: raw };
  return {
    fm: raw.slice(3, end).trim(),
    body: raw.slice(end + 4).trim(),
  };
}

function researchBodyWordCount(body) {
  let text = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/^import\s.+$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ');
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Rule 13: published research items need ≥ minBodyWords in the source body. */
function checkPublishedResearchWordCounts(config) {
  const researchDir = path.join(ROOT, 'src', 'content', 'research');
  if (!fs.existsSync(researchDir)) return;
  const minWords =
    (config.research && Number(config.research.minBodyWords)) || 300;
  for (const name of fs.readdirSync(researchDir)) {
    if (!/\.(md|mdx)$/i.test(name)) continue;
    const full = path.join(researchDir, name);
    const raw = fs.readFileSync(full, 'utf8');
    const { fm, body } = splitFrontmatter(raw);
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const slugMatch = fm.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
    const slug = slugMatch ? slugMatch[1].trim() : name.replace(/\.(md|mdx)$/i, '');
    const words = researchBodyWordCount(body);
    if (words < minWords) {
      error(
        `/research/${slug}`,
        13,
        `published research body has ${words} words (need ≥${minWords})`,
      );
    }
  }
}

function main() {
  const started = Date.now();
  if (!fs.existsSync(distRoot)) {
    console.error(`ERROR: dist root not found: ${distRoot}`);
    process.exit(2);
  }
  const config = loadConfig();
  const files = walkIndexHtml(distRoot);
  const notFoundHtml = path.join(distRoot, '404.html');
  if (fs.existsSync(notFoundHtml)) files.push(notFoundHtml);
  files.sort();
  if (!files.length) {
    console.error(`ERROR: no index.html under ${distRoot}`);
    process.exit(2);
  }
  const sitemapExclude = new Set(config.sitemapExclude || []);

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
    const html = fs.readFileSync(file, 'utf8');
    if (isRedirectHtml(html)) {
      // Keep redirect shims out of title/canonical/sitemap page rules.
      continue;
    }
    inbound.set(pagePath, inbound.get(pagePath) || 0);
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
      const excludedFromSitemap = sitemapExclude.has(pagePath);
      if (!noindex && can && !inSm && !excludedFromSitemap) {
        error(pagePath, 5, `indexable page missing from sitemap: ${can}`);
      }
      if ((noindex || excludedFromSitemap) && can && inSm) {
        error(pagePath, 5, `noindex page must not appear in sitemap: ${can}`);
      }
    }

    // 6. JSON-LD
    const parsedLd = [];
    for (const block of jsonLdBlocks(html)) {
      try {
        parsedLd.push(JSON.parse(block.trim()));
      } catch (e) {
        error(pagePath, 6, `JSON-LD parse failed: ${e.message}`);
      }
    }

    // Research item pages: require Article JSON-LD with org author/publisher refs
    if (pagePath.startsWith('/research/')) {
      const articles = [];
      for (const node of parsedLd) {
        collectByType(node, 'Article', articles);
      }
      if (!articles.length) {
        error(pagePath, 6, 'research item page missing Article JSON-LD');
      } else {
        for (const article of articles) {
          for (const field of ['headline', 'datePublished', 'dateModified']) {
            if (!article[field]) {
              error(pagePath, 6, `Article JSON-LD missing ${field}`);
            }
          }
          const orgRef = `${ORIGIN}/#organization`;
          const authorId = article.author && (article.author['@id'] || article.author);
          const publisherId =
            article.publisher && (article.publisher['@id'] || article.publisher);
          if (authorId !== orgRef) {
            error(pagePath, 6, `Article author must be ${orgRef}`);
          }
          if (publisherId !== orgRef) {
            error(pagePath, 6, `Article publisher must be ${orgRef}`);
          }
        }
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

  // Research hub must remain reachable (≥3 inbound) and draft research must not ship
  const hubPath = '/panama-qualified-investor-visa-research-papers';
  if (!inbound.has(hubPath)) {
    error(hubPath, 8, 'research hub page missing from build');
  } else if ((inbound.get(hubPath) || 0) < 3) {
    error(
      hubPath,
      8,
      `research hub needs ≥3 inbound internal links (found ${inbound.get(hubPath) || 0})`,
    );
  }

  // Draft research entries (draft: true in source) must not appear in dist
  const researchDir = path.join(ROOT, 'src', 'content', 'research');
  if (fs.existsSync(researchDir)) {
    for (const name of fs.readdirSync(researchDir)) {
      if (!/\.(md|mdx)$/i.test(name)) continue;
      const raw = fs.readFileSync(path.join(researchDir, name), 'utf8');
      const { fm } = splitFrontmatter(raw);
      if (!/^draft:\s*true\s*$/m.test(fm)) continue;
      const slugMatch = fm.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
      const slug = slugMatch
        ? slugMatch[1].trim()
        : name.replace(/\.(md|mdx)$/i, '');
      const built = path.join(distRoot, 'research', slug, 'index.html');
      if (fs.existsSync(built)) {
        error(`/research/${slug}`, 5, 'draft research item must not be built');
      }
    }
  }

  checkPublishedResearchWordCounts(config);

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
