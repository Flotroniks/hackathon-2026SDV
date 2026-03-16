import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginApi } from '../api/authApi';
import { setAuthToken } from '../api/client';
import type { AuthUser } from '../types/auth';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet(['carbon_token', 'carbon_user'])
      .then(([tokenEntry, userEntry]) => {
        const storedToken = tokenEntry[1];
        const storedUser = userEntry[1];
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      async signIn(email, password) {
        const response = await loginApi(email, password);
        setToken(response.accessToken);
        setUser(response.user);
        setAuthToken(response.accessToken);
        await AsyncStorage.multiSet([
          ['carbon_token', response.accessToken],
          ['carbon_user', JSON.stringify(response.user)],
        ]);
      },
      async signOut() {
        setToken(null);
        setUser(null);
        setAuthToken(null);
        await AsyncStorage.multiRemove(['carbon_token', 'carbon_user']);
      },
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
