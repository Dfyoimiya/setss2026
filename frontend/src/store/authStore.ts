import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isAdmin: () => boolean
  isReviewer: () => boolean
  isLoggedIn: () => boolean
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAdmin: () => get().user?.role?.includes('admin') ?? false,
      isReviewer: () =>
        get().user?.role?.includes('reviewer') ||
        get().user?.role?.includes('admin') ||
        false,
      isLoggedIn: () => !!get().token,
      updateUser: (user) => set({ user }),
    }),
    { name: 'setss-auth' }
  )
)
