import { Card, Breadcrumb, Typography, Button, Skeleton } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { announcementApi } from '@/api/announcements'
import ErrorResult from '@/components/common/ErrorResult'

export default function AnnouncementDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementApi.get(id!),
    enabled: !!id,
  })

  if (isError) return <ErrorResult onRetry={refetch} />

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/">{t('nav.home')}</Link> },
          { title: <Link to="/announcements">{t('nav.announcements')}</Link> },
          { title: isLoading ? '...' : data?.title },
        ]}
      />
      <Card>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <>
            <Typography.Title level={2}>{data?.title}</Typography.Title>
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              {data?.created_at
                ? new Date(data.created_at).toLocaleString('zh-CN')
                : ''}
            </Typography.Text>
            <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.8 }}>
              {data?.content}
            </Typography.Paragraph>
          </>
        )}
        <Button style={{ marginTop: 24 }} onClick={() => navigate('/announcements')}>
          ← {t('nav.announcements')}
        </Button>
      </Card>
    </div>
  )
}
