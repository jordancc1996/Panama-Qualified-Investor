/**
 * @astrojs/sitemap emits lastmod as full ISO datetimes.
 * Rewrite to YYYY-MM-DD only (never invent dates).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distArg = process.argv[2] || 'dist';
const distRoot = path.resolve(ROOT, distArg);

for (const name of fs.readdirSync(distRoot)) {
  if (!/^sitemap(?:-\d+)?\.xml$/.test(name)) continue;
  const file = path.join(distRoot, name);
  const xml = fs.readFileSync(file, 'utf8');
  const next = xml.replace(
    /<lastmod>([^<]*)<\/lastmod>/g,
    (_m, value) => {
      const trimmed = String(value).trim();
      const day = trimmed.slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
        // Drop invalid lastmod rather than invent a date.
        return '';
      }
      return `<lastmod>${day}</lastmod>`;
    },
  );
  if (next !== xml) fs.writeFileSync(file, next);
}
