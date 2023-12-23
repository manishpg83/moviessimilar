<?php namespace App\Services;

use App\Models\Channel;
use App\Models\Episode;
use App\Models\NewsArticle;
use App\Models\Person;
use App\Models\Season;
use App\Models\Title;
use Common\Admin\Sitemap\BaseSitemapGenerator;
use Common\Core\Contracts\AppUrlGenerator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SitemapGenerator extends BaseSitemapGenerator
{
    protected function getAppQueries(): array
    {
        return [
            app(Title::class)
                ->where(function (Builder $query) {
                    $query->where('fully_synced', true)->orWhereNull('tmdb_id');
                })
                ->whereNotNull('name')
                ->select(['id', 'name']),
            app(Person::class)
                ->where('fully_synced', true)
                ->orWhereNull('tmdb_id')
                ->select(['id', 'name']),
            app(Episode::class)
                ->whereHas('title')
                ->with(['title' => fn($q) => $q->compact()])
                ->select([
                    'id',
                    'name',
                    'title_id',
                    'season_number',
                    'episode_number',
                ]),
            app(Season::class)
                ->whereHas('title')
                ->with(['title' => fn($q) => $q->compact()])
                ->select(['id', 'title_id', 'number']),
            Channel::where('public', true)
                ->where('internal', false)
                ->select(['id', 'name', 'slug']),
            app(NewsArticle::class)->select(['id', 'title', 'slug']),
        ];
    }

    protected function getAppStaticUrls(): array
    {
        return ['browse?type=series', 'browse?type=movie', 'people', 'news'];
    }

    protected function addTitleLine(
        string $url,
        string $updatedAt,
        string $name,
    ) {
        $this->addNewLine($url, $updatedAt, $name);
        $this->addNewLine("$url/full-credits", $updatedAt, $name);
    }

    protected function getModelUrl(Model $model): string
    {
        if ($model instanceof Season) {
            return app(AppUrlGenerator::class)->season($model, $model->title);
        }
        if ($model instanceof Episode) {
            return app(AppUrlGenerator::class)->episode($model, $model->title);
        }
        return parent::getModelUrl($model);
    }
}
