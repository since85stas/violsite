<?php
// Скопируйте в config.php НА ХОСТИНГЕ и заполните. config.php не хранится в git.
return [
    // Google Таблица концертов, опубликованная как CSV
    'concerts_csv_url' => '',
    'concerts_cache_ttl' => 900, // секунд (15 минут)

    // Telegram: токен от @BotFather и chat_id получателя заявок
    'telegram_bot_token' => '',
    'telegram_chat_id' => '',

    // Почта для дубля заявок
    'mail_to' => '',
    'mail_from' => 'no-reply@example-violin.ru',

    // Разрешённые источники запросов (свой домен)
    'allowed_origins' => ['https://example-violin.ru'],

    // Антиспам
    'rate_limit_per_hour' => 5,
    'min_fill_seconds' => 3,
];
