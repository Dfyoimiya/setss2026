import { Typography, Card, Row, Col, Avatar, Space, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/common/PageWrapper'

const { Title, Text } = Typography

interface Member {
  name: string
  nameCn?: string
  institution: string
  role: string
  color: string
}

const PROGRAM_CHAIRS: Member[] = [
  { name: 'Prof. Wei Zhang', nameCn: '张伟', institution: '西南大学', role: 'General Chair', color: '#1677ff' },
  { name: 'Prof. Li Chen', nameCn: '陈莉', institution: 'Tsinghua University', role: 'Program Chair', color: '#52c41a' },
]

const TPC_MEMBERS: Member[] = [
  { name: 'Prof. John Smith', institution: 'MIT', role: 'TPC Member', color: '#722ed1' },
  { name: 'Dr. Maria Garcia', institution: 'ETH Zurich', role: 'TPC Member', color: '#eb2f96' },
  { name: 'Prof. Yuki Tanaka', institution: 'Tokyo University', role: 'TPC Member', color: '#fa8c16' },
  { name: 'Dr. Ahmed Hassan', institution: 'Cairo University', role: 'TPC Member', color: '#13c2c2' },
  { name: 'Prof. Anna Müller', institution: 'TU Berlin', role: 'TPC Member', color: '#f5222d' },
  { name: 'Dr. Liu Yang', nameCn: '杨柳', institution: 'Peking University', role: 'TPC Member', color: '#1677ff' },
]

const ORGANIZING: Member[] = [
  { name: 'Dr. Xiao Wang', nameCn: '王晓', institution: '西南大学', role: 'Organizing Chair', color: '#52c41a' },
  { name: 'Ms. Fang Liu', nameCn: '刘芳', institution: '西南大学', role: 'Secretary', color: '#fa8c16' },
  { name: 'Mr. Tao Li', nameCn: '李涛', institution: '西南大学', role: 'Web Chair', color: '#722ed1' },
  { name: 'Ms. Mei Zhou', nameCn: '周梅', institution: '西南大学', role: 'Finance Chair', color: '#13c2c2' },
]

function MemberCard({ member }: { member: Member }) {
  const initials = member.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Card hoverable size="small" style={{ height: '100%' }}>
      <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
        <Avatar size={56} style={{ background: member.color, fontSize: 20 }} icon={<UserOutlined />}>
          {initials}
        </Avatar>
        <div>
          <Text strong style={{ display: 'block' }}>{member.name}</Text>
          {member.nameCn && <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>{member.nameCn}</Text>}
          <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>{member.institution}</Text>
          <Tag color="blue" style={{ marginTop: 4 }}>{member.role}</Tag>
        </div>
      </Space>
    </Card>
  )
}

function MemberSection({ title, members }: { title: string; members: Member[] }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
      <Row gutter={[16, 16]}>
        {members.map((m) => (
          <Col xs={24} sm={12} md={8} lg={6} key={m.name}>
            <MemberCard member={m} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default function CommitteePage() {
  const { t } = useTranslation()

  return (
    <PageWrapper title={t('nav.committee')}>
      <MemberSection title="程序委员会主席 / Program Chairs" members={PROGRAM_CHAIRS} />
      <MemberSection title="技术程序委员会 / Technical Program Committee" members={TPC_MEMBERS} />
      <MemberSection title="组织委员会 / Organizing Committee" members={ORGANIZING} />
    </PageWrapper>
  )
}
