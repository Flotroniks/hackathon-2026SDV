import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../api/authApi';
import type { AuthUser, LoginResponse } from '../types/auth';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  bootstrapStatus: () => Promise<boolean>;
  bootstrapRegister: (email: string, password: string, fullName: string) => Promise<void>;
  changeFirstLoginPassword: (email: string, currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('carbon_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('carbon_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    setIsLoading(true);
    authApi
      .me()
      .then((resolvedUser) => {
        setUser(resolvedUser);
        localStorage.setItem('carbon_user', JSON.stringify(resolvedUser));
      })
      .catch(() => {
        localStorage.removeItem('carbon_token');
        localStorage.removeItem('carbon_user');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      async login(email, password) {
        const response = await authApi.login({ email, password });
        if (response.passwordChangeRequired || !response.accessToken) {
          localStorage.removeItem('carbon_token');
          localStorage.removeItem('carbon_user');
          setToken(null);
          setUser(null);
          return response;
        }

        setToken(response.accessToken);
        setUser(response.user);
        localStorage.setItem('carbon_token', response.accessToken);
        localStorage.setItem('carbon_user', JSON.stringify(response.user));
        return response;
      },
      async bootstrapStatus() {
        const response = await authApi.bootstrapStatus();
        return response.bootstrapRequired;
      },
      async bootstrapRegister(email, password, fullName) {
        const response = await authApi.bootstrapRegister({ email, password, fullName });
        if (!response.accessToken) {
          throw new Error('Bootstrap failed');
        }
        setToken(response.accessToken);
        setUser(response.user);
        localStorage.setItem('carbon_token', response.accessToken);
        localStorage.setItem('carbon_user', JSON.stringify(response.user));
      },
      async changeFirstLoginPassword(email, currentPassword, newPassword) {
        const response = await authApi.changeFirstLoginPassword({ email, currentPassword, newPassword });
        if (!response.accessToken) {
          throw new Error('Password update failed');
        }
        setToken(response.accessToken);
        setUser(response.user);
        localStorage.setItem('carbon_token', response.accessToken);
        localStorage.setItem('carbon_user', JSON.stringify(response.user));
      },
      logout() {
        localStorage.removeItem('carbon_token');
        localStorage.removeItem('carbon_user');
        setToken(null);
        setUser(null);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
