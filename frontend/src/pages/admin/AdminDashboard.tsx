import { Link } from 'react-router-dom'
import { Users, FileText, Gavel, CheckCircle } from 'lucide-react'
import { useAdminUsers, useAdminSubmissions, useAdminReviews } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP, ASSIGNMENT_STATUS_MAP } from '@/api/types'

export default function AdminDashboard() {
  const { data: usersData } = useAdminUsers(1, 1)
  const { data: subsData } = useAdminSubmissions(1, 20)
  const { data: reviewsData } = useAdminReviews(1, 20)

  const totalUsers = usersData?.pagination?.total ?? 0
  const totalSubmissions = subsData?.pagination?.total ?? 0
  const totalReviews = reviewsData?.pagination?.total ?? 0

  const reviewStats = reviewsData?.data || []
  const submissionStats = subsData?.data || []
  const pendingAssignments = reviewStats.filter((r) => r.status === 'pending').length
  const completedReviews = reviewStats.filter((r) => r.review).length

  const statCards = [
    { label: '总用户数', value: totalUsers, icon: Users, href: '/admin/users', color: 'bg-blue-50 text-blue-600' },
    { label: '论文总数', value: totalSubmissions, icon: FileText, href: '/admin/papers', color: 'bg-green-50 text-green-600' },
    { label: '评审总数', value: totalReviews, icon: Gavel, href: '/admin/reviews', color: 'bg-amber-50 text-amber-600' },
    { label: '已完成评审', value: completedReviews, icon: CheckCircle, href: '/admin/reviews', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="管理仪表盘"
        breadcrumbs={[{ label: '管理后台' }, { label: '仪表盘' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.href}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center bg-opacity-10`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-[#1E293B]">{stat.value}</p>
              <p className="text-sm text-[#64748B] mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 论文概览 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="font-medium text-[#1E293B]">论文概览</h2>
            <Link to="/admin/papers" className="text-sm text-[#00629B] hover:underline">查看全部</Link>
          </div>
          <div className="p-6">
            {submissionStats.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                    <th className="pb-3 font-medium">标题</th>
                    <th className="pb-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionStats.slice(0, 5).map((s) => {
                    const st = SUBMISSION_STATUS_MAP[s.status]
                    return (
                      <tr key={s.id} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="py-3 pr-4">
                          <span className="text-sm text-[#1E293B] line-clamp-1">{s.title}</span>
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color || ''}`}>
                            {st?.label || s.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-[#64748B] text-center py-8">暂无论文提交</p>
            )}
          </div>
        </div>

        {/* 评审概览 */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="font-medium text-[#1E293B]">评审概览</h2>
            <Link to="/admin/reviews" className="text-sm text-[#00629B] hover:underline">查看全部</Link>
          </div>
          <div className="p-6">
            {reviewStats.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                    <th className="pb-3 font-medium">论文 ID</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">评分</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewStats.slice(0, 5).map((r) => {
                    const st = ASSIGNMENT_STATUS_MAP[r.status]
                    return (
                      <tr key={r.id} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="py-3 pr-4">
                          <span className="text-sm font-mono text-[#1E293B]">{r.submission_id?.slice(0, 8)}...</span>
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color}`}>
                            {st?.label}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-[#64748B]">
                          {r.review ? `${r.review.overall_score}/10` : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-[#64748B] text-center py-8">暂无评审记录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
