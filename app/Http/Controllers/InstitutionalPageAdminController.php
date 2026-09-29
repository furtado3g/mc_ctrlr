<?php

namespace App\Http\Controllers;

use App\Actions\PublishInstitutionalPageDraft;
use App\Actions\SaveInstitutionalPageDraft;
use App\Http\Requests\InstitutionalPageRequest;
use App\Models\InstitutionalPage;
use App\Support\InstitutionalPageDefaults;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalPageAdminController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('institucional.view');
        $page = InstitutionalPage::query()->home()->first();
        $published = ($page ? $page->published_content : null) ?? InstitutionalPageDefaults::content();
        $draft = $page?->draft_content;
        $map = function (?array $content): ?array {
            if ($content === null) {
                return null;
            }
            $content['app_layout'] = in_array($content['app_layout'] ?? null, ['sidebar', 'header'], true) ? $content['app_layout'] : 'sidebar';
            $content['auth_layout'] = in_array($content['auth_layout'] ?? null, ['simple', 'card', 'split'], true) ? $content['auth_layout'] : 'simple';
            $logoPath = $content['logo_path'] ?? null;
            $content['logo_url'] = is_string($logoPath) && Storage::disk('public')->exists($logoPath) ? Storage::disk('public')->url($logoPath) : null;
            $content['sections'] = array_map(function (array $section): array {
                $imagePath = $section['image_path'] ?? null;
                $section['image_url'] = is_string($imagePath) && Storage::disk('public')->exists($imagePath) ? Storage::disk('public')->url($imagePath) : null;

                return $section;
            }, $content['sections'] ?? []);

            return $content;
        };

        return Inertia::render('institutional-page/edit', ['published' => $map($published), 'draft' => $map($draft), 'draftSavedAt' => $page?->draft_saved_at?->toISOString(), 'draftSavedBy' => $page?->draftSaver?->name, 'publishedAt' => $page?->published_at?->toISOString(), 'publishedBy' => $page?->publisher?->name, 'canEdit' => $request->user()->canAccess('institucional', 'edit')]);
    }

    public function save(InstitutionalPageRequest $request, SaveInstitutionalPageDraft $action): RedirectResponse
    {
        $action->execute($request);

        return back()->with('success', 'Rascunho salvo. A página pública não foi alterada.');
    }

    public function publish(Request $request, PublishInstitutionalPageDraft $action): RedirectResponse
    {
        Gate::authorize('institucional.edit');
        $action->execute($request->user()->id);

        return back()->with('success', 'Página institucional publicada.');
    }
}
