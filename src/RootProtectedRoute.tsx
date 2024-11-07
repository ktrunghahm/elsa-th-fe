import { LinearProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useFetchUserInfo } from './authen/services/authen';
import { HeaderBarLayout } from './common/components/HeaderBarLayout';
import { useAppStore } from './common/hooks';
import { AuthenticationState } from './common/types';

export function RootProtectedRoute() {
  const authenticationState = useAppStore((state) => state.authentication);
  useFetchUserInfo();

  if (authenticationState === AuthenticationState.pending) {
    return <LinearProgress />;
  }

  if (authenticationState === AuthenticationState.yes) {
    return <HeaderBarLayout main={<Outlet />} />;
  }

  return <Navigate to="/login" />;
}
