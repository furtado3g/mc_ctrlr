<?php

namespace App\Http\Requests;

use App\Rules\ValidCpf;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->member()->exists() ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => is_string($this->input('cpf')) ? preg_replace('/\D+/', '', $this->input('cpf')) : $this->input('cpf'),
            'postal_code' => is_string($this->input('postal_code')) ? preg_replace('/\D+/', '', $this->input('postal_code')) : $this->input('postal_code'),
        ]);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $memberId = $this->user()?->member_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'cpf' => ['required', 'string', 'size:11', new ValidCpf, Rule::unique('members', 'cpf')->ignore($memberId)],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'phone' => ['required', 'string', 'max:40'],
            'postal_code' => ['required', 'string', 'size:8'],
            'address_line' => ['required', 'string', 'max:255'],
            'address_number' => ['required', 'string', 'max:50'],
            'address_complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:120'],
            'city' => ['required', 'string', 'max:120'],
            'state' => ['required', 'string', 'size:2', Rule::in(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'])],
        ];
    }
}
