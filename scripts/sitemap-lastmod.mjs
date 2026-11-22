/**
 * Map sitemap URLs to source files and read lastmod from git
 * (`git log -1 --format=%cs`). Falls back to the GitHub Commits API
 * when the clone is shallow (Vercel default) so graft commits cannot
 * invent wrong dates. Returns undefined when history is unavailable
 * so callers can omit lastmod (never use build time).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.panamaqualifiedinvestor.com';
const GITHUB_REPO = 'jordancc1996/Panama-Qualified-Investor';

/** @type {boolean | null} */
let shallowCache = null;
/** @type {Map<string, string | undefined>} */
const lastmodCache = new Map();

function isShallowRepo() {
  if (shallowCache != null) return shallowCache;
  try {
    const out = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    shallowCache = out === 'true';
  } catch {
    shallowCache = true;
  }
  return shallowCache;
}

/**
 * @param {string} relPath repo-relative path
 * @returns {string | undefined} YYYY-MM-DD
 */
function gitLastmodTrusted(relPath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', relPath], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* no git */
  }
  return undefined;
}

/**
 * @param {string} relPath repo-relative path
 * @returns {Promise<string | undefined>}
 */
async function githubLastmod(relPath) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/commits?path=${encodeURIComponent(relPath)}&per_page=1`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'panama-qualified-investor-sitemap-lastmod',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      console.warn(`sitemap-lastmod: GitHub API ${res.status} for ${relPath}`);
      return undefined;
    }
    const data = await res.json();
    const iso = data?.[0]?.commit?.committer?.date || data?.[0]?.commit?.author?.date;
    if (!iso || typeof iso !== 'string') return undefined;
    const day = iso.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : undefined;
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    console.warn(`sitemap-lastmod: GitHub fetch failed for ${relPath} (${msg})`);
    return undefined;
  }
}

/**
 * @param {string} relPath repo-relative path
 * @returns {string | undefined | Promise<string | undefined>} YYYY-MM-DD or undefined
 */
export function gitLastmod(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return undefined;
  if (lastmodCache.has(relPath)) return lastmodCache.get(relPath);

  // Full history: trust local git.
  if (!isShallowRepo()) {
    const day = gitLastmodTrusted(relPath);
    lastmodCache.set(relPath, day);
    return day;
  }

  // Shallow: do not use local git (graft commits invent wrong dates).
  // Resolve via GitHub and cache synchronously after await in lastmodForUrl.
  return undefined;
}

/**
 * Async variant used by serialize (Astro accepts async serialize).
 * @param {string} relPath
 * @returns {Promise<string | undefined>}
 */
export async function gitLastmodAsync(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return undefined;
  if (lastmodCache.has(relPath)) return lastmodCache.get(relPath);

  if (!isShallowRepo()) {
    const day = gitLastmodTrusted(relPath);
    lastmodCache.set(relPath, day);
    return day;
  }

  const day = await githubLastmod(relPath);
  lastmodCache.set(relPath, day);
  return day;
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
 * @returns {Promise<string | undefined>} YYYY-MM-DD
 */
export async function lastmodForUrl(url) {
  const file = sourceFileForUrl(url);
  if (!file) return undefined;
  return gitLastmodAsync(file);
}
