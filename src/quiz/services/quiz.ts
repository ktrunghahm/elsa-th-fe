import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosInstance } from '../../common/axios';
import { Quiz } from '../types';

export const FETCH_LIST_QUIZZES_KEY = 'fetch-list-quizzes';
export function useListQuizzes() {
  return useQuery({
    queryKey: [FETCH_LIST_QUIZZES_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get('/user/quiz');
      return res.data;
    },
  });
}

export const FETCH_QUIZ_FOR_USER = 'fetch-quiz-for-user';
export function useFetchQuizForUser(quizId: string) {
  return useQuery<void, AxiosError, Quiz>({
    queryKey: [FETCH_QUIZ_FOR_USER, quizId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/quiz/${quizId}`);
      return res.data;
    },
    retry(_, error) {
      return error.response?.status !== 400;
    },
  });
}

export function useJoinQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizId: string) => {
      const res = await axiosInstance.post(`/user/quiz/${quizId}/join`, {});
      queryClient.invalidateQueries({ queryKey: [FETCH_LIST_QUIZZES_KEY] });
      queryClient.invalidateQueries({ queryKey: [FETCH_QUIZ_FOR_USER, quizId] });
      return res.data;
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
      const res = await axiosInstance.post(`/user/quiz/${quizId}/answer`, data);
      queryClient.invalidateQueries({ queryKey: [FETCH_QUIZ_FOR_USER, quizId] });
      return res.data;
    },
  });
}

export const FETCH_LEADERBOARD_KEY = 'fetch-leaderboard';
export function useFetchLeaderboard(quizId: string) {
  return useQuery({
    queryKey: [FETCH_LEADERBOARD_KEY, quizId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/quiz/${quizId}/leaderboard`);
      return res.data;
    },
  });
}

export const FETCH_QUIZ_ONLINE_COUNT = 'fetch-quiz-online-count';

export function useFetchQuizOnlineCount(quizId: string) {
  return useQuery({
    queryKey: [FETCH_QUIZ_ONLINE_COUNT, quizId],
    queryFn: async () => {
      const res = await axiosInstance.get(`user/quiz/${quizId}/online-count`);
      return res.data;
    },
    refetchInterval: 2000,
  });
}
