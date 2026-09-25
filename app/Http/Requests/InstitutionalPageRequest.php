<?php

namespace App\Http\Requests;

use App\Models\InstitutionalPage;
use App\Support\InstitutionalPageAssets;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class InstitutionalPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('institucional', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120', 'not_regex:/^\s*$/u'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'logo_path' => ['nullable', 'string', 'max:255'],
            'remove_logo' => ['nullable', 'boolean'],
            'sections' => ['required', 'array', 'max:4'],
            'sections.*.key' => ['required', 'string', 'in:hero,about,activities,contact', 'distinct'],
            'sections.*.title' => ['nullable', 'string', 'max:160'],
            'sections.*.body' => ['nullable', 'string', 'max:5000'],
            'sections.*.image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'sections.*.image_path' => ['nullable', 'string', 'max:255'],
            'sections.*.remove_image' => ['nullable', 'boolean'],
            'sections.*.cta_label' => ['nullable', 'string', 'max:80'],
            'sections.*.cta_url' => ['nullable', 'string', 'max:2048'],
            'sections.*.enabled' => ['required', 'boolean'],
            'sections.*.position' => ['required', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $sections = $this->input('sections', []);
            if (! is_array($sections)) {
                return;
            }
            $positions = [];
            $page = InstitutionalPage::query()->home()->first();
            $allowedPaths = array_values(array_unique([
                ...InstitutionalPageAssets::paths($page?->draft_content),
                ...InstitutionalPageAssets::paths($page?->published_content),
            ]));
            foreach ($sections as $index => $section) {
                if (! is_array($section)) {
                    continue;
                }
                $key = $section['key'] ?? null;
                if (is_string($key) && ! in_array($key, ['hero', 'about', 'activities', 'contact'], true)) {
                    $validator->errors()->add("sections.$index.key", 'Seção desconhecida.');
                }
                foreach (['title', 'body', 'cta_label'] as $textField) {
                    if (is_string($section[$textField] ?? null) && preg_match('/<\s*\/?\s*[a-z][^>]*>/i', $section[$textField])) {
                        $validator->errors()->add("sections.$index.$textField", 'Informe texto simples, sem marcação HTML.');
                    }
                }
                if (! empty($section['enabled']) && (trim((string) ($section['title'] ?? '')) === '' || trim((string) ($section['body'] ?? '')) === '')) {
                    $validator->errors()->add("sections.$index.title", 'Seções ativas precisam de título e conteúdo.');
                }
                if ((bool) ($section['cta_label'] ?? null) !== (bool) ($section['cta_url'] ?? null)) {
                    $validator->errors()->add("sections.$index.cta_url", 'Informe rótulo e endereço da chamada.');
                }
                $url = $section['cta_url'] ?? '';
                if ($url !== '' && ! (str_starts_with($url, '/') && ! str_starts_with($url, '//')) && ! (is_string($url) && preg_match('#^https://#i', $url))) {
                    $validator->errors()->add("sections.$index.cta_url", 'Use um caminho local ou endereço HTTPS.');
                }
                $position = $section['position'] ?? null;
                if (is_numeric($position)) {
                    if (in_array((int) $position, $positions, true)) {
                        $validator->errors()->add("sections.$index.position", 'A posição deve ser única.');
                    }
                    $positions[] = (int) $position;
                }
                foreach (['image_path'] as $pathKey) {
                    if (! empty($section[$pathKey]) && ! in_array($section[$pathKey], $allowedPaths, true)) {
                        $validator->errors()->add("sections.$index.$pathKey", 'A imagem não pertence ao conteúdo atual.');
                    }
                }
            }
            $logoPath = $this->input('logo_path');
            if ($logoPath && ! in_array($logoPath, $allowedPaths, true)) {
                $validator->errors()->add('logo_path', 'A imagem não pertence ao conteúdo atual.');
            }
        });
    }
}
