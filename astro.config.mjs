// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Адрес сайта задаётся при сборке:
//   SITE_URL  — протокол и домен без пути: https://shpagina.ru или https://login.github.io
//   BASE_PATH — префикс пути: '/' на своём домене, '/site/' на GitHub Pages без своего домена
// В GitHub Actions оба значения подставляет actions/configure-pages.
const SITE = process.env.SITE_URL || 'https://example-violin.ru';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Порт можно переопределить переменной PORT (так делает превью в редакторе)
  server: { host: '127.0.0.1', port: Number(process.env.PORT) || 4321 },
  build: { format: 'directory' },

  // Русский — основной язык (без префикса), английский — /en/
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru-RU', en: 'en-US' },
      },
    }),
  ],
});
