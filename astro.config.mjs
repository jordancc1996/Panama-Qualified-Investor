// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://panamaqualifiedinvestor.com',
  integrations: [
    sitemap({
      customPages: ['https://panamaqualifiedinvestor.com/documents/panama-investment-outlook-qiv.pdf'],
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
