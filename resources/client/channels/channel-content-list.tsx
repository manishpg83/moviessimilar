import {InfiniteScrollSentinel} from '@common/ui/infinite-scroll/infinite-scroll-sentinel';
import React, {Fragment, ReactNode} from 'react';
import {ChannelContentProps} from '@app/channels/channel-content';
import {usePaginatedChannelContent} from '@common/channels/requests/use-paginated-channel-content';
import {ChannelHeader} from '@app/channels/channel-header/channel-header';
import {ChannelContentModel} from '@app/admin/channels/channel-content-config';
import {ChannelContentListItem} from '@app/channels/channel-content-list-item';
import {useChannelContent} from '@common/channels/requests/use-channel-content';
import clsx from 'clsx';

export function ChannelContentList(props: ChannelContentProps) {
  return (
    <Fragment>
      <ChannelHeader {...props} />
      {props.isNested || props.channel.config.contentType !== 'listAll' ? (
        <SimpleList {...props} />
      ) : (
        <PaginatedList {...props} />
      )}
    </Fragment>
  );
}

function SimpleList({channel}: ChannelContentProps) {
  const {data} = useChannelContent<ChannelContentModel>(channel);
  return <Content content={data} />;
}

function PaginatedList({channel}: ChannelContentProps) {
  const query = usePaginatedChannelContent<ChannelContentModel>(channel);
  return (
    <Content
      content={query.items}
      className={clsx('transition-opacity', query.isReloading && 'opacity-70')}
    >
      <InfiniteScrollSentinel query={query} />
    </Content>
  );
}

interface ContentProps {
  content: ChannelContentModel[] | undefined;
  children?: ReactNode;
  className?: string;
}
function Content({content = [], children, className}: ContentProps) {
  return (
    <div className={className}>
      {content.map(item => (
        <ChannelContentListItem
          key={`${item.id}-${item.model_type}`}
          item={item}
        />
      ))}
      {children}
    </div>
  );
}
