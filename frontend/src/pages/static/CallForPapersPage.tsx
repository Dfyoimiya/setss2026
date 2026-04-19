import { Typography, Card, Table, Button, Space } from 'antd'
import {
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import PageWrapper from '@/components/common/PageWrapper'

const { Title, Paragraph, Text } = Typography

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

const DATES = [
  { label: 'Paper Submission Deadline', date: '2026-06-01' },
  { label: 'Acceptance Notification', date: '2026-07-15' },
  { label: 'Camera-Ready Deadline', date: '2026-07-30' },
  { label: 'Conference Dates', date: '2026-09-15 ~ 09-17' },
]

export default function CallForPapersPage() {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuthStore()

  const dateColumns = [
    { title: 'Event', dataIndex: 'label', key: 'label' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ]

  return (
    <PageWrapper title={t('nav.cfp')}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 简介 */}
        <Card>
          <Title level={4}>关于 SETSS 2026</Title>
          <Paragraph>
            SETSS 2026（Software Engineering Technology Symposium & Summit 2026）是由西南大学主办的国际学术会议，旨在汇聚全球软件工程领域的研究者、工程师与行业专家，共同探讨前沿技术与实践经验。
          </Paragraph>
          <Paragraph>
            We invite submissions of original, unpublished research papers on all aspects of software engineering. All submitted papers will undergo a rigorous double-blind peer review process by the international program committee.
          </Paragraph>
        </Card>

        {/* 主题 */}
        <Card title={<><CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />感兴趣的研究主题</>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 8 }}>
            {TOPICS.map((topic) => (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#1677ff' }} />
                <Text>{topic}</Text>
              </div>
            ))}
          </div>
        </Card>

        {/* 提交要求 */}
        <Card title={<><FileTextOutlined style={{ marginRight: 8 }} />提交要求</>}>
          <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>论文须为原创未发表研究成果</li>
            <li>采用 IEEE 双栏格式，正文不超过 10 页（含图表），参考文献另计</li>
            <li>实行双盲评审，请确保论文中不含作者身份信息</li>
            <li>仅接受 PDF 格式，文件大小不超过 20MB</li>
            <li>至少一位作者须在接受后完成注册并出席会议</li>
          </ul>
        </Card>

        {/* 重要日期 */}
        <Card title={<><CalendarOutlined style={{ marginRight: 8 }} />重要日期</>}>
          <Table
            dataSource={DATES}
            columns={dateColumns}
            rowKey="label"
            pagination={false}
            size="small"
          />
        </Card>

        {/* CTA */}
        <Card style={{ textAlign: 'center' }}>
          <Title level={4}>准备好了吗？</Title>
          <Paragraph type="secondary">立即登录并提交您的论文</Paragraph>
          <Space>
            {isLoggedIn() ? (
              <Link to="/submission/new">
                <Button type="primary" size="large" icon={<FileTextOutlined />}>
                  {t('submission.submit')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button type="primary" size="large">{t('auth.register_btn')}</Button>
                </Link>
                <Link to="/login">
                  <Button size="large">{t('auth.login_btn')}</Button>
                </Link>
              </>
            )}
          </Space>
        </Card>
      </Space>
    </PageWrapper>
  )
}
