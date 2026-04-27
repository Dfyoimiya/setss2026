import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/api/adminService'
import type {
  RoleUpdateRequest,
  StatusUpdateRequest,
  SubmissionPeriodForm,
  SubmissionPeriodUpdate,
  ManualAssignmentRequest,
  AdminDecisionRequest,
  ReviewVisibilityUpdate,
} from '@/api/types'

// ── 用户管理 ──

export function useAdminUsers(page = 1, pageSize = 20, keyword = '') {
  return useQuery({
    queryKey: ['admin', 'users', page, pageSize, keyword],
    queryFn: async () => {
      const res = await adminService.listUsers({ page, page_size: pageSize, keyword })
      return res.data
    },
    staleTime: 1 * 60 * 1000,
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RoleUpdateRequest }) =>
      adminService.updateUserRole(userId, data),
    onSuccess: () => {
      toast.success('角色已更新')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useUpdateUserStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: StatusUpdateRequest }) =>
      adminService.updateUserStatus(userId, data),
    onSuccess: () => {
      toast.success('状态已更新')
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

// ── 论文管理 ──

export function useAdminSubmissions(page = 1, pageSize = 20, keyword = '') {
  return useQuery({
    queryKey: ['admin', 'submissions', page, pageSize, keyword],
    queryFn: async () => {
      const res = await adminService.listAllSubmissions({ page, page_size: pageSize, keyword })
      return res.data
    },
    staleTime: 1 * 60 * 1000,
  })
}

export function useMakeDecision() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminDecisionRequest }) =>
      adminService.makeDecision(id, data),
    onSuccess: () => {
      toast.success('评审决定已提交')
      qc.invalidateQueries({ queryKey: ['admin', 'submissions'] })
    },
  })
}

// ── 投稿周期管理 ──

export function useAdminPeriods() {
  return useQuery({
    queryKey: ['admin', 'periods'],
    queryFn: async () => {
      const res = await adminService.listPeriods()
      return res.data.data!
    },
  })
}

export function useCreatePeriod() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmissionPeriodForm) => adminService.createPeriod(data),
    onSuccess: () => {
      toast.success('投稿周期已创建')
      qc.invalidateQueries({ queryKey: ['admin', 'periods'] })
    },
  })
}

export function useUpdatePeriod() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmissionPeriodUpdate }) =>
      adminService.updatePeriod(id, data),
    onSuccess: () => {
      toast.success('投稿周期已更新')
      qc.invalidateQueries({ queryKey: ['admin', 'periods'] })
    },
  })
}

// ── 评审管理 ──

export function useAdminReviewers() {
  return useQuery({
    queryKey: ['admin', 'reviewers'],
    queryFn: async () => {
      const res = await adminService.listReviewers()
      return res.data.data!
    },
  })
}

export function useAdminReviews(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin', 'reviews', page, pageSize],
    queryFn: async () => {
      const res = await adminService.listAllAssignments({ page, page_size: pageSize })
      return res.data
    },
    staleTime: 1 * 60 * 1000,
  })
}

export function useManualAssign() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: ManualAssignmentRequest) => adminService.manualAssign(data),
    onSuccess: () => {
      toast.success('评审人已指定')
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}

export function useAutoAssign() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (submissionId?: string) =>
      adminService.autoAssign(submissionId ? { submission_id: submissionId } : undefined),
    onSuccess: () => {
      toast.success('评审人已自动分配')
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}

export function useToggleReviewVisibility() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: ReviewVisibilityUpdate }) =>
      adminService.toggleReviewVisibility(reviewId, data),
    onSuccess: () => {
      toast.success('评审可见性已切换')
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] })
    },
  })
}
