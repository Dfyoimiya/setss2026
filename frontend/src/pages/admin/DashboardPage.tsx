import { Card, Row, Col, Statistic, Progress, Tag, Space, Button, App } from 'antd'
import {
  TeamOutlined,
  FileTextOutlined,
  AuditOutlined,
  IdcardOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '@/api/admin'
import { PAPER_STATUS_LABELS, PAPER_STATUS_COLORS } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function AdminDashboard() {
  const { message } = App.useApp()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
    refetchInterval: 30000,
  })

  const remindMutation = useMutation({
    mutationFn: adminApi.remindPendingReviewers,
    onSuccess: (d: { message: string }) => message.success(d.message),
    onError: () => message.error('发送失败'),
  })

  if (isLoading) return <LoadingSpinner />
  if (!stats) return null

  const reviewProgress = stats.total_reviews > 0
    ? Math.round(((stats.total_reviews - stats.pending_reviews) / stats.total_reviews) * 100)
    : 0

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 600 }}>数据概览</span>
        <Button
          icon={<BellOutlined />}
          onClick={() => remindMutation.mutate()}
          loading={remindMutation.isPending}
        >
          提醒待审稿人
        </Button>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="注册用户"
              value={stats.total_users}
              prefix={<TeamOutlined style={{ color: '#1677ff' }} />}
              suffix={<Link to="/admin/users" style={{ fontSize: 12, marginLeft: 8 }}>管理</Link>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="投稿总数"
              value={stats.total_papers}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              suffix={<Link to="/admin/papers" style={{ fontSize: 12, marginLeft: 8 }}>管理</Link>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="审稿任务"
              value={stats.total_reviews}
              prefix={<AuditOutlined style={{ color: '#faad14' }} />}
              suffix={<Link to="/admin/reviews" style={{ fontSize: 12, marginLeft: 8 }}>管理</Link>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="参会报名"
              value={stats.total_registrations}
              prefix={<IdcardOutlined style={{ color: '#722ed1' }} />}
              suffix={<Link to="/admin/registrations" style={{ fontSize: 12, marginLeft: 8 }}>管理</Link>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 论文状态分布 */}
        <Col xs={24} md={12}>
          <Card title="论文状态分布" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {Object.entries(PAPER_STATUS_LABELS).map(([status, label]) => {
                const count = stats.papers_by_status[status] ?? 0
                const pct = stats.total_papers > 0 ? Math.round((count / stats.total_papers) * 100) : 0
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Tag color={PAPER_STATUS_COLORS[status]}>{label}</Tag>
                      <span style={{ color: '#666', fontSize: 13 }}>{count} 篇</span>
                    </div>
                    <Progress percent={pct} size="small" showInfo={false} strokeColor={
                      status === 'accepted' ? '#52c41a' :
                      status === 'rejected' ? '#ff4d4f' :
                      status === 'under_review' ? '#1677ff' :
                      status === 'revision_required' ? '#faad14' : '#d9d9d9'
                    } />
                  </div>
                )
              })}
            </Space>
          </Card>
        </Col>

        {/* 审稿进度 + 报名类型 */}
        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <Card title="审稿完成进度">
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <Progress
                  type="circle"
                  percent={reviewProgress}
                  format={(p) => (
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{p}%</div>
                      <div style={{ fontSize: 12, color: '#888' }}>已完成</div>
                    </div>
                  )}
                  strokeColor={{ '0%': '#1677ff', '100%': '#52c41a' }}
                />
                <div style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
                  {stats.total_reviews - stats.pending_reviews} / {stats.total_reviews} 篇已审
                  {stats.pending_reviews > 0 && (
                    <span style={{ color: '#faad14', marginLeft: 8 }}>
                      ({stats.pending_reviews} 篇待审)
                    </span>
                  )}
                </div>
              </div>
            </Card>

            <Card title="报名类型分布">
              <Space wrap>
                {Object.entries(stats.registrations_by_type).map(([type, count]) => (
                  <Tag key={type} color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
                    {type === 'student' ? '学生' :
                     type === 'regular' ? '普通' :
                     type === 'speaker' ? '演讲者' :
                     type === 'virtual' ? '线上' : type}
                    : {count}
                  </Tag>
                ))}
                {Object.keys(stats.registrations_by_type).length === 0 && (
                  <span style={{ color: '#999' }}>暂无报名</span>
                )}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}
