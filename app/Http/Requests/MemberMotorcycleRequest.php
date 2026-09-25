<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberMotorcycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cadastros', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'identifier' => ['nullable', 'string', 'max:32'],
            'manufacturer' => ['required', 'string', 'max:120'],
            'model' => ['required', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'between:1900,2100'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
        ];
    }
}
