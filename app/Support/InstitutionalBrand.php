<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class InstitutionalBrand
{
    /** @return array{name: string, logo: string|null} */
    public static function published(): array
    {
        $content = InstitutionalPageDefaults::publishedContent();
        $logoPath = $content['logo_path'] ?? null;

        return [
            'name' => (string) ($content['name'] ?? config('app.name', 'Laravel')),
            'logo' => is_string($logoPath) && Storage::disk('public')->exists($logoPath) ? Storage::disk('public')->url($logoPath) : null,
        ];
    }
}
