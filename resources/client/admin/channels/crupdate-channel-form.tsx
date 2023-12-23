import React, {Fragment} from 'react';
import {ChannelEditorTabs} from '@common/admin/channels/channel-editor/channel-editor-tabs';
import {ChannelNameField} from '@common/admin/channels/channel-editor/controls/channel-name-field';
import {ContentTypeField} from '@common/admin/channels/channel-editor/controls/content-type-field';
import {ContentModelField} from '@common/admin/channels/channel-editor/controls/content-model-field';
import {ChannelContentEditor} from '@common/admin/channels/channel-editor/channel-content-editor';
import {
  ChannelContentSearchField,
  ChannelContentSearchFieldProps,
} from '@common/admin/channels/channel-editor/channel-content-search-field';
import {ChannelContentItemImage} from '@app/admin/channels/channel-content-item-image';
import {ContentAutoUpdateField} from '@common/admin/channels/channel-editor/controls/content-auto-update-field';
import {ContentOrderField} from '@common/admin/channels/channel-editor/controls/content-order-field';
import {ContentLayoutFields} from '@common/admin/channels/channel-editor/controls/content-layout-fields';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {useSettings} from '@common/core/settings/use-settings';
import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {channelContentConfig} from '@app/admin/channels/channel-content-config';
import {FormTextField} from '@common/ui/forms/input-field/text-field/text-field';
import {FormSwitch} from '@common/ui/forms/toggle/switch';
import {ChannelRestrictionField} from '@app/admin/channels/channel-restriction-field';

export function CrupdateChannelForm() {
  return (
    <Fragment>
      <ChannelEditorTabs>
        <ChannelNameField />
        <FormTextField
          name="description"
          label={<Trans message="Description" />}
          inputElementType="textarea"
          rows={2}
          className="my-24"
        />
        <ContentTypeField config={channelContentConfig} />
        <AutoUpdateField />
        <ContentModelField config={channelContentConfig} className="my-24" />
        <ChannelRestrictionField />
        <ContentOrderField config={channelContentConfig} />
        <ContentLayoutFields config={channelContentConfig} />
        <FormSwitch
          className="mb-24"
          name="config.hideTitle"
          description={
            <Trans message="Whether title should be shown when displaying this channel on the site." />
          }
        >
          <Trans message="Hide title" />
        </FormSwitch>
      </ChannelEditorTabs>
      <ChannelContentEditor searchField={<SearchField />} />
    </Fragment>
  );
}

function SearchField(props: ChannelContentSearchFieldProps) {
  return (
    <ChannelContentSearchField
      {...props}
      imgRenderer={item => <ChannelContentItemImage item={item} />}
    />
  );
}

function AutoUpdateField() {
  const {tmdb_is_setup} = useSettings();
  const {watch} = useFormContext<UpdateChannelPayload>();
  const methodConfig =
    channelContentConfig.autoUpdateMethods[watch('config.autoUpdateMethod')!];
  return (
    <ContentAutoUpdateField config={channelContentConfig}>
      {!methodConfig?.localOnly && !methodConfig?.tmdbOnly && tmdb_is_setup && (
        <FormSelect
          selectionMode="single"
          className="mt-24 flex-auto md:mt-0"
          name="config.autoUpdateProvider"
          label={<Trans message="Fetch content from" />}
          required
        >
          <Option value="tmdb">
            <Trans message="TheMovieDB" />
          </Option>
          <Option value="local">
            <Trans message="Local database" />
          </Option>
        </FormSelect>
      )}
    </ContentAutoUpdateField>
  );
}
