export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  passwordChangeRequired: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string | null;
  tokenType: string;
  user: AuthUser;
  passwordChangeRequired: boolean;
}

export interface FirstLoginPasswordChangeRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface BootstrapStatusResponse {
  bootstrapRequired: boolean;
}

export interface BootstrapAdminRequest {
  email: string;
  password: string;
  fullName: string;
}
