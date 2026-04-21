import apiClient from './client'
import type { Token, User } from '@/types'

export const authApi = {
  register: (data: { email: string; password: string; full_name?: string; institution?: string }) =>
    apiClient.post<{ message: string }>('/users/register', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    apiClient.get<{ message: string }>('/users/verify-email', { params: { token } }).then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient.post<Token>('/users/login', { email, password }).then((r) => r.data),

  getMe: () => apiClient.get<User>('/users/me').then((r) => r.data),

  updateMe: (data: { full_name?: string; institution?: string; phone?: string }) =>
    apiClient.patch<User>('/users/me', data).then((r) => r.data),

  changePassword: (old_password: string, new_password: string) =>
    apiClient.post('/users/me/change-password', { old_password, new_password }).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/users/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, new_password: string) =>
    apiClient.post<{ message: string }>('/users/reset-password', { token, new_password }).then((r) => r.data),
}
