<?php

namespace App\Console\Commands;

use App\Services\Cache\AppCacheManagerInterface;
use Illuminate\Console\Command;

class CacheHealthCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cache-health {--json : Retorna o status em formato JSON}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica e reporta a integridade, conectividade, latência e fallback do cache Redis';

    /**
     * Execute the console command.
     */
    public function handle(AppCacheManagerInterface $cacheManager): int
    {
        $health = $cacheManager->checkHealth();

        $outputData = [
            'status' => $health['status'] ?? 'error',
            'driver' => $health['driver'] ?? 'failover',
            'connected' => (bool) ($health['connected'] ?? false),
            'latency_ms' => (float) ($health['latency_ms'] ?? 0.0),
            'write_read_test' => $health['write_read_test'] ?? 'failed',
            'ttl_test' => $health['ttl_test'] ?? 'failed',
            'fallback_store' => $health['fallback_store'] ?? 'database',
            'timestamp' => $health['timestamp'] ?? now()->toIso8601ZuluString(),
        ];

        if ($this->option('json')) {
            $this->output->writeln(json_encode($outputData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            $this->info('--- Cache Health Status ---');
            $this->table(
                ['Métrica / Teste', 'Valor'],
                [
                    ['Status Geral', strtoupper($outputData['status'])],
                    ['Driver Principal', $outputData['driver']],
                    ['Conectado', $outputData['connected'] ? 'Sim' : 'Não'],
                    ['Latência (ms)', $outputData['latency_ms'] . ' ms'],
                    ['Teste Leitura/Escrita', $outputData['write_read_test']],
                    ['Teste de TTL', $outputData['ttl_test']],
                    ['Fallback Store', $outputData['fallback_store']],
                    ['Detalhes', $health['details'] ?? ''],
                    ['Timestamp', $outputData['timestamp']],
                ]
            );

            if ($outputData['status'] === 'ok') {
                $this->info('✓ Cache Redis operacional com alta performance.');
            } elseif ($outputData['status'] === 'degraded') {
                $this->warn('⚠ Cache operando em modo degradado via fallback.');
            } else {
                $this->error('✗ Falha crítica no subsistema de cache.');
            }
        }

        return $outputData['status'] === 'ok' ? self::SUCCESS : self::FAILURE;
    }
}
