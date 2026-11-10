<?php
// GET /api/stats.php?days=30 — страница статистики посещений, закрыта паролем
// (HTTP Basic: логин stats_user, пароль stats_password из config.php).
// Пустой stats_password — страница отключена.

declare(strict_types=1);

require __DIR__ . '/stats-lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');

$config = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$user = (string)($config['stats_user'] ?? 'elena');
$pass = (string)($config['stats_password'] ?? '');

if ($pass === '') {
    http_response_code(404);
    exit('Not found');
}

$givenUser = (string)($_SERVER['PHP_AUTH_USER'] ?? '');
$givenPass = (string)($_SERVER['PHP_AUTH_PW'] ?? '');
// Некоторые хостинги (PHP как CGI) не передают PHP_AUTH_*, тогда разбираем заголовок сами
if ($givenUser === '' && preg_match('/^Basic\s+(.+)$/i', (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? ''), $m)) {
    [$givenUser, $givenPass] = array_pad(explode(':', (string)base64_decode($m[1]), 2), 2, '');
}
if (!hash_equals($user, $givenUser) || !hash_equals($pass, $givenPass)) {
    header('WWW-Authenticate: Basic realm="Statistics", charset="UTF-8"');
    http_response_code(401);
    exit('Нужен пароль');
}

$days = (int)($_GET['days'] ?? 30);
$days = in_array($days, [7, 30, 90, 365], true) ? $days : 30;
$today = new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
$byDay = statsLoad($days, $today);

$views = statsTotal($byDay, 'views');
$events = statsTotal($byDay, 'events');
$sources = statsTotal($byDay, 'sources');
$totalViews = array_sum($views);
$bookings = ($events['lesson_whatsapp'] ?? 0) + ($events['lesson_telegram'] ?? 0) + ($events['lesson_call'] ?? 0);

$e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
$label = fn(array $map, string $k) => $map[$k] ?? ($k === 'other' ? 'Другое' : $k);
$pct = fn(int $n, int $all) => $all > 0 ? round($n * 100 / $all) . '%' : '—';

function bars(array $rows, array $labels, callable $label, callable $e, callable $pct): string
{
    $all = array_sum($rows);
    if (!$rows) return '<p class="muted">Пока нет данных</p>';
    $max = max($rows);
    $html = '<table class="bars">';
    foreach ($rows as $k => $n) {
        $w = $max > 0 ? round($n * 100 / $max) : 0;
        $html .= '<tr><th>' . $e($label($labels, (string)$k)) . '</th><td class="num">' . $n . '</td><td class="num muted">' . $pct($n, $all)
            . '</td><td class="bar"><span style="width:' . $w . '%"></span></td></tr>';
    }
    return $html . '</table>';
}
?>
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Статистика сайта</title>
<style>
  :root { --bg:#fff; --soft:#f8f6f2; --ink:#221f1b; --muted:#6a645b; --line:#e6e1d9; --accent:#a0561b; color-scheme: light; }
  @media (prefers-color-scheme: dark) { :root { --bg:#151311; --soft:#1c1a17; --ink:#f0ebe3; --muted:#a69e92; --line:#2f2b26; --accent:#e2a263; color-scheme: dark; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 960px; margin: 0 auto; padding: 32px max(16px, env(safe-area-inset-left)) 48px; }
  h1 { font-size: 26px; font-weight: 500; margin: 0 0 4px; }
  h2 { font-size: 17px; font-weight: 500; margin: 36px 0 12px; }
  .muted { color: var(--muted); }
  nav { display: flex; gap: 6px; flex-wrap: wrap; margin: 16px 0 24px; }
  nav a { padding: 6px 14px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); text-decoration: none; font-size: 14px; }
  nav a[aria-current] { background: var(--ink); border-color: var(--ink); color: var(--bg); }
  .tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .tile { background: var(--soft); border-radius: 10px; padding: 16px; }
  .tile b { display: block; font-size: 30px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .tile span { font-size: 13px; color: var(--muted); }
  table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid var(--line); font-weight: 400; }
  .num { text-align: right; white-space: nowrap; width: 1%; }
  .bars .bar { width: 40%; }
  .bars .bar span { display: block; height: 8px; border-radius: 4px; background: var(--accent); min-width: 2px; }
  .scroll { overflow-x: auto; }
  .daily th { font-weight: 500; white-space: nowrap; }
  footer { margin-top: 40px; font-size: 13px; }
  @media (max-width: 600px) { .tiles { grid-template-columns: 1fr; } .bars .bar { display: none; } }
</style>
</head>
<body>
<main>
  <h1>Статистика сайта</h1>
  <p class="muted">Без кук и персональных данных: только суммы по дням. Время московское.</p>

  <nav aria-label="Период">
    <?php foreach ([7 => '7 дней', 30 => '30 дней', 90 => '90 дней', 365 => 'Год'] as $d => $name): ?>
      <a href="?days=<?= $d ?>"<?= $d === $days ? ' aria-current="page"' : '' ?>><?= $name ?></a>
    <?php endforeach; ?>
  </nav>

  <div class="tiles">
    <div class="tile"><b><?= $totalViews ?></b><span>просмотров страниц</span></div>
    <div class="tile"><b><?= $bookings ?></b><span>нажали «Написать» или «Позвонить»</span></div>
    <div class="tile"><b><?= $pct($bookings, $totalViews) ?></b><span>доля нажатий от просмотров</span></div>
  </div>

  <h2>Откуда приходят</h2>
  <?= bars($sources, STATS_SOURCES, $label, $e, $pct) ?>

  <h2>Нажатия на кнопки</h2>
  <?= bars($events, STATS_EVENTS, $label, $e, $pct) ?>

  <h2>Страницы</h2>
  <?= bars($views, STATS_PAGES, $label, $e, $pct) ?>

  <h2>По дням</h2>
  <div class="scroll">
    <table class="daily">
      <thead><tr><th>День</th><th class="num">Просмотры</th><th class="num">WhatsApp</th><th class="num">Telegram</th><th class="num">Звонок</th><th class="num">Билеты</th></tr></thead>
      <tbody>
      <?php foreach ($byDay as $day => $d):
          $v = array_sum($d['views'] ?? []);
          $ev = $d['events'] ?? []; ?>
        <tr>
          <td><?= $e((new DateTimeImmutable($day))->format('d.m.Y')) ?></td>
          <td class="num"><?= $v ?: '·' ?></td>
          <td class="num"><?= $ev['lesson_whatsapp'] ?? '·' ?></td>
          <td class="num"><?= $ev['lesson_telegram'] ?? '·' ?></td>
          <td class="num"><?= $ev['lesson_call'] ?? '·' ?></td>
          <td class="num"><?= $ev['tickets'] ?? '·' ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>

  <footer class="muted">
    Считаются просмотры страниц, а не уникальные посетители: без кук отличить одного человека от другого нельзя.
    Боты и поисковые роботы не учитываются. Поисковые запросы — в Яндекс.Вебмастере и Google Search Console.
  </footer>
</main>
</body>
</html>
