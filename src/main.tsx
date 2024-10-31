import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@toolpad/core';
import { ConfirmProvider } from 'material-ui-confirm';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from './authen/pages/LoginPage';
import { ListQuizzesPage } from './quiz/pages/ListQuizzesPage';
import { QuizPage } from './quiz/pages/QuizPage';
import { RootRoute } from './RootRoute';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    children: [
      {
        path: 'list-quizzes',
        element: <ListQuizzesPage />,
      },
      {
        path: 'quiz/:quizId',
        element: <QuizPage />,
      },
    ],
  },
  { path: 'login', element: <LoginPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <NotificationsProvider>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </NotificationsProvider>
  </QueryClientProvider>,
);
