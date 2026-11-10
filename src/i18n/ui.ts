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

    'media.eyebrow': 'Видео',
    'media.title': 'Послушать',

    'gallery.eyebrow': 'Галерея',
    'gallery.title': 'Фото',
    'gallery.all': 'Все',
    'gallery.concert': 'Концерты',
    'gallery.lessons': 'Уроки',
    'gallery.portrait': 'Портреты',

    'lessons.eyebrow': 'Уроки скрипки',
    'lessons.prices': 'Стоимость',

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
    'book.note': 'Время предварительное — Анна свяжется с вами и подтвердит.',
    'book.done': 'Заявка отправлена. Анна свяжется с вами в ближайшее время.',
    'book.fail': 'Не получилось отправить заявку. Напишите напрямую:',

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

    'media.eyebrow': 'Video',
    'media.title': 'Listen',

    'gallery.eyebrow': 'Gallery',
    'gallery.title': 'Photos',
    'gallery.all': 'All',
    'gallery.concert': 'Concerts',
    'gallery.lessons': 'Lessons',
    'gallery.portrait': 'Portraits',

    'lessons.eyebrow': 'Violin lessons',
    'lessons.prices': 'Prices',

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
    'book.note': 'The time is preliminary — Anna will contact you to confirm.',
    'book.done': 'Request sent. Anna will get back to you shortly.',
    'book.fail': 'Could not send the request. Please write directly:',

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
