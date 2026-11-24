// Иконка для «На экран Домой» (iPhone, Android) — 180×180, на тёплом фоне сайта:
// система сама скругляет углы и не любит прозрачность. Знак — полный, с усом и струнами.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { logoMarkup, LOGO_VIEWBOX } from '../lib/logo';

export const GET: APIRoute = async () => {
  const S = 180;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">` +
    `<rect width="${S}" height="${S}" fill="#f6ead6"/>` +
    // знак 76:110 — по высоте ~70% иконки, по центру
    `<svg x="${(S - 87) / 2}" y="${(S - 126) / 2}" width="87" height="126" viewBox="${LOGO_VIEWBOX}">` +
    logoMarkup('ati', { accent: '#a0561b', ink: '#221f1b' }) +
    `</svg></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
