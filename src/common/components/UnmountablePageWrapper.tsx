import { Fragment, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export function UnmountablePageWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();

  return <Fragment key={`${location.pathname}?${location.search}`}>{children}</Fragment>;
}
