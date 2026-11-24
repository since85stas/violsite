// Иконка вкладки в PNG 32×32 — для браузеров и сервисов, которые не берут SVG
// (Safari, сниппеты Яндекса). Тот же упрощённый знак, что в favicon.svg, на прозрачном фоне.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { logoMarkup } from '../lib/logo';

export const GET: APIRoute = async () => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.3 0 110 110" width="128" height="128">` +
    logoMarkup('fav', { accent: '#a0561b', ink: '#221f1b' }, true) +
    `</svg>`;
  // рисуем крупно и уменьшаем — так края мягче
  const png = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
