import { useState } from 'react'
import {
  Card,
  Descriptions,
  Tag,
  Table,
  Button,
  Upload,
  Breadcrumb,
  Space,
  Typography,
  App,
} from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import { paperApi } from '@/api/papers'
import { PAPER_STATUS_LABELS, PAPER_STATUS_COLORS, type PaperAuthor } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'

export default function PaperDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const [crFile, setCrFile] = useState<File | null>(null)

  const { data: paper, isLoading, isError, refetch } = useQuery({
    queryKey: ['paper', id],
    queryFn: () => paperApi.get(id!),
    enabled: !!id,
  })

  const crMutation = useMutation({
    mutationFn: () => paperApi.uploadCameraReady(id!, crFile!),
    onSuccess: () => {
      message.success(t('common.operation_success'))
      setCrFile(null)
      queryClient.invalidateQueries({ queryKey: ['paper', id] })
      refetch()
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError || !paper) return <ErrorResult onRetry={refetch} />

  const authorColumns: ColumnsType<PaperAuthor> = [
    { title: '顺序', dataIndex: 'order', key: 'order', width: 60 },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '机构', dataIndex: 'institution', key: 'institution' },
    {
      title: '通讯作者',
      dataIndex: 'is_corresponding',
      key: 'is_corresponding',
      render: (v: boolean) => v ? <Tag color="blue">是</Tag> : null,
    },
  ]

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">{t('nav.home')}</Link> },
          { title: <Link to="/submission">{t('submission.title')}</Link> },
          { title: paper.submission_number },
        ]}
      />

      {/* 元数据 */}
      <Card title="论文信息" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('submission.submission_number')}>
            <Typography.Text strong>{paper.submission_number}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('submission.status')}>
            <Tag color={PAPER_STATUS_COLORS[paper.status]}>
              {PAPER_STATUS_LABELS[paper.status] || paper.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('submission.paper_title')} span={2}>
            {paper.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('submission.topic')}>{paper.topic}</Descriptions.Item>
          <Descriptions.Item label={t('submission.submit_date')}>
            {paper.created_at ? new Date(paper.created_at).toLocaleString('zh-CN') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('submission.abstract')} span={2}>
            <Typography.Paragraph style={{ margin: 0 }}>{paper.abstract}</Typography.Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label={t('submission.keywords')} span={2}>
            {paper.keywords}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 合著者 */}
      {paper.co_authors?.length > 0 && (
        <Card title={t('submission.co_authors')} style={{ marginBottom: 24 }}>
          <Table
            dataSource={paper.co_authors}
            columns={authorColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* 文件 */}
      <Card title="文件管理">
        <Space direction="vertical" style={{ width: '100%' }}>
          {paper.file_path && (
            <div>
              <Typography.Text strong>投稿文件：</Typography.Text>{' '}
              <Button
                icon={<DownloadOutlined />}
                href={paperApi.downloadUrl(id!)}
                target="_blank"
              >
                下载 PDF
              </Button>
            </div>
          )}
          {paper.status === 'accepted' && (
            <div>
              <Typography.Text strong>{t('submission.camera_ready')}：</Typography.Text>
              <Space style={{ marginTop: 8 }}>
                <Upload
                  beforeUpload={(f) => {
                    if (f.type !== 'application/pdf') { message.error('仅支持 PDF'); return false }
                    setCrFile(f)
                    return false
                  }}
                  fileList={crFile ? [{ uid: '-1', name: crFile.name, status: 'done' }] : []}
                  onRemove={() => setCrFile(null)}
                  accept=".pdf"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>选择终稿</Button>
                </Upload>
                <Button
                  type="primary"
                  disabled={!crFile}
                  loading={crMutation.isPending}
                  onClick={() => crMutation.mutate()}
                >
                  上传终稿
                </Button>
              </Space>
              {paper.camera_ready_path && (
                <Typography.Text type="success" style={{ display: 'block', marginTop: 8 }}>
                  ✓ 终稿已上传
                </Typography.Text>
              )}
            </div>
          )}
        </Space>
      </Card>
    </div>
  )
}
