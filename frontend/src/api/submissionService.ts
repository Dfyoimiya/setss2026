import apiClient from './client'
import type {
  ApiResponse,
  PagedResponse,
  SubmissionForm,
  SubmissionUpdateForm,
  Submission,
  SubmissionListItem,
  SubmissionPeriodListItem,
  SubmissionFile,
  RebuttalForm,
  Rebuttal,
} from './types'

export const submissionService = {
  listPeriods: () =>
    apiClient.get<ApiResponse<SubmissionPeriodListItem[]>>('/api/v1/submissions/periods'),

  create: (data: SubmissionForm) =>
    apiClient.post<ApiResponse<Submission>>('/api/v1/submissions/', data),

  list: (params?: { page?: number; page_size?: number }) =>
    apiClient.get<PagedResponse<SubmissionListItem>>('/api/v1/submissions/', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Submission>>(`/api/v1/submissions/${id}`),

  update: (id: string, data: SubmissionUpdateForm) =>
    apiClient.put<ApiResponse<Submission>>(`/api/v1/submissions/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/api/v1/submissions/${id}`),

  uploadFile: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<SubmissionFile>>(
      `/api/v1/submissions/${id}/files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
  },

  downloadFile: (submissionId: string, fileId: string) =>
    apiClient.get(`/api/v1/submissions/${submissionId}/files/${fileId}/download`, {
      responseType: 'blob',
    }),

  submit: (id: string) =>
    apiClient.post<ApiResponse<Submission>>(`/api/v1/submissions/${id}/submit`),

  submitRevision: (id: string) =>
    apiClient.post<ApiResponse<Submission>>(`/api/v1/submissions/${id}/revision`),

  createRebuttal: (reviewId: string, data: RebuttalForm) =>
    apiClient.post<ApiResponse<Rebuttal>>(
      `/api/v1/submissions/reviews/${reviewId}/rebuttal`,
      data,
    ),
}
