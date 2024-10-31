import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../common/axios';

export const FETCH_USER_INFO_KEY = 'fetch-user-info';

export function useFetchUserInfo() {
  return useQuery({
    queryKey: [FETCH_USER_INFO_KEY],
    queryFn: async () => {
      const res = await axiosInstance.get('authen/user', { validateStatus: () => true });
      if (res.status === 200) {
        return res.data;
      }
      return null;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
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
      return res.statusText;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/authen/logout');
      queryClient.clear();
      return res.statusText;
    },
  });
}
