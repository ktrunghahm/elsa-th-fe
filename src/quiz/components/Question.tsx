import { LoadingButton } from '@mui/lab';
import { Box, Card, colors, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Quiz } from '../types';
import { useAnswerQuestion } from '../services/quiz';
import { FormattedMessage, useIntl } from 'react-intl';

export function Question({ questionIndex, quiz }: { quiz: Quiz; questionIndex: number }) {
  const question = useMemo(
    () => quiz.quiz.content.questions[questionIndex],
    [questionIndex, quiz.quiz.content.questions],
  );
  const answered = useMemo(() => quiz.answers[questionIndex], [questionIndex, quiz.answers]);
  const answeredCorrectly = useMemo(() => question.options[answered]?.answer, [answered, question.options]);

  const formMethods = useForm({
    defaultValues: { questionIndex, selectedAnswerIndex: answered || null },
  });
  const { mutateAsync, isPending } = useAnswerQuestion();
  const notification = useNotifications();
  const intl = useIntl();

  return (
    <Card>
      <Box
        bgcolor={answered === undefined ? 'unset' : answeredCorrectly ? colors.green[200] : colors.red[200]}
        paddingX={2}
        paddingY={1}
        component={'form'}
        onSubmit={formMethods.handleSubmit(async (data) => {
          const responseData = await mutateAsync({
            data: { questionIndex: data.questionIndex, selectedAnswerIndex: data.selectedAnswerIndex! },
            quizId: quiz.quizId,
          });
          if (responseData.correct) {
            notification.show(intl.formatMessage({ defaultMessage: 'You have chosen wisely' }), {
              autoHideDuration: 3000,
              severity: 'success',
            });
          } else {
            notification.show(intl.formatMessage({ defaultMessage: 'You have chosen poorly' }), {
              autoHideDuration: 3000,
              severity: 'error',
            });
          }
        })}
      >
        <Typography>
          {questionIndex + 1}. {question.text}
        </Typography>
        <Box>
          <Controller
            name="selectedAnswerIndex"
            control={formMethods.control}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup value={field.value} onChange={field.onChange}>
                {question.options.map((option, i) => (
                  <FormControlLabel
                    key={i}
                    value={i}
                    disabled={answered !== undefined}
                    control={<Radio readOnly={answered !== undefined} />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <LoadingButton
            loading={isPending}
            type="submit"
            disabled={!formMethods.formState.isValid || answered !== undefined}
            variant="outlined"
          >
            <FormattedMessage defaultMessage={'Answer'} />
          </LoadingButton>
        </Box>
      </Box>
    </Card>
  );
}
