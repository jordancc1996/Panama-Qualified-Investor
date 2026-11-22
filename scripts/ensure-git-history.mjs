/**
 * Vercel clones are shallow by default. Unshallow when possible so
 * sitemap lastmod can read per-file git dates. Prefer also setting
 * project env VERCEL_DEEP_CLONE=true. Failures are non-fatal: lastmod
 * is omitted per URL when history is missing.
 */
import { execFileSync } from 'node:child_process';

function run(cmd, args) {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

try {
  const shallow = run('git', ['rev-parse', '--is-shallow-repository']);
  if (shallow === 'true') {
    console.log('ensure-git-history: shallow repo detected; fetching unshallow…');
    execFileSync('git', ['fetch', '--unshallow'], { stdio: 'inherit' });
  }
} catch (err) {
  const msg = err && err.message ? err.message : String(err);
  console.warn(`ensure-git-history: skipped (${msg})`);
}
