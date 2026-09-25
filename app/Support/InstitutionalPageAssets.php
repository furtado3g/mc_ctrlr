<?php

namespace App\Support;

class InstitutionalPageAssets
{
    /**
     * @param  array<string, mixed>|null  $content
     * @return list<string>
     */
    public static function paths(?array $content): array
    {
        if ($content === null) {
            return [];
        }

        $paths = [];
        if (is_string($content['logo_path'] ?? null)) {
            $paths[] = $content['logo_path'];
        }
        foreach (($content['sections'] ?? []) as $section) {
            if (is_array($section) && is_string($section['image_path'] ?? null)) {
                $paths[] = $section['image_path'];
            }
        }

        return array_values(array_unique($paths));
    }
}
