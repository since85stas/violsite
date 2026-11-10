<?php
// Проверка функций счётчика public/api/stats-lib.php.
// Запуск без установленного PHP:  npx -y @php-wasm/cli@3.1.59 tests/php/stats.test.php
// С PHP:                          php tests/php/stats.test.php

declare(strict_types=1);

require __DIR__ . '/../../public/api/stats-lib.php';

$fail = 0;
function check(string $name, bool $ok): void
{
    global $fail;
    echo ($ok ? 'ok   ' : 'FAIL ') . $name . PHP_EOL;
    if (!$ok) $fail++;
}

check('путь / ', statsPage('/') === '/');
check('путь /en → /en/', statsPage('/en') === '/en/');
check('путь /privacy?x=1 → /privacy/', statsPage('/privacy?x=1') === '/privacy/');
check('неизвестный путь → other', statsPage('/wp-admin/') === 'other');

check('пустой источник → direct', statsSource('') === 'direct');
check('yandex.ru → yandex', statsSource('yandex.ru') === 'yandex');
check('www.google.com → google', statsSource('www.google.com') === 'google');
check('m.vk.com → vk', statsSource('m.vk.com') === 'vk');
check('t.me → telegram', statsSource('t.me') === 'telegram');
check('2gis.ru → 2ГИС', statsSource('2gis.ru') === 'maps');
check('example.org → other', statsSource('example.org') === 'other');
check('notyandex.ru не yandex', statsSource('notyandex.ru') === 'other');

check('бот по User-Agent', statsIsBot('Mozilla/5.0 (compatible; YandexBot/3.0)'));
check('пустой User-Agent — бот', statsIsBot(''));
check('обычный браузер — не бот', !statsIsBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Safari/604.1'));

$dir = sys_get_temp_dir() . '/stats-test-' . getmypid();
statsIncrement('2026-11-10', 'views', '/', $dir);
statsIncrement('2026-11-10', 'views', '/', $dir);
statsIncrement('2026-11-11', 'views', '/en/', $dir);
statsIncrement('2026-11-11', 'events', 'lesson_whatsapp', $dir);
statsIncrement('2026-10-31', 'sources', 'yandex', $dir);
$data = statsLoad(30, new DateTimeImmutable('2026-11-11'), $dir);
check('загружено 30 дней', count($data) === 30);
check('просмотры за 10 ноября', ($data['2026-11-10']['views']['/'] ?? 0) === 2);
check('данные из прошлого месяца', ($data['2026-10-31']['sources']['yandex'] ?? 0) === 1);
check('сумма просмотров', statsTotal($data, 'views') === ['/' => 2, '/en/' => 1]);
check('в файле нет IP и User-Agent', !preg_match('/\d+\.\d+\.\d+\.\d+|Mozilla/', (string)file_get_contents("$dir/2026-11.json")));
array_map('unlink', glob("$dir/*.json"));
rmdir($dir);

echo PHP_EOL . ($fail ? "Ошибок: $fail" : 'Все проверки пройдены') . PHP_EOL;
exit($fail ? 1 : 0);
