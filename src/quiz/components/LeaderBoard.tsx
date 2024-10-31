import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { baseSocketURL } from '../../common/config';
import { useConnectAndHoldSocket } from '../../common/hooks';
import { FETCH_LEADERBOARD_KEY, useFetchLeaderboard, useFetchQuizOnlineCount } from '../services/quiz';

export function LeaderBoard({ quizName }: { quizName: string }) {
  const { quizId } = useParams();
  const { data: leaderBoardData, isLoading: isLoading } = useFetchLeaderboard(quizId!);
  const { data: onlineCountData, isLoading: isLoadingOnlineCount } = useFetchQuizOnlineCount(quizId!);
  const queryClient = useQueryClient();

  const socketRef = useConnectAndHoldSocket(baseSocketURL, '/quiz', { quizId: quizId! });

  useEffect(() => {
    const event = 'message';
    const socket = socketRef.current;
    function onLeaderBoardUpdated(msg: string, fn: (msg: string) => void) {
      if (msg === 'leaderboard updated') {
        queryClient.invalidateQueries({ queryKey: [FETCH_LEADERBOARD_KEY, quizId] });
      } else if (msg === 'ping') {
        fn('pong');
      }
    }
    socket.on(event, onLeaderBoardUpdated);

    return () => {
      socket.off(event, onLeaderBoardUpdated);
    };
  }, [queryClient, quizId, socketRef]);

  return (
    <Box position={'sticky'} top={0}>
      <Box marginY={2}>
        <Typography variant="h6">
          Leader board for{' '}
          <Typography fontStyle={'italic'} fontWeight={600} variant="subtitle2" component={'span'}>
            {quizName}
          </Typography>
          {'  '}
          <Typography component={'span'}>
            Online: {isLoadingOnlineCount ? <Skeleton variant="text" width={20} /> : onlineCountData.count}
          </Typography>
        </Typography>
      </Box>
      {leaderBoardData ? (
        <DataGrid
          rowSelection={false}
          getRowId={(row) => row.userEmail}
          loading={isLoading}
          columns={[
            { field: 'userEmail', headerName: 'Email', minWidth: 190 },
            { field: 'totalScore', headerName: 'Total score', width: 120 },
            { field: 'answeredQuestions', headerName: 'Total answered', width: 120 },
          ]}
          rows={leaderBoardData.content}
        />
      ) : (
        <Box width={100} marginX={'auto'} paddingY={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
