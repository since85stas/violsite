<?php
// POST /api/hit.php — счётчик: просмотр страницы или клик по кнопке.
// Поля: t = view | click, p = путь страницы, r = домен источника (только для view), e = событие (для click).
// Отвечает 204 без тела. Не сохраняет IP, User-Agent и куки — только +1 к суммам за день.

declare(strict_types=1);

require __DIR__ . '/stats-lib.php';

header('Cache-Control: no-store');

$done = function (int $status = 204): void {
    http_response_code($status);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') $done(405);

// Только со своего сайта и не от ботов
$host = strtolower((string)preg_replace('/:\d+$/', '', (string)($_SERVER['HTTP_HOST'] ?? '')));
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$originHost = strtolower((string)parse_url($origin, PHP_URL_HOST));
if ($originHost === '' || $originHost !== $host) $done(403);
if (statsIsBot((string)($_SERVER['HTTP_USER_AGENT'] ?? ''))) $done();

$day = (new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow')))->format('Y-m-d');
$type = (string)($_POST['t'] ?? '');
$page = statsPage((string)($_POST['p'] ?? '/'));

if ($type === 'view') {
    statsIncrement($day, 'views', $page);
    $ref = (string)($_POST['r'] ?? '');
    // свой домен источником не считаем (переходы внутри сайта)
    $refHost = preg_replace('/^www\./', '', strtolower($ref));
    if ($refHost !== preg_replace('/^www\./', '', $host)) {
        statsIncrement($day, 'sources', statsSource(substr($ref, 0, 100)));
    }
} elseif ($type === 'click') {
    $event = (string)($_POST['e'] ?? '');
    if (isset(STATS_EVENTS[$event])) statsIncrement($day, 'events', $event);
}

$done();
