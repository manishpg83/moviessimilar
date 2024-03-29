<?php

namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class TruncateTitleData extends Command
{
    protected $signature = 'titles:truncate';

    protected $description = 'Truncate all title related database tables.';

    public function handle()
    {
        if ($this->confirm('Are you sure?')) {
            DB::table('creditables')->truncate();
            DB::table('episodes')->truncate();
            DB::table('images')->truncate();
            DB::table('channelables')->truncate();
            DB::table('people')->truncate();
            DB::table('reviews')->truncate();
            DB::table('seasons')->truncate();
            DB::table('taggables')->truncate();
            DB::table('tags')->truncate();
            DB::table('titles')->truncate();
            DB::table('videos')->truncate();
            DB::table('video_captions')->truncate();
            DB::table('video_reports')->truncate();
            DB::table('keywords')->truncate();
            DB::table('keyword_title')->truncate();
            DB::table('genres')->truncate();
            DB::table('genre_title')->truncate();
        }
    }
}
