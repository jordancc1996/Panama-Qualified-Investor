/**
 * Vercel clones are shallow by default. Unshallow / deepen so sitemap
 * lastmod can read real per-file dates. Prefer also setting project env
 * VERCEL_DEEP_CLONE=true. Failures are non-fatal: lastmod is omitted
 * while the repo remains shallow (never invent or use build time).
 */
import { execFileSync } from 'node:child_process';

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

function isShallow() {
  try {
    return run('git', ['rev-parse', '--is-shallow-repository']) === 'true';
  } catch {
    return true;
  }
}

try {
  if (!isShallow()) {
    console.log('ensure-git-history: full history already available');
    process.exit(0);
  }

  console.log('ensure-git-history: shallow repo detected; fetching unshallow…');
  try {
    execFileSync('git', ['fetch', '--unshallow'], { stdio: 'inherit' });
  } catch {
    console.warn('ensure-git-history: --unshallow failed; deepening…');
    try {
      execFileSync('git', ['fetch', '--deepen=1000'], { stdio: 'inherit' });
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.warn(`ensure-git-history: deepen failed (${msg})`);
    }
  }

  if (isShallow()) {
    console.warn(
      'ensure-git-history: still shallow after fetch; sitemap will omit lastmod rather than use unreliable dates',
    );
  } else {
    console.log('ensure-git-history: history is now complete');
  }
} catch (err) {
  const msg = err && err.message ? err.message : String(err);
  console.warn(`ensure-git-history: skipped (${msg})`);
}
