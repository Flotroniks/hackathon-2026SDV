import axios from 'axios';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8088/api/v1',
});

export function setAuthToken(token: string | null) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

export default client;
