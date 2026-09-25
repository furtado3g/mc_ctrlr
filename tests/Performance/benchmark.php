<?php

require dirname(__DIR__, 2).'/vendor/autoload.php';

use App\Actions\GenerateFees;
use App\Models\BillingPeriod;
use App\Models\Member;
use App\Models\User;
use App\Reports\CashLedger;
use App\Reports\FiscalReport;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

$app = require dirname(__DIR__, 2).'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

DB::beginTransaction();

try {
    $user = User::create(['name' => 'Benchmark', 'email' => 'benchmark-'.uniqid().'@example.test', 'password' => 'benchmark', 'active' => true]);
    $period = BillingPeriod::create(['competence' => '2099-01', 'due_at' => '2099-01-31', 'default_amount_cents' => 5000, 'status' => 'open']);
    $now = now();
    $members = [];
    for ($i = 0; $i < 500; $i++) {
        $members[] = ['name' => 'Benchmark '.$i, 'joined_at' => '2099-01-01', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now];
    }
    Member::insert($members);

    $start = microtime(true);
    $first = app(GenerateFees::class)->execute($period, $user->id);
    $generationSeconds = round(microtime(true) - $start, 3);
    $second = app(GenerateFees::class)->execute($period, $user->id);

    $members = [];
    for ($i = 0; $i < 10000; $i++) {
        $members[] = ['name' => 'Search Benchmark '.$i, 'joined_at' => '2099-01-01', 'status' => $i % 2 ? 'left' : 'active', 'created_at' => $now, 'updated_at' => $now];
        if (count($members) === 500) {
            DB::table('members')->insert($members);
            $members = [];
        }
    }

    $queryRuns = [
        'search' => fn () => DB::table('members')->where('name', 'like', '%Benchmark 99%')->count(),
        'filter' => fn () => DB::table('members')->where('status', 'active')->count(),
        'sort_page' => fn () => DB::table('members')->where('status', 'active')->orderBy('name')->orderBy('id')->offset(300)->limit(30)->get(),
    ];
    $queryP95Ms = [];
    foreach ($queryRuns as $name => $run) {
        $samples = [];
        for ($i = 0; $i < 30; $i++) {
            $startedAt = microtime(true);
            $run();
            $samples[] = (microtime(true) - $startedAt) * 1000;
        }
        sort($samples);
        $queryP95Ms[$name] = round($samples[(int) ceil(count($samples) * 0.95) - 1], 2);
    }

    $movements = [];
    for ($i = 0; $i < 10000; $i++) {
        $movements[] = ['type' => $i % 2 ? 'out' : 'in', 'amount_cents' => 100,
            'occurred_at' => '2099-01-15', 'category' => 'benchmark', 'description' => 'Movimento '.$i,
            'source' => 'manual', 'status' => 'active', 'created_by' => $user->id,
            'created_at' => $now, 'updated_at' => $now];
        if (count($movements) === 500) {
            DB::table('cash_movements')->insert($movements);
            $movements = [];
        }
    }

    $start = microtime(true);
    $totals = app(CashLedger::class)->totals('2099-01-01', '2099-01-31');
    $ledgerSeconds = round(microtime(true) - $start, 3);
    $start = microtime(true);
    $rows = app(FiscalReport::class)->rows('2099-01-01', '2099-01-31');
    $reportSeconds = round(microtime(true) - $start, 3);

    echo json_encode(compact('first', 'second', 'generationSeconds', 'ledgerSeconds', 'reportSeconds', 'queryP95Ms', 'totals'), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE).PHP_EOL;
    echo 'reportRows='.count($rows).PHP_EOL;

    if ($first['created'] !== 500 || $second['created'] !== 0 || count($rows) !== 10000 || $generationSeconds > 120 || max($ledgerSeconds, $reportSeconds) > 5 || max($queryP95Ms) > 3000) {
        exit(1);
    }
} finally {
    DB::rollBack();
}
