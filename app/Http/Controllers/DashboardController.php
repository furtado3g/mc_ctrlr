<?php

namespace App\Http\Controllers;

use App\Models\CashMovement;
use App\Models\Fee;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('dashboard', [
            'members_active' => $user->canAccess('cadastros', 'view') ? Member::where('status', 'active')->count() : null,
            'fees_open' => $user->canAccess('cobrancas', 'view') ? Fee::whereRaw('issued_amount_cents + adjustment_cents > (SELECT COALESCE(SUM(amount_cents), 0) FROM payments WHERE payments.fee_id = fees.id AND payments.status = ?)', ['confirmed'])->count() : null,
            'cash_balance_cents' => $user->canAccess('caixa', 'view') ? CashMovement::where('status', 'active')->selectRaw("COALESCE(SUM(CASE WHEN type = 'in' THEN amount_cents ELSE -amount_cents END), 0) AS total")->value('total') : null,
        ]);
    }
}
