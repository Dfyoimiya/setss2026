import apiClient from './client'
import type { Paper, PaginatedResponse } from '@/types'

export const paperApi = {
  listMine: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<Paper>>('/papers/', { params: { page, size } })
      .then((r) => r.data),

  get: (id: string) => apiClient.get<Paper>(`/papers/${id}`).then((r) => r.data),

  submit: (formData: FormData) =>
    apiClient.post<Paper>('/papers/', formData).then((r) => r.data),

  updateMeta: (id: string, data: { title?: string; abstract?: string; keywords?: string; topic?: string }) =>
    apiClient.put<Paper>(`/papers/${id}`, null, { params: data }).then((r) => r.data),

  uploadFile: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return apiClient.post<Paper>(`/papers/${id}/upload-file`, fd).then((r) => r.data)
  },

  uploadCameraReady: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return apiClient.post<Paper>(`/papers/${id}/camera-ready`, fd).then((r) => r.data)
  },

  // 获取 presigned 下载链接（替代旧的直接下载 URL）
  getDownloadUrl: (id: string) =>
    apiClient.get<{ url: string; filename: string }>(`/papers/${id}/download-url`).then((r) => r.data),

  getCameraReadyUrl: (id: string) =>
    apiClient.get<{ url: string; filename: string }>(`/papers/${id}/camera-ready-url`).then((r) => r.data),
}
