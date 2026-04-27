import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, ScrollText, Users, Gavel, BarChart3,
  LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { isReviewer } from '@/api/types'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  role?: 'admin' | 'reviewer'
  children?: NavItem[]
}

const userNavItems: NavItem[] = [
  { label: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
  { label: '提交论文', href: '/submission', icon: FileText },
  { label: '我的论文', href: '/papers', icon: ScrollText },
  { label: '评审任务', href: '/reviews', icon: Gavel, role: 'reviewer' },
]

const adminNavItems: NavItem[] = [
  { label: '管理首页', href: '/admin', icon: LayoutDashboard },
  { label: '用户管理', href: '/admin/users', icon: Users },
  { label: '论文管理', href: '/admin/papers', icon: FileText },
  { label: '评审进度', href: '/admin/reviews', icon: BarChart3 },
]

export default function DashboardLayout({ admin }: { admin?: boolean }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const items = admin ? adminNavItems : userNavItems.filter(
    (i) => !i.role || (i.role === 'reviewer' && isReviewer(user?.role)),
  )

  const displayName = user?.full_name || user?.email?.split('@')[0] || '用户'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const Sidebar = () => (
    <>
      <div className="p-4 border-b border-[#E2E8F0]">
        <Link to="/" className="text-sm text-[#64748B] hover:text-[#00629B] transition-colors">
          ← 返回首页
        </Link>
        <div className="mt-3">
          <div className="w-10 h-10 rounded-full bg-[#00629B] flex items-center justify-center text-white font-semibold text-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <p className="mt-2 text-sm font-medium text-[#1E293B]">{displayName}</p>
          <p className="text-xs text-[#64748B]">{user?.email}</p>
        </div>
      </div>
      <nav className="p-3 flex-1">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#00629B]/10 text-[#00629B]'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-[#E2E8F0]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 顶部导航 */}
      <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-[#64748B] hover:text-[#1E293B]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#00629B]">SETSS 2026</span>
            {admin && <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">管理后台</span>}
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* 桌面端侧边栏 */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-4rem)] sticky top-16">
          <Sidebar />
        </aside>

        {/* 移动端侧边栏遮罩 */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
              <Sidebar />
            </aside>
          </div>
        )}

        {/* 主内容区 */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
