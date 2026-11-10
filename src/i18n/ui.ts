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
    'book.name': 'Имя',
    'book.contact': 'Телефон или Telegram',
    'book.comment': 'Комментарий',
    'book.agree': 'Согласен(на) на обработку персональных данных',
    'book.policy': 'Политика конфиденциальности',
    'book.submit': 'Отправить заявку',
    'book.note': 'Время предварительное — Елена свяжется с вами и подтвердит.',
    'book.done': 'Заявка отправлена. Елена свяжется с вами в ближайшее время.',
    'book.fail': 'Не получилось отправить заявку. Напишите напрямую:',
    'book.sending': 'Отправляем…',
    'book.pickDay': 'Выберите день',
    'book.err.day': 'Выберите желаемый день',
    'book.err.name': 'Укажите имя',
    'book.err.contact': 'Укажите телефон (+7 …) или Telegram (@имя)',
    'book.err.agree': 'Нужно согласие на обработку данных',
    'book.comment.placeholder': 'Например: играли 3 года в детстве, хочу вернуться',

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
    'book.name': 'Name',
    'book.contact': 'Phone, Telegram or WhatsApp',
    'book.comment': 'Comment',
    'book.agree': 'I agree to the processing of my personal data',
    'book.policy': 'Privacy policy',
    'book.submit': 'Send request',
    'book.note': 'The time is preliminary — Elena will contact you to confirm.',
    'book.done': 'Request sent. Elena will get back to you shortly.',
    'book.fail': 'Could not send the request. Please write directly:',
    'book.sending': 'Sending…',
    'book.pickDay': 'Choose a day',
    'book.err.day': 'Choose a preferred day',
    'book.err.name': 'Enter your name',
    'book.err.contact': 'Enter a phone number (+…) or Telegram (@name)',
    'book.err.agree': 'Please agree to the processing of your data',
    'book.comment.placeholder': 'For example: played for 3 years as a child, want to come back',

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
