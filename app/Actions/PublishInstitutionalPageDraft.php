<?php

namespace App\Actions;

use App\Models\InstitutionalPage;
use App\Support\InstitutionalPageAssets;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PublishInstitutionalPageDraft
{
    public function execute(int $userId): InstitutionalPage
    {
        $page = InstitutionalPage::query()->home()->first();
        if (! $page?->draft_content) {
            throw ValidationException::withMessages(['draft' => 'Salve um rascunho antes de publicar.']);
        }
        $oldPaths = InstitutionalPageAssets::paths($page->published_content);
        $published = DB::transaction(function () use ($page, $userId) {
            $page->update(['published_content' => $page->draft_content, 'draft_content' => null, 'published_by' => $userId, 'published_at' => now()]);

            return $page->fresh();
        });
        $newPaths = InstitutionalPageAssets::paths($published->published_content);
        foreach (array_diff($oldPaths, $newPaths) as $path) {
            Storage::disk('public')->delete($path);
        }

        return $published;
    }
}
