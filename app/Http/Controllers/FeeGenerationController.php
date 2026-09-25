<?php

namespace App\Http\Controllers;

use App\Actions\GenerateFees;
use App\Models\BillingPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FeeGenerationController extends Controller
{
    public function store(Request $request, BillingPeriod $period, GenerateFees $generator): RedirectResponse
    {
        Gate::authorize('cobrancas.edit');

        return back()->with('generation', $generator->execute($period, $request->user()->id));
    }
}
