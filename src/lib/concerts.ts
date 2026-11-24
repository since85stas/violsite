// Концерты из Google Таблицы (опубликованной как CSV).
// Сборка: вшиваем афишу в HTML (SEO, работа без JS).
// Браузер: Concerts.astro скачивает ту же таблицу и обновляет список без пересборки.
//
// Колонки таблицы — см. docs/concerts-sheet.md

import sample from '../data/concerts.sample.json';
import { parseCsv, rowsToConcerts } from './concerts-csv';

export const CONCERT_TYPES = ['solo', 'orchestra', 'chamber', 'other'] as const;
export type ConcertType = (typeof CONCERT_TYPES)[number];

export interface Concert {
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM
  city: string;
  venue: string;
  program: string;     // кратко: название концерта — видно в афише
  type: ConcertType;
  ticketsUrl: string;
  // Подробности — в окне по клику на название (все поля необязательные)
  details?: string;    // программа вечера: произведения, по строке на каждое
  performers?: string; // исполнители
  address?: string;    // точный адрес площадки
}

let cache: Promise<Concert[]> | undefined;

/**
 * Загружает концерты при сборке (один раз на всю сборку — обе языковые версии берут один результат).
 * CONCERTS_CSV_URL — ссылка на опубликованную таблицу или локальный CSV-файл (для проверки).
 * В режиме разработки без ссылки — тестовые данные из concerts.sample.json.
 * Ошибка сети не роняет сборку: афиша будет пустой, а в браузере её подтянет Concerts.astro.
 */
export function loadConcerts(): Promise<Concert[]> {
  cache ??= fetchConcerts();
  return cache;
}

async function fetchConcerts(): Promise<Concert[]> {
  const url = import.meta.env.CONCERTS_CSV_URL;
  if (!url) return import.meta.env.DEV ? (sample.items as Concert[]) : [];
  try {
    let text: string;
    if (/^https?:\/\//i.test(url)) {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
    } else {
      const { readFile } = await import('node:fs/promises');
      text = await readFile(url, 'utf8');
    }
    const concerts = rowsToConcerts(parseCsv(text));
    console.log(`[concerts] загружено концертов: ${concerts.length}`);
    return concerts;
  } catch (err) {
    console.warn(`[concerts] не удалось загрузить таблицу (${(err as Error).message}) — афиша будет пустой`);
    return [];
  }
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
