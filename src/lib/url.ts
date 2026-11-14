// Префикс адреса сайта. На своём домене — '/', на GitHub Pages без домена — '/<репозиторий>/'.
// Задаётся при сборке переменной BASE_PATH (см. astro.config.mjs).
export const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** '/files/presskit.pdf' → '/site/files/presskit.pdf' при BASE = '/site/'. Внешние ссылки не трогает. */
export const withBase = (path: string) => (path.startsWith('/') ? BASE + path.slice(1) : path);
