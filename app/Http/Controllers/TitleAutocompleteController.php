<?php

namespace App\Http\Controllers;

use App\Models\Title;
use Common\Core\BaseController;

class TitleAutocompleteController extends BaseController
{
    public function __invoke()
    {
        $this->authorize('index', Title::class);

        $search = request('searchQuery');
        $selectedTitleId = request('selectedTitleId');
        $seasonNumber = request('seasonNumber');
        $builder = app(Title::class);

        if ($search) {
            $builder = $builder->search($search);
        }

        $results = $builder
            ->take(10)
            ->get(['id', 'name', 'poster', 'release_date']);

        if ($selectedTitleId) {
            $title = Title::withCount('seasons')->find($selectedTitleId);
            if ($title) {
                if ($seasonNumber) {
                    $title->load([
                        'season' => fn($query) => $query
                            ->where('number', $seasonNumber)
                            ->withCount('episodes'),
                    ]);
                }
                $results = $results->prepend($title);
            }
        }

        $results = $results->map(function (Title $title) {
            $normalized = $title->toNormalizedArray();
            if ($title->relationLoaded('season')) {
                $normalized['episodes_count'] =
                    $title->season->episodes_count ?? 0;
            }
            $normalized['seasons_count'] = $title->seasons_count;
            return $normalized;
        });

        return ['titles' => $results];
    }
}
