<?php

namespace App\Http\Controllers;

use Common\Core\BaseController;
use Illuminate\Support\Facades\Auth;

class UserWatchlistController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function __invoke()
    {
        $list = Auth::user()
            ->watchlist()
            ->firstOrFail();
        
        $list->loadContent([
            'paginate' => 'simple',
        ]);

        $items = $list->content
            ->map(
                fn($item) => [
                    'id' => $item->id,
                    'type' => $item->model_type,
                ],
            )
            ->groupBy('type')
            ->map(
                fn($group) => $group->mapWithKeys(
                    fn($item) => [
                        $item['id'] => true,
                    ],
                ),
            );

        return $this->success(['watchlist' => [
            'id' => $list->id,
            'items' => $items,
        ]]);
    }
}
