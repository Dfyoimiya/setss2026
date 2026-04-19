import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '24px 48px', background: '#f0f2f5', flex: 1 }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
