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
  Tag,
  Alert,
  App,
} from 'antd'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reviewApi } from '@/api/reviews'
import { paperApi } from '@/api/papers'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'

const schema = z.object({
  score: z.number().min(1).max(5).int(),
  comments: z.string().min(10, '审稿意见至少 10 个字符'),
  recommendation: z.enum(['accept', 'reject', 'revise'] as const),
})
type ReviewForm = z.infer<typeof schema>

const SCORE_LABELS: Record<number, string> = {
  1: '强烈拒绝',
  2: '拒绝',
  3: '边界',
  4: '接受',
  5: '强烈接受',
}

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

  const { data: paper } = useQuery({
    queryKey: ['paper-blind', review?.paper_id],
    queryFn: () => paperApi.get(review!.paper_id),
    enabled: !!review?.paper_id,
  })

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: zodResolver(schema),
    defaultValues: { score: 3, comments: '', recommendation: 'accept' },
  })

  const currentScore = watch('score')

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

  const handleDownload = async () => {
    if (!review?.paper_id) return
    try {
      const { url, filename } = await paperApi.getDownloadUrl(review.paper_id)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.target = '_blank'
      a.click()
    } catch {
      message.error('下载失败，请重试')
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !review) return <ErrorResult onRetry={refetch} />

  const isSubmitted = review.status === 'submitted'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        type="text"
        onClick={() => navigate('/review')}
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        返回审稿列表
      </Button>

      {isSubmitted && (
        <Alert
          message="您已提交审稿意见，可在此修改"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 论文信息（双盲） */}
      <Card
        title={t('review.paper_info')}
        style={{ marginBottom: 24 }}
        extra={
          <Button icon={<DownloadOutlined />} size="small" onClick={handleDownload}>
            下载论文 PDF
          </Button>
        }
      >
        {paper ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="投稿编号">
              <Typography.Text strong>{(paper as { submission_number?: string }).submission_number ?? review.paper_id}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="论文标题">
              {(paper as { title?: string }).title ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="研究主题">
              <Tag color="blue">{(paper as { topic?: string }).topic ?? '—'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关键词">
              {(paper as { keywords?: string }).keywords ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="摘要">
              <Typography.Paragraph
                ellipsis={{ rows: 4, expandable: true, symbol: '展开' }}
                style={{ margin: 0 }}
              >
                {(paper as { abstract?: string }).abstract ?? '—'}
              </Typography.Paragraph>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text type="secondary">论文信息加载中…</Typography.Text>
        )}
      </Card>

      {/* 审稿表单 */}
      <Card title={t('review.submit_review')}>
        <Form layout="vertical" onFinish={handleSubmit((d) => submitMutation.mutate(d))}>
          {/* 评分 */}
          <Form.Item
            label={
              <Space>
                <span>{t('review.score')}</span>
                <Tag color={
                  currentScore >= 4 ? 'success' :
                  currentScore === 3 ? 'warning' : 'error'
                }>
                  {currentScore} — {SCORE_LABELS[currentScore]}
                </Tag>
              </Space>
            }
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
                  marks={Object.fromEntries(
                    Object.entries(SCORE_LABELS).map(([k, v]) => [k, { label: v, style: { fontSize: 11 } }])
                  )}
                  value={field.value}
                  onChange={field.onChange}
                  style={{ width: '100%', maxWidth: 500, marginBottom: 24 }}
                />
              )}
            />
          </Form.Item>

          {/* 推荐决定 */}
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
                  <Radio.Button value="accept" style={{ color: '#52c41a' }}>
                    ✓ {t('review.accept')}
                  </Radio.Button>
                  <Radio.Button value="revise" style={{ color: '#faad14' }}>
                    ↻ {t('review.revise')}
                  </Radio.Button>
                  <Radio.Button value="reject" style={{ color: '#ff4d4f' }}>
                    ✗ {t('review.reject')}
                  </Radio.Button>
                </Radio.Group>
              )}
            />
          </Form.Item>

          {/* 审稿意见 */}
          <Form.Item
            label={t('review.comments')}
            validateStatus={errors.comments ? 'error' : ''}
            help={errors.comments?.message}
          >
            <Controller
              control={control}
              name="comments"
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={8}
                  placeholder="请详细描述论文的优点、不足及修改建议（至少 10 个字符）"
                  showCount
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/review')}>{t('profile.cancel')}</Button>
              <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
                {isSubmitted ? '更新审稿意见' : t('review.submit_btn')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
