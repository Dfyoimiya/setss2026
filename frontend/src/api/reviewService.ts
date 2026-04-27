import apiClient from './client'
import type {
  ApiResponse,
  PagedResponse,
  ReviewAssignment,
  ReviewAssignmentListItem,
  AssignmentDecision,
  ReviewForm,
  ReviewUpdateForm,
  Review,
} from './types'

export const reviewService = {
  listMyAssignments: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<PagedResponse<ReviewAssignmentListItem>>('/api/v1/review/assignments', { params }),

  getAssignment: (id: string) =>
    apiClient.get<ApiResponse<ReviewAssignment>>(`/api/v1/review/assignments/${id}`),

  acceptAssignment: (id: string, data: AssignmentDecision = { accept: true }) =>
    apiClient.post<ApiResponse<null>>(`/api/v1/review/assignments/${id}/accept`, data),

  declineAssignment: (id: string, data: AssignmentDecision = { accept: false }) =>
    apiClient.post<ApiResponse<null>>(`/api/v1/review/assignments/${id}/decline`, data),

  submitReview: (id: string, data: ReviewForm) =>
    apiClient.post<ApiResponse<Review>>(`/api/v1/review/assignments/${id}/review`, data),

  updateReview: (id: string, data: ReviewUpdateForm) =>
    apiClient.put<ApiResponse<Review>>(`/api/v1/review/assignments/${id}/review`, data),

  downloadPaperFile: (assignmentId: string) =>
    apiClient.get(`/api/v1/review/assignments/${assignmentId}/file/download`, {
      responseType: 'blob',
    }),
}
