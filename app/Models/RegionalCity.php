<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $regional_id
 * @property string $name
 * @property string $state
 * @property bool $is_headquarters
 * @property bool $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Regional $regional
 */
#[Fillable(['regional_id', 'name', 'state', 'is_headquarters', 'active'])]
class RegionalCity extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<Regional, $this>
     */
    public function regional(): BelongsTo
    {
        return $this->belongsTo(Regional::class);
    }

    /**
     * @return HasMany<Member, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class, 'regional_city_id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_headquarters' => 'boolean',
            'active' => 'boolean',
        ];
    }
}
