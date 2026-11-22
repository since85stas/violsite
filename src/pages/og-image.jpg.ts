// Картинка для превью ссылок в мессенджерах и соцсетях (og:image), 1200×630.
// Генерируется при сборке: слева знак и имя на тёплом фоне, справа портрет из src/assets/portrait/
// (первый файл), а если его нет — контур скрипки. Отдельно рисовать ничего не нужно.
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import site from '../data/site.json';
import { logoMarkup, LOGO_VIEWBOX } from '../lib/logo';

const W = 1200;
const H = 630;
const HALF = 600;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

async function portraitBuffer(): Promise<Buffer | null> {
  const dir = join(process.cwd(), 'src/assets/portrait');
  try {
    const file = (await readdir(dir)).find((f) => /\.(jpe?g|png|webp)$/i.test(f));
    return file ? await readFile(join(dir, file)) : null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async () => {
  const [first, ...rest] = site.name.ru.split(' ');
  const textSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="#f6ead6"/>
      <svg x="66" y="40" width="83" height="120" viewBox="${LOGO_VIEWBOX}">${logoMarkup('og', { accent: '#a0561b', ink: '#221f1b' })}</svg>
      <text x="72" y="250" font-family="Georgia, 'DejaVu Serif', 'Times New Roman', serif" font-size="88" fill="#a0561b">${esc(first)}</text>
      <text x="72" y="350" font-family="Georgia, 'DejaVu Serif', 'Times New Roman', serif" font-size="88" fill="#a0561b">${esc(rest.join(' '))}</text>
      <text x="74" y="430" font-family="'DejaVu Sans', Arial, sans-serif" font-size="30" fill="#5b3a14">Скрипачка · концерты и уроки</text>
      <text x="74" y="474" font-family="'DejaVu Sans', Arial, sans-serif" font-size="26" fill="#8a6a45">${esc(site.name.en)} · violinist</text>
      <g stroke="#5b3a14" stroke-opacity="0.25">
        ${Array.from({ length: 5 }, (_, i) => `<line x1="72" x2="520" y1="${540 + i * 7}" y2="${540 + i * 7}" stroke-width="1.5"/>`).join('')}
      </g>
    </svg>`;

  const portrait = await portraitBuffer();
  const right = portrait
    ? await sharp(portrait).resize(HALF, H, { fit: 'cover', position: 'attention' }).toBuffer()
    : await sharp(Buffer.from(`
        <svg width="${HALF}" height="${H}" viewBox="0 0 ${HALF} ${H}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${HALF}" height="${H}" fill="#221f1b"/>
          <g transform="translate(220 95) scale(1.6 1.95)" fill="none" stroke="#e2a263" stroke-width="1.1" stroke-opacity="0.85">
            <path d="M50 4v58"/><rect x="45" y="2" width="10" height="16" rx="5"/>
            <path d="M50 62c-16 0-26 10-26 24 0 9 6 14 6 20s-10 12-10 30c0 26 16 44 30 44s30-18 30-44c0-18-10-24-10-30s6-11 6-20c0-14-10-24-26-24z"/>
            <path d="M38 118c-4 6-4 12 0 18M62 118c4 6 4 12 0 18"/><path d="M42 160h16"/><path d="M47 62v98M53 62v98"/>
          </g>
        </svg>`)).png().toBuffer();

  const image = await sharp(Buffer.from(textSvg))
    .composite([{ input: right, left: HALF, top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/jpeg' } });
};
