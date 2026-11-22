// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { lastmodForUrl } from './scripts/sitemap-lastmod.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.panamaqualifiedinvestor.com',
  // Lets @astrojs/sitemap write homepage <loc> without a trailing slash
  // (sitemap package otherwise normalizes the root to host/).
  trailingSlash: 'never',
  redirects: {
    '/research': {
      status: 308,
      destination: '/panama-qualified-investor-visa-research-papers',
    },
  },
  integrations: [
    mdx(),
    sitemap({
      customPages: ['https://www.panamaqualifiedinvestor.com/documents/panama-investment-outlook-qiv.pdf'],
      filter(page) {
        // /research is a 308 shim to the indexed hub; keep only the hub + item pages.
        // 404 is noindex and must not appear in the sitemap.
        const normalized = page.replace(/\/$/, '');
        if (normalized === 'https://www.panamaqualifiedinvestor.com/research') return false;
        if (normalized === 'https://www.panamaqualifiedinvestor.com/404') return false;
        if (normalized.endsWith('/404.html')) return false;
        return true;
      },
      serialize(item) {
        if (item.url.endsWith('/') && item.url !== 'https://www.panamaqualifiedinvestor.com/') {
          item.url = item.url.slice(0, -1);
        }
        const lastmod = lastmodForUrl(item.url);
        if (lastmod) {
          item.lastmod = lastmod;
        } else {
          delete item.lastmod;
        }
        return item;
      },
    }),
  ],
  // Homepage previously loaded two render-blocking stylesheets. Inline all page CSS
  // into <style> so there is no external CSS round-trip / FOUC, without shipping a
  // site-wide CSS bundle to every route.
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
