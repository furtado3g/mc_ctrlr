<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleAccessGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('administracao', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return ['access_group_id' => ['nullable', 'integer', 'exists:access_groups,id']];
    }
}
