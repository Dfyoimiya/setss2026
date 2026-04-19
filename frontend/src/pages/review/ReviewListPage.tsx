import { Table, Tag, Card, Row, Col, Statistic, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { reviewApi } from '@/api/reviews'
import { REVIEW_STATUS_LABELS, RECOMMENDATION_LABELS, type ReviewWithPaper } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

export default function ReviewListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { page, size, onChange } = usePagination(10)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['assignedReviews', page],
    queryFn: () => reviewApi.getAssigned(page, size),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const pending = data?.items.filter((r) => r.status === 'pending').length ?? 0
  const submitted = data?.items.filter((r) => r.status === 'submitted').length ?? 0

  const columns: ColumnsType<ReviewWithPaper> = [
    {
      title: t('submission.submission_number'),
      dataIndex: ['paper', 'submission_number'],
      key: 'submission_number',
      width: 140,
    },
    {
      title: t('submission.paper_title'),
      dataIndex: ['paper', 'title'],
      key: 'title',
    },
    {
      title: t('submission.topic'),
      dataIndex: ['paper', 'topic'],
      key: 'topic',
    },
    {
      title: t('review.status') || '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'submitted' ? 'success' : 'warning'}>
          {REVIEW_STATUS_LABELS[s] || s}
        </Tag>
      ),
    },
    {
      title: t('review.score'),
      dataIndex: 'score',
      key: 'score',
      render: (v: number | null) => (v != null ? `${v}/5` : '-'),
    },
    {
      title: t('review.recommendation'),
      dataIndex: 'recommendation',
      key: 'recommendation',
      render: (v: string | null) =>
        v ? (
          <Tag color={v === 'accept' ? 'success' : v === 'reject' ? 'error' : 'warning'}>
            {RECOMMENDATION_LABELS[v] || v}
          </Tag>
        ) : '-',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Button size="small" type="primary" onClick={() => navigate(`/review/${record.id}`)}>
          {record.status === 'pending' ? t('review.submit_btn') : '查看/修改'}
        </Button>
      ),
    },
  ]

  return (
    <PageWrapper title={t('review.title')}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="总分配任务" value={data?.total ?? 0} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('review.pending')} value={pending} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('review.submitted')} value={submitted} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data?.items || []}
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: t('common.no_data') }}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: size,
          onChange,
          showTotal: (total) => `${t('common.total')} ${total} ${t('common.items')}`,
        }}
      />
    </PageWrapper>
  )
}
