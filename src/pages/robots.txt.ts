// robots.txt генерируется при сборке, чтобы адрес карты сайта учитывал домен и префикс (GitHub Pages).
// Важно: на GitHub Pages без своего домена поисковики читают robots.txt только с корня
// login.github.io, а не из /site/ — тогда карту сайта нужно отправить в Вебмастер вручную.
import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(withBase('/sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
