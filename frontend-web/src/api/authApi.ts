import client from './client';
import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
  FirstLoginPasswordChangeRequest,
  BootstrapStatusResponse,
  BootstrapAdminRequest,
} from '../types/auth';

export async function login(payload: LoginRequest) {
  const { data } = await client.post<LoginResponse>('/auth/login', payload);
  return data;
}

export async function me() {
  const { data } = await client.get<AuthUser>('/auth/me');
  return data;
}

export async function changeFirstLoginPassword(payload: FirstLoginPasswordChangeRequest) {
  const { data } = await client.post<LoginResponse>('/auth/first-login/change-password', payload);
  return data;
}

export async function bootstrapStatus() {
  const { data } = await client.get<BootstrapStatusResponse>('/auth/bootstrap/status');
  return data;
}

export async function bootstrapRegister(payload: BootstrapAdminRequest) {
  const { data } = await client.post<LoginResponse>('/auth/bootstrap/register', payload);
  return data;
}
