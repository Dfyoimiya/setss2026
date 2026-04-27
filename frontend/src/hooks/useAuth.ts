import { useState, useCallback } from 'react';

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const login = useCallback((name: string, email: string) => {
    setUser({ name, email });
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const openAuth = useCallback((mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  return { user, login, logout, showAuthModal, setShowAuthModal, authMode, openAuth };
}
