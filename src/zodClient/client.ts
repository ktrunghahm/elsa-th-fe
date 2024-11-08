import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const AuthenReqDto = z.object({ email: z.string(), password: z.string() }).passthrough();
const UserInfo = z.object({ email: z.string(), role: z.string() }).passthrough();
const AuthenSuccessResponse = z
  .object({ success: z.boolean().default(true), userInfo: UserInfo.optional() })
  .passthrough();
const GetUserResponse = z.object({ user: UserInfo }).passthrough();
const SimpleSuccessResponse = z.object({ success: z.boolean() }).passthrough();
const CreateQuizReqType = z
  .object({
    name: z.string(),
    content: z
      .object({
        questions: z.array(
          z
            .object({
              text: z.string(),
              options: z.array(z.object({ text: z.string(), answer: z.boolean() }).passthrough()),
            })
            .passthrough(),
        ),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();
const MinimalQuizTaking = z.object({ createdAt: z.string().datetime({ offset: true }) }).passthrough();
const QuizContentType = z
  .object({
    questions: z.array(
      z
        .object({
          text: z.string(),
          options: z.array(z.object({ text: z.string(), answer: z.boolean() }).passthrough()),
        })
        .passthrough(),
    ),
  })
  .passthrough();
const Quiz = z
  .object({
    quizTakings: z.array(MinimalQuizTaking).optional(),
    id: z.string(),
    name: z.string(),
    content: QuizContentType,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const SimpleCountResponse = z.object({ count: z.number() }).passthrough();
const QuizTaking = z
  .object({
    quiz: Quiz.optional(),
    quizId: z.string(),
    userEmail: z.string(),
    answers: z.object({}).partial().passthrough(),
    totalScore: z.number(),
    attemptCount: z.number(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const AnswerQuizQuestionActionType = z
  .object({ questionIndex: z.number().gte(0), selectedAnswerIndex: z.number().gte(0) })
  .passthrough();
const AnswerQuizQuestionResponse = z.object({ newTotalScore: z.number(), correct: z.boolean() }).passthrough();
const QuizForUser = z
  .object({
    quizId: z.string().uuid(),
    answers: z.record(z.number()),
    totalScore: z.number(),
    joinedAt: z.unknown(),
    lastActionAt: z.unknown(),
    quiz: z
      .object({
        name: z.string(),
        content: z.array(
          z.object({ text: z.string(), options: z.array(z.object({ text: z.string() }).passthrough()) }).passthrough(),
        ),
      })
      .passthrough(),
  })
  .passthrough();
const LeaderboardContentType = z.array(
  z.object({ userEmail: z.string(), totalScore: z.number(), answeredQuestions: z.number() }).passthrough(),
);
const Leaderboard = z
  .object({ quizId: z.string(), content: LeaderboardContentType, updatedAt: z.string().datetime({ offset: true }) })
  .passthrough();

export const schemas = {
  AuthenReqDto,
  UserInfo,
  AuthenSuccessResponse,
  GetUserResponse,
  SimpleSuccessResponse,
  CreateQuizReqType,
  MinimalQuizTaking,
  QuizContentType,
  Quiz,
  SimpleCountResponse,
  QuizTaking,
  AnswerQuizQuestionActionType,
  AnswerQuizQuestionResponse,
  QuizForUser,
  LeaderboardContentType,
  Leaderboard,
};

const endpoints = makeApi([
  {
    method: 'post',
    path: '/admin/quiz',
    alias: 'AdminQuizController_createQuiz',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateQuizReqType,
      },
    ],
    response: Quiz,
  },
  {
    method: 'get',
    path: '/admin/quiz',
    alias: 'AdminQuizController_listQuizzes',
    requestFormat: 'json',
    response: z.array(Quiz),
  },
  {
    method: 'delete',
    path: '/admin/quiz/:quizId',
    alias: 'AdminQuizController_deleteQuiz',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ success: z.boolean() }).passthrough(),
  },
  {
    method: 'get',
    path: '/admin/quiz/total-connected-ws-client',
    alias: 'AdminQuizController_getTotalConnectedWSClient',
    requestFormat: 'json',
    response: z.object({ count: z.number() }).passthrough(),
  },
  {
    method: 'post',
    path: '/authen/authen-req',
    alias: 'AuthenController_authenReq',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: AuthenReqDto,
      },
    ],
    response: AuthenSuccessResponse,
  },
  {
    method: 'post',
    path: '/authen/logout',
    alias: 'AuthenController_logout',
    requestFormat: 'json',
    response: z.object({ success: z.boolean() }).passthrough(),
  },
  {
    method: 'get',
    path: '/authen/user',
    alias: 'AuthenController_getCurrentUser',
    requestFormat: 'json',
    response: GetUserResponse,
  },
  {
    method: 'get',
    path: '/quiz/:quizId/leaderboard',
    alias: 'LeaderboardController_getForQuiz',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: Leaderboard,
  },
  {
    method: 'post',
    path: '/quiz/:quizId/leaderboard',
    alias: 'LeaderboardController_forceUpdate',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ count: z.number() }).passthrough(),
  },
  {
    method: 'get',
    path: '/user/quiz',
    alias: 'UserQuizController_listAvailableQuizzesForUser',
    requestFormat: 'json',
    response: z.array(Quiz),
  },
  {
    method: 'get',
    path: '/user/quiz/:quizId',
    alias: 'UserQuizController_getQuizByUser',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: QuizForUser,
  },
  {
    method: 'post',
    path: '/user/quiz/:quizId/answer',
    alias: 'UserQuizController_answerQuizQuestion',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: AnswerQuizQuestionActionType,
      },
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: AnswerQuizQuestionResponse,
  },
  {
    method: 'post',
    path: '/user/quiz/:quizId/join',
    alias: 'UserQuizController_joinQuiz',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: QuizTaking,
  },
  {
    method: 'get',
    path: '/user/quiz/:quizId/online-count',
    alias: 'UserQuizController_getOnlineCountForQuiz',
    requestFormat: 'json',
    parameters: [
      {
        name: 'quizId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ count: z.number() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
