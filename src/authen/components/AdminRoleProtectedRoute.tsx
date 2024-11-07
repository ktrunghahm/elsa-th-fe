import { Box, Button, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useAppStore } from '../../common/hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

export function AdminRoleProtectedRoute({ children }: Props) {
  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();

  if (user?.role !== 'admin') {
    return (
      <Container>
        <Box textAlign={'center'} marginY={4}>
          <Typography color="warning">You don't have permission to access this page</Typography>
          <Box marginY={2}>
            <Button variant="contained" onClick={() => navigate('/', { replace: true })}>
              Go back
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return children;
}
