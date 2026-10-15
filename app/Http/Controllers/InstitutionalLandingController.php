<?php

namespace App\Http\Controllers;

use App\Services\Cache\AppCacheManagerInterface;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalLandingController extends Controller
{
    public function __invoke(AppCacheManagerInterface $cache): Response
    {
        $content = $cache->getPublishedLandingContent();
        $brand = $cache->getPublishedBrand();

        return Inertia::render('landing/index', ['content' => $content, ...$brand]);
    }
}
