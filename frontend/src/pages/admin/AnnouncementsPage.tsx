import { useState } from 'react'
import { Table, Tag, Button, Space, Modal, Form, Input, Switch, Popconfirm, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { announcementApi } from '@/api/announcements'
import { adminApi } from '@/api/admin'
import { type Announcement } from '@/types'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import ErrorResult from '@/components/common/ErrorResult'

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  is_published: z.boolean(),
})
type AnnouncementForm = z.infer<typeof schema>

interface AnnouncementModalProps {
  open: boolean
  onClose: () => void
  initialData?: Announcement
}

function AnnouncementModal({ open, onClose, initialData }: AnnouncementModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? { title: initialData.title, content: initialData.content, is_published: initialData.is_published }
      : { is_published: false },
  })

  const mutation = useMutation({
    mutationFn: (data: AnnouncementForm) =>
      isEdit
        ? announcementApi.update(initialData!.id, data)
        : announcementApi.create(data),
    onSuccess: () => {
      message.success(t('common.operation_success'))
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
      reset()
      onClose()
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  return (
    <Modal
      title={isEdit ? t('admin.edit') : t('admin.create')}
      open={open}
      onCancel={() => { reset(); onClose() }}
      onOk={handleSubmit((d: AnnouncementForm) => mutation.mutate(d))}
      okButtonProps={{ loading: mutation.isPending }}
      okText={t('admin.save')}
      cancelText={t('admin.cancel')}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item
          label="标题"
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
        >
          <Input {...register('title')} />
        </Form.Item>
        <Form.Item
          label="内容"
          validateStatus={errors.content ? 'error' : ''}
          help={errors.content?.message}
        >
          <Input.TextArea rows={6} {...register('content')} />
        </Form.Item>
        <Form.Item label="立即发布">
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <Switch checked={field.value} onChange={field.onChange} />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function AdminAnnouncementsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { page, size, onChange } = usePagination(20)
  const [modalState, setModalState] = useState<{ open: boolean; data?: Announcement }>({ open: false })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAnnouncements', page],
    queryFn: () => adminApi.listAllAnnouncements(page, size),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  const columns: ColumnsType<Announcement> = [
    { title: '标题', dataIndex: 'title', key: 'title' },
    {
      title: '状态',
      dataIndex: 'is_published',
      key: 'is_published',
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>{v ? '已发布' : '草稿'}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string | null) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-'),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => setModalState({ open: true, data: record })}>
            {t('admin.edit')}
          </Button>
          <Popconfirm
            title={t('common.confirm_delete')}
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button size="small" danger>
              {t('admin.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageWrapper
      title={t('admin.announcements')}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalState({ open: true })}
        >
          {t('admin.create')}
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
      <AnnouncementModal
        open={modalState.open}
        onClose={() => setModalState({ open: false })}
        initialData={modalState.data}
      />
    </PageWrapper>
  )
}
