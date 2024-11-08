import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodiosClient } from '../../common/axios';
import { useAppStore } from '../../common/hooks';
import { AuthenticationState } from '../../common/types';

export const FETCH_USER_INFO_KEY = 'fetch-user-info';

export function useFetchUserInfo() {
  const authenticate = useAppStore((state) => state.authenticate);
  const setUserInfo = useAppStore((state) => state.setUserInfo);

  return useQuery({
    queryKey: [FETCH_USER_INFO_KEY],
    queryFn: async () => {
      try {
        const res = await zodiosClient.AuthenController_getCurrentUser();
        authenticate(AuthenticationState.yes);
        setUserInfo(res.user);
        return res;
      } catch (e) {
        authenticate(AuthenticationState.no);
        throw e;
      }
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const authenticate = useAppStore((state) => state.authenticate);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        const res = await zodiosClient.AuthenController_authenReq(data);
        if (res.success) {
          authenticate(AuthenticationState.yes);
        } else {
          authenticate(AuthenticationState.no);
          return 'Wrong email or password';
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return 'Wrong email or password';
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [FETCH_USER_INFO_KEY] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const authenticate = useAppStore((state) => state.authenticate);

  return useMutation({
    mutationFn: async () => {
      const res = await zodiosClient.AuthenController_logout(undefined);
      return res;
    },
    onSuccess() {
      queryClient.clear();
      authenticate(AuthenticationState.no);
    },
  });
}
