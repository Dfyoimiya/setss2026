import { Outlet, NavLink } from 'react-router-dom'
import { Users, FileText, ClipboardList, Calendar, Settings } from 'lucide-react'
import PageHeader, { PageTopBar, PageFooter } from '@/components/PageHeader'

const adminNav = [
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/submissions', label: 'Submissions', icon: FileText },
  { to: '/admin/reviews', label: 'Reviews', icon: ClipboardList },
  { to: '/admin/periods', label: 'Periods', icon: Calendar },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />
      <PageHeader
        badge={{ icon: <Settings className="w-4 h-4 text-[#b8860b]" />, text: 'Administration' }}
        title="Admin Panel"
        subtitle="Manage users, submissions, reviews, and submission periods"
      />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-0 overflow-x-auto">
          {adminNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3.5 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive ? 'border-[#b8860b] text-[#1a365d]' : 'border-transparent text-[#8a8680] hover:text-[#5c5a56]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Outlet />
      </main>

      <PageFooter />
    </div>
  )
}
