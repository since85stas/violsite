<?php
// Общие функции счётчика посещений (hit.php пишет, stats.php читает).
//
// Принцип: никаких персональных данных. Не сохраняются IP, User-Agent, куки и любые
// идентификаторы посетителя — только суммы по дням: просмотры страниц, клики по кнопкам,
// группы источников. Хранение: cache/stats/ГГГГ-ММ.json.

declare(strict_types=1);

const STATS_EVENTS = [
    'lesson_whatsapp' => 'Запись: WhatsApp',
    'lesson_telegram' => 'Запись: Telegram',
    'lesson_copy' => 'Запись: копирование текста',
    'lesson_call' => 'Запись: звонок',
    'tickets' => 'Билеты на концерт',
    'video_play' => 'Просмотр видео',
    'presskit' => 'Пресс-кит',
    'repertoire' => 'Репертуар',
    'org_contact' => 'Контакты для организаторов',
];

const STATS_PAGES = [
    '/' => 'Главная (RU)',
    '/en/' => 'Главная (EN)',
    '/privacy/' => 'Политика (RU)',
    '/en/privacy/' => 'Политика (EN)',
];

const STATS_SOURCES = [
    'direct' => 'Прямые заходы',
    'yandex' => 'Яндекс',
    'google' => 'Google',
    'maps' => '2ГИС',
    'vk' => 'VK',
    'telegram' => 'Telegram',
    'whatsapp' => 'WhatsApp',
    'youtube' => 'YouTube',
    'instagram' => 'Instagram',
    'other' => 'Другие сайты',
];

/** Нормализует путь страницы к одному из известных; остальное — 'other'. */
function statsPage(string $path): string
{
    $path = '/' . trim(strtok($path, '?#') ?: '/', '/') . '/';
    $path = $path === '//' ? '/' : $path;
    return isset(STATS_PAGES[$path]) ? $path : 'other';
}

/** Группа источника по домену, с которого пришёл посетитель. */
function statsSource(string $host): string
{
    $h = strtolower(preg_replace('/^www\./', '', trim($host)));
    if ($h === '') return 'direct';
    // Браузеры передают с чужих сайтов только домен (без пути), поэтому Яндекс.Карты
    // попадают в «Яндекс», а Google Maps — в «Google». Отдельно видно только 2ГИС.
    $rules = [
        'maps' => '/(^|\.)2gis\.[a-z]+$/',
        'yandex' => '/(^|\.)(yandex\.[a-z.]+|ya\.ru|dzen\.ru)$/',
        'google' => '/(^|\.)google\.[a-z.]+$/',
        'vk' => '/(^|\.)(vk\.com|vk\.ru|vkvideo\.ru|ok\.ru)$/',
        'telegram' => '/(^|\.)(t\.me|telegram\.org|telegram\.me)$/',
        'whatsapp' => '/(^|\.)(whatsapp\.com|wa\.me)$/',
        'youtube' => '/(^|\.)(youtube\.com|youtu\.be)$/',
        'instagram' => '/(^|\.)instagram\.com$/',
    ];
    foreach ($rules as $group => $re) {
        if (preg_match($re, $h)) return $group;
    }
    return 'other';
}

function statsIsBot(string $ua): bool
{
    return $ua === '' || (bool)preg_match('/bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|scrapy/i', $ua);
}

function statsDir(): string
{
    return __DIR__ . '/cache/stats';
}

/** Прибавляет единицу к счётчику за день. $kind: views | events | sources. */
function statsIncrement(string $day, string $kind, string $key, ?string $dir = null): bool
{
    $dir ??= statsDir();
    if (!is_dir($dir) && !@mkdir($dir, 0750, true)) return false;
    $fp = @fopen($dir . '/' . substr($day, 0, 7) . '.json', 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) { fclose($fp); return false; }
    $data = json_decode((string)stream_get_contents($fp), true) ?: [];
    $data[$day][$kind][$key] = (int)($data[$day][$kind][$key] ?? 0) + 1;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data, JSON_UNESCAPED_SLASHES));
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

/** Данные за последние $days дней: [день => [views/events/sources => [ключ => число]]]. */
function statsLoad(int $days, DateTimeImmutable $today, ?string $dir = null): array
{
    $dir ??= statsDir();
    $out = [];
    $files = [];
    for ($i = 0; $i < $days; $i++) {
        $day = $today->modify("-$i days")->format('Y-m-d');
        $month = substr($day, 0, 7);
        if (!array_key_exists($month, $files)) {
            $raw = @file_get_contents($dir . '/' . $month . '.json');
            $files[$month] = $raw ? (json_decode($raw, true) ?: []) : [];
        }
        $out[$day] = $files[$month][$day] ?? [];
    }
    return $out;
}

/** Сумма по всем дням для одного вида счётчиков. */
function statsTotal(array $byDay, string $kind): array
{
    $sum = [];
    foreach ($byDay as $d) {
        foreach ($d[$kind] ?? [] as $k => $n) $sum[$k] = ($sum[$k] ?? 0) + (int)$n;
    }
    arsort($sum);
    return $sum;
}
