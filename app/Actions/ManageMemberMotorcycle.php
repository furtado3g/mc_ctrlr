<?php

namespace App\Actions;

use App\Models\Member;
use App\Models\MemberMotorcycle;
use App\Models\Motorcycle;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManageMemberMotorcycle
{
    /** @param array{identifier?: string|null, manufacturer: string, model: string, year?: int|string|null, started_at: string, ended_at?: string|null} $data */
    public function create(Member $member, array $data): MemberMotorcycle
    {
        return DB::transaction(function () use ($member, $data): MemberMotorcycle {
            $identifier = $this->normalizeIdentifier($data['identifier'] ?? null);
            $attributes = [
                'manufacturer' => $data['manufacturer'],
                'model' => $data['model'],
                'year' => $data['year'] ?? null,
            ];

            if ($identifier !== null) {
                $motorcycle = Motorcycle::query()->where('identifier', $identifier)->lockForUpdate()->first();
                if ($motorcycle) {
                    foreach ($attributes as $key => $value) {
                        if ((string) ($motorcycle->{$key} ?? '') !== (string) ($value ?? '')) {
                            throw ValidationException::withMessages(['identifier' => 'A identificação já está cadastrada com outros dados.']);
                        }
                    }
                } else {
                    $motorcycle = Motorcycle::create(['identifier' => $identifier, ...$attributes]);
                }
            } else {
                $motorcycle = Motorcycle::create($attributes);
            }

            $this->assertNoOverlap($motorcycle, $data['started_at'], $data['ended_at'] ?? null);

            return $member->motorcycleLinks()->create([
                'motorcycle_id' => $motorcycle->id,
                'started_at' => $data['started_at'],
                'ended_at' => $data['ended_at'] ?? null,
            ]);
        });
    }

    /** @param array{identifier?: string|null, manufacturer: string, model: string, year?: int|string|null, started_at: string, ended_at?: string|null} $data */
    public function update(MemberMotorcycle $link, array $data): void
    {
        DB::transaction(function () use ($link, $data): void {
            $motorcycle = Motorcycle::query()->whereKey($link->motorcycle_id)->lockForUpdate()->firstOrFail();
            $this->assertNoOverlap($motorcycle, $data['started_at'], $data['ended_at'] ?? null, $link->id);

            $motorcycle->update([
                'identifier' => $this->normalizeIdentifier($data['identifier'] ?? null),
                'manufacturer' => $data['manufacturer'],
                'model' => $data['model'],
                'year' => $data['year'] ?? null,
            ]);
            $link->update(['started_at' => $data['started_at'], 'ended_at' => $data['ended_at'] ?? null]);
        });
    }

    public function end(MemberMotorcycle $link): void
    {
        abort_if($link->ended_at !== null, 404);
        $link->update(['ended_at' => today()]);
    }

    private function assertNoOverlap(Motorcycle $motorcycle, string $startedAt, ?string $endedAt, ?int $exceptLinkId = null): void
    {
        $overlap = $motorcycle->memberLinks()
            ->when($exceptLinkId, fn ($query) => $query->whereKeyNot($exceptLinkId))
            ->where('started_at', '<=', $endedAt ?? '9999-12-31')
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhere('ended_at', '>=', $startedAt))
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages(['started_at' => 'A moto já possui vínculo nesse período.']);
        }
    }

    private function normalizeIdentifier(?string $identifier): ?string
    {
        $identifier = strtoupper(trim((string) $identifier));

        return $identifier === '' ? null : $identifier;
    }
}
