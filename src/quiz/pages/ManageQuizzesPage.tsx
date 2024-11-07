import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, IconButton, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { useConfirm } from 'material-ui-confirm';
import { useMemo } from 'react';
import { useDeleteQuiz, useGenerateQuiz, useListQuizzes } from '../services/quiz';

export function ManageQuizzesPage() {
  const { data: availableQuizzes, isLoading } = useListQuizzes();

  const { mutateAsync: deleteQuiz, isPending: isDeletingQuiz } = useDeleteQuiz();
  const { mutateAsync: generateQuiz, isPending: isGeneratingQuiz } = useGenerateQuiz();

  const confirm = useConfirm();

  const columns = useMemo(
    (): GridColDef[] => [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 200,
        renderCell(params) {
          return (
            <Box>
              <Typography component={'span'}>{params.value}</Typography>
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
      {
        field: 'action',
        headerName: 'Action',
        minWidth: 200,
        renderCell(params) {
          return (
            <IconButton
              onClick={async () => {
                try {
                  await confirm({
                    title: 'Confirm deletion',
                    description: `Are you sure you want to delete "${params.row.name}"?`,
                  });

                  deleteQuiz(params.row.id);
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                  /* empty */
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          );
        },
      },
    ],
    [confirm, deleteQuiz],
  );

  return (
    <Container>
      <Box position={'relative'} overflow={'visible'}>
        <Box position={'absolute'} width={'100%'}>
          {(isGeneratingQuiz || isDeletingQuiz) && <LinearProgress />}
        </Box>
      </Box>
      <Box marginY={2} display={'flex'} paddingY={1}>
        <Typography variant="h6" flex={1}>
          Quizzes currently online:
        </Typography>
        <Button variant="contained" onClick={() => generateQuiz()}>
          Generate new quiz
        </Button>
      </Box>
      <DataGrid
        autosizeOnMount
        autosizeOptions={{ columns: ['name', 'createdAt', 'action'], expand: true }}
        loading={isLoading}
        rows={availableQuizzes}
        columns={columns}
        rowSelection={false}
      />
    </Container>
  );
}
