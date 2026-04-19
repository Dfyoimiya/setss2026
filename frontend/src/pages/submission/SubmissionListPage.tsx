import { Table, Tag, Button, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { paperApi } from '@/api/papers'
import { PAPER_STATUS_LABELS, PAPER_STATUS_COLORS, type Paper } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

export default function SubmissionListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { page, size, onChange } = usePagination(10)
  App.useApp() // ensure context

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myPapers', page],
    queryFn: () => paperApi.listMine(page, size),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<Paper> = [
    {
      title: t('submission.submission_number'),
      dataIndex: 'submission_number',
      key: 'submission_number',
      width: 150,
    },
    {
      title: t('submission.paper_title'),
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record) => (
        <a onClick={() => navigate(`/submission/${record.id}`)}>{title}</a>
      ),
    },
    {
      title: t('submission.topic'),
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: t('submission.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={PAPER_STATUS_COLORS[status]}>{PAPER_STATUS_LABELS[status] || status}</Tag>
      ),
    },
    {
      title: t('submission.submit_date'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Button size="small" onClick={() => navigate(`/submission/${record.id}`)}>
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('submission.title')}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/submission/new')}
        >
          {t('submission.submit')}
        </Button>
      }
    >
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
