<?php

namespace App\Http\Requests;

use App\Models\Member;
use App\Rules\ValidCpf;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cadastros', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $member = $this->route('member');
        $memberId = $member instanceof Member ? $member->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'joined_at' => ['required', 'date'],
            'status' => ['required', 'in:active,left'],
            'left_at' => ['nullable', 'date', 'after_or_equal:joined_at'],
            'cpf' => ['nullable', 'string', 'size:11', new ValidCpf, Rule::unique('members', 'cpf')->ignore($memberId)],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'postal_code' => ['nullable', 'string', 'size:8'],
            'address_line' => ['nullable', 'string', 'max:255'],
            'address_number' => ['nullable', 'string', 'max:50'],
            'address_complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'size:2', Rule::in(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'])],
            'emergency_contact_name' => ['nullable', 'string', 'max:255', 'required_with:emergency_contact_relationship,emergency_contact_phone'],
            'emergency_contact_relationship' => ['nullable', 'string', 'max:120', 'required_with:emergency_contact_name,emergency_contact_phone'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:40', 'required_with:emergency_contact_name,emergency_contact_relationship'],
            'companion_name' => ['nullable', 'string', 'max:255', 'required_with:companion_phone'],
            'companion_phone' => ['nullable', 'string', 'max:40', 'required_with:companion_name'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => is_string($this->input('cpf')) ? preg_replace('/\D+/', '', $this->input('cpf')) : $this->input('cpf'),
            'postal_code' => is_string($this->input('postal_code')) ? preg_replace('/\D+/', '', $this->input('postal_code')) : $this->input('postal_code'),
        ]);
    }
}
