<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AvatarUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && (bool) $this->user()->active;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'avatar.required' => 'O arquivo da foto de perfil é obrigatório.',
            'avatar.image' => 'O arquivo enviado deve ser uma imagem.',
            'avatar.mimes' => 'A foto de perfil deve ser do formato JPEG, PNG ou WebP.',
            'avatar.max' => 'A foto de perfil não pode ser maior que 5MB.',
        ];
    }
}
