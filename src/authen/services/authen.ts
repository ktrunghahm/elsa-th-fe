import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../common/axios';
import { useAppStore } from '../../common/hooks';
import { AuthenticationState, UserInfo } from '../../common/types';

export const FETCH_USER_INFO_KEY = 'fetch-user-info';

export function useFetchUserInfo() {
  const authenticate = useAppStore((state) => state.authenticate);
  const setUserInfo = useAppStore((state) => state.setUserInfo);

  return useQuery({
    queryKey: [FETCH_USER_INFO_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get<UserInfo>('authen/user', { validateStatus: () => true });
      if (res.status === 200) {
        authenticate(AuthenticationState.yes);
        const userInfo = res.data;
        setUserInfo(userInfo);
        return userInfo;
      }
      return null;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const authenticate = useAppStore((state) => state.authenticate);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axiosInstance.post('/authen/authen-req', data, {
        validateStatus() {
          return true;
        },
      });
      if (res.status === 200) {
        if (res.data.success) {
          queryClient.invalidateQueries({ queryKey: [FETCH_USER_INFO_KEY] });
          return null;
        } else {
          return 'Wrong email or password';
        }
      }
      authenticate(AuthenticationState.yes);
      return res.statusText;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const authenticate = useAppStore((state) => state.authenticate);

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/authen/logout');
      queryClient.clear();
      authenticate(AuthenticationState.no);
      return res.statusText;
    },
  });
}
