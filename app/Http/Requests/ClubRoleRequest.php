<?php

namespace App\Http\Requests;

use App\Models\ClubRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClubRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cadastros', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $role = $this->route('role');
        $id = $role instanceof ClubRole ? $role->id : null;

        return [
            'name' => ['required', 'string', 'max:120', Rule::unique('club_roles')->ignore($id)],
            'sort_order' => ['required', 'integer', 'min:1', Rule::unique('club_roles')->ignore($id)],
            'active' => ['required', 'boolean'],
        ];
    }
}
