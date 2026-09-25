<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberProfileContactsRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MemberProfileContactsController extends Controller
{
    public function update(MemberProfileContactsRequest $request): RedirectResponse
    {
        $request->user()->member->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contatos atualizados.']);

        return back();
    }
}
