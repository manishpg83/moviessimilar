import {useSettings} from '@common/core/settings/use-settings';
import {useMemo} from 'react';
import {TitlePageSections} from '@app/titles/pages/title-page/sections/title-page-sections';

export function useConfiguredTitlePageSections() {
  const {title_page} = useSettings();
  return useMemo(() => {
    return title_page?.sections ? JSON.parse(title_page.sections) : [];
  }, [title_page?.sections]) as (typeof TitlePageSections)[number][];
}
