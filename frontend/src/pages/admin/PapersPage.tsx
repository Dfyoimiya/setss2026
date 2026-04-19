import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Select,
  Modal,
  App,
} from 'antd'
import { ExportOutlined, UserAddOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { adminApi } from '@/api/admin'
import { PAPER_STATUS_LABELS, type Paper } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

const TOPICS = [
  'Software Engineering Methods & Practices',
  'Distributed Systems & Cloud Computing',
  'Artificial Intelligence & Machine Learning',
  'DevOps, CI/CD & Software Quality',
  'Formal Methods & Program Verification',
  'Human-Computer Interaction',
  'Software Security & Privacy',
  'Open Source Software & Ecosystems',
]

export default function AdminPapersPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { page, size, onChange, reset } = usePagination(20)

  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [topicFilter, setTopicFilter] = useState<string | undefined>()
  const [assignModal, setAssignModal] = useState<{ open: boolean; paperId: string }>({
    open: false,
    paperId: '',
  })
  const [selectedReviewer, setSelectedReviewer] = useState<string | undefined>()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminPapers', page, statusFilter, topicFilter],
    queryFn: () => adminApi.listPapers(page, size, statusFilter, topicFilter),
  })

  const { data: allUsers } = useQuery({
    queryKey: ['adminUsersAll'],
    queryFn: () => adminApi.listUsers(1, 100),
    enabled: assignModal.open,
  })

  const reviewerOptions =
    allUsers?.items
      .filter((u) => u.role.includes('reviewer') || u.role.includes('admin'))
      .map((u) => ({ value: u.id, label: `${u.full_name || u.email} (${u.role})` })) ?? []

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updatePaperStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPapers'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  const assignMutation = useMutation({
    mutationFn: ({ paperId, reviewerId }: { paperId: string; reviewerId: string }) =>
      adminApi.assignReviewer(paperId, reviewerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPapers'] })
      message.success(t('common.operation_success'))
      setAssignModal({ open: false, paperId: '' })
      setSelectedReviewer(undefined)
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<Paper> = [
    { title: '编号', dataIndex: 'submission_number', key: 'submission_number', width: 130 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '主题', dataIndex: 'topic', key: 'topic', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string, record) => (
        <Select
          value={s}
          size="small"
          style={{ width: 120 }}
          options={Object.entries(PAPER_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          onChange={(val) => statusMutation.mutate({ id: record.id, status: val })}
        />
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Button
          size="small"
          icon={<UserAddOutlined />}
          onClick={() => setAssignModal({ open: true, paperId: record.id })}
        >
          {t('admin.assign_reviewer')}
        </Button>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('admin.papers')}
      extra={
        <Button
          icon={<ExportOutlined />}
          onClick={() => window.open(adminApi.exportPapers())}
        >
          {t('admin.export_csv')}
        </Button>
      }
    >
      {/* 过滤栏 */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="所有状态"
          allowClear
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); reset() }}
          options={Object.entries(PAPER_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
          style={{ width: 140 }}
        />
        <Select
          placeholder="所有主题"
          allowClear
          value={topicFilter}
          onChange={(v) => { setTopicFilter(v); reset() }}
          options={TOPICS.map((tp) => ({ value: tp, label: tp }))}
          style={{ width: 260 }}
        />
        <Button
          onClick={() => {
            setStatusFilter(undefined)
            setTopicFilter(undefined)
            reset()
          }}
        >
          {t('common.reset')}
        </Button>
      </Space>

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

      {/* 分配审稿人 Modal */}
      <Modal
        title={t('admin.assign_reviewer')}
        open={assignModal.open}
        onCancel={() => { setAssignModal({ open: false, paperId: '' }); setSelectedReviewer(undefined) }}
        onOk={() => {
          if (selectedReviewer) {
            assignMutation.mutate({ paperId: assignModal.paperId, reviewerId: selectedReviewer })
          }
        }}
        okButtonProps={{ disabled: !selectedReviewer, loading: assignMutation.isPending }}
        okText={t('admin.save')}
        cancelText={t('admin.cancel')}
      >
        <Select
          placeholder="选择审稿人"
          style={{ width: '100%' }}
          value={selectedReviewer}
          onChange={setSelectedReviewer}
          options={reviewerOptions}
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
        />
      </Modal>
    </PageWrapper>
  )
}
