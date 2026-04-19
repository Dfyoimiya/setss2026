import apiClient from './client'
import type { ReviewWithPaper, Review, PaginatedResponse } from '@/types'

export const reviewApi = {
  getAssigned: (page = 1, size = 20) =>
    apiClient
      .get<PaginatedResponse<ReviewWithPaper>>('/reviews/assigned', { params: { page, size } })
      .then((r) => r.data),

  get: (id: string) => apiClient.get<Review>(`/reviews/${id}`).then((r) => r.data),

  submit: (id: string, data: { score: number; comments: string; recommendation: string }) =>
    apiClient.post<Review>(`/reviews/${id}/submit`, data).then((r) => r.data),

  update: (id: string, data: { score: number; comments: string; recommendation: string }) =>
    apiClient.put<Review>(`/reviews/${id}`, data).then((r) => r.data),
}
