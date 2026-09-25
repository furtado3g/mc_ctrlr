<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberProfileContactsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->member()->exists() ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'emergency_contact_name' => ['nullable', 'string', 'max:255', 'required_with:emergency_contact_relationship,emergency_contact_phone'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:120', 'required_with:emergency_contact_name,emergency_contact_phone'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:40', 'required_with:emergency_contact_name,emergency_contact_relationship'],
            'companion_name' => ['nullable', 'string', 'max:255', 'required_with:companion_phone'],
            'companion_phone' => ['nullable', 'string', 'max:40', 'required_with:companion_name'],
        ];
    }
}
