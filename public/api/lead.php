<?php
// POST /api/lead.php — заявка на пробный урок.
// Поля: lang, format, day, time, who, name, contact, comment, agree, website (ловушка), ts.
//
// TODO (этап 5):
//  - только POST, проверка Origin по allowed_origins;
//  - повторная проверка полей на сервере, обрезка длины;
//  - антиспам: website пустое, now - ts >= min_fill_seconds, лимит rate_limit_per_hour на IP;
//  - отправка в Telegram (sendMessage) и дубль на почту;
//  - запись в logs/leads.log (резерв на случай сбоя Telegram и почты);
//  - ответ JSON { ok: true } или { ok: false, error }.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$config = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];

http_response_code(501);
echo json_encode(['ok' => false, 'error' => 'not_implemented']);
