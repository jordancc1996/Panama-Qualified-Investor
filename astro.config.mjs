// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

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
        const normalized = page.replace(/\/$/, '');
        return normalized !== 'https://www.panamaqualifiedinvestor.com/research';
      },
      serialize(item) {
        if (item.url.endsWith('/') && item.url !== 'https://www.panamaqualifiedinvestor.com/') {
          item.url = item.url.slice(0, -1);
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
