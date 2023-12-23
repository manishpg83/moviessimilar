<?php

use App\Models\Channel;
use App\Models\Person;
use App\Models\Title;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('lists')
            ->whereNull('auto_update')
            ->lazyById(100)
            ->each(function ($list) {
                $channel = Channel::create([
                    'name' => $list->name,
                    'description' => $list->description,
                    'user_id' => $list->user_id,
                    'type' => 'list',
                    'public' => $list->public,
                    'internal' => $list->system,
                    'created_at' => $list->created_at,
                    'updated_at' => $list->updated_at,
                    'config' => json_encode([
                        'contentType' => 'manual',
                        'contentOrder' => 'channelables.order:asc',
                        'contentModel' => 'title',
                        'layout' => 'grid',
                        'preventDeletion' => $list?->system ?? false,
                    ]),
                ]);

                $listables = DB::table('listables')
                    ->where('list_id', $list->id)
                    ->where(
                        // skip episodes
                        fn($q) => $q
                            ->where('listable_type', Title::class)
                            ->orWhere('listable_type', Person::class),
                    )
                    ->get();

                DB::table('channelables')->insert(
                    $listables
                        ->map(
                            fn($listable) => [
                                'channel_id' => $channel->id,
                                'channelable_id' => $listable->listable_id,
                                'channelable_type' => $listable->listable_type,
                                'order' => $listable->order,
                                'created_at' => $listable->created_at,
                            ],
                        )
                        ->toArray(),
                );
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
};
