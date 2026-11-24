// «Добавить в календарь»: файл .ics (iPhone, Outlook, Android) и ссылка Google Календаря.
// Один код на сборку (файлы /calendar/<id>.ics) и браузер (концерты, добавленные в таблицу после сборки).
//
// Время в таблице — московское (как и в разметке MusicEvent): переводим в UTC, UTC+3 без перехода
// на летнее время. Конец концерта в таблице не указан — считаем 2 часа. Без времени — событие на весь день.

import type { Concert } from './concerts';

const DURATION_H = 2;
const MSK_OFFSET_H = 3;

/** Короткий стабильный id для имени файла: дата, время и хеш площадки. */
export function calendarId(c: Concert) {
  let h = 5381;
  for (const ch of `${c.city}|${c.venue}`) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0;
  return `${c.date}-${c.time ? c.time.replace(':', '') : 'day'}-${h.toString(36)}`;
}

const pad = (n: number) => String(n).padStart(2, '0');
const utcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const dayStamp = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;

interface EventText { title: string; location: string; description: string; start: string; end: string; allDay: boolean }

export interface CalendarOpts { performer: string; concertWord: string; pageUrl: string }

function eventText(c: Concert, { performer, concertWord, pageUrl }: CalendarOpts): EventText {
  const [y, m, d] = c.date.split('-').map(Number);
  let start: string, end: string;
  if (c.time) {
    const [hh, mm] = c.time.split(':').map(Number);
    const s = new Date(Date.UTC(y, m - 1, d, hh - MSK_OFFSET_H, mm));
    start = utcStamp(s);
    end = utcStamp(new Date(s.getTime() + DURATION_H * 3600_000));
  } else {
    start = dayStamp(new Date(Date.UTC(y, m - 1, d)));
    end = dayStamp(new Date(Date.UTC(y, m - 1, d + 1)));
  }
  const title = c.program ? `${c.program.split('\n')[0]} — ${performer}` : `${performer}: ${concertWord}`;
  const location = [c.venue, c.address, c.city].filter(Boolean).join(', ');
  const description = [
    c.details,
    c.performers,
    /^https?:\/\//i.test(c.ticketsUrl) ? `Билеты: ${c.ticketsUrl}` : '',
    pageUrl,
  ].filter(Boolean).join('\n\n');
  return { title, location, description, start, end, allDay: !c.time };
}

/** Ссылка «добавить событие» в Google Календаре. */
export function googleCalendarUrl(c: Concert, opts: CalendarOpts) {
  const e = eventText(c, opts);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${e.start}/${e.end}`,
    location: e.location,
    details: e.description,
    ctz: 'Europe/Moscow',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

// RFC 5545: экранирование текста и перенос длинных строк (не длиннее 75 байт)
const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
function fold(line: string) {
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** Текст файла .ics с одним событием. */
export function icsText(c: Concert, opts: CalendarOpts) {
  const e = eventText(c, opts);
  const when = e.allDay
    ? [`DTSTART;VALUE=DATE:${e.start}`, `DTEND;VALUE=DATE:${e.end}`]
    : [`DTSTART:${e.start}`, `DTEND:${e.end}`];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//violsite//concerts//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${calendarId(c)}@violsite`,
    // DTSTAMP — постоянный (по дате концерта), чтобы файл не менялся от сборки к сборке
    `DTSTAMP:${e.allDay ? `${e.start}T000000Z` : e.start}`,
    ...when,
    `SUMMARY:${escapeText(e.title)}`,
    `LOCATION:${escapeText(e.location)}`,
    `DESCRIPTION:${escapeText(e.description)}`,
    ...(opts.pageUrl ? [`URL:${opts.pageUrl}`] : []),
    // Напоминание за день
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(e.title)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
