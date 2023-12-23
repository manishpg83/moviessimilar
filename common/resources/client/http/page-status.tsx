import {FullPageLoader} from '@common/ui/progress/full-page-loader';
import {errorStatusIs} from '@common/utils/http/error-status-is';
import {NotFoundPage} from '@common/ui/not-found-page/not-found-page';
import {PageErrorMessage} from '@common/errors/page-error-message';
import React, {ReactNode} from 'react';
import {UseQueryResult} from '@tanstack/react-query';
import {Navigate} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';

interface Props {
  query: UseQueryResult;
  show404?: boolean;
  loaderClassName?: string;
  loaderIsScreen?: boolean;
  loader?: ReactNode;
}
export function PageStatus({
  query,
  show404 = true,
  loader,
  loaderClassName,
  loaderIsScreen = true,
}: Props) {
  const {isLoggedIn} = useAuth();

  if (query.isLoading) {
    return (
      loader || (
        <FullPageLoader className={loaderClassName} screen={loaderIsScreen} />
      )
    );
  }

  if (
    query.isError &&
    (errorStatusIs(query.error, 401) || errorStatusIs(query.error, 403)) &&
    !isLoggedIn
  ) {
    return <Navigate to="/login" replace />;
  }

  if (show404 && query.isError && errorStatusIs(query.error, 404)) {
    return <NotFoundPage />;
  }

  return <PageErrorMessage />;
}
