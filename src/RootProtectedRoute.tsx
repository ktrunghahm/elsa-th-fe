import { LinearProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useFetchUserInfo } from './authen/services/authen';
import { HeaderBarLayout } from './common/components/HeaderBarLayout';
import { useAppStore } from './common/hooks';
import { AuthenticationState } from './common/types';
import styled from '@emotion/styled';

export function RootProtectedRoute() {
  const authenticationState = useAppStore((state) => state.authentication);
  useFetchUserInfo();

  if (authenticationState === AuthenticationState.pending) {
    return (
      <MainContainer>
        <LinearProgress />
      </MainContainer>
    );
  }

  if (authenticationState === AuthenticationState.yes) {
    return (
      <MainContainer>
        <HeaderBarLayout main={<Outlet />} />
      </MainContainer>
    );
  }

  return <Navigate to="/login" />;
}

const MainContainer = styled.div`
  min-width: 1024px;
`;
