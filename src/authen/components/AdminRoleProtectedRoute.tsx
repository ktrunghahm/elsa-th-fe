import { Box, Button, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useAppStore } from '../../common/hooks';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
          <Typography color="warning">
            <FormattedMessage defaultMessage={"You don't have permission to access this page"} />
          </Typography>
          <Box marginY={2}>
            <Button variant="contained" onClick={() => navigate('/', { replace: true })}>
              <FormattedMessage defaultMessage={'Go back'} />
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return children;
}
