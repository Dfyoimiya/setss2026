import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const { Content } = Layout

export default function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content
        style={
          isHome
            ? { flex: 1, background: '#000d1a' }
            : { padding: '24px 48px', background: '#f0f2f5', flex: 1 }
        }
      >
        <Outlet />
      </Content>
      {!isHome && <Footer />}
    </Layout>
  )
}
