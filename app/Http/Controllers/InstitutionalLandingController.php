<?php

namespace App\Http\Controllers;

use App\Support\InstitutionalBrand;
use App\Support\InstitutionalPageDefaults;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalLandingController extends Controller
{
    public function __invoke(): Response
    {
        $content = InstitutionalPageDefaults::publishedContent();
        $sections = array_values(array_filter($content['sections'] ?? [], fn (array $section): bool => (bool) ($section['enabled'] ?? false)));
        usort($sections, fn (array $a, array $b): int => ($a['position'] ?? 0) <=> ($b['position'] ?? 0));
        $content['sections'] = array_map(function (array $section) {
            $imagePath = $section['image_path'] ?? null;
            $section['image_url'] = is_string($imagePath) && Storage::disk('public')->exists($imagePath) ? Storage::disk('public')->url($imagePath) : null;

            return $section;
        }, $sections);

        return Inertia::render('landing/index', ['content' => $content, ...InstitutionalBrand::published()]);
    }
}
