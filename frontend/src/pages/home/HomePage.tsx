import { Typography, Row, Col, Card, Statistic, List, Button, Space } from 'antd'
import { EnvironmentOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { announcementApi } from '@/api/announcements'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const IMPORTANT_DATES = [
  { key: 'submission_deadline', date: '2026-06-01' },
  { key: 'notification_date', date: '2026-07-15' },
  { key: 'registration_deadline', date: '2026-08-01' },
  { key: 'conference_start', date: '2026-09-15' },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements-home'],
    queryFn: () => announcementApi.list(1, 3),
  })

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          padding: '64px 48px',
          marginBottom: 40,
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <Typography.Title level={1} style={{ color: '#fff', marginBottom: 8 }}>
          {t('home.title')}
        </Typography.Title>
        <Typography.Title level={4} style={{ color: '#91d5ff', fontWeight: 400, marginBottom: 16 }}>
          {t('home.subtitle')}
        </Typography.Title>
        <Typography.Text style={{ color: '#ccc', fontSize: 16, display: 'block', marginBottom: 24 }}>
          {t('home.description')}
        </Typography.Text>
        <Typography.Text style={{ color: '#aaa', display: 'block', marginBottom: 32 }}>
          <EnvironmentOutlined style={{ marginRight: 6 }} />
          西南大学行政楼报告厅，重庆
        </Typography.Text>
        {isLoggedIn() ? (
          <Space size="middle">
            <Button type="primary" size="large" icon={<FileTextOutlined />} onClick={() => navigate('/submission/new')}>
              {t('submission.submit')}
            </Button>
            <Button size="large" ghost onClick={() => navigate('/conference-registration')}>
              {t('nav.register')}
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button type="primary" size="large" onClick={() => navigate('/register')}>
              {t('auth.register_btn')}
            </Button>
            <Button size="large" ghost onClick={() => navigate('/login')}>
              {t('auth.login_btn')}
            </Button>
          </Space>
        )}
      </div>

      {/* 重要日期 */}
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        <CalendarOutlined style={{ marginRight: 8 }} />
        {t('home.countdown_title')}
      </Typography.Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {IMPORTANT_DATES.map(({ key, date }) => (
          <Col xs={24} sm={12} md={6} key={key}>
            <Card hoverable>
              <Statistic
                title={t(`home.${key}`)}
                value={date}
                valueStyle={{ fontSize: 18, color: '#1677ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 最新公告 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          {t('home.recent_announcements')}
        </Typography.Title>
        <Link to="/announcements">{t('home.view_all')}</Link>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <List
            dataSource={announcements?.items || []}
            locale={{ emptyText: t('common.no_data') }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Link to={`/announcements/${item.id}`}>{item.title}</Link>}
                  description={
                    item.created_at
                      ? new Date(item.created_at).toLocaleDateString('zh-CN')
                      : ''
                  }
                />
                <Typography.Text
                  type="secondary"
                  ellipsis
                  style={{ maxWidth: 400 }}
                >
                  {item.content}
                </Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  )
}
