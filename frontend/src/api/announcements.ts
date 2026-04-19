import apiClient from './client'
import type { Announcement, PaginatedResponse } from '@/types'

export const announcementApi = {
  list: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<Announcement>>('/announcements/', { params: { page, size } })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Announcement>(`/announcements/${id}`).then((r) => r.data),

  create: (data: { title: string; content: string; is_published: boolean }) =>
    apiClient.post<Announcement>('/announcements/', data).then((r) => r.data),

  update: (id: string, data: { title?: string; content?: string; is_published?: boolean }) =>
    apiClient.put<Announcement>(`/announcements/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/announcements/${id}`).then((r) => r.data),
}
