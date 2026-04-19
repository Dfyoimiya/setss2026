import apiClient from './client'
import type { User, Paper, Review, Registration, Announcement, ConfigItem, PaginatedResponse } from '@/types'

export const adminApi = {
  // 用户
  listUsers: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<User>>('/admin/users/', { params: { page, size } })
      .then((r) => r.data),
  updateRole: (userId: string, role: string) =>
    apiClient.patch<User>(`/admin/users/${userId}/role`, { role }).then((r) => r.data),
  updateUserStatus: (userId: string, is_active: boolean) =>
    apiClient.patch<User>(`/admin/users/${userId}/status`, { is_active }).then((r) => r.data),

  // 论文
  listPapers: (page = 1, size = 20, status?: string, topic?: string) =>
    apiClient
      .get<PaginatedResponse<Paper>>('/admin/papers/', { params: { page, size, status, topic } })
      .then((r) => r.data),
  updatePaperStatus: (paperId: string, status: string) =>
    apiClient.patch<Paper>(`/admin/papers/${paperId}/status`, { status }).then((r) => r.data),
  exportPapers: () => `/api/v1/admin/papers/export`,
  assignReviewer: (paperId: string, reviewer_id: string) =>
    apiClient
      .post<Review>(`/admin/papers/${paperId}/assign-reviewer`, { reviewer_id })
      .then((r) => r.data),
  removeReviewer: (paperId: string, reviewerId: string) =>
    apiClient
      .delete(`/admin/papers/${paperId}/assign-reviewer/${reviewerId}`)
      .then((r) => r.data),

  // 审稿
  listReviews: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<Review>>('/admin/reviews/', { params: { page, size } })
      .then((r) => r.data),

  // 报名
  listRegistrations: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<Registration>>('/admin/registrations/', { params: { page, size } })
      .then((r) => r.data),
  updateRegistrationStatus: (id: string, status: string) =>
    apiClient
      .patch<Registration>(`/admin/registrations/${id}/status`, { status })
      .then((r) => r.data),

  // 公告（复用公告 API）
  listAllAnnouncements: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<Announcement>>('/announcements/', { params: { page, size } })
      .then((r) => r.data),

  // 系统配置
  listConfig: () => apiClient.get<ConfigItem[]>('/admin/config/').then((r) => r.data),
  updateConfig: (key: string, value: string, description?: string) =>
    apiClient
      .put<ConfigItem>(`/admin/config/${key}`, { value, description })
      .then((r) => r.data),
}
