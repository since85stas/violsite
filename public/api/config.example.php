<?php
// Скопируйте в config.php НА ХОСТИНГЕ (рядом с этим файлом) и заполните.
// config.php не хранится в git и закрыт от чтения из браузера (.htaccess).
return [
    // Google Таблица концертов, опубликованная как CSV (docs/concerts-sheet.md)
    'concerts_csv_url' => '',
    'concerts_cache_ttl' => 900, // секунд (15 минут)
];
