import { Box, CircularProgress, colors, Container, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { LeaderBoard } from '../components/LeaderBoard';
import { Question } from '../components/Question';
import { useFetchQuizForUser } from '../services/quiz';

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
          <Typography color="error">
            <FormattedMessage defaultMessage={'You have not joined this quiz'} />
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box minWidth={'930px'} display={'flex'} gap={2}>
        <Box paddingY={2} width={440}>
          <LeaderBoard quizName={quizData.quiz.name} />
        </Box>
        <Box paddingY={2} width={480}>
          <Box
            display={'flex'}
            gap={1}
            justifyContent={'center'}
            paddingY={1}
            position={'sticky'}
            top={64}
            zIndex={10}
            bgcolor={colors.common.white}
          >
            <Typography>
              <FormattedMessage defaultMessage={'Total score: {ts}'} values={{ ts: quizData.totalScore }} />
            </Typography>
            <Typography>
              <FormattedMessage
                defaultMessage={'Answered questions: {aq}'}
                values={{ aq: Object.keys(quizData.answers).length }}
              />
            </Typography>
            <Typography>
              <FormattedMessage
                defaultMessage={'Total questions: {tq}'}
                values={{ tq: quizData.quiz.content.length }}
              />
            </Typography>
          </Box>
          {quizData.quiz.content.map((_, i) => (
            <Box key={i} marginY={2} marginX={'auto'}>
              <Question questionIndex={i} quiz={quizData} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
