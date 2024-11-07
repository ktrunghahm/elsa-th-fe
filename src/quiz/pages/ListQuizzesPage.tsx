import { Box, colors, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { RouterLinkWithConfirm } from '../../common/components/RouterLinkWithConfirm';
import { useJoinQuiz, useListQuizzes } from '../services/quiz';
import { FormattedMessage, useIntl } from 'react-intl';

export function ListQuizzesPage() {
  const { data: availableQuizzes, isLoading } = useListQuizzes();
  const { mutateAsync, isPending: isJoining } = useJoinQuiz();
  const intl = useIntl();

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
                confirmTitle={intl.formatMessage({ defaultMessage: 'Confirm to join' })}
                confirmDescription={intl.formatMessage(
                  { defaultMessage: 'Are you sure you want to join: "{v}"' },
                  { v: params.value },
                )}
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
                  <FormattedMessage defaultMessage={'Joined'} />
                </Typography>
              ) : (
                <Typography component={'span'}>
                  <FormattedMessage defaultMessage={'Not joined'} />
                </Typography>
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
    [intl, mutateAsync],
  );

  return (
    <Container>
      <Box marginY={2}>
        <Typography variant="h6">
          <FormattedMessage defaultMessage={'Available quizzes to join:'} />
        </Typography>
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
