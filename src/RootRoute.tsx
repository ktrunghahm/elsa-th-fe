import { LoadingButton } from '@mui/lab';
import { Box, colors, LinearProgress, Typography } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useFetchUserInfo, useLogout } from './authen/services/authen';

export function RootRoute() {
  const { data: userData, isLoading } = useFetchUserInfo();
  const { mutateAsync, isPending } = useLogout();

  if (isLoading) {
    return (
      <Box>
        <LinearProgress />
      </Box>
    );
  }

  if (userData) {
    return (
      <Box padding={0} margin={0}>
        <Box
          display={'flex'}
          justifyContent={'right'}
          component={'header'}
          alignItems={'center'}
          gap={2}
          bgcolor={colors.common.white}
        >
          <Typography variant="body2">{userData.user.email}</Typography>
          <LoadingButton loading={isPending} variant="outlined" onClick={() => mutateAsync()}>
            Logout
          </LoadingButton>
        </Box>
        <Outlet />
      </Box>
    );
  }

  return <Navigate to="/login" />;
}
