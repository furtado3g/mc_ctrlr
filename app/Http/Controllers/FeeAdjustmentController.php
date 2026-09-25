<?php

namespace App\Http\Controllers;

use App\Actions\AdjustFee;
use App\Models\Fee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FeeAdjustmentController extends Controller
{
    public function store(Request $request, Fee $fee, AdjustFee $adjust): RedirectResponse
    {
        Gate::authorize('cobrancas.edit');
        $data = $request->validate(['amount_cents' => 'required|integer|not_in:0', 'reason' => 'required|string|max:1000']);
        $adjust->execute($fee, (int) $data['amount_cents'], $data['reason'], $request->user()->id);

        return back();
    }
}
