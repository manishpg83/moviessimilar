import React from 'react';
import {CreateChannelPageLayout} from '@common/admin/channels/channel-editor/create-channel-page-layout';
import {MOVIE_MODEL} from '@app/titles/models/title';
import {CrupdateChannelForm} from '@app/admin/channels/crupdate-channel-form';

export function CreateChannelPage() {
  return (
    <CreateChannelPageLayout
      defaultValues={{
        contentModel: MOVIE_MODEL,
        autoUpdateProvider: 'local',
        layout: 'grid',
        nestedLayout: 'carousel',
      }}
    >
      <CrupdateChannelForm />
    </CreateChannelPageLayout>
  );
}
