# Сайт скрипачки

Визитка, афиша концертов, видео, галерея и запись на уроки. Русский и английский.

- Дизайн: [`docs/prototype/index.html`](docs/prototype/index.html) — утверждённый прототип
- План и статус: [`docs/plan.md`](docs/plan.md)
- Что запросить у заказчика: [`docs/content-checklist.md`](docs/content-checklist.md)
- Таблица концертов: [`docs/concerts-sheet.md`](docs/concerts-sheet.md)

## Стек

- [Astro](https://astro.build) 7 — статическая сборка, i18n (`/` — RU, `/en/` — EN), sitemap
- Шрифты Prata и Golos Text — локально через Fontsource
- PHP 8 на хостинге — один скрипт `public/api/concerts.php`: кэш таблицы концертов
- Запись на уроки — через WhatsApp и Telegram с готовым текстом, сайт данные не собирает
- GitHub Actions — сборка и деплой по rsync

## Запуск

Нужен Node.js 22.23+ (см. `.nvmrc`).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # сборка в dist/
npm run preview  # просмотр собранного сайта
```

Переменные окружения — в `.env` (образец: `.env.example`).
PHP-скрипты локально не запускаются через `astro dev`; для их проверки нужен PHP (`php -S localhost:8000 -t dist`).

## Структура

```
src/
  components/      блоки страницы (Hero, About, Concerts, Media, Gallery, Lessons, BookingForm, Reviews, Organizers)
  data/            содержимое сайта в JSON, поля на двух языках { "ru": …, "en": … }
  i18n/ui.ts       тексты интерфейса и помощники для языков
  layouts/         общий <head>, шапка, подвал
  lib/concerts.ts  загрузка концертов из Google Таблицы при сборке
  pages/           маршруты: /, /en/, /privacy, /en/privacy, 404
  scripts/         (пусто — клиентский JS внутри компонентов)
  styles/          дизайн-токены и базовые стили
  assets/          исходные фото (Astro сожмёт их сам)
public/
  api/             PHP: concerts.php, lead.php, config.example.php
  files/           PDF: пресс-кит, репертуар
docs/              план, чек-листы, прототип
```

## Где что менять

| Что | Файл |
|---|---|
| Имя, контакты, соцсети, SEO-описание | `src/data/site.json` |
| Биография и цифры | `src/data/about.json` |
| Аудитории, цены, варианты в форме | `src/data/lessons.json` |
| Видео | `src/data/videos.json` |
| Фото галереи | `src/assets/gallery/` + `src/data/gallery.json` |
| Отзывы | `src/data/reviews.json` |
| Тексты кнопок и меню | `src/i18n/ui.ts` |
| Концерты | Google Таблица (не в коде) |

## Деплой

1. На хостинге: PHP 8, SSL, папка сайта. Создать `api/config.php` из `api/config.example.php`.
2. В GitHub → Settings → Secrets and variables → Actions:
   - секреты `SSH_HOST`, `SSH_USER`, `SSH_KEY` (приватный ключ), `SSH_PATH` (папка сайта на хостинге);
   - переменные `CONCERTS_CSV_URL`, `PUBLIC_YM_ID`, `DEPLOY_ENABLED=true`.
3. Пуш в `main` → сборка → rsync на хостинг. Плюс ночная пересборка для свежей афиши.

`config.php` и кэш концертов живут только на хостинге и не перезаписываются деплоем.
