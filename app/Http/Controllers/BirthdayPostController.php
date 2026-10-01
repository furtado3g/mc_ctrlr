<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Regional;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BirthdayPostController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();
        $currentMonth = (int) $request->input('month', $today->month);
        $period = $request->input('period', 'month');
        $regionalId = $request->input('regional_id');
        $search = $request->input('search');
        $selectedMemberId = $request->input('member_id');

        $query = Member::query()
            ->whereNotNull('birth_date')
            ->where('status', 'active')
            ->with(['user.profile', 'regional']);

        if ($regionalId) {
            $query->where('regional_id', $regionalId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('user.profile', function ($pq) use ($search) {
                        $pq->where('road_nickname', 'like', "%{$search}%");
                    });
            });
        }

        $allMembers = $query->get();

        $formatted = $allMembers->map(function (Member $member) use ($today) {
            /** @var Carbon $birthDate */
            $birthDate = $member->birth_date;
            $thisYearBday = Carbon::create($today->year, $birthDate->month, $birthDate->day)->startOfDay();

            if ($thisYearBday->isPast() && ! $thisYearBday->isToday()) {
                $nextBday = Carbon::create($today->year + 1, $birthDate->month, $birthDate->day)->startOfDay();
                $turningAge = ($today->year + 1) - $birthDate->year;
            } else {
                $nextBday = $thisYearBday;
                $turningAge = $today->year - $birthDate->year;
            }

            $isToday = $birthDate->format('m-d') === $today->format('m-d');
            $daysUntil = $isToday ? 0 : (int) $today->diffInDays($nextBday, false);

            $targetUser = $member->user;

            return [
                'id' => $member->id,
                'name' => $member->name,
                'road_nickname' => $targetUser?->road_nickname,
                'avatar_url' => $targetUser?->avatar,
                'regional_name' => $member->regional?->name,
                'regional_id' => $member->regional_id,
                'birth_date' => $birthDate->format('Y-m-d'),
                'birth_day_month' => $birthDate->translatedFormat('d \d\e F'),
                'day' => (int) $birthDate->day,
                'month' => (int) $birthDate->month,
                'is_today' => $isToday,
                'days_until' => $daysUntil,
                'turning_age' => $turningAge > 0 ? $turningAge : null,
            ];
        });

        // Compute overall counters before period filtering
        $todayCount = $formatted->where('is_today', true)->count();
        $weekCount = $formatted->filter(fn ($m) => $m['days_until'] >= 0 && $m['days_until'] <= 7)->count();
        $monthCount = $formatted->filter(fn ($m) => $m['month'] === $currentMonth)->count();

        // Apply period filter
        $filtered = match ($period) {
            'today' => $formatted->filter(fn ($m) => $m['is_today'])->sortBy('name'),
            'week' => $formatted->filter(fn ($m) => $m['days_until'] >= 0 && $m['days_until'] <= 7)->sortBy('days_until'),
            default => $formatted->filter(fn ($m) => $m['month'] === $currentMonth)->sortBy('day'),
        };

        $selectedMember = null;
        if ($selectedMemberId) {
            $selectedMember = $formatted->firstWhere('id', (int) $selectedMemberId);
            if (! $selectedMember) {
                $target = Member::with(['user.profile', 'regional'])->find($selectedMemberId);
                if ($target && $target->birth_date) {
                    $bDate = $target->birth_date;
                    $selectedMember = [
                        'id' => $target->id,
                        'name' => $target->name,
                        'road_nickname' => $target->user?->road_nickname,
                        'avatar_url' => $target->user?->avatar,
                        'regional_name' => $target->regional?->name,
                        'regional_id' => $target->regional_id,
                        'birth_date' => $bDate->format('Y-m-d'),
                        'birth_day_month' => $bDate->translatedFormat('d \d\e F'),
                        'day' => (int) $bDate->day,
                        'month' => (int) $bDate->month,
                        'is_today' => $bDate->format('m-d') === $today->format('m-d'),
                        'days_until' => 0,
                        'turning_age' => $today->year - $bDate->year,
                    ];
                }
            }
        }

        $regionais = Regional::orderBy('name')->get(['id', 'name']);

        return Inertia::render('birthdays/index', [
            'birthdays' => $filtered->values()->all(),
            'today_count' => $todayCount,
            'week_count' => $weekCount,
            'month_count' => $monthCount,
            'filters' => [
                'period' => $period,
                'month' => $currentMonth,
                'regional_id' => $regionalId ? (int) $regionalId : null,
                'search' => $search,
            ],
            'regionais' => $regionais,
            'selectedMember' => $selectedMember,
        ]);
    }

    public function searchMembers(Request $request): JsonResponse
    {
        $q = trim((string) $request->input('q', ''));
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $today = Carbon::today();

        $members = Member::query()
            ->where('status', 'active')
            ->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhereHas('user.profile', function ($pq) use ($q) {
                        $pq->where('road_nickname', 'like', "%{$q}%");
                    });
            })
            ->with(['user.profile', 'regional'])
            ->limit(15)
            ->get();

        $results = $members->map(function (Member $m) use ($today) {
            $bDate = $m->birth_date;
            $turningAge = null;
            $daysUntil = 0;
            $isToday = false;

            if ($bDate) {
                $thisYearBday = Carbon::create($today->year, $bDate->month, $bDate->day)->startOfDay();
                if ($thisYearBday->isPast() && ! $thisYearBday->isToday()) {
                    $nextBday = Carbon::create($today->year + 1, $bDate->month, $bDate->day)->startOfDay();
                    $turningAge = ($today->year + 1) - $bDate->year;
                } else {
                    $nextBday = $thisYearBday;
                    $turningAge = $today->year - $bDate->year;
                }
                $isToday = $bDate->format('m-d') === $today->format('m-d');
                $daysUntil = $isToday ? 0 : (int) $today->diffInDays($nextBday, false);
            }

            return [
                'id' => $m->id,
                'name' => $m->name,
                'road_nickname' => $m->user?->road_nickname,
                'avatar_url' => $m->user?->avatar,
                'regional_name' => $m->regional?->name,
                'birth_date' => $bDate?->format('Y-m-d'),
                'birth_day_month' => $bDate?->translatedFormat('d \d\e F') ?? 'Não cadastrada',
                'day' => $bDate ? (int) $bDate->day : 0,
                'month' => $bDate ? (int) $bDate->month : 0,
                'is_today' => $isToday,
                'days_until' => $daysUntil,
                'turning_age' => $turningAge,
            ];
        });

        return response()->json($results);
    }
}
