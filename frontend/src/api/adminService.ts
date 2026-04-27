import apiClient from './client'
import type {
  ApiResponse,
  PagedResponse,
  User,
  RoleUpdateRequest,
  StatusUpdateRequest,
  MessageResponse,
  Submission,
  SubmissionListItem,
  SubmissionPeriod,
  SubmissionPeriodListItem,
  SubmissionPeriodForm,
  SubmissionPeriodUpdate,
  Reviewer,
  ManualAssignmentRequest,
  ReviewAssignment,
  AdminDecisionRequest,
  ReviewVisibilityUpdate,
  Review,
} from './types'

export const adminService = {
  // ── 用户管理 ──
  listUsers: (params?: { page?: number; page_size?: number; keyword?: string }) =>
    apiClient.get<PagedResponse<User>>('/api/v1/admin/users/', { params }),

  updateUserRole: (userId: string, data: RoleUpdateRequest) =>
    apiClient.patch<ApiResponse<MessageResponse>>(`/api/v1/admin/users/${userId}/role`, data),

  updateUserStatus: (userId: string, data: StatusUpdateRequest) =>
    apiClient.patch<ApiResponse<MessageResponse>>(`/api/v1/admin/users/${userId}/status`, data),

  // ── 论文管理 ──
  listAllSubmissions: (params?: { page?: number; page_size?: number; keyword?: string }) =>
    apiClient.get<PagedResponse<SubmissionListItem>>('/api/v1/admin/submissions/', { params }),

  getSubmissionDetail: (id: string) =>
    apiClient.get<ApiResponse<Submission>>(`/api/v1/admin/submissions/${id}`),

  downloadSubmissionFile: (submissionId: string, fileId: string) =>
    apiClient.get(`/api/v1/admin/submissions/${submissionId}/files/${fileId}/download`, {
      responseType: 'blob',
    }),

  makeDecision: (id: string, data: AdminDecisionRequest) =>
    apiClient.post<ApiResponse<null>>(`/api/v1/admin/submissions/${id}/decision`, data),

  // ── 论文周期管理 ──
  listPeriods: () =>
    apiClient.get<ApiResponse<SubmissionPeriodListItem[]>>('/api/v1/admin/periods/'),

  createPeriod: (data: SubmissionPeriodForm) =>
    apiClient.post<ApiResponse<SubmissionPeriod>>('/api/v1/admin/periods/', data),

  getPeriod: (id: string) =>
    apiClient.get<ApiResponse<SubmissionPeriod>>(`/api/v1/admin/periods/${id}`),

  updatePeriod: (id: string, data: SubmissionPeriodUpdate) =>
    apiClient.put<ApiResponse<SubmissionPeriod>>(`/api/v1/admin/periods/${id}`, data),

  deletePeriod: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/admin/periods/${id}`),

  // ── 评审管理 ──
  listReviewers: () =>
    apiClient.get<ApiResponse<Reviewer[]>>('/api/v1/admin/reviews/reviewers'),

  listAllAssignments: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<PagedResponse<ReviewAssignment>>('/api/v1/admin/reviews/assignments', { params }),

  manualAssign: (data: ManualAssignmentRequest) =>
    apiClient.post<ApiResponse<null>>('/api/v1/admin/reviews/assignments', data),

  autoAssign: (params?: { submission_id?: string }) =>
    apiClient.post<ApiResponse<null>>('/api/v1/admin/reviews/assignments/auto', null, { params }),

  toggleReviewVisibility: (reviewId: string, data: ReviewVisibilityUpdate) =>
    apiClient.post<ApiResponse<Review>>(
      `/api/v1/admin/reviews/reviews/${reviewId}/visibility`,
      data,
    ),
}
