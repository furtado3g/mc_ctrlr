<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

class InfraHealthCommandsTest extends TestCase
{
    public function test_cache_health_command_runs_successfully(): void
    {
        $this->artisan('app:cache-health')
            ->assertExitCode(0);
    }

    public function test_cache_health_command_json_output_structure(): void
    {
        $this->artisan('app:cache-health', ['--json' => true])
            ->assertExitCode(0);

        $output = $this->app['artisan']->output();
        $data = json_decode($output, true);

        $this->assertIsArray($data, 'Output must be valid JSON');
        $this->assertArrayHasKey('status', $data);
        $this->assertArrayHasKey('driver', $data);
        $this->assertArrayHasKey('connected', $data);
        $this->assertArrayHasKey('latency_ms', $data);
        $this->assertArrayHasKey('write_read_test', $data);
        $this->assertArrayHasKey('ttl_test', $data);
        $this->assertArrayHasKey('fallback_store', $data);
        $this->assertArrayHasKey('timestamp', $data);
    }

    public function test_storage_health_command_runs_successfully(): void
    {
        // Ensure storage directory and symlink are present
        $targetPath = storage_path('app/public');
        if (! File::isDirectory($targetPath)) {
            File::makeDirectory($targetPath, 0755, true);
        }
        $receiptsPath = storage_path('app/receipts');
        if (! File::isDirectory($receiptsPath)) {
            File::makeDirectory($receiptsPath, 0755, true);
        }
        $linkPath = public_path('storage');
        if (! file_exists($linkPath)) {
            $this->artisan('storage:link')->assertSuccessful();
        }

        $this->artisan('app:storage-health')
            ->assertExitCode(0);
    }

    public function test_storage_health_command_json_output_structure(): void
    {
        // Ensure storage directory and symlink are present
        $targetPath = storage_path('app/public');
        if (! File::isDirectory($targetPath)) {
            File::makeDirectory($targetPath, 0755, true);
        }
        $receiptsPath = storage_path('app/receipts');
        if (! File::isDirectory($receiptsPath)) {
            File::makeDirectory($receiptsPath, 0755, true);
        }
        $linkPath = public_path('storage');
        if (! file_exists($linkPath)) {
            $this->artisan('storage:link')->assertSuccessful();
        }

        $this->artisan('app:storage-health', ['--json' => true])
            ->assertExitCode(0);

        $output = $this->app['artisan']->output();
        $data = json_decode($output, true);

        $this->assertIsArray($data, 'Output must be valid JSON');
        $this->assertSame('ok', $data['status']);
        $this->assertArrayHasKey('reference_path', $data);
        $this->assertArrayHasKey('disks', $data);
        $this->assertArrayHasKey('public', $data['disks']);
        $this->assertArrayHasKey('receipts', $data['disks']);
        $this->assertTrue($data['disks']['public']['writable']);
        $this->assertTrue($data['disks']['public']['readable']);
        $this->assertSame('passed', $data['disks']['public']['write_test']);
        $this->assertArrayHasKey('symlink', $data);
        $this->assertTrue($data['symlink']['valid']);
        $this->assertArrayHasKey('timestamp', $data);
    }
}
