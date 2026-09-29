<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class InstitutionalBrand
{
    /** @return array{name: string, logo: string|null, app_layout: string, auth_layout: string} */
    public static function published(): array
    {
        $content = InstitutionalPageDefaults::publishedContent();
        $logoPath = $content['logo_path'] ?? null;

        return [
            'name' => (string) ($content['name'] ?? config('app.name', 'Laravel')),
            'logo' => is_string($logoPath) && Storage::disk('public')->exists($logoPath) ? Storage::disk('public')->url($logoPath) : null,
            'app_layout' => in_array($content['app_layout'] ?? null, ['sidebar', 'header'], true) ? $content['app_layout'] : 'sidebar',
            'auth_layout' => in_array($content['auth_layout'] ?? null, ['simple', 'card', 'split'], true) ? $content['auth_layout'] : 'simple',
        ];
    }
}
