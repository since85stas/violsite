<?php
// GET /api/concerts.php → JSON со списком концертов из Google Таблицы.
//
// TODO (этап 4):
//  - скачать CSV по concerts_csv_url (cURL, таймаут 5 с);
//  - разобрать CSV (str_getcsv построчно с учётом переносов в кавычках);
//  - пропустить строки «Показывать = нет» и строки с неверной датой;
//  - дата ДД.ММ.ГГГГ → YYYY-MM-DD; формат ответа — как тип Concert в src/lib/concerts.ts;
//  - кэш в cache/concerts.json на concerts_cache_ttl секунд;
//  - если Google недоступен — отдать последний кэш.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

$config = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];

http_response_code(501);
echo json_encode(['ok' => false, 'error' => 'not_implemented', 'concerts' => []], JSON_UNESCAPED_UNICODE);
