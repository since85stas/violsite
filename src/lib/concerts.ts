// Концерты из Google Таблицы (опубликованной как CSV).
// Сборка: вшиваем афишу в HTML (SEO, работа без JS).
// Браузер: обновляем список через /api/concerts.php (кэш 15 минут).
//
// Колонки таблицы — см. docs/concerts-sheet.md

export type ConcertType = 'solo' | 'orchestra' | 'chamber' | 'other';

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
 * TODO (этап 4): скачать CSV по CONCERTS_CSV_URL, разобрать, отфильтровать «Показывать = нет»,
 * привести дату ДД.ММ.ГГГГ → YYYY-MM-DD, отсортировать. При ошибке сети — вернуть [] и не ронять сборку.
 */
export async function loadConcerts(): Promise<Concert[]> {
  const url = import.meta.env.CONCERTS_CSV_URL;
  if (!url) return [];
  return [];
}

export function splitByDate(concerts: Concert[], today = new Date()) {
  const todayKey = today.toISOString().slice(0, 10);
  const upcoming = concerts.filter((c) => c.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
  const past = concerts.filter((c) => c.date < todayKey).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
