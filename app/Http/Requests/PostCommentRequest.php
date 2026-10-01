<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostCommentRequest extends FormRequest
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
            'content' => ['required', 'string', 'min:1', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => 'O comentário não pode ficar em branco.',
            'content.max' => 'O comentário não pode exceder 1.000 caracteres.',
        ];
    }
}
