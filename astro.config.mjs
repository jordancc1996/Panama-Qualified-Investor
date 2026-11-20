// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.panamaqualifiedinvestor.com',
  // Lets @astrojs/sitemap write homepage <loc> without a trailing slash
  // (sitemap package otherwise normalizes the root to host/).
  trailingSlash: 'never',
  integrations: [
    sitemap({
      customPages: ['https://www.panamaqualifiedinvestor.com/documents/panama-investment-outlook-qiv.pdf'],
      filter(page) {
        // Counsel-pending Decree 17 changes page stays out of the sitemap until confirmed.
        return !page.includes('/panama-qualified-investor-visa-changes');
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
    plugins: [tailwindcss()]
  }
});
