import { useEffect } from 'react'
import {
  Card,
  Descriptions,
  Form,
  Input,
  Radio,
  Button,
  Space,
  Slider,
  Typography,
  App,
} from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reviewApi } from '@/api/reviews'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'

const schema = z.object({
  score: z.number().min(1).max(5).int(),
  comments: z.string().min(10),
  recommendation: z.enum(['accept', 'reject', 'revise'] as const),
})
type ReviewForm = z.infer<typeof schema>

export default function ReviewDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const { data: review, isLoading, isError, refetch } = useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewApi.get(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(schema),
    defaultValues: { score: 3, comments: '', recommendation: 'accept' },
  })

  useEffect(() => {
    if (review) {
      reset({
        score: review.score ?? 3,
        comments: review.comments ?? '',
        recommendation: (review.recommendation as ReviewForm['recommendation']) ?? 'accept',
      })
    }
  }, [review, reset])

  const submitMutation = useMutation({
    mutationFn: (data: ReviewForm) =>
      review?.status === 'pending'
        ? reviewApi.submit(id!, data)
        : reviewApi.update(id!, data),
    onSuccess: () => {
      message.success(t('common.operation_success'))
      queryClient.invalidateQueries({ queryKey: ['review', id] })
      queryClient.invalidateQueries({ queryKey: ['assignedReviews'] })
      navigate('/review')
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError || !review) return <ErrorResult onRetry={refetch} />

  // review.get returns Review (not ReviewWithPaper), so we need to fetch paper separately
  // The review object has paper_id but not paper details — show what we have
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* 论文信息（双盲，仅显示 paper_id） */}
      <Card title={t('review.paper_info')} style={{ marginBottom: 24 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="论文 ID">
            <Typography.Text code>{review.paper_id}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="审稿状态">
            {review.status === 'submitted' ? t('review.submitted') : t('review.pending')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 审稿表单 */}
      <Card title={t('review.submit_review')}>
        <Form layout="vertical" onFinish={handleSubmit((d) => submitMutation.mutate(d))}>
          <Form.Item
            label={t('review.score')}
            validateStatus={errors.score ? 'error' : ''}
            help={errors.score?.message}
          >
            <Controller
              control={control}
              name="score"
              render={({ field }) => (
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
                  value={field.value}
                  onChange={field.onChange}
                  style={{ width: 300 }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={t('review.comments')}
            validateStatus={errors.comments ? 'error' : ''}
            help={errors.comments?.message}
          >
            <Input.TextArea rows={6} {...register('comments')} />
          </Form.Item>

          <Form.Item
            label={t('review.recommendation')}
            validateStatus={errors.recommendation ? 'error' : ''}
            help={errors.recommendation?.message}
          >
            <Controller
              control={control}
              name="recommendation"
              render={({ field }) => (
                <Radio.Group {...field}>
                  <Radio value="accept">{t('review.accept')}</Radio>
                  <Radio value="reject">{t('review.reject')}</Radio>
                  <Radio value="revise">{t('review.revise')}</Radio>
                </Radio.Group>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/review')}>{t('profile.cancel')}</Button>
              <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
                {review.status === 'submitted' ? '更新意见' : t('review.submit_btn')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
