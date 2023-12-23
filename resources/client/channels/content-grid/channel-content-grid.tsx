import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import React, {Fragment} from 'react';
import {ChannelContentProps} from '@app/channels/channel-content';
import {usePaginatedChannelContent} from '@common/channels/requests/use-paginated-channel-content';
import {ChannelHeader} from '@app/channels/channel-header/channel-header';
import {
  ContentGridLayout,
  ContentGridProps,
} from '@app/channels/content-grid/content-grid-layout';
import {ChannelContentGridItem} from '@app/channels/content-grid/channel-content-grid-item';
import {ChannelContentModel} from '@app/admin/channels/channel-content-config';
import {useChannelContent} from '@common/channels/requests/use-channel-content';
import clsx from 'clsx';

interface ChannelContentGridProps extends ChannelContentProps {
  variant?: ContentGridProps['variant'];
}
export function ChannelContentGrid(props: ChannelContentGridProps) {
  return (
    <Fragment>
      <ChannelHeader {...props} />
      {props.isNested ? (
        <SimpleGrid {...props} />
      ) : (
        <PaginatedGrid {...props} />
      )}
    </Fragment>
  );
}

function PaginatedGrid({channel, variant}: ChannelContentGridProps) {
  const query = usePaginatedChannelContent<ChannelContentModel>(channel);
  return (
    <div
      className={clsx('transition-opacity', query.isReloading && 'opacity-70')}
    >
      <ContentGrid content={query.items} variant={variant} />
      <InfiniteScrollSentinel query={query} />
    </div>
  );
}

function SimpleGrid({channel, variant}: ChannelContentGridProps) {
  const {data} = useChannelContent(channel);
  return <ContentGrid content={data} variant={variant} />;
}

interface ContentProps {
  content: ChannelContentModel[] | undefined;
  variant: ContentGridProps['variant'];
}
export function ContentGrid({content = [], variant}: ContentProps) {
  return (
    <ContentGridLayout variant={variant}>
      {content.map(item => (
        <ChannelContentGridItem
          key={`${item.id}-${item.model_type}`}
          item={item}
          variant={variant}
        />
      ))}
    </ContentGridLayout>
  );
}
