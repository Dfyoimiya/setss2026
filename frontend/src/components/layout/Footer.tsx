import { Layout, Typography } from 'antd'

const { Footer: AntFooter } = Layout
const { Text } = Typography

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#f0f2f5' }}>
      <Text type="secondary">
        SETSS 2026 © {new Date().getFullYear()} · K-ON! Team · Southwest University
      </Text>
    </AntFooter>
  )
}
