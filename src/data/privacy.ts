// Текст политики конфиденциальности (RU/EN).
// Исходит из того, как устроен сайт: статический (GitHub Pages), без форм, без кук,
// без счётчиков; запись — через мессенджеры. При любом изменении этого (форма, Метрика,
// новый хостинг) текст нужно обновить. TODO: показать юристу перед запуском.
//
// Подстановки: {name} — имя, {operator} — ФИО и статус, {email} — почта для запросов.

export interface PrivacySection { title: string; paragraphs: string[]; list?: string[] }
export interface PrivacyText { title: string; intro: string; sections: PrivacySection[]; updated: string }

export const privacy: Record<'ru' | 'en', PrivacyText> = {
  ru: {
    title: 'Политика конфиденциальности',
    updated: 'Редакция от',
    intro:
      'Этот сайт — персональная страница скрипачки {name}. Здесь описано, какие данные о посетителях обрабатываются при использовании сайта и записи на уроки.',
    sections: [
      {
        title: 'Кто отвечает за сайт',
        paragraphs: ['{operator}. Вопросы о данных и запросы на их удаление: {email}.'],
      },
      {
        title: 'Сайт не собирает персональные данные',
        paragraphs: [
          'На сайте нет форм для ввода имени, телефона или почты, нет регистрации и личного кабинета.',
          'Сайт не использует cookie и не подключает счётчики посещаемости и рекламные системы (Яндекс.Метрику, Google Analytics и подобные).',
        ],
      },
      {
        title: 'Запись на уроки через мессенджеры',
        paragraphs: [
          'Блок «Запись на пробный урок» только составляет текст сообщения из выбранных вами вариантов (формат, день, время, кто будет заниматься). Этот выбор никуда не отправляется и не сохраняется.',
          'Кнопки «Написать в WhatsApp» и «Написать в Telegram» открывают ваш мессенджер. Сообщение отправляете вы сами. Вместе с ним {name} получает то, что мессенджер показывает собеседнику: имя профиля, номер телефона или имя пользователя.',
          'Эти данные используются только чтобы ответить вам и договориться об уроке. Переписку можно удалить по вашей просьбе. Обработку данных внутри мессенджеров регулируют правила WhatsApp и Telegram.',
        ],
      },
      {
        title: 'Сторонние сервисы',
        paragraphs: [
          'При открытии страниц ваш браузер обращается к сервисам, перечисленным ниже. Как и любой веб-сервер, они получают технические данные запроса — IP-адрес, тип браузера, адрес страницы — и обрабатывают их по своим правилам:',
        ],
        list: [
          'GitHub Pages (GitHub, Inc.) — хостинг сайта. GitHub может сохранять IP-адреса посетителей в журналах для безопасности и работы сервиса.',
          'Google Таблицы (Google LLC) — из опубликованной таблицы загружается афиша концертов.',
          'YouTube, Rutube, VK Видео — только если вы нажали на видео: до нажатия плеер не загружается. Обложки видео YouTube загружаются с серверов YouTube.',
          'WhatsApp и Telegram — только если вы нажали кнопку записи.',
        ],
      },
      {
        title: 'Ваши права',
        paragraphs: [
          'Вы можете узнать, какие ваши данные есть у {name} (например, переписка о записи), попросить исправить или удалить их. Напишите на {email} или в тот мессенджер, где шла переписка.',
        ],
      },
      {
        title: 'Изменения',
        paragraphs: ['Если устройство сайта изменится (например, появится форма или счётчик), эта страница будет обновлена.'],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    updated: 'Last updated',
    intro:
      'This is the personal website of violinist {name}. This page explains what visitor data is processed when you use the site and book a lesson.',
    sections: [
      {
        title: 'Who is responsible',
        paragraphs: ['{operator}. Questions about your data and deletion requests: {email}.'],
      },
      {
        title: 'The site does not collect personal data',
        paragraphs: [
          'There are no forms asking for your name, phone number or email, no registration and no accounts.',
          'The site does not use cookies and does not include analytics or advertising trackers (Yandex Metrica, Google Analytics or similar).',
        ],
      },
      {
        title: 'Booking via messengers',
        paragraphs: [
          'The “Book a trial lesson” block only drafts a message from the options you choose (format, day, time, student). Your choice is not sent or stored anywhere.',
          'The “Message on WhatsApp” and “Message on Telegram” buttons open your messenger, and you send the message yourself. {name} then sees what the messenger shows to any contact: your profile name, phone number or username.',
          'This information is used only to reply and arrange the lesson. The conversation can be deleted on request. Data inside the messengers is governed by the WhatsApp and Telegram policies.',
        ],
      },
      {
        title: 'Third-party services',
        paragraphs: [
          'When you open the pages, your browser connects to the services below. Like any web server, they receive technical request data — IP address, browser type, page address — and process it under their own policies:',
        ],
        list: [
          'GitHub Pages (GitHub, Inc.) — website hosting. GitHub may keep visitor IP addresses in logs for security and service operation.',
          'Google Sheets (Google LLC) — the concert schedule is loaded from a published spreadsheet.',
          'YouTube, Rutube, VK Video — only after you click a video; the player is not loaded before that. YouTube video thumbnails are loaded from YouTube servers.',
          'WhatsApp and Telegram — only if you press a booking button.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'You can ask what data {name} has about you (for example, a booking conversation), and request correction or deletion. Write to {email} or in the messenger you used.',
        ],
      },
      {
        title: 'Changes',
        paragraphs: ['If the way the site works changes (for example, a form or analytics is added), this page will be updated.'],
      },
    ],
  },
};
