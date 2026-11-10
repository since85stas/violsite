<?php
// GET /api/concerts.php → { ok: true, updated: <unix>, concerts: [...] }
//
// Скачивает опубликованную Google Таблицу (CSV), разбирает и кэширует результат
// в cache/concerts.json на concerts_cache_ttl секунд. Если таблица недоступна —
// отдаёт последний удачный кэш (stale: true). Логика разбора повторяет
// src/lib/concerts-csv.ts — при изменении правил меняйте оба места.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$config = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$url = (string)($config['concerts_csv_url'] ?? '');
$ttl = (int)($config['concerts_cache_ttl'] ?? 900);
$cacheFile = __DIR__ . '/cache/concerts.json';

function respond(array $data, int $status = 200, int $maxAge = 300): void
{
    http_response_code($status);
    header('Cache-Control: public, max-age=' . $maxAge);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readCache(string $file): ?array
{
    if (!is_file($file)) return null;
    $data = json_decode((string)file_get_contents($file), true);
    return is_array($data) && isset($data['concerts']) ? $data : null;
}

function download(string $url): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'violinist-site/1.0',
        ]);
        $body = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return ($body !== false && $code === 200) ? (string)$body : null;
    }
    $ctx = stream_context_create(['http' => ['timeout' => 10, 'follow_location' => 1]]);
    $body = @file_get_contents($url, false, $ctx);
    return $body === false ? null : $body;
}

/** Разбор CSV по RFC 4180: кавычки, запятые и переносы строк внутри ячеек. */
function parseCsv(string $text): array
{
    $text = preg_replace('/^\xEF\xBB\xBF/', '', $text);
    $rows = [];
    $row = [];
    $cell = '';
    $quoted = false;
    $len = strlen($text);
    for ($i = 0; $i < $len; $i++) {
        $ch = $text[$i];
        if ($quoted) {
            if ($ch === '"') {
                if (($text[$i + 1] ?? '') === '"') { $cell .= '"'; $i++; } else { $quoted = false; }
            } else {
                $cell .= $ch;
            }
        } elseif ($ch === '"') {
            $quoted = true;
        } elseif ($ch === ',') {
            $row[] = $cell; $cell = '';
        } elseif ($ch === "\n" || $ch === "\r") {
            if ($ch === "\r" && ($text[$i + 1] ?? '') === "\n") $i++;
            $row[] = $cell; $rows[] = $row; $row = []; $cell = '';
        } else {
            $cell .= $ch;
        }
    }
    if ($cell !== '' || $row) { $row[] = $cell; $rows[] = $row; }
    return array_values(array_filter($rows, fn($r) => trim(implode('', $r)) !== ''));
}

function lower(string $s): string
{
    return mb_strtolower(trim($s), 'UTF-8');
}

function normalizeDate(string $v): ?string
{
    $v = trim($v);
    if (preg_match('/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/', $v, $m)) {
        [$d, $mo, $y] = [(int)$m[1], (int)$m[2], (int)$m[3]];
    } elseif (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})$/', $v, $m)) {
        [$y, $mo, $d] = [(int)$m[1], (int)$m[2], (int)$m[3]];
    } else {
        return null;
    }
    return checkdate($mo, $d, $y) ? sprintf('%04d-%02d-%02d', $y, $mo, $d) : null;
}

function normalizeTime(string $v): string
{
    if (!preg_match('/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/', trim($v), $m)) return '';
    if ((int)$m[1] > 23 || (int)$m[2] > 59) return '';
    return sprintf('%02d:%s', (int)$m[1], $m[2]);
}

function rowsToConcerts(array $rows): array
{
    if (count($rows) < 2) return [];
    $columns = [
        'date' => ['дата', 'date'],
        'time' => ['время', 'time'],
        'city' => ['город', 'city'],
        'venue' => ['площадка', 'venue', 'место'],
        'program' => ['программа', 'program', 'programme'],
        'type' => ['тип', 'type'],
        'ticketsUrl' => ['билеты', 'tickets', 'ссылка на билеты'],
        'show' => ['показывать', 'show', 'visible'],
    ];
    $types = [
        'сольный' => 'solo', 'solo' => 'solo', 'recital' => 'solo',
        'с оркестром' => 'orchestra', 'orchestra' => 'orchestra', 'with orchestra' => 'orchestra',
        'камерный' => 'chamber', 'chamber' => 'chamber',
    ];
    $no = ['нет', 'no', 'false', '0', 'скрыть', 'hide'];

    $header = array_map('lower', $rows[0]);
    $idx = [];
    foreach ($columns as $key => $names) {
        $idx[$key] = -1;
        foreach ($header as $i => $h) {
            if (in_array($h, $names, true)) { $idx[$key] = $i; break; }
        }
    }
    $get = fn(array $r, string $k) => $idx[$k] >= 0 ? trim((string)($r[$idx[$k]] ?? '')) : '';

    $out = [];
    foreach (array_slice($rows, 1) as $r) {
        if (in_array(lower($get($r, 'show')), $no, true)) continue;
        $date = normalizeDate($get($r, 'date'));
        $city = $get($r, 'city');
        $venue = $get($r, 'venue');
        if ($date === null || $city === '' || $venue === '') continue;
        $tickets = $get($r, 'ticketsUrl');
        $out[] = [
            'date' => $date,
            'time' => normalizeTime($get($r, 'time')),
            'city' => $city,
            'venue' => $venue,
            'program' => $get($r, 'program'),
            'type' => $types[lower($get($r, 'type'))] ?? 'other',
            'ticketsUrl' => preg_match('~^https?://~i', $tickets) ? $tickets : '',
        ];
    }
    return $out;
}

// --- основной сценарий ---
// (тесты подключают файл с CONCERTS_LIB_ONLY, чтобы получить только функции разбора)
if (defined('CONCERTS_LIB_ONLY')) return;

$cached = readCache($cacheFile);
if ($cached && time() - (int)($cached['updated'] ?? 0) < $ttl) {
    respond(['ok' => true] + $cached);
}

if ($url === '') {
    respond(['ok' => false, 'error' => 'not_configured', 'concerts' => []], 503, 60);
}

$csv = download($url);
if ($csv !== null) {
    $rows = parseCsv($csv);
    // Защита от «пустой» выдачи: если Google вернул не таблицу (например, страницу ошибки) — не затираем кэш
    if ($rows && count($rows[0]) >= 3) {
        $data = ['updated' => time(), 'concerts' => rowsToConcerts($rows)];
        if (!is_dir(dirname($cacheFile))) @mkdir(dirname($cacheFile), 0755, true);
        @file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
        respond(['ok' => true] + $data);
    }
}

if ($cached) {
    respond(['ok' => true, 'stale' => true] + $cached, 200, 60);
}
respond(['ok' => false, 'error' => 'unavailable', 'concerts' => []], 502, 60);
