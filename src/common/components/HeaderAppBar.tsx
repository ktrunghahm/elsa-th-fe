import { LoadingButton } from '@mui/lab';
import { AppBar, Skeleton, Toolbar, Typography } from '@mui/material';
import { useFetchUserInfo, useLogout } from '../../authen/services/authen';

export function HeaderAppBar() {
  const { mutateAsync, isPending } = useLogout();
  const { data } = useFetchUserInfo();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography flex={1}>
          {data ? `Welcome: ${data.user.email}` : <Skeleton variant="text" component={'span'} />}
        </Typography>
        <LoadingButton color="inherit" variant="outlined" loading={isPending} onClick={() => mutateAsync()}>
          <Typography>Logout</Typography>
        </LoadingButton>
      </Toolbar>
    </AppBar>
  );
}
