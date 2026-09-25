<?php

namespace App\Http\Controllers;

use App\Actions\ManageMemberMotorcycle;
use App\Http\Requests\MemberProfileMotorcycleRequest;
use App\Models\MemberMotorcycle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MemberProfileMotorcycleController extends Controller
{
    public function store(MemberProfileMotorcycleRequest $request, ManageMemberMotorcycle $motorcycles): RedirectResponse
    {
        $motorcycles->create($request->user()->member, $request->motorcycleData());

        return back();
    }

    public function update(MemberProfileMotorcycleRequest $request, MemberMotorcycle $link, ManageMemberMotorcycle $motorcycles): RedirectResponse
    {
        abort_unless($link->member_id === $request->user()->member_id && $link->ended_at === null, 404);
        $motorcycles->update($link, $request->motorcycleData());

        return back();
    }

    public function destroy(Request $request, MemberMotorcycle $link, ManageMemberMotorcycle $motorcycles): RedirectResponse
    {
        abort_unless($request->user()?->member_id === $link->member_id && $link->ended_at === null, 404);
        $motorcycles->end($link);

        return back();
    }
}
