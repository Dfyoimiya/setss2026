import { useState } from 'react'
import { Table, Input, Button, Space, Typography, App } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { adminApi } from '@/api/admin'
import { type ConfigItem } from '@/types'
import PageWrapper from '@/components/common/PageWrapper'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'

export default function AdminConfigPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminConfig'],
    queryFn: adminApi.listConfig,
  })

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminApi.updateConfig(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminConfig'] })
      message.success(t('common.operation_success'))
      setEditingKey(null)
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<ConfigItem> = [
    {
      title: '配置键',
      dataIndex: 'key',
      key: 'key',
      width: 220,
      render: (v: string) => <Typography.Text code>{v}</Typography.Text>,
    },
    {
      title: '配置值',
      dataIndex: 'value',
      key: 'value',
      render: (v: string, record) =>
        editingKey === record.key ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onPressEnter={() => updateMutation.mutate({ key: record.key, value: editValue })}
            autoFocus
          />
        ) : (
          <Typography.Text ellipsis style={{ maxWidth: 300 }}>{v}</Typography.Text>
        ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (v: string | null) => v || '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 140,
      render: (_, record) =>
        editingKey === record.key ? (
          <Space>
            <Button
              size="small"
              type="primary"
              loading={updateMutation.isPending}
              onClick={() => updateMutation.mutate({ key: record.key, value: editValue })}
            >
              {t('admin.save')}
            </Button>
            <Button size="small" onClick={() => setEditingKey(null)}>
              {t('admin.cancel')}
            </Button>
          </Space>
        ) : (
          <Button
            size="small"
            onClick={() => {
              setEditingKey(record.key)
              setEditValue(record.value)
            }}
          >
            {t('admin.edit')}
          </Button>
        ),
    },
  ]

  return (
    <PageWrapper title={t('admin.config')}>
      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="key"
        pagination={false}
        locale={{ emptyText: t('common.no_data') }}
      />
    </PageWrapper>
  )
}
