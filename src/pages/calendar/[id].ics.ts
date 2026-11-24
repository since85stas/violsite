// Файлы «Добавить в календарь» для предстоящих концертов: /calendar/<id>.ics.
// Настоящий файл с адресом надёжнее всего открывается на iPhone (Safari сразу предлагает «Добавить в Календарь»).
// Концерты, добавленные в таблицу после сборки, получают файл в браузере (см. Concerts.astro).
import type { APIRoute, GetStaticPaths } from 'astro';
import { loadConcerts, splitByDate, type Concert } from '../../lib/concerts';
import { calendarId, icsText } from '../../lib/calendar';
import { withBase } from '../../lib/url';
import site from '../../data/site.json';

export const getStaticPaths = (async () => {
  const { upcoming } = splitByDate(await loadConcerts());
  return upcoming.map((c) => ({ params: { id: calendarId(c) }, props: { concert: c } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ concert: Concert }> = ({ props, site: siteUrl }) => {
  const pageUrl = new URL(withBase('/#concerts'), siteUrl).toString();
  const body = icsText(props.concert, { performer: site.name.ru, concertWord: 'концерт', pageUrl });
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
