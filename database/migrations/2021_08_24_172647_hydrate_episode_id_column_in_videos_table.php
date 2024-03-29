<?php

use App\Models\Episode;
use App\Models\Video;
use Illuminate\Database\Migrations\Migration;

class HydrateEpisodeIdColumnInVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $videos = Video::whereNotNull('season_num')
            ->whereNotNull('episode_num')
            ->whereNull('episode_id')
            ->lazyById(100)
            ->each(function (Video $video) {
                $episode = Episode::where('episode_number', $video->episode_num)
                    ->where('season_number', $video->season_num)
                    ->where('title_id', $video->title_id)
                    ->first();

                if ($episode) {
                    $video->episode_id = $episode->id;
                    $video->save();
                }
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
