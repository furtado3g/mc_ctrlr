<?php

namespace App\Http\Requests;

use App\Models\MemberMotorcycle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberProfileMotorcycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $member = $this->user()?->member;
        if (! $member) {
            return false;
        }

        $link = $this->route('link');
        if ($link instanceof MemberMotorcycle) {
            return $link->member_id === $member->id && $link->ended_at === null;
        }

        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'identifier' => is_string($this->input('identifier')) ? strtoupper(trim($this->input('identifier'))) : $this->input('identifier'),
        ]);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $link = $this->route('link');
        $identifierRules = ['nullable', 'string', 'max:32'];
        if ($link instanceof MemberMotorcycle) {
            $identifierRules[] = Rule::unique('motorcycles', 'identifier')->ignore($link->motorcycle_id);
        }

        return [
            'identifier' => $identifierRules,
            'manufacturer' => ['required', 'string', 'max:120'],
            'model' => ['required', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'between:1900,2100'],
            'started_at' => ['required', 'date', 'before_or_equal:today'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
        ];
    }

    /** @return array{identifier?: string|null, manufacturer: string, model: string, year?: int|string|null, started_at: string, ended_at?: string|null} */
    public function motorcycleData(): array
    {
        $data = $this->validated();
        $year = $data['year'] ?? null;

        return [
            'identifier' => is_string($data['identifier'] ?? null) ? $data['identifier'] : null,
            'manufacturer' => (string) $data['manufacturer'],
            'model' => (string) $data['model'],
            'year' => is_int($year) || is_string($year) ? $year : null,
            'started_at' => (string) $data['started_at'],
            'ended_at' => is_string($data['ended_at'] ?? null) ? $data['ended_at'] : null,
        ];
    }
}
