import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/api/types'

export interface AuthUser {
  name: string
  email: string
  avatar?: string
}

function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null
  return {
    name: u.full_name || u.email.split('@')[0],
    email: u.email,
  }
}

export function useAuth() {
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const closeAuth = () => setShowAuthModal(false)

  return {
    user: toAuthUser(user),
    rawUser: user,
    isAuthenticated,
    logout: storeLogout,
    showAuthModal,
    setShowAuthModal: closeAuth,
    authMode,
    openAuth,
  }
}
