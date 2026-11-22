// Иконка вкладки — упрощённый знак (без уса и струн, смычки толще), квадратная рамка.
// Цвета следуют теме браузера. Генерируется при сборке из src/lib/logo.ts.
import type { APIRoute } from 'astro';
import { logoMarkup } from '../lib/logo';

export const GET: APIRoute = () => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.3 0 110 110">` +
    `<style>svg{--a:#a0561b;--k:#221f1b}@media (prefers-color-scheme:dark){svg{--a:#e2a263;--k:#f0ebe3}}</style>` +
    logoMarkup('fav', { accent: 'var(--a)', ink: 'var(--k)' }, true) +
    `</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
