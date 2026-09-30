<?php

namespace App\Http\Requests;

use App\Models\BillingPeriod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BillingPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canAccess('cobrancas', 'edit') ?? false;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        $period = $this->route('period');
        $id = $period instanceof BillingPeriod ? $period->id : null;
        $user = $this->user();
        $regionalId = ! $user?->is_global && $user?->regional_id ? $user->regional_id : session('active_regional_id');

        return [
            'competence' => [
                'required',
                'date_format:Y-m',
                Rule::unique('billing_periods')
                    ->where(fn ($query) => $regionalId ? $query->where('regional_id', $regionalId) : $query)
                    ->ignore($id),
            ],
            'due_at' => ['required', 'date'],
            'default_amount_cents' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:open,closed'],
        ];
    }
}
