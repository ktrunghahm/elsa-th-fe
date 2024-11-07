export enum AuthenticationState {
  yes = 'yes',
  no = 'no',
  pending = 'pending',
}

export interface UserInfo {
  user: { email: string };
  role: string;
}
