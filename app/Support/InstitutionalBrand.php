<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class InstitutionalBrand
{
    /** @return array{name: string, logo: string|null, app_layout: string, auth_layout: string} */
    public static function published(): array
    {
        return app(\App\Services\Cache\AppCacheManagerInterface::class)->getPublishedBrand();
    }
}
