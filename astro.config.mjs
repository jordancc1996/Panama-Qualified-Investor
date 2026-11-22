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
  vite: {
    plugins: [tailwindcss()],
    // Merge CSS into a single render-blocking stylesheet (homepage previously loaded two).
    build: {
      cssCodeSplit: false,
    },
  },
});
