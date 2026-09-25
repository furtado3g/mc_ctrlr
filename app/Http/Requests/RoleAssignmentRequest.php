<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cadastros', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'club_role_id' => ['required', 'exists:club_roles,id'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
        ];
    }
}
