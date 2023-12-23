<?php

namespace App\Policies;

use App\Models\Channel;
use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Illuminate\Support\Collection;

class ChannelPolicy extends BasePolicy
{
    public function index(
        ?User $user,
        int $userId = null,
        string $channelType = null,
    ) {
        if ($userId && $user->id === $userId) {
            return true;
        }

        if ($channelType === 'list' && $this->hasPermission($user, 'lists.view')) {
            return true;
        }

        return $this->hasPermission($user, 'channels.update');
    }

    public function show(?User $user, Channel $channel)
    {
        if ($channel->user_id && $channel->user_id === $user->id) {
            return true;
        }

        if ($channel->type === 'channel') {
            return $this->hasPermission($user, 'titles.view');
        } else {
            return $this->hasPermission($user, 'lists.view') ||
                $channel->public;
        }
    }

    public function store(User $user, string $channelType = null)
    {
        if ($channelType === 'list') {
            return $this->hasPermission($user, 'lists.create');
        }
        return $this->hasPermission($user, 'channels.create');
    }

    public function update(User $user, Channel $channel)
    {
        if ($channel->user_id && $channel->user_id === $user->id) {
            return true;
        }

        if ($channel->type === 'list') {
            return $this->hasPermission($user, 'lists.update');
        }

        return $this->hasPermission($user, 'channels.update');
    }

    public function destroy(User $user, Collection $channels = null)
    {
        $type = $channels?->first()['type'] ?? 'channel';

        if ($type === 'list' && $this->hasPermission($user, 'lists.delete')) {
            return true;
        }

        if (
            $type === 'channel' &&
            $this->hasPermission($user, 'channels.delete')
        ) {
            return true;
        }

        return collect($channels)->every(
            fn(Channel $list) => $list->user_id === $user->id,
        );
    }
}
