<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberMotorcycleRequest;
use App\Models\Member;
use App\Models\MemberMotorcycle;
use App\Models\Motorcycle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MemberMotorcycleController extends Controller
{
    public function store(MemberMotorcycleRequest $request, Member $member): RedirectResponse
    {
        $data = $request->validated();
        $identifier = isset($data['identifier']) ? strtoupper(trim($data['identifier'])) : null;
        DB::transaction(function () use ($data, $identifier, $member) {
            $motorcycle = $identifier ? Motorcycle::firstOrCreate(['identifier' => $identifier], [
                'manufacturer' => $data['manufacturer'], 'model' => $data['model'], 'year' => $data['year'] ?? null,
            ]) : Motorcycle::create([
                'manufacturer' => $data['manufacturer'], 'model' => $data['model'], 'year' => $data['year'] ?? null,
            ]);
            $overlap = $motorcycle->memberLinks()
                ->where('started_at', '<=', $data['ended_at'] ?? '9999-12-31')
                ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>=', $data['started_at']))
                ->exists();
            if ($overlap) {
                throw ValidationException::withMessages(['started_at' => 'A moto já possui vínculo nesse período.']);
            }
            $member->motorcycleLinks()->create([
                'motorcycle_id' => $motorcycle->id,
                'started_at' => $data['started_at'], 'ended_at' => $data['ended_at'] ?? null,
            ]);
        });

        return back();
    }

    public function update(MemberMotorcycleRequest $request, MemberMotorcycle $link): RedirectResponse
    {
        $data = $request->validated();
        $overlap = MemberMotorcycle::where('motorcycle_id', $link->motorcycle_id)
            ->whereKeyNot($link->id)
            ->where('started_at', '<=', $data['ended_at'] ?? '9999-12-31')
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>=', $data['started_at']))
            ->exists();
        if ($overlap) {
            throw ValidationException::withMessages(['started_at' => 'A moto já possui vínculo nesse período.']);
        }
        $link->motorcycle->update([
            'identifier' => isset($data['identifier']) ? strtoupper(trim($data['identifier'])) : null,
            'manufacturer' => $data['manufacturer'], 'model' => $data['model'], 'year' => $data['year'] ?? null,
        ]);
        $link->update(['started_at' => $data['started_at'], 'ended_at' => $data['ended_at'] ?? null]);

        return back();
    }
}
