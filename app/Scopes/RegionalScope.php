<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class RegionalScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        if (! $user) {
            return;
        }

        if ($user->is_global) {
            $activeRegionalId = session('active_regional_id');
            if ($activeRegionalId !== null) {
                $builder->where($model->getTable() . '.regional_id', $activeRegionalId);
            }

            return;
        }

        if ($user->regional_id !== null) {
            $builder->where($model->getTable() . '.regional_id', $user->regional_id);
        } else {
            // User without regional and not global cannot access tenant data
            $builder->whereRaw('1 = 0');
        }
    }
}
