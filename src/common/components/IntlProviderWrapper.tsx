import { IntlProvider } from 'react-intl';
import { useAppStore } from '../hooks';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function IntlProviderWrapper({ children }: Props) {
  const locale = useAppStore((state) => state.locale);

  return <IntlProvider locale={locale}>{children}</IntlProvider>;
}
