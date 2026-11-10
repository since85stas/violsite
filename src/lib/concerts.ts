// Концерты из Google Таблицы (опубликованной как CSV).
// Сборка: вшиваем афишу в HTML (SEO, работа без JS).
// Браузер: обновляем список через /api/concerts.php (кэш 15 минут) — этап 4.
//
// Колонки таблицы — см. docs/concerts-sheet.md

import sample from '../data/concerts.sample.json';

export const CONCERT_TYPES = ['solo', 'orchestra', 'chamber', 'other'] as const;
export type ConcertType = (typeof CONCERT_TYPES)[number];

export interface Concert {
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  city: string;
  venue: string;
  program: string;
  type: ConcertType;
  ticketsUrl: string;
}

/**
 * Загружает концерты при сборке.
 * В режиме разработки без CONCERTS_CSV_URL — тестовые данные из concerts.sample.json.
 * TODO (этап 4): скачать CSV по CONCERTS_CSV_URL, разобрать, отфильтровать «Показывать = нет»,
 * привести дату ДД.ММ.ГГГГ → YYYY-MM-DD. При ошибке сети — вернуть [] и не ронять сборку.
 */
export async function loadConcerts(): Promise<Concert[]> {
  const url = import.meta.env.CONCERTS_CSV_URL;
  if (!url) return import.meta.env.DEV ? (sample.items as Concert[]) : [];
  return [];
}

/** Сегодняшняя дата в Москве в виде YYYY-MM-DD — граница «предстоящие / прошедшие». */
export function todayKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow' }).format(now);
}

export function splitByDate(concerts: Concert[], today = todayKey()) {
  const upcoming = concerts.filter((c) => c.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = concerts.filter((c) => c.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
