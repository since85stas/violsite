// Тексты интерфейса на двух языках.
// Содержимое (биография, цены, отзывы) — в src/data/*.json.

export const languages = { ru: 'Русский', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ru';

export const ui = {
  ru: {
    'nav.about': 'О себе',
    'nav.concerts': 'Концерты',
    'nav.media': 'Видео',
    'nav.gallery': 'Галерея',
    'nav.lessons': 'Уроки',
    'nav.organizers': 'Организаторам',
    'nav.book': 'Записаться',
    'nav.menu': 'Меню',

    'hero.eyebrow': 'Скрипачка · солистка · педагог',
    'hero.ctaLessons': 'Записаться на пробный урок',
    'hero.ctaConcerts': 'Афиша концертов',
    'hero.next': 'Ближайший концерт',

    'about.eyebrow': 'О себе',
    'concerts.eyebrow': 'Афиша',
    'concerts.title': 'Концерты',
    'concerts.upcoming': 'Предстоящие',
    'concerts.past': 'Прошедшие',
    'concerts.tickets': 'Билеты',
    'concerts.empty': 'Новые концерты скоро появятся',
    'concerts.pastEmpty': 'Здесь появятся прошедшие концерты',
    'concerts.type.solo': 'Сольный',
    'concerts.type.orchestra': 'С оркестром',
    'concerts.type.chamber': 'Камерный',
    'concerts.type.other': 'Концерт',

    'media.eyebrow': 'Видео',
    'media.title': 'Послушать',
    'media.play': 'Смотреть видео',

    'gallery.eyebrow': 'Галерея',
    'gallery.title': 'Фото',
    'gallery.all': 'Все',
    'gallery.concert': 'Концерты',
    'gallery.lessons': 'Уроки',
    'gallery.portrait': 'Портреты',
    'gallery.filter': 'Фильтр фото',
    'gallery.open': 'Открыть фото',
    'gallery.viewer': 'Просмотр фото',
    'gallery.close': 'Закрыть',
    'gallery.prev': 'Предыдущее фото',
    'gallery.next': 'Следующее фото',

    'lessons.eyebrow': 'Уроки скрипки',
    'lessons.prices': 'Стоимость',
    'lessons.priceOnRequest': 'уточняется',
    'lessons.sizes': 'Подберём размер скрипки по росту ребёнка',
    'lessons.formats': 'Где проходят занятия',
    'lessons.offline': 'В студии',
    'lessons.online': 'Онлайн в Zoom — из любого города',

    'book.title': 'Запись на пробный урок',
    'book.format': 'Формат',
    'book.offline': 'В студии',
    'book.online': 'Онлайн, Zoom',
    'book.day': 'Желаемый день',
    'book.time': 'Удобное время',
    'book.who': 'Кто будет заниматься',
    'book.intro': 'Выберите, что вам удобно, — мы составим сообщение, а вы отправите его Елене в мессенджере.',
    'book.anyDay': 'Любой день',
    'book.preview': 'Ваше сообщение',
    'book.whatsapp': 'Написать в WhatsApp',
    'book.telegram': 'Написать в Telegram',
    'book.copy': 'Скопировать текст',
    'book.copied': 'Текст скопирован',
    'book.call': 'Или позвоните',
    'book.note': 'Время предварительное — Елена ответит и подтвердит.',
    'book.privacy': 'Сайт ничего не сохраняет: сообщение уходит напрямую из вашего мессенджера.',
    'book.msg.hello': 'Здравствуйте, Елена! Хочу записаться на пробный урок скрипки.',
    'book.msg.who': 'Кто будет заниматься',
    'book.msg.format': 'Формат',
    'book.msg.when': 'Когда удобно',

    'reviews.eyebrow': 'Отзывы учеников',
    'reviews.title': 'Что говорят',

    'org.eyebrow': 'Организаторам',
    'org.title': 'Приглашения на концерты',
    'org.presskit': 'Пресс-кит (PDF)',
    'org.repertoire': 'Репертуар (PDF)',

    'footer.privacy': 'Политика конфиденциальности',
    'lang.switch': 'English',
  },
  en: {
    'nav.about': 'About',
    'nav.concerts': 'Concerts',
    'nav.media': 'Video',
    'nav.gallery': 'Gallery',
    'nav.lessons': 'Lessons',
    'nav.organizers': 'For presenters',
    'nav.book': 'Book a lesson',
    'nav.menu': 'Menu',

    'hero.eyebrow': 'Violinist · soloist · teacher',
    'hero.ctaLessons': 'Book a trial lesson',
    'hero.ctaConcerts': 'Upcoming concerts',
    'hero.next': 'Next concert',

    'about.eyebrow': 'About',
    'concerts.eyebrow': 'Schedule',
    'concerts.title': 'Concerts',
    'concerts.upcoming': 'Upcoming',
    'concerts.past': 'Past',
    'concerts.tickets': 'Tickets',
    'concerts.empty': 'New dates coming soon',
    'concerts.pastEmpty': 'Past concerts will appear here',
    'concerts.type.solo': 'Recital',
    'concerts.type.orchestra': 'With orchestra',
    'concerts.type.chamber': 'Chamber',
    'concerts.type.other': 'Concert',

    'media.eyebrow': 'Video',
    'media.title': 'Listen',
    'media.play': 'Play video',

    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'Photos',
    'gallery.all': 'All',
    'gallery.concert': 'Concerts',
    'gallery.lessons': 'Lessons',
    'gallery.portrait': 'Portraits',
    'gallery.filter': 'Filter photos',
    'gallery.open': 'Open photo',
    'gallery.viewer': 'Photo viewer',
    'gallery.close': 'Close',
    'gallery.prev': 'Previous photo',
    'gallery.next': 'Next photo',

    'lessons.eyebrow': 'Violin lessons',
    'lessons.prices': 'Prices',
    'lessons.priceOnRequest': 'on request',
    'lessons.sizes': 'We will pick the right violin size for your child',
    'lessons.formats': 'Where lessons take place',
    'lessons.offline': 'In the studio',
    'lessons.online': 'Online via Zoom — from anywhere',

    'book.title': 'Book a trial lesson',
    'book.format': 'Format',
    'book.offline': 'In the studio',
    'book.online': 'Online, Zoom',
    'book.day': 'Preferred day',
    'book.time': 'Preferred time',
    'book.who': 'Who will study',
    'book.intro': 'Pick what suits you — we will draft a message, and you send it to Elena in your messenger.',
    'book.anyDay': 'Any day',
    'book.preview': 'Your message',
    'book.whatsapp': 'Message on WhatsApp',
    'book.telegram': 'Message on Telegram',
    'book.copy': 'Copy text',
    'book.copied': 'Text copied',
    'book.call': 'Or call',
    'book.note': 'The time is preliminary — Elena will reply to confirm.',
    'book.privacy': 'The site stores nothing: the message goes straight from your messenger.',
    'book.msg.hello': 'Hello, Elena! I would like to book a trial violin lesson.',
    'book.msg.who': 'Student',
    'book.msg.format': 'Format',
    'book.msg.when': 'Preferred time',

    'reviews.eyebrow': 'Student reviews',
    'reviews.title': 'What students say',

    'org.eyebrow': 'For presenters',
    'org.title': 'Concert engagements',
    'org.presskit': 'Press kit (PDF)',
    'org.repertoire': 'Repertoire (PDF)',

    'footer.privacy': 'Privacy policy',
    'lang.switch': 'Русский',
  },
} as const;

export type UiKey = keyof (typeof ui)['ru'];

export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key] ?? ui[defaultLang][key];
}

/** Путь страницы на нужном языке: ('/privacy', 'en') → '/en/privacy' */
export function localizePath(path: string, lang: Lang) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? clean : `/${lang}${clean === '/' ? '/' : clean}`;
}

/** Выбор значения из двуязычного поля { ru, en } в данных */
export type Localized<T = string> = { ru: T; en: T };
export const pick = <T>(value: Localized<T>, lang: Lang): T => value[lang] ?? value[defaultLang];
