// Разбор CSV из Google Таблицы концертов. Та же логика продублирована в public/api/concerts.php —
// при изменении правил меняйте оба места. Формат таблицы — docs/concerts-sheet.md

import type { Concert, ConcertType } from './concerts';

/** Разбор CSV по RFC 4180: кавычки, запятые и переносы строк внутри ячеек. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

// Названия колонок (русские из шаблона и английские — на случай другого языка таблицы)
const COLUMNS: Record<keyof Concert | 'show', string[]> = {
  date: ['дата', 'date'],
  time: ['время', 'time'],
  city: ['город', 'city'],
  venue: ['площадка', 'venue', 'место'],
  program: ['программа', 'program', 'programme'],
  type: ['тип', 'type'],
  ticketsUrl: ['билеты', 'tickets', 'ссылка на билеты'],
  show: ['показывать', 'show', 'visible'],
};

const TYPES: Record<string, ConcertType> = {
  'сольный': 'solo', 'solo': 'solo', 'recital': 'solo',
  'с оркестром': 'orchestra', 'orchestra': 'orchestra', 'with orchestra': 'orchestra',
  'камерный': 'chamber', 'chamber': 'chamber',
};

const NO = new Set(['нет', 'no', 'false', '0', 'скрыть', 'hide']);

/** «22.11.2026», «2.3.2027», «2026-11-22» → «2026-11-22». Неверная дата → null. */
export function normalizeDate(v: string): string | null {
  const s = v.trim();
  let y: number, m: number, d: number;
  let match = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if (match) { d = +match[1]; m = +match[2]; y = +match[3]; }
  else if ((match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { y = +match[1]; m = +match[2]; d = +match[3]; }
  else return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** «19:00», «9:30», «19:00:00» → «19:00». Пусто или неверно → «». */
export function normalizeTime(v: string): string {
  const match = v.trim().match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/);
  if (!match || +match[1] > 23 || +match[2] > 59) return '';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function rowsToConcerts(rows: string[][]): Concert[] {
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (key: keyof typeof COLUMNS) => header.findIndex((h) => COLUMNS[key].includes(h));
  const idx = Object.fromEntries(Object.keys(COLUMNS).map((k) => [k, col(k as keyof typeof COLUMNS)])) as Record<keyof typeof COLUMNS, number>;
  const get = (r: string[], k: keyof typeof COLUMNS) => (idx[k] >= 0 ? (r[idx[k]] ?? '').trim() : '');

  const out: Concert[] = [];
  for (const r of rows.slice(1)) {
    if (NO.has(get(r, 'show').toLowerCase())) continue;
    const date = normalizeDate(get(r, 'date'));
    const city = get(r, 'city');
    const venue = get(r, 'venue');
    if (!date || !city || !venue) continue; // неполные строки пропускаем, сайт не ломаем
    const tickets = get(r, 'ticketsUrl');
    out.push({
      date,
      time: normalizeTime(get(r, 'time')),
      city,
      venue,
      program: get(r, 'program'),
      type: TYPES[get(r, 'type').toLowerCase()] ?? 'other',
      ticketsUrl: /^https?:\/\//i.test(tickets) ? tickets : '',
    });
  }
  return out;
}
