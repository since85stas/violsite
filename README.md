# Сайт скрипачки

Визитка, афиша концертов, видео, галерея и запись на уроки. Русский и английский.

- Дизайн: [`docs/prototype/index.html`](docs/prototype/index.html) — утверждённый прототип
- План и статус: [`docs/plan.md`](docs/plan.md)
- Что запросить у заказчика: [`docs/content-checklist.md`](docs/content-checklist.md)
- Таблица концертов: [`docs/concerts-sheet.md`](docs/concerts-sheet.md)

## Стек

- [Astro](https://astro.build) 7 — статическая сборка, i18n (`/` — RU, `/en/` — EN), sitemap
- Шрифты Prata и Golos Text — локально через Fontsource
- Хостинг — **GitHub Pages** (бесплатно, только статика, без серверного кода)
- Концерты — опубликованная Google Таблица: вшиваются при сборке и обновляются в браузере
- Запись на уроки — через WhatsApp и Telegram с готовым текстом, сайт данные не собирает
- Аналитика — Яндекс.Вебмастер, Google Search Console, Яндекс.Бизнес (без счётчиков на сайте)
- GitHub Actions — сборка и деплой на Pages

## Запуск

Нужен Node.js 22.23+ (см. `.nvmrc`).

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # сборка в dist/
npm run preview  # просмотр собранного сайта
```

Переменные окружения — в `.env` (образец: `.env.example`).

Сборка «как на GitHub Pages без своего домена» (с префиксом `/site/`):

```bash
SITE_URL=https://login.github.io BASE_PATH=/site npm run build
```

В Git Bash на Windows перед командой добавьте `MSYS_NO_PATHCONV=1`, иначе `/site` превратится в путь Windows.

## Структура

```
src/
  components/      блоки страницы (Hero, About, Concerts, Media, Gallery, Lessons, BookingForm, Reviews, Organizers)
  data/            содержимое сайта в JSON, поля на двух языках { "ru": …, "en": … }
  i18n/ui.ts       тексты интерфейса и помощники для языков
  layouts/         общий <head>, шапка, подвал
  lib/             концерты (загрузка и разбор CSV), галерея, видео, url.ts — префикс адреса
  pages/           маршруты: /, /en/, /privacy, /en/privacy, 404, robots.txt
  styles/          дизайн-токены и базовые стили
  assets/          исходные фото (Astro сожмёт их сам)
public/
  files/           PDF: пресс-кит, репертуар
docs/              план, чек-листы, прототип, тестовая таблица концертов
```

Все внутренние ссылки строятся через `localizePath()` / `withBase()` — так сайт работает
и по адресу `login.github.io/site/`, и на своём домене. Не пишите в коде пути вида `href="/…"` напрямую.

## Где что менять

| Что | Файл |
|---|---|
| Имя, контакты, соцсети, SEO-описание | `src/data/site.json` |
| Биография и цифры | `src/data/about.json` |
| Аудитории, цены, варианты для записи | `src/data/lessons.json` |
| Видео | `src/data/videos.json` |
| Фото галереи | `src/assets/gallery/` + `src/data/gallery.json` |
| Отзывы | `src/data/reviews.json` |
| Тексты кнопок и меню | `src/i18n/ui.ts` |
| Концерты | Google Таблица (не в коде) |

## Деплой на GitHub Pages

1. Репозиторий на GitHub — **публичный** (на бесплатном тарифе Pages работает только с публичными).
2. **Settings → Pages → Source: GitHub Actions.**
3. **Settings → Secrets and variables → Actions → Variables:** `CONCERTS_CSV_URL` — ссылка на опубликованную таблицу.
4. Пуш в `main` → сборка → публикация. Сайт будет по адресу `https://<логин>.github.io/<репозиторий>/`.
   Плюс ночная пересборка (03:00 МСК) и кнопка **Actions → Build and deploy → Run workflow**.

Адрес и префикс сборка получает сама (`actions/configure-pages`), вручную ничего задавать не нужно.

### Свой домен

1. **Settings → Pages → Custom domain** — вписать домен (например, `shpagina.ru`).
2. У регистратора — DNS-записи:
   - для `shpagina.ru`: A-записи `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   - для `www.shpagina.ru`: CNAME на `<логин>.github.io`.
3. Дождаться обновления DNS, включить **Enforce HTTPS**.
4. Подтвердить домен в настройках аккаунта: **Settings → Pages → Verified domains**.
5. Пересобрать сайт (Run workflow) — ссылки станут от корня домена.

### Если GitHub Pages плохо открывается в России

Сайт полностью статический: папку `dist/` можно выложить на любой хостинг (Beget, Timeweb и т.п.)
без изменений в коде. Тогда в workflow нужно заменить шаги публикации на загрузку по SFTP/rsync.
