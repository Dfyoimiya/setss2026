import { Link } from 'react-router-dom'
import { FileText, ScrollText, Gavel, UserCircle, Shield, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { isAdmin, isReviewer, canSubmit } from '@/api/types'
import { useCurrentUser, useUpdateProfile } from '@/hooks/useAuthQuery'
import { useSubmissions } from '@/hooks/useSubmissionQuery'
import { useMyReviews } from '@/hooks/useReviewQuery'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP, ASSIGNMENT_STATUS_MAP } from '@/api/types'
import { useState } from 'react'

export default function Dashboard() {
  const { user } = useAuthStore()
  useCurrentUser()
  const { data: subsData } = useSubmissions(1, 5)
  const { data: reviewsData } = useMyReviews(1, 5, isReviewer(user?.role))

  const displayName = user?.full_name || user?.email?.split('@')[0] || '用户'
  const submissions = subsData?.data || []
  const reviews = reviewsData?.data || []
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileInstitution, setProfileInstitution] = useState('')
  const updateProfile = useUpdateProfile()

  const startEditProfile = () => {
    setProfileName(user?.full_name || '')
    setProfileInstitution(user?.institution || '')
    setEditingProfile(true)
  }

  const saveProfile = async () => {
    await updateProfile.mutateAsync({ full_name: profileName, institution: profileInstitution })
    setEditingProfile(false)
  }

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
    { label: '个人信息', href: '#', icon: UserCircle, desc: '管理账户信息', onClick: () => startEditProfile() },
  ]

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="仪表盘" />

      {/* 欢迎 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
        <p className="text-lg font-medium text-[#1E293B]">欢迎回来，{displayName}</p>
        <p className="text-sm text-[#64748B] mt-1">{user?.email}</p>
      </div>

      {/* 个人信息编辑 */}
      {editingProfile && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
          <h2 className="text-base font-semibold text-[#1E293B] mb-4">编辑个人信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">邮箱</label>
              <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#94A3B8] bg-[#F8FAFC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">姓名</label>
              <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="您的姓名" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#00629B]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">机构</label>
              <input type="text" value={profileInstitution} onChange={(e) => setProfileInstitution(e.target.value)} placeholder="您的机构" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#00629B]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1">角色</label>
              <p className="text-sm text-[#64748B]">{user?.role}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={saveProfile} disabled={updateProfile.isPending} className="px-4 py-2 bg-[#00629B] text-white text-sm rounded-lg hover:bg-[#004B7A] transition-colors disabled:opacity-60 flex items-center gap-2">
                {updateProfile.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                保存
              </button>
              <button onClick={() => setEditingProfile(false)} className="px-4 py-2 border border-[#E2E8F0] text-sm rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon
          const Component = 'onClick' in link ? 'button' : Link
          const props: Record<string, unknown> = 'onClick' in link
            ? { onClick: link.onClick }
            : { to: link.href }
          return (
            <Component
              key={link.label}
              {...props as any}
              className="card-standard flex items-start gap-4 w-full text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00629B]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#00629B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1E293B]">{link.label}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{link.desc}</p>
              </div>
            </Component>
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
