<?php

namespace App\Http\Controllers;

use App\Actions\ManageCashMovement;
use App\Models\CashMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CashMovementController extends Controller
{
    public function store(Request $request, ManageCashMovement $action): RedirectResponse
    {
        Gate::authorize('caixa.edit');
        $data = $request->validate([
            'type' => 'required|in:in,out', 'amount_cents' => 'required|integer|min:1',
            'occurred_at' => 'required|date', 'category' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
        ]);
        $action->create($data, $request->user()->id);

        return back();
    }

    public function correct(Request $request, CashMovement $movement, ManageCashMovement $action): RedirectResponse
    {
        Gate::authorize('caixa.edit');
        $data = $request->validate([
            'type' => 'required|in:in,out', 'amount_cents' => 'required|integer|min:1',
            'occurred_at' => 'required|date', 'category' => 'required|string|max:100',
            'description' => 'required|string|max:2000', 'reason' => 'required|string|max:1000',
        ]);
        $reason = $data['reason'];
        unset($data['reason']);
        $action->change($movement, $data, $reason, $request->user()->id);

        return back();
    }

    public function reverse(Request $request, CashMovement $movement, ManageCashMovement $action): RedirectResponse
    {
        Gate::authorize('caixa.edit');
        $data = $request->validate(['reason' => 'required|string|max:1000']);
        $action->change($movement, [], $data['reason'], $request->user()->id, true);

        return back();
    }
}
