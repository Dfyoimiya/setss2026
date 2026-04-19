import { Table, Switch, Select, App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { adminApi } from '@/api/admin'
import { type User } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

const ROLE_OPTIONS = [
  { value: 'user', label: '普通用户' },
  { value: 'reviewer', label: '审稿人' },
  { value: 'admin', label: '管理员' },
]

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { page, size, onChange } = usePagination(20)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.listUsers(page, size),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminApi.updateUserStatus(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<User> = [
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '姓名', dataIndex: 'full_name', key: 'full_name', render: (v) => v || '-' },
    { title: '机构', dataIndex: 'institution', key: 'institution', render: (v) => v || '-' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record) => (
        <Select
          value={role}
          size="small"
          style={{ width: 110 }}
          options={ROLE_OPTIONS}
          onChange={(r) => roleMutation.mutate({ id: record.id, role: r })}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (v: boolean, record) => (
        <Switch
          checked={v}
          size="small"
          onChange={(val) => statusMutation.mutate({ id: record.id, is_active: val })}
        />
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
  ]

  return (
    <PageWrapper title={t('admin.users')}>
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
