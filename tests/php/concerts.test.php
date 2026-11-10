<?php
// Проверка разбора таблицы концертов в public/api/concerts.php на docs/concerts-sample.csv.
// Запуск без установленного PHP:  npx -y @php-wasm/cli@3.1.59 tests/php/concerts.test.php
// С PHP:                          php tests/php/concerts.test.php

declare(strict_types=1);

define('CONCERTS_LIB_ONLY', true);
require __DIR__ . '/../../public/api/concerts.php';

$csv = file_get_contents(__DIR__ . '/../../docs/concerts-sample.csv');
$concerts = rowsToConcerts(parseCsv($csv));

$fail = 0;
function check(string $name, bool $ok): void
{
    global $fail;
    echo ($ok ? 'ok   ' : 'FAIL ') . $name . PHP_EOL;
    if (!$ok) $fail++;
}

$dates = array_column($concerts, 'date');
check('6 концертов', count($concerts) === 6);
check('даты как при сборке', $dates === ['2026-11-22', '2026-12-06', '2026-12-19', '2027-01-14', '2026-10-04', '2026-09-18']);
check('скрытый концерт пропущен', !in_array('2027-02-01', $dates, true));
check('31 февраля пропущено', !str_contains(json_encode($concerts, JSON_UNESCAPED_UNICODE), 'Тверь'));
check('перенос строки в программе', str_contains($concerts[2]['program'], "\n(с пианистом"));
check('время 19:00:00 → 19:00', $concerts[3]['time'] === '19:00');
check('тип «с оркестром» в нижнем регистре', $concerts[3]['type'] === 'orchestra');
check('неизвестный тип → other', $concerts[5]['type'] === 'other');
check('ссылка javascript: отброшена', $concerts[4]['ticketsUrl'] === '');
check('ссылка https сохранена', $concerts[0]['ticketsUrl'] === 'https://example.ru/tickets/1');
check('кавычки и запятые в площадке', $concerts[0]['venue'] === 'Зал «Зарядье», камерный зал');

echo PHP_EOL . ($fail ? "Ошибок: $fail" : 'Все проверки пройдены') . PHP_EOL;
exit($fail ? 1 : 0);
