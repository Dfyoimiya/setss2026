import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { submissionService } from '@/api/submissionService'
import type { SubmissionForm, SubmissionUpdateForm, RebuttalForm } from '@/api/types'

export function useSubmissions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['submissions', 'list', page, pageSize],
    queryFn: async () => {
      const res = await submissionService.list({ page, page_size: pageSize })
      return res.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useSubmission(id: string | undefined) {
  return useQuery({
    queryKey: ['submissions', id],
    queryFn: async () => {
      const res = await submissionService.getById(id!)
      return res.data.data!
    },
    enabled: !!id,
  })
}

export function usePeriods() {
  return useQuery({
    queryKey: ['submissions', 'periods'],
    queryFn: async () => {
      const res = await submissionService.listPeriods()
      return res.data.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateSubmission() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmissionForm) => submissionService.create(data),
    onSuccess: () => {
      toast.success('论文提交成功')
      qc.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export function useUpdateSubmission() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmissionUpdateForm }) =>
      submissionService.update(id, data),
    onSuccess: (_res, vars) => {
      toast.success('论文已更新')
      qc.invalidateQueries({ queryKey: ['submissions', vars.id] })
      qc.invalidateQueries({ queryKey: ['submissions', 'list'] })
    },
  })
}

export function useDeleteSubmission() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => submissionService.delete(id),
    onSuccess: () => {
      toast.success('论文已撤回')
      qc.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      submissionService.uploadFile(id, file),
    onSuccess: () => {
      toast.success('文件上传成功')
    },
  })
}

export function useSubmitSubmission() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => submissionService.submit(id),
    onSuccess: () => {
      toast.success('论文已提交评审')
      qc.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export function useSubmitRevision() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => submissionService.submitRevision(id),
    onSuccess: () => {
      toast.success('修订版已提交')
      qc.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

export function useCreateRebuttal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: RebuttalForm }) =>
      submissionService.createRebuttal(reviewId, data),
    onSuccess: () => {
      toast.success('反驳意见已提交')
      qc.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}
