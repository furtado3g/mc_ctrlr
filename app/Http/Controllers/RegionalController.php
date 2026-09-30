<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditEvent;
use App\Http\Requests\RegionalRequest;
use App\Models\Regional;
use App\Models\RegionalCity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegionalController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_global) {
            abort(403, 'Acesso restrito à administração global.');
        }

        Gate::authorize('administracao.view');

        $query = Regional::query()
            ->with(['cities' => fn ($q) => $q->orderByDesc('is_headquarters')->orderBy('name')])
            ->withCount(['members', 'cities']);

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%")
                    ->orWhere('city', 'ilike', "%{$search}%")
                    ->orWhereHas('cities', function ($cq) use ($search) {
                        $cq->where('name', 'ilike', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('active', true);
            } elseif ($status === 'inactive') {
                $query->where('active', false);
            }
        }

        $regionals = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('admin/regionals/index', [
            'regionals' => $regionals,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
            'canManage' => $user->canAccess('administracao', 'edit'),
        ]);
    }

    public function store(RegionalRequest $request, RecordAuditEvent $audit): RedirectResponse
    {
        $data = $request->validated();
        $citiesData = $data['cities'];

        $headquarters = collect($citiesData)->firstWhere('is_headquarters', true);
        $sedeCity = $headquarters['name'] ?? '';
        $sedeState = $headquarters['state'] ?? '';

        $regional = DB::transaction(function () use ($data, $citiesData, $sedeCity, $sedeState) {
            $regional = Regional::create([
                'name' => $data['name'],
                'code' => $data['code'],
                'city' => $sedeCity,
                'state' => $sedeState,
                'active' => true,
            ]);

            foreach ($citiesData as $city) {
                RegionalCity::create([
                    'regional_id' => $regional->id,
                    'name' => $city['name'],
                    'state' => strtoupper($city['state']),
                    'is_headquarters' => (bool) ($city['is_headquarters'] ?? false),
                    'active' => true,
                ]);
            }

            return $regional;
        });

        $regional->load('cities');

        $audit->execute(
            'regional',
            $regional->id,
            'regional_created',
            null,
            [
                'name' => $regional->name,
                'code' => $regional->code,
                'city' => $regional->city,
                'state' => $regional->state,
                'cities' => $regional->cities->toArray(),
            ],
            $request->user()->id
        );

        return redirect()->route('admin.regionals.index')->with('success', 'Regional criada com sucesso.');
    }

    public function update(RegionalRequest $request, Regional $regional, RecordAuditEvent $audit): RedirectResponse
    {
        $before = [
            'name' => $regional->name,
            'code' => $regional->code,
            'city' => $regional->city,
            'state' => $regional->state,
            'active' => $regional->active,
            'cities' => $regional->cities()->get()->toArray(),
        ];

        $data = $request->validated();
        $citiesData = $data['cities'];

        $headquarters = collect($citiesData)->firstWhere('is_headquarters', true);
        $sedeCity = $headquarters['name'] ?? '';
        $sedeState = $headquarters['state'] ?? '';

        DB::transaction(function () use ($regional, $data, $citiesData, $sedeCity, $sedeState) {
            $regional->update([
                'name' => $data['name'],
                'code' => $data['code'],
                'city' => $sedeCity,
                'state' => $sedeState,
            ]);

            $existingCities = $regional->cities()->get()->keyBy('id');
            $submittedCityIds = collect($citiesData)->pluck('id')->filter()->all();

            // Check if removed cities have members
            foreach ($existingCities as $cityId => $cityModel) {
                if (! in_array($cityId, $submittedCityIds, true)) {
                    if ($cityModel->members()->exists()) {
                        throw ValidationException::withMessages([
                            'cities' => "A cidade {$cityModel->name}/{$cityModel->state} não pode ser removida pois possui membros vinculados.",
                        ]);
                    }
                    $cityModel->delete();
                }
            }

            // Sync submitted cities
            foreach ($citiesData as $city) {
                if (! empty($city['id']) && $existingCities->has($city['id'])) {
                    $existingCities[$city['id']]->update([
                        'name' => $city['name'],
                        'state' => strtoupper($city['state']),
                        'is_headquarters' => (bool) ($city['is_headquarters'] ?? false),
                    ]);
                } else {
                    RegionalCity::create([
                        'regional_id' => $regional->id,
                        'name' => $city['name'],
                        'state' => strtoupper($city['state']),
                        'is_headquarters' => (bool) ($city['is_headquarters'] ?? false),
                        'active' => true,
                    ]);
                }
            }
        });

        $regional->refresh()->load('cities');

        $audit->execute(
            'regional',
            $regional->id,
            'regional_updated',
            $before,
            [
                'name' => $regional->name,
                'code' => $regional->code,
                'city' => $regional->city,
                'state' => $regional->state,
                'active' => $regional->active,
                'cities' => $regional->cities->toArray(),
            ],
            $request->user()->id
        );

        return redirect()->route('admin.regionals.index')->with('success', 'Regional atualizada com sucesso.');
    }

    public function toggleStatus(Request $request, Regional $regional, RecordAuditEvent $audit): RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->is_global) {
            abort(403, 'Acesso restrito à administração global.');
        }

        Gate::authorize('administracao.edit');

        if ($regional->id === 1 && $regional->active) {
            return back()->withErrors(['error' => 'A regional Matriz não pode ser desativada.']);
        }

        $before = ['active' => $regional->active];
        $regional->active = ! $regional->active;
        $regional->save();

        $audit->execute(
            'regional',
            $regional->id,
            'regional_activated',
            $before,
            ['active' => $regional->active],
            $user->id
        );

        return redirect()->route('admin.regionals.index')->with('success', 'Status da regional atualizado.');
    }
}
