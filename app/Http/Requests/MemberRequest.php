<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cadastros', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'joined_at' => ['required', 'date'],
            'status' => ['required', 'in:active,left'],
            'left_at' => ['nullable', 'date', 'after_or_equal:joined_at'],
        ];
    }
}
