/**
 * Map sitemap URLs to source files and read lastmod from git
 * (`git log -1 --format=%cs`). Returns undefined when history is
 * unavailable so callers can omit lastmod (never use build time).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.panamaqualifiedinvestor.com';

/**
 * @param {string} relPath repo-relative path
 * @returns {string | undefined} YYYY-MM-DD or undefined
 */
export function gitLastmod(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return undefined;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* shallow clone / no git */
  }
  return undefined;
}

/**
 * @param {string} url absolute sitemap loc
 * @returns {string | undefined} repo-relative source path
 */
export function sourceFileForUrl(url) {
  let normalized = url.trim();
  if (normalized.endsWith('/') && normalized !== `${ORIGIN}/`) {
    normalized = normalized.slice(0, -1);
  }

  if (normalized === ORIGIN || normalized === `${ORIGIN}/`) {
    return 'src/pages/index.astro';
  }

  if (normalized === `${ORIGIN}/documents/panama-investment-outlook-qiv.pdf`) {
    return 'public/documents/panama-investment-outlook-qiv.pdf';
  }

  if (!normalized.startsWith(ORIGIN + '/')) return undefined;
  const pathname = normalized.slice(ORIGIN.length);

  if (pathname.startsWith('/research/')) {
    const slug = pathname.slice('/research/'.length).replace(/\/$/, '');
    if (!slug || slug.includes('/')) return undefined;
    for (const ext of ['.mdx', '.md']) {
      const candidate = `src/content/research/${slug}${ext}`;
      if (fs.existsSync(path.join(ROOT, candidate))) return candidate;
    }
    return undefined;
  }

  const page = `src/pages${pathname}.astro`;
  if (fs.existsSync(path.join(ROOT, page))) return page;
  return undefined;
}

/**
 * @param {string} url absolute sitemap loc
 * @returns {string | undefined} YYYY-MM-DD
 */
export function lastmodForUrl(url) {
  const file = sourceFileForUrl(url);
  if (!file) return undefined;
  return gitLastmod(file);
}
