import { Link } from 'react-router-dom'
import { FileText, ScrollText, Gavel, UserCircle, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { isAdmin, isReviewer, canSubmit } from '@/api/types'
import { useCurrentUser } from '@/hooks/useAuthQuery'
import { useSubmissions } from '@/hooks/useSubmissionQuery'
import { useMyReviews } from '@/hooks/useReviewQuery'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP, ASSIGNMENT_STATUS_MAP } from '@/api/types'

export default function Dashboard() {
  const { user } = useAuthStore()
  useCurrentUser()
  const { data: subsData } = useSubmissions(1, 5)
  const { data: reviewsData } = useMyReviews(1, 5, isReviewer(user?.role))

  const displayName = user?.full_name || user?.email?.split('@')[0] || '用户'
  const submissions = subsData?.data || []
  const reviews = reviewsData?.data || []

  const quickLinks = [
    ...(canSubmit(user?.role) ? [
      { label: '提交论文', href: '/submission', icon: FileText, desc: '提交新论文稿件' },
      { label: '我的论文', href: '/papers', icon: ScrollText, desc: '查看已提交论文' },
    ] : []),
    ...(isReviewer(user?.role) ? [
      { label: '评审任务', href: '/reviews', icon: Gavel, desc: '查看分配到我的评审' },
    ] : []),
    ...(isAdmin(user?.role) ? [
      { label: '管理后台', href: '/admin/dashboard', icon: Shield, desc: '系统管理' },
    ] : []),
    { label: '个人信息', href: '#', icon: UserCircle, desc: '管理账户信息' },
  ]

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="仪表盘" />

      {/* 欢迎 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
        <p className="text-lg font-medium text-[#1E293B]">欢迎回来，{displayName}</p>
        <p className="text-sm text-[#64748B] mt-1">{user?.email}</p>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.label}
              to={link.href}
              className="card-standard flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00629B]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#00629B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E293B]">{link.label}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{link.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 最近论文 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="font-medium text-[#1E293B]">最近论文</h2>
          <Link to="/papers" className="text-sm text-[#00629B] hover:underline">查看全部 →</Link>
        </div>
        {submissions.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">标题</th>
                <th className="px-6 py-3 text-left">状态</th>
                <th className="px-6 py-3 text-left">提交时间</th>
              </tr>
            </thead>
            <tbody>
              {submissions.slice(0, 5).map((s) => {
                const st = SUBMISSION_STATUS_MAP[s.status]
                return (
                  <tr key={s.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-6 py-3">
                      <Link to={`/papers/${s.id}`} className="text-sm text-[#1E293B] hover:text-[#00629B] font-medium">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color}`}>{st?.label}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#64748B]">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString('zh-CN') : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-[#64748B]">
            尚未提交论文，<Link to="/submission" className="text-[#00629B] hover:underline">立即提交</Link>
          </div>
        )}
      </div>

      {/* 最近评审任务 */}
      {isReviewer(user?.role) && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="font-medium text-[#1E293B]">评审任务</h2>
            <Link to="/reviews" className="text-sm text-[#00629B] hover:underline">查看全部 →</Link>
          </div>
          {reviews.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3 text-left">论文 ID</th>
                  <th className="px-6 py-3 text-left">状态</th>
                  <th className="px-6 py-3 text-left">截止日期</th>
                </tr>
              </thead>
              <tbody>
                {reviews.slice(0, 5).map((r) => {
                  const st = ASSIGNMENT_STATUS_MAP[r.status]
                  return (
                    <tr key={r.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="px-6 py-3">
                        <Link to={`/reviews/${r.id}`} className="text-sm text-[#1E293B] hover:text-[#00629B] font-mono">
                          {r.submission_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color}`}>{st?.label}</span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {new Date(r.deadline).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[#64748B]">暂无评审任务</div>
          )}
        </div>
      )}
    </div>
  )
}
