import { Layout, Menu, Button, Dropdown, Space, Select } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

const { Header } = Layout

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, isAdmin, isReviewer, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const publicItems = [
    { key: '/', label: <Link to="/">{t('nav.home')}</Link> },
    { key: '/announcements', label: <Link to="/announcements">{t('nav.announcements')}</Link> },
    { key: '/call-for-papers', label: <Link to="/call-for-papers">{t('nav.cfp')}</Link> },
    { key: '/committee', label: <Link to="/committee">{t('nav.committee')}</Link> },
    { key: '/contact', label: <Link to="/contact">{t('nav.contact')}</Link> },
  ]

  const protectedItems = isLoggedIn()
    ? [
        { key: '/submission', label: <Link to="/submission">{t('nav.submission')}</Link> },
        ...(isReviewer()
          ? [{ key: '/review', label: <Link to="/review">{t('nav.review')}</Link> }]
          : []),
        {
          key: '/conference-registration',
          label: <Link to="/conference-registration">{t('nav.register')}</Link>,
        },
        ...(isAdmin()
          ? [{ key: '/admin', label: <Link to="/admin/users">{t('nav.admin')}</Link> }]
          : []),
      ]
    : []

  const menuItems = [...publicItems, ...protectedItems]
  const selectedKey = menuItems.find((i) => i.key === location.pathname)?.key ?? '/'

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">{t('nav.profile')}</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>{t('nav.logout')}</span>,
    },
  ]

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#001529',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          marginRight: 32,
          whiteSpace: 'nowrap',
        }}
      >
        SETSS 2026
      </Link>

      {/* 导航菜单 */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />

      {/* 右侧：语言切换 + 用户操作 */}
      <Space style={{ marginLeft: 16 }}>
        <Select
          value={i18n.language.startsWith('zh') ? 'zh' : 'en'}
          onChange={(v) => i18n.changeLanguage(v)}
          options={[
            { value: 'zh', label: '中文' },
            { value: 'en', label: 'EN' },
          ]}
          size="small"
          style={{ width: 70 }}
        />
        {isLoggedIn() ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />} style={{ color: '#fff' }}>
              {user?.full_name || user?.email?.split('@')[0]}
            </Button>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" style={{ color: '#fff' }} onClick={() => navigate('/login')}>
              {t('nav.login')}
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              {t('nav.register_user')}
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  )
}
