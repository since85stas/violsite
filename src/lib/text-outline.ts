// Текст → контуры SVG по файлам шрифтов сайта (@fontsource, WOFF2).
// Нужен для картинки превью (og-image): её рисует sharp, а у сервера сборки (GitHub Actions)
// нет шрифтов сайта — <text> выходил бы запасным шрифтом. Контуры от шрифта не зависят.
import { create, type Font } from 'fontkitten';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = join(process.cwd(), 'node_modules/@fontsource');

/** Шрифт, разбитый fontsource на наборы (кириллица, латиница): для каждой буквы берём набор, где она есть. */
export async function loadFont(pkg: string, weight: number): Promise<Font[]> {
  const subsets = ['cyrillic', 'latin', 'cyrillic-ext', 'latin-ext'];
  const fonts: Font[] = [];
  for (const s of subsets) {
    try {
      fonts.push(create(await readFile(join(files, pkg, 'files', `${pkg}-${s}-${weight}-normal.woff2`))) as Font);
    } catch {
      /* такого набора у шрифта нет */
    }
  }
  if (!fonts.length) throw new Error(`Шрифт ${pkg} ${weight} не найден в node_modules/@fontsource`);
  return fonts;
}

/**
 * SVG-группа с контурами строки. x, y — начало базовой линии (как у <text>).
 * letterSpacing — в долях размера шрифта (0.01 = 1%).
 */
export function textOutline(text: string, fonts: Font[], size: number, x: number, y: number, fill: string, letterSpacing = 0): string {
  let pen = 0;
  const parts: string[] = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const font = fonts.find((f) => f.hasGlyphForCodePoint(cp)) ?? fonts[0];
    const k = size / font.unitsPerEm;
    const [glyph] = font.glyphsForString(ch);
    const d = glyph.path.toSVG();
    if (d) parts.push(`<path transform="translate(${(pen).toFixed(2)} 0) scale(${k} ${-k})" d="${d}"/>`);
    pen += glyph.advanceWidth * k + letterSpacing * size;
  }
  return `<g transform="translate(${x} ${y})" fill="${fill}">${parts.join('')}</g>`;
}
