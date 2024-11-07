import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { HeaderAppBar } from './HeaderAppBar';

interface Props {
  main: ReactNode;
}

export function HeaderBarLayout({ main }: Props) {
  return (
    <Box minHeight={'100dvh'}>
      <HeaderAppBar />
      <Box>{main}</Box>
    </Box>
  );
}
