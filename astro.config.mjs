// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Alan adı belli olunca burayı ve src/site.config.ts içindeki `url` alanını güncelle.
export default defineConfig({
  site: 'https://naifmutfak.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    // Dil eşleşmeleri (hreflang) her sayfanın <head>'inde; bkz. src/components/SEO.astro
    sitemap(),
  ],
});
