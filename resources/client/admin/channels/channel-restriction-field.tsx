import {Trans} from '@common/i18n/trans';
import {Item} from '@common/ui/forms/listbox/item';
import {FormSelect} from '@common/ui/forms/select/select';
import React, {useState} from 'react';
import {GENRE_MODEL} from '@app/titles/models/genre';
import {KEYWORD_MODEL} from '@app/titles/models/keyword';
import {PRODUCTION_COUNTRY_MODEL} from '@app/titles/models/production-country';
import {useValueLists} from '@common/http/value-lists';
import {message} from '@common/i18n/message';
import {useTrans} from '@common/i18n/use-trans';
import {useFormContext} from 'react-hook-form';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import {MOVIE_MODEL, SERIES_MODEL, TITLE_MODEL} from '@app/titles/models/title';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';

const supportedModels = [TITLE_MODEL, MOVIE_MODEL, SERIES_MODEL];

const restrictions = {
  [GENRE_MODEL]: message('Genre'),
  [KEYWORD_MODEL]: message('Keyword'),
  [PRODUCTION_COUNTRY_MODEL]: message('Production country'),
};

export function ChannelRestrictionField() {
  const {setValue} = useFormContext<UpdateChannelPayload>();
  const {watch} = useFormContext<UpdateChannelPayload>();

  if (!supportedModels.includes(watch('config.contentModel'))) {
    return null;
  }

  return (
    <div className="my-24 items-end gap-14 md:flex">
      <FormSelect
        className="w-full flex-auto"
        name="config.restriction"
        selectionMode="multiple" // changed to multiple
        label={<Trans message="Filter titles by" />}
        labelSuffix={<InfoTrigger />}
        onSelectionChange={() => {
          setValue('config.restrictionModelId', 'urlParam');
        }}
      >
        <Item value={null}>
          <Trans message="Don't filter titles" />
        </Item>
        {Object.entries(restrictions).map(([value, label]) => (
          <Item key={value} value={value}>
            <Trans {...label} />
          </Item>
        ))}
      </FormSelect>
      <RestrictionModelField />
    </div>
  );
}

function RestrictionModelField() {
  const {trans} = useTrans();
  const [searchValue, setSearchValue] = useState('');
  const {watch} = useFormContext<UpdateChannelPayload>();
  const {data} = useValueLists(['genres', 'productionCountries'], {
    type: watch('config.autoUpdateProvider'),
  });

  const selectedRestriction = watch(
    'config.restriction'
  ) as keyof typeof restrictions;
  const selectedKeywordId = watch('config.restrictionModelId');
  const keywordQuery = useValueLists(['keywords'], {
    searchQuery: searchValue,
    selectedValue: selectedKeywordId,
    type: watch('config.autoUpdateProvider'),
  });

  if (!selectedRestriction) return null;

  const options = {
    [GENRE_MODEL]: data?.genres,
    [KEYWORD_MODEL]: keywordQuery.data?.keywords,
    [PRODUCTION_COUNTRY_MODEL]: data?.productionCountries,
  };
  const restrictionLabel = restrictions[selectedRestriction];

  // allow setting keyword to custom value, because there are too many keywords
  // to put into autocomplete, ideally it would use async search from backend though

  return (
    <FormSelect
      className="w-full flex-auto"
      name="config.restrictionModelId"
      selectionMode="single"
      showSearchField
      searchPlaceholder={trans(message('Search...'))}
      isAsync={selectedRestriction === KEYWORD_MODEL}
      isLoading={
        selectedRestriction === KEYWORD_MODEL && keywordQuery.isLoading
      }
      inputValue={searchValue}
      onInputValueChange={setSearchValue}
      label={
        <Trans
          message=":restriction name"
          values={{restriction: trans(restrictionLabel)}}
        />
      }
    >
      <Item value="urlParam">
        <Trans message="Dynamic (from url)" />
      </Item>
      {options[selectedRestriction]?.map(option => (
        <Item key={option.value} value={option.value}>
          <Trans message={option.name} />
        </Item>
      ))}
    </FormSelect>
  );
}

function InfoTrigger() {
  return (
    <InfoDialogTrigger
      title={<Trans message="Content filtering" />}
      body={
        <Trans message="Allows specifying additional condition channel content should be filtered on. If 'Dynamic (from url)' is selected, filter from url will be used. For example, a single channel configured to filter by dynamic genre would show action titles at 'site.com/genre/action', comedies at 'site.com/genre/comedy' and so on, for any genre." />
      }
    />
  );
}
