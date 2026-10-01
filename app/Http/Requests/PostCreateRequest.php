<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostCreateRequest extends FormRequest
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
            'content' => ['required', 'string', 'min:1', 'max:5000'],
            'regional_id' => ['nullable', 'exists:regionals,id'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => 'O texto da publicação é obrigatório.',
            'content.max' => 'O texto não pode exceder 5.000 caracteres.',
            'images.max' => 'Não é permitido enviar mais de 10 fotos por publicação.',
            'images.*.image' => 'Cada anexo deve ser uma imagem válida.',
            'images.*.mimes' => 'As imagens devem estar nos formatos JPEG, PNG ou WebP.',
            'images.*.max' => 'Cada imagem não pode ultrapassar 5MB.',
        ];
    }
}
