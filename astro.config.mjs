import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://nemeseteibeladv.com.br',
  compressHTML: true,
  // Serve a pasta assets/ como raiz estática.
  // assets/img/bg1.avif → /img/bg1.avif
  publicDir: 'assets',
  build: {
    assets: '_assets',
  },
});
