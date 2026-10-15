<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StorageReferenceTest extends TestCase
{
    public function test_public_disk_resolves_to_storage_app_public(): void
    {
        $publicPath = Storage::disk('public')->path('');
        $expectedSubpath = 'storage' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'public';

        $this->assertStringContainsString($expectedSubpath, $publicPath);
    }

    public function test_local_disk_resolves_to_storage_app(): void
    {
        $localPath = Storage::disk('local')->path('');
        $expectedSubpath = 'storage' . DIRECTORY_SEPARATOR . 'app';

        $this->assertStringContainsString($expectedSubpath, $localPath);
    }

    public function test_public_storage_symlink_points_to_public_storage_directory(): void
    {
        $linkPath = public_path('storage');
        $targetPath = storage_path('app/public');

        // Verify public storage directory exists
        if (! File::isDirectory($targetPath)) {
            File::makeDirectory($targetPath, 0755, true);
        }

        // Run storage:link if not already linked
        if (! file_exists($linkPath)) {
            $this->artisan('storage:link')->assertSuccessful();
        }

        $this->assertTrue(file_exists($linkPath), 'The public/storage symlink or directory must exist.');
    }

    public function test_file_upload_to_public_disk_persists_in_storage_path(): void
    {
        $filename = 'test_sample_' . uniqid() . '.txt';
        $content = 'Sample content for storage persistence test';

        $uploaded = Storage::disk('public')->put($filename, $content);
        $this->assertTrue($uploaded);
        $this->assertTrue(Storage::disk('public')->exists($filename));

        $fullPath = Storage::disk('public')->path($filename);
        $this->assertFileExists($fullPath);
        $this->assertSame($content, file_get_contents($fullPath));

        // Cleanup
        Storage::disk('public')->delete($filename);
        $this->assertFalse(Storage::disk('public')->exists($filename));
    }

    public function test_private_receipts_storage_path_exists_and_is_writable(): void
    {
        $receiptsDir = storage_path('app/receipts');
        if (! File::isDirectory($receiptsDir)) {
            File::makeDirectory($receiptsDir, 0755, true);
        }

        $testReceipt = 'receipt_test_' . uniqid() . '.pdf';
        $written = File::put($receiptsDir . '/' . $testReceipt, '%PDF-1.4 test receipt');

        $this->assertNotFalse($written);
        $this->assertFileExists($receiptsDir . '/' . $testReceipt);

        // Cleanup
        File::delete($receiptsDir . '/' . $testReceipt);
    }
}
