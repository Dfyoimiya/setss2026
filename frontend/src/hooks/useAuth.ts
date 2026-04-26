import { useState, useCallback, useEffect } from 'react'
import { api, setToken, clearToken, setStoredUser, getStoredUser } from '@/lib/api'

export interface User {
  name: string
  email: string
  full_name?: string
  institution?: string
  role?: string
}

interface LoginResponse {
  access_token: string
  token_type: string
}

interface RegisterResponse {
  message: string
}

interface ProfileResponse {
  id: string
  email: string
  full_name: string | null
  institution: string | null
  role: string
  is_active: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    return getStoredUser()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('setss-auth-token')
    if (token) {
      api.get<ProfileResponse>('/api/v1/users/me')
        .then((res) => {
          const u: User = {
            name: res.data.full_name || res.data.email.split('@')[0],
            email: res.data.email,
            full_name: res.data.full_name || undefined,
            institution: res.data.institution || undefined,
            role: res.data.role,
          }
          setUser(u)
          setStoredUser({ name: u.name, email: u.email })
        })
        .catch(() => {
          clearToken()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const res = await api.post<LoginResponse>('/api/v1/users/login', {
        email,
        password,
      })
      setToken(res.data.access_token)
      const profile = await api.get<ProfileResponse>('/api/v1/users/me')
      const u: User = {
        name: profile.data.full_name || profile.data.email.split('@')[0],
        email: profile.data.email,
        full_name: profile.data.full_name || undefined,
        institution: profile.data.institution || undefined,
        role: profile.data.role,
      }
      setUser(u)
      setStoredUser({ name: u.name, email: u.email })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      return false
    }
  }, [])

  const register = useCallback(async (
    fullName: string,
    email: string,
    password: string,
    institution?: string,
  ) => {
    setError(null)
    try {
      await api.post<RegisterResponse>('/api/v1/users/register', {
        email,
        password,
        full_name: fullName,
        institution: institution || undefined,
      })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: { full_name?: string; institution?: string }) => {
    const res = await api.patch<ProfileResponse>('/api/v1/users/me', data)
    const u: User = {
      name: res.data.full_name || res.data.email.split('@')[0],
      email: res.data.email,
      full_name: res.data.full_name || undefined,
      institution: res.data.institution || undefined,
      role: res.data.role,
    }
    setUser(u)
    setStoredUser({ name: u.name, email: u.email })
    return u
  }, [])

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    await api.post('/api/v1/users/me/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
  }, [])

  return {
    user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  }
}
