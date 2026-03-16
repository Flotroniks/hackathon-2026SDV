export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER';
  active: boolean;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}
