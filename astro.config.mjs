// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: заменить на боевой домен перед запуском
const SITE = 'https://example-violin.ru';

export default defineConfig({
  site: SITE,
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
