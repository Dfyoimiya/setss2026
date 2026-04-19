import { Card, Descriptions, Typography, Space, Button, Divider } from 'antd'
import {
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/common/PageWrapper'

const { Text, Paragraph } = Typography

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <PageWrapper title={t('nav.contact')}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="联系信息 / Contact Information">
          <Descriptions bordered column={1}>
            <Descriptions.Item
              label={<><MailOutlined style={{ marginRight: 6 }} />邮箱</>}
            >
              <a href="mailto:setss2026@swu.edu.cn">setss2026@swu.edu.cn</a>
            </Descriptions.Item>
            <Descriptions.Item
              label={<><PhoneOutlined style={{ marginRight: 6 }} />电话</>}
            >
              +86-23-68251234
            </Descriptions.Item>
            <Descriptions.Item
              label={<><EnvironmentOutlined style={{ marginRight: 6 }} />地址</>}
            >
              重庆市北碚区天生路2号 西南大学行政楼报告厅
              <br />
              <Text type="secondary">No.2 Tiansheng Road, Beibei District, Chongqing, China 400715</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={<><GlobalOutlined style={{ marginRight: 6 }} />网站</>}
            >
              <a href="https://setss2026.swu.edu.cn" target="_blank" rel="noreferrer">
                setss2026.swu.edu.cn
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="快速联系 / Quick Contact">
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            如有任何问题，欢迎通过以下方式联系我们的组委会。<br />
            For any inquiries, feel free to reach out to the organizing committee.
          </Paragraph>
          <Space>
            <Button
              type="primary"
              icon={<MailOutlined />}
              href="mailto:setss2026@swu.edu.cn?subject=SETSS 2026 Inquiry"
            >
              发送邮件
            </Button>
            <Button
              icon={<MailOutlined />}
              href="mailto:setss2026@swu.edu.cn?subject=SETSS 2026 - Paper Submission Query"
            >
              投稿咨询
            </Button>
          </Space>
        </Card>

        <Card title="主办单位 / Organizers">
          <Divider plain>主办</Divider>
          <Paragraph>西南大学计算机与信息科学学院（School of Computer and Information Science, Southwest University）</Paragraph>
          <Divider plain>承办</Divider>
          <Paragraph>K-ON! 团队 · 软件工程班2</Paragraph>
          <Divider plain>协办</Divider>
          <Paragraph>CCF 学生分会 · 西南大学研究生院</Paragraph>
        </Card>
      </Space>
    </PageWrapper>
  )
}
