import { Box, colors, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { RouterLinkWithConfirm } from '../../common/components/RouterLinkWithConfirm';
import { useJoinQuiz, useListQuizzes } from '../services/quiz';

export function ListQuizzesPage() {
  const { data: availableQuizzes, isLoading } = useListQuizzes();

  const { mutateAsync, isPending: isJoining } = useJoinQuiz();

  const columns = useMemo(
    (): GridColDef[] => [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 200,
        renderCell(params) {
          const joinedAt = params.row.quizTakings[0]?.createdAt;
          return (
            <Box>
              <RouterLinkWithConfirm
                to={`/quiz/${params.row.id}`}
                requiresConfirm={!joinedAt}
                confirmTitle="Confirm to join"
                confirmDescription={`Are you sure you want to join quiz: ${params.value}`}
                action={async () => {
                  await mutateAsync(params.row.id);
                }}
              >
                <Typography component={'span'}>{params.value}</Typography>
              </RouterLinkWithConfirm>
            </Box>
          );
        },
      },
      {
        field: 'joiningStatus',
        headerName: 'Joining status',
        minWidth: 280,
        renderCell(params) {
          const joinedAt = params.row.quizTakings[0]?.createdAt;
          return (
            <Box>
              {joinedAt ? (
                <Typography component={'span'} color={colors.green.A700}>
                  Joined
                </Typography>
              ) : (
                <Typography component={'span'}>Not joined</Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        minWidth: 200,
        renderCell(params) {
          return (
            <Box>
              <Typography component={'span'}>
                {DateTime.fromISO(params.value).toFormat('HH:mm:ss - yyyy LLL dd')}
              </Typography>
            </Box>
          );
        },
      },
    ],
    [mutateAsync],
  );

  return (
    <Container>
      <Box marginY={2}>
        <Typography variant="h6">Available quizzes to join:</Typography>
      </Box>
      <DataGrid
        autosizeOnMount
        autosizeOptions={{ columns: ['name', 'createdAt'], expand: true }}
        loading={isLoading || isJoining}
        rows={availableQuizzes}
        columns={columns}
        rowSelection={false}
      />
    </Container>
  );
}
