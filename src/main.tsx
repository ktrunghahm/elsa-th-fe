import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@toolpad/core';
import { ConfirmProvider } from 'material-ui-confirm';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AdminRoleProtectedRoute } from './authen/components/AdminRoleProtectedRoute';
import { LoginPage } from './authen/pages/LoginPage';
import { theme } from './common/theme';
import './main.css';
import { ListQuizzesPage } from './quiz/pages/ListQuizzesPage';
import { ManageQuizzesPage } from './quiz/pages/ManageQuizzesPage';
import { QuizPage } from './quiz/pages/QuizPage';
import { RootProtectedRoute } from './RootProtectedRoute';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to={'list-quizzes'} />,
      },
      {
        path: 'admin',
        element: (
          <AdminRoleProtectedRoute>
            <ManageQuizzesPage />
          </AdminRoleProtectedRoute>
        ),
      },
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
    <ThemeProvider theme={theme}>
      <NotificationsProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </NotificationsProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);
