import apiClient from './client'
import type {
  ApiResponse,
  TokenResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserUpdateRequest,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
} from './types'

export const authService = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>('/api/v1/users/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<User>>('/api/v1/users/register', data),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/api/v1/users/me'),

  updateMe: (data: UserUpdateRequest) =>
    apiClient.patch<ApiResponse<User>>('/api/v1/users/me', data),

  changePassword: (data: PasswordChangeRequest) =>
    apiClient.post<ApiResponse<MessageResponse>>('/api/v1/users/me/change-password', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiResponse<MessageResponse>>('/api/v1/users/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiResponse<MessageResponse>>('/api/v1/users/reset-password', data),
}
