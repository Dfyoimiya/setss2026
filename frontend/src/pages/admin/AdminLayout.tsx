import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  AuditOutlined,
  IdcardOutlined,
  NotificationOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const { Sider, Content } = Layout

export default function AdminLayout() {
  const { t } = useTranslation()
  const location = useLocation()

  const menuItems = [
    { key: '/admin/dashboard', icon: <DashboardOutlined />, label: <Link to="/admin/dashboard">数据概览</Link> },
    { key: '/admin/users', icon: <TeamOutlined />, label: <Link to="/admin/users">{t('admin.users')}</Link> },
    { key: '/admin/papers', icon: <FileTextOutlined />, label: <Link to="/admin/papers">{t('admin.papers')}</Link> },
    { key: '/admin/reviews', icon: <AuditOutlined />, label: <Link to="/admin/reviews">{t('admin.reviews')}</Link> },
    { key: '/admin/registrations', icon: <IdcardOutlined />, label: <Link to="/admin/registrations">{t('admin.registrations')}</Link> },
    { key: '/admin/announcements', icon: <NotificationOutlined />, label: <Link to="/admin/announcements">{t('admin.announcements')}</Link> },
    { key: '/admin/config', icon: <SettingOutlined />, label: <Link to="/admin/config">{t('admin.config')}</Link> },
  ]

  return (
    <Layout style={{ minHeight: 'calc(100vh - 134px)', margin: '-24px -48px' }}>
      <Sider width={220} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
