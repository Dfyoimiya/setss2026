import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reviewService } from '@/api/reviewService'
import type { AssignmentDecision, ReviewForm, ReviewUpdateForm } from '@/api/types'

export function useMyReviews(page = 1, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: ['reviews', 'mine', page, pageSize],
    queryFn: async () => {
      const res = await reviewService.listMyAssignments({ page, page_size: pageSize })
      return res.data
    },
    enabled,
    staleTime: 2 * 60 * 1000,
  })
}

export function useReviewDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await reviewService.getAssignment(id!)
      return res.data.data!
    },
    enabled: !!id,
  })
}

export function useAcceptAssignment() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: AssignmentDecision }) =>
      reviewService.acceptAssignment(id, data),
    onSuccess: () => {
      toast.success('已接受评审邀请')
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export function useDeclineAssignment() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewService.declineAssignment(id),
    onSuccess: () => {
      toast.success('已拒绝评审邀请')
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export function useSubmitReview() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewForm }) =>
      reviewService.submitReview(id, data),
    onSuccess: () => {
      toast.success('评审意见已提交')
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export function useUpdateReview() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewUpdateForm }) =>
      reviewService.updateReview(id, data),
    onSuccess: () => {
      toast.success('评审意见已更新')
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
