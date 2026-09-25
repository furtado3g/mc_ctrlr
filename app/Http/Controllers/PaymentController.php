<?php

namespace App\Http\Controllers;

use App\Actions\RecordPayment;
use App\Actions\ReversePayment;
use App\Models\Fee;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    public function store(Request $request, Fee $fee, RecordPayment $action): RedirectResponse
    {
        Gate::authorize('cobrancas.edit');
        Gate::authorize('caixa.edit');
        $data = $request->validate([
            'amount_cents' => 'required|integer|min:1', 'paid_at' => 'required|date',
            'method' => 'required|string|max:32', 'reference' => 'nullable|string|max:255',
        ]);
        $action->execute($fee, $data, $request->user()->id);

        return back();
    }

    public function reverse(Request $request, Payment $payment, ReversePayment $action): RedirectResponse
    {
        Gate::authorize('cobrancas.edit');
        Gate::authorize('caixa.edit');
        $data = $request->validate(['reason' => 'required|string|max:1000']);
        $action->execute($payment, $data['reason'], $request->user()->id);

        return back();
    }
}
