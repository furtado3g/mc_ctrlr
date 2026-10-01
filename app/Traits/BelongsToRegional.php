<?php

namespace App\Traits;

use App\Models\Regional;
use App\Scopes\RegionalScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

/**
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait BelongsToRegional
{
    /**
     * Boot the trait and apply the regional scope.
     */
    protected static function bootBelongsToRegional(): void
    {
        static::addGlobalScope(new RegionalScope);

        static::creating(function ($model) {
            if ($model->regional_id !== null) {
                return;
            }

            $user = Auth::user();

            if (! $user) {
                $firstRegional = Regional::first();
                if ($firstRegional) {
                    $model->regional_id = $firstRegional->id;
                }
                return;
            }

            if (! $user->is_global && $user->regional_id !== null) {
                $model->regional_id = $user->regional_id;
            } elseif ($user->is_global) {
                $model->regional_id = session('active_regional_id') ?? (Regional::first()?->id ?? 1);
            }
        });
    }

    /**
     * Retrieve the model for a bound value with cross-tenant IDOR protection.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        $record = static::withoutGlobalScope(RegionalScope::class)
            ->where($field ?? $this->getRouteKeyName(), $value)
            ->first();

        if (! $record) {
            return null;
        }

        $user = Auth::user();

        if ($user && ! $user->is_global && $record->regional_id !== $user->regional_id) {
            abort(403, 'Acesso negado: registro pertence a outra divisão regional.');
        }

        if ($user?->is_global) {
            $activeRegionalId = session('active_regional_id');
            if ($activeRegionalId !== null && (int) $record->regional_id !== (int) $activeRegionalId) {
                abort(403, 'Acesso negado: registro fora da divisão regional ativa.');
            }
        }

        return $record;
    }

    /**
     * @return BelongsTo<Regional, $this>
     */
    public function regional(): BelongsTo
    {
        return $this->belongsTo(Regional::class);
    }
}
