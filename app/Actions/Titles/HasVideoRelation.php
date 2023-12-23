<?php

namespace App\Actions\Titles;

use App\Models\Episode;
use App\Models\Video;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasVideoRelation
{
    public function videos(): HasMany
    {
        return $this->hasMany(Video::class)->applySelectedSort();
    }

    public function primaryVideo(): HasOne
    {
        $preferFull = settings('streaming.prefer_full');
        return $this->hasOne(Video::class)
            ->when($preferFull, function ($query) {
                $query->where('category', 'full');
            })
            ->select([
                'id',
                'title_id',
                'name',
                'category',
                'episode_id',
                'season_num',
                'episode_num',
            ])
            ->when(
                fn() => static::class !== Episode::class && $preferFull,
                fn($builder) => $builder
                    ->where(
                        fn($builder) => $builder
                            ->whereNull('season_num')
                            ->whereNull('episode_num'),
                    )
                    ->orWhere(
                        fn($builder) => $builder
                            ->where('season_num', 1)
                            ->where('episode_num', 1),
                    ),
            )
            ->applySelectedSort();
    }
}
