import { Table, Tag, Card, Row, Col, Statistic } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { adminApi } from '@/api/admin'
import { REVIEW_STATUS_LABELS, RECOMMENDATION_LABELS, type Review } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

export default function AdminReviewsPage() {
  const { t } = useTranslation()
  const { page, size, onChange } = usePagination(20)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminReviews', page],
    queryFn: () => adminApi.listReviews(page, size),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const pending = data?.items.filter((r) => r.status === 'pending').length ?? 0
  const submitted = data?.items.filter((r) => r.status === 'submitted').length ?? 0

  const columns: ColumnsType<Review> = [
    { title: '审稿 ID', dataIndex: 'id', key: 'id', render: (v: string) => v.slice(0, 8) + '...', width: 110 },
    { title: '论文 ID', dataIndex: 'paper_id', key: 'paper_id', render: (v: string) => v.slice(0, 8) + '...', width: 110 },
    { title: '审稿人 ID', dataIndex: 'reviewer_id', key: 'reviewer_id', render: (v: string) => v.slice(0, 8) + '...', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'submitted' ? 'success' : 'warning'}>
          {REVIEW_STATUS_LABELS[s] || s}
        </Tag>
      ),
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (v: number | null) => (v != null ? `${v}/5` : '-'),
    },
    {
      title: '推荐',
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
  ]

  return (
    <PageWrapper title={t('admin.reviews')}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="总审稿数" value={data?.total ?? 0} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="待审稿" value={pending} valueStyle={{ color: '#fa8c16' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="已提交" value={submitted} valueStyle={{ color: '#52c41a' }} /></Card>
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
