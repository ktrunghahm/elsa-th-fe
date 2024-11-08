import { faker } from '@faker-js/faker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodiosClient } from '../../common/axios';

export const FETCH_LIST_QUIZZES_KEY = 'fetch-list-quizzes';
export function useListQuizzes() {
  return useQuery({
    queryKey: [FETCH_LIST_QUIZZES_KEY],
    queryFn: async () => {
      const res = await zodiosClient.UserQuizController_listAvailableQuizzesForUser();
      return res;
    },
  });
}

export const FETCH_QUIZ_FOR_USER = 'fetch-quiz-for-user';
export function useFetchQuizForUser(quizId: string) {
  return useQuery({
    queryKey: [FETCH_QUIZ_FOR_USER, quizId],
    queryFn: async () => {
      return await zodiosClient.UserQuizController_getQuizByUser({ params: { quizId } });
    },
  });
}

export function useJoinQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizId: string) => {
      const res = await zodiosClient.UserQuizController_joinQuiz(undefined, { params: { quizId } });
      return res.data;
    },
    onSuccess(_, quizId) {
      queryClient.invalidateQueries({ queryKey: [FETCH_LIST_QUIZZES_KEY] });
      queryClient.invalidateQueries({ queryKey: [FETCH_QUIZ_FOR_USER, quizId] });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizId: string) => {
      return await zodiosClient.AdminQuizController_deleteQuiz(undefined, { params: { quizId } });
    },
    onSuccess(_, quizId) {
      queryClient.invalidateQueries({ queryKey: [FETCH_LIST_QUIZZES_KEY] });
      queryClient.invalidateQueries({ queryKey: [FETCH_QUIZ_FOR_USER, quizId] });
    },
  });
}

export function useGenerateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await zodiosClient.AdminQuizController_createQuiz({ name: `${faker.word.adjective()} quiz` });
      return res.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [FETCH_LIST_QUIZZES_KEY] });
    },
  });
}

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      quizId,
    }: {
      quizId: string;
      data: {
        questionIndex: number;
        selectedAnswerIndex: number;
      };
    }) => {
      const res = await zodiosClient.UserQuizController_answerQuizQuestion(data, { params: { quizId } });
      return res;
    },
    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: [FETCH_QUIZ_FOR_USER, variables.quizId] });
    },
  });
}

export const FETCH_LEADERBOARD_KEY = 'fetch-leaderboard';
export function useFetchLeaderboard(quizId: string) {
  return useQuery({
    queryKey: [FETCH_LEADERBOARD_KEY, quizId],
    queryFn: async () => {
      const res = await zodiosClient.LeaderboardController_getForQuiz({ params: { quizId } });
      return res;
    },
  });
}

export const FETCH_QUIZ_ONLINE_COUNT = 'fetch-quiz-online-count';

export function useFetchQuizOnlineCount(quizId: string) {
  return useQuery({
    queryKey: [FETCH_QUIZ_ONLINE_COUNT, quizId],
    queryFn: async () => {
      const res = await zodiosClient.UserQuizController_getOnlineCountForQuiz({ params: { quizId } });
      return res;
    },
    refetchInterval: 2000,
  });
}
