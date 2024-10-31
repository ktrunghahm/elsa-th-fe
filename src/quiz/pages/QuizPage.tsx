import { Box, CircularProgress, colors, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { useFetchQuizForUser } from '../services/quiz';
import { LeaderBoard } from '../components/LeaderBoard';

export function QuizPage() {
  const { quizId } = useParams();
  const { data: quizData, isLoading } = useFetchQuizForUser(quizId!);

  if (isLoading) {
    return (
      <Container>
        <Box paddingY={4} marginX={'auto'} width={100}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!quizData) {
    return (
      <Container>
        <Box paddingY={2} marginX={'auto'} width={300}>
          <Typography color="error">You have not joined this quiz</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box display={'flex'} justifyContent={'stretch'}>
        <Box paddingY={2} width={440}>
          <LeaderBoard quizName={quizData.quiz.name} />
        </Box>
        <Box paddingY={2} flex={1}>
          <Box
            display={'flex'}
            gap={1}
            position={'sticky'}
            top={40}
            bgcolor={colors.common.white}
            paddingY={1}
            zIndex={99999}
          >
            <Typography>Current score: {quizData.totalScore}</Typography>
            <Typography>Answered questions: {Object.keys(quizData.answers).length}</Typography>
            <Typography>Total questions: {quizData.quiz.content.questions.length}</Typography>
          </Box>
          {quizData.quiz.content.questions.map((_, i) => (
            <Box key={i} marginY={2} width={440} marginX={'auto'}>
              <Question questionIndex={i} quiz={quizData} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
