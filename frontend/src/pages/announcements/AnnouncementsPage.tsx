import { List, Card, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { announcementApi } from '@/api/announcements'
import { usePagination } from '@/hooks/usePagination'
import PageWrapper from '@/components/common/PageWrapper'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'

export default function AnnouncementsPage() {
  const { t } = useTranslation()
  const { page, size, onChange } = usePagination(10)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['announcements', page],
    queryFn: () => announcementApi.list(page, size),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorResult onRetry={refetch} />

  return (
    <PageWrapper title={t('nav.announcements')}>
      <Card>
        <List
          dataSource={data?.items || []}
          locale={{ emptyText: t('common.no_data') }}
          pagination={{
            total: data?.total,
            current: page,
            pageSize: size,
            onChange,
            showTotal: (total) => `${t('common.total')} ${total} ${t('common.items')}`,
          }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/announcements/${item.id}`} style={{ fontSize: 16 }}>
                    {item.title}
                  </Link>
                }
                description={
                  item.created_at
                    ? new Date(item.created_at).toLocaleDateString('zh-CN')
                    : ''
                }
              />
              <Typography.Text type="secondary" ellipsis style={{ maxWidth: 500 }}>
                {item.content.slice(0, 120)}{item.content.length > 120 ? '...' : ''}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </PageWrapper>
  )
}
