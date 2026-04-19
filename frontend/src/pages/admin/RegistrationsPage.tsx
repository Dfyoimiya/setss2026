import { Table, Tag, Select, App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { adminApi } from '@/api/admin'
import { REGISTRATION_TYPE_LABELS, type Registration } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

const STATUS_OPTIONS = [
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'cancelled', label: '已取消' },
]

export default function AdminRegistrationsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { page, size, onChange } = usePagination(20)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminRegistrations', page],
    queryFn: () => adminApi.listRegistrations(page, size),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistrations'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<Registration> = [
    { title: '确认码', dataIndex: 'confirmation_code', key: 'confirmation_code', width: 140 },
    { title: '用户 ID', dataIndex: 'user_id', key: 'user_id', render: (v: string) => v.slice(0, 8) + '...' },
    {
      title: '参会类型',
      dataIndex: 'registration_type',
      key: 'registration_type',
      render: (v: string) => <Tag>{REGISTRATION_TYPE_LABELS[v] || v}</Tag>,
    },
    { title: '机构', dataIndex: 'institution', key: 'institution', render: (v) => v || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string, record) => (
        <Select
          value={s}
          size="small"
          style={{ width: 110 }}
          options={STATUS_OPTIONS}
          onChange={(val) => statusMutation.mutate({ id: record.id, status: val })}
        />
      ),
    },
    {
      title: '报名时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
  ]

  return (
    <PageWrapper title={t('admin.registrations')}>
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
