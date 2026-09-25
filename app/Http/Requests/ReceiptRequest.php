<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('caixa', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return ['receipt' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240']];
    }
}
