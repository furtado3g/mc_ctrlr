<?php

namespace App\Http\Requests;

use App\Models\AccessGroup;
use App\Support\AccessPermissionCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AccessGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('administracao', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $group = $this->route('group');

        return [
            'name' => ['required', 'string', 'max:120', Rule::unique('access_groups', 'name')->ignore($group instanceof AccessGroup ? $group->id : null)],
            'active' => ['required', 'boolean'],
            'permissions' => ['present', 'array'],
            'permissions.*.area' => ['required', 'string', Rule::in([...AccessPermissionCatalog::AREAS, 'membros'])],
            'permissions.*.action' => ['required', 'string', Rule::in([...AccessPermissionCatalog::ACTIONS, 'edit_joined_at'])],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $permissions = $this->input('permissions', []);
            if (! is_array($permissions)) {
                return;
            }

            foreach ($permissions as $index => $permission) {
                if (! is_array($permission)
                    || ! is_string($permission['area'] ?? null)
                    || ! is_string($permission['action'] ?? null)
                    || ! AccessPermissionCatalog::allows($permission['area'], $permission['action'])) {
                    $validator->errors()->add("permissions.{$index}.action", 'A combinação de área e ação não é permitida.');
                }
            }
        });
    }
}
