import client from './client';
import type { AuthUser, UserRole } from '../types/auth';

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export async function fetchUsers() {
  const { data } = await client.get<AuthUser[]>('/users');
  return data;
}

export async function createUser(payload: CreateUserRequest) {
  const { data } = await client.post<AuthUser>('/users', payload);
  return data;
}
