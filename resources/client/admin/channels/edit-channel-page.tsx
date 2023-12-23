import {EditChannelPageLayout} from '@common/admin/channels/channel-editor/edit-channel-page-layout';
import React from 'react';
import {CrupdateChannelForm} from '@app/admin/channels/crupdate-channel-form';

export function EditChannelPage() {
  return (
    <EditChannelPageLayout>
      <CrupdateChannelForm />
    </EditChannelPageLayout>
  );
}
