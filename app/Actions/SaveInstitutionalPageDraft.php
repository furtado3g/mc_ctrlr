<?php

namespace App\Actions;

use App\Http\Requests\InstitutionalPageRequest;
use App\Models\InstitutionalPage;
use App\Support\InstitutionalPageAssets;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SaveInstitutionalPageDraft
{
    public function execute(InstitutionalPageRequest $request): InstitutionalPage
    {
        $page = InstitutionalPage::query()->home()->first();
        $oldDraftPaths = InstitutionalPageAssets::paths($page?->draft_content);
        $data = $request->validated();
        $snapshot = ['name' => trim($data['name']), 'logo_path' => ! empty($data['remove_logo']) ? null : ($data['logo_path'] ?? $page?->draft_content['logo_path'] ?? $page?->published_content['logo_path'] ?? null), 'sections' => []];
        $uploaded = [];
        try {
            if ($request->file('logo')) {
                $snapshot['logo_path'] = $request->file('logo')->store('institutional', 'public');
            }
            foreach ($data['sections'] as $index => $section) {
                $existingDraftSection = collect($page?->draft_content['sections'] ?? [])->firstWhere('key', $section['key']);
                $existingPublishedSection = collect($page?->published_content['sections'] ?? [])->firstWhere('key', $section['key']);
                $imagePath = ! empty($section['remove_image']) ? null : ($section['image_path'] ?? $existingDraftSection['image_path'] ?? $existingPublishedSection['image_path'] ?? null);
                if ($request->file("sections.$index.image")) {
                    $imagePath = $request->file("sections.$index.image")->store('institutional', 'public');
                }
                $snapshot['sections'][] = ['key' => $section['key'], 'title' => trim((string) ($section['title'] ?? '')), 'body' => trim((string) ($section['body'] ?? '')), 'image_path' => $imagePath, 'cta_label' => $section['cta_label'] ?? null, 'cta_url' => $section['cta_url'] ?? null, 'enabled' => (bool) $section['enabled'], 'position' => (int) $section['position']];
            }
            foreach (InstitutionalPageAssets::paths($snapshot) as $path) {
                if ($path && ! in_array($path, $oldDraftPaths, true)) {
                    $uploaded[] = $path;
                }
            }
            $saved = DB::transaction(function () use ($page, $snapshot, $request) {
                $page ??= new InstitutionalPage(['key' => 'home']);
                $page->fill(['draft_content' => $snapshot, 'draft_saved_by' => $request->user()->id, 'draft_saved_at' => now()])->save();

                return $page;
            });
            $publishedPaths = InstitutionalPageAssets::paths($saved->published_content);
            $draftPaths = InstitutionalPageAssets::paths($snapshot);
            foreach (array_diff($oldDraftPaths, $publishedPaths, $draftPaths) as $path) {
                Storage::disk('public')->delete($path);
            }

            return $saved;
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($uploaded);
            throw $exception;
        }
    }
}
