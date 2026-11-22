// Знак сайта: скрипка (силуэт с усом, четырьмя струнами, эфами) и за ней крест-накрест
// два смычка — барочный (выгнут наружу, цвет скрипки) и современный (прогнут к волосу, тёмный).
// Один источник для шапки, иконки вкладки (favicon.svg) и картинки превью (og-image.jpg).
// Детали скрипки вырезаны масками — сквозь них виден фон, поэтому знак работает на любой теме.

export interface LogoColors {
  /** Скрипка и барочный смычок */
  accent: string;
  /** Современный смычок */
  ink: string;
}

/** Рамка знака по фактическим границам рисунка (x 17.9–91.6, y 1.2–108.5), пропорции 76 : 110. */
export const LOGO_VIEWBOX = '17 0 76 110';

const BODY =
  'M50 33 C59 33 67.5 35.5 67.5 44 C67.5 49 65.5 51.5 64.5 53.5 L66.6 54.6 C61 56.5 60 58.5 60 61 ' +
  'C60 63.5 61 65.5 66.6 67.4 L64.5 68.6 C67 70.5 70.5 74 70.5 80 C70.5 91 60 97 50 97 ' +
  'C40 97 29.5 91 29.5 80 C29.5 74 33 70.5 35.5 68.6 L33.4 67.4 C39 65.5 40 63.5 40 61 ' +
  'C40 58.5 39 56.5 33.4 54.6 L35.5 53.5 C34.5 51.5 32.5 49 32.5 44 C32.5 35.5 41 33 50 33 Z';

const F_HOLE =
  'M44 15 C34 36 54 62 37 85 C46 62 26 36 44 15 Z M49.6 12.5 a5.1 5.1 0 1 1 -10.2 0 a5.1 5.1 0 1 1 10.2 0 Z ' +
  'M42 88 a6.5 6.5 0 1 1 -13 0 a6.5 6.5 0 1 1 13 0 Z';

// Силуэт: корпус, шейка, колковая коробка, завиток
const SHAPE = `<path d="${BODY}"/><rect x="47" y="12" width="6" height="23"/><path d="M46.4 7 L53.6 7 L53 14 L47 14 Z"/><circle cx="50" cy="6" r="4.8"/>`;

/**
 * Содержимое <svg viewBox={LOGO_VIEWBOX}>.
 * id — префикс для масок (уникальный на странице). simple — без уса и струн, смычки толще: для иконки 16–32 px.
 * Цвета — любые CSS-значения; для встроенного SVG можно var(--accent).
 */
export function logoMarkup(id: string, c: LogoColors, simple = false): string {
  const hair = simple ? 0 : 0.9; // волос смычка в маленьком размере не нужен
  const k = simple ? 1.6 : 1; // трость толще в иконке (внутренний край ближе к волосу)
  const baroque =
    `<g transform="rotate(-34 50 56)" style="fill:${c.accent};stroke:${c.accent}">` +
    (hair ? `<path d="M50 10 L50 100" fill="none" stroke-width="${hair}"/>` : '') +
    `<path stroke="none" d="M50 9 Q30 55 50 101 Q${37 + (k - 1) * 7} 55 50 9 Z"/>` +
    `<rect stroke="none" x="45.3" y="89" width="4.7" height="8" rx="1"/></g>`;
  const modern =
    `<g transform="rotate(34 50 56)" style="fill:${c.ink};stroke:${c.ink}">` +
    (hair ? `<path d="M50 14 L50 92" fill="none" stroke-width="${hair}"/>` : '') +
    `<path stroke="none" d="M56 8 Q47 55 56 98 Q${52 + (k - 1) * 5} 55 59.5 9 Z"/>` +
    `<path stroke="none" d="M56 7 L60 10 L50 14.5 L50 11.5 Z"/>` +
    `<rect stroke="none" x="50" y="86" width="6" height="9" rx="1"/><rect stroke="none" x="51.5" y="95" width="3" height="4" rx="0.8"/></g>`;

  const purfling = simple
    ? ''
    : `<clipPath id="${id}-clip"><path d="${BODY}"/></clipPath>` +
      `<g clip-path="url(#${id}-clip)" fill="none"><path d="${BODY}" stroke="#000" stroke-width="5"/><path d="${BODY}" stroke="#fff" stroke-width="3.4"/></g>`;
  const strings = simple
    ? ''
    : `<path d="M48.1 13 L47.1 81 M49.37 13 L49.03 81 M50.63 13 L50.97 81 M51.9 13 L52.9 81" stroke-width="0.5"/>`;

  return (
    // Смычки прячутся за скрипкой с небольшим просветом; в выемках корпуса их не видно
    `<mask id="${id}-gap" maskUnits="userSpaceOnUse" x="0" y="-10" width="100" height="130">` +
    `<rect x="0" y="-10" width="100" height="130" fill="#fff"/>` +
    `<g fill="#000" stroke="#000" stroke-width="5" stroke-linejoin="round">${SHAPE}<rect x="32" y="50" width="36" height="21"/></g></mask>` +
    // Вырезы в скрипке: ус, струны, подставка, глазок завитка, эфы, подгрудник
    `<mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="104">` +
    `<g fill="#fff">${SHAPE}</g>${purfling}` +
    `<g fill="none" stroke="#000">${strings}<path d="M43.5 72 L56.5 72" stroke-width="2"/><circle cx="50" cy="6" r="1.9" stroke-width="1.1"/></g>` +
    `<g fill="#000"><path d="${F_HOLE}" transform="translate(30.5 57) scale(0.24 0.3)"/><path d="${F_HOLE}" transform="translate(69.5 57) scale(-0.24 0.3)"/>` +
    `<path d="M47.2 81 L52.8 81 L52 92 L48 92 Z"/></g></mask>` +
    `<g mask="url(#${id}-gap)"><g transform="translate(50 62) scale(1.22) translate(-50 -56)">${baroque}${modern}</g></g>` +
    `<rect width="100" height="104" style="fill:${c.accent}" mask="url(#${id}-cut)"/>`
  );
}
