<?php

namespace App\Support;

use App\Services\Cache\AppCacheManagerInterface;

class InstitutionalBrand
{
    /** @return array{name: string, logo: string|null, app_layout: string, auth_layout: string} */
    public static function published(): array
    {
        $brand = app(AppCacheManagerInterface::class)->getPublishedBrand();

        return [
            'name' => $brand['name'],
            'logo' => $brand['logo'],
            'app_layout' => $brand['app_layout'],
            'auth_layout' => $brand['auth_layout'],
        ];
    }
}
