import client from './client';
import type { LoginResponse } from '../types/auth';

export async function login(email: string, password: string) {
  const { data } = await client.post<LoginResponse>('/auth/login', { email, password });
  return data;
}
