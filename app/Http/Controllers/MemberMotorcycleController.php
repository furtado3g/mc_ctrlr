<?php

namespace App\Http\Controllers;

use App\Actions\ManageMemberMotorcycle;
use App\Http\Requests\MemberMotorcycleRequest;
use App\Models\Member;
use App\Models\MemberMotorcycle;
use Illuminate\Http\RedirectResponse;

class MemberMotorcycleController extends Controller
{
    public function store(MemberMotorcycleRequest $request, Member $member, ManageMemberMotorcycle $motorcycles): RedirectResponse
    {
        $motorcycles->create($member, $request->motorcycleData());

        return back();
    }

    public function update(MemberMotorcycleRequest $request, MemberMotorcycle $link, ManageMemberMotorcycle $motorcycles): RedirectResponse
    {
        $motorcycles->update($link, $request->motorcycleData());

        return back();
    }
}
