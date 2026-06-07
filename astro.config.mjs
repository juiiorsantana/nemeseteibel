import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nemeseteibeladv.com.br',
  compressHTML: true,
  // Serve a pasta assets/ como raiz estática.
  // assets/img/bg1.avif → /img/bg1.avif
  publicDir: 'assets',
  build: {
    assets: '_assets',
  },
});
