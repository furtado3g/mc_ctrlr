<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class StorageHealthCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:storage-health {--json : Retorna o status em formato JSON}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica a integridade da pasta de referência de storage, permissões e link simbólico público';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $referencePath = storage_path('app');
        $publicStoragePath = storage_path('app/public');
        $receiptsStoragePath = storage_path('app/receipts');
        $symlinkPath = public_path('storage');

        // Verify and test public disk
        $publicHealth = $this->checkDiskDirectory($publicStoragePath);

        // Verify and test receipts disk
        $receiptsHealth = $this->checkDiskDirectory($receiptsStoragePath);

        // Verify symlink
        $symlinkValid = file_exists($symlinkPath) && is_readable($symlinkPath);
        $symlinkTarget = is_link($symlinkPath) ? (string) readlink($symlinkPath) : $publicStoragePath;

        $allOk = $publicHealth['writable']
            && $publicHealth['readable']
            && $publicHealth['write_test'] === 'passed'
            && $receiptsHealth['writable']
            && $receiptsHealth['readable']
            && $receiptsHealth['write_test'] === 'passed'
            && $symlinkValid;

        $status = $allOk ? 'ok' : 'error';

        $outputData = [
            'status' => $status,
            'reference_path' => $referencePath,
            'disks' => [
                'public' => $publicHealth,
                'receipts' => $receiptsHealth,
            ],
            'symlink' => [
                'link_path' => $symlinkPath,
                'target_path' => $publicStoragePath,
                'valid' => $symlinkValid,
            ],
            'timestamp' => now()->toIso8601ZuluString(),
        ];

        if ($this->option('json')) {
            $this->output->writeln(json_encode($outputData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        } else {
            $this->info('--- Storage Health Status ---');
            $this->table(
                ['Item', 'Caminho', 'Status'],
                [
                    ['Referência Base', $referencePath, is_dir($referencePath) ? 'Presente' : 'Ausente'],
                    ['Disco Public', $publicStoragePath, $publicHealth['write_test'] === 'passed' ? 'Escrita OK' : 'Falha'],
                    ['Disco Receipts', $receiptsStoragePath, $receiptsHealth['write_test'] === 'passed' ? 'Escrita OK' : 'Falha'],
                    ['Symlink Public/Storage', $symlinkPath, $symlinkValid ? 'Válido' : 'Inválido/Quebrado'],
                ]
            );

            if ($status === 'ok') {
                $this->info('✓ Armazenamento persistente e permissões operando normalmente.');
            } else {
                $this->error('✗ Falha na integridade de armazenamento ou permissões de disco.');
            }
        }

        return $status === 'ok' ? self::SUCCESS : self::FAILURE;
    }

    /**
     * Check directory existence, read/write permissions, and perform a real write/read test.
     *
     * @return array{path: string, writable: bool, readable: bool, write_test: string}
     */
    protected function checkDiskDirectory(string $path): array
    {
        if (! File::isDirectory($path)) {
            File::makeDirectory($path, 0755, true);
        }

        $writable = is_writable($path);
        $readable = is_readable($path);
        $writeTest = 'failed';

        if ($writable) {
            $testFile = $path . DIRECTORY_SEPARATOR . '.health_check_' . uniqid() . '.tmp';
            $testContent = 'storage_health_' . time();
            try {
                if (file_put_contents($testFile, $testContent) !== false) {
                    $readBack = file_get_contents($testFile);
                    if ($readBack === $testContent) {
                        $writeTest = 'passed';
                    }
                    @unlink($testFile);
                }
            } catch (\Throwable $e) {
                $writeTest = 'failed';
            }
        }

        return [
            'path' => $path,
            'writable' => $writable,
            'readable' => $readable,
            'write_test' => $writeTest,
        ];
    }
}
