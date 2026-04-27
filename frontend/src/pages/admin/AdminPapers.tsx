import { useState } from 'react'
import { Search, Gavel } from 'lucide-react'
import { useAdminSubmissions, useMakeDecision, useAutoAssign } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP } from '@/api/types'
import type { AdminDecisionValue } from '@/api/types'

const DECISIONS: { value: AdminDecisionValue; label: string }[] = [
  { value: 'accepted', label: '接收' },
  { value: 'minor_revision', label: '小修' },
  { value: 'major_revision', label: '大修' },
  { value: 'rejected', label: '拒绝' },
]

export default function AdminPapers() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { data, isLoading } = useAdminSubmissions(page, 20, keyword)
  const decisionMutation = useMakeDecision()
  const autoAssignMutation = useAutoAssign()

  const submissions = data?.data || []
  const pagination = data?.pagination

  const handleDecision = (id: string, decision: AdminDecisionValue) => {
    if (!window.confirm(`确定将这篇论文标记为"${decision}"？`)) return
    decisionMutation.mutate({ id, data: { decision } })
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="论文管理"
        breadcrumbs={[{ label: '管理后台' }, { label: '论文管理' }]}
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索论文标题..."
          className="input-standard pl-10 max-w-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (<div key={i} className="skeleton h-12 w-full" />))}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3 text-left">标题</th>
                  <th className="px-6 py-3 text-left">状态</th>
                  <th className="px-6 py-3 text-left">提交时间</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => {
                  const st = SUBMISSION_STATUS_MAP[s.status]
                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="px-6 py-3">
                        <span className="text-sm text-[#1E293B] font-medium">{s.title}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color || ''}`}>
                          {st?.label || s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => autoAssignMutation.mutate(s.id)}
                            disabled={autoAssignMutation.isPending}
                            className="text-xs text-[#00629B] hover:underline flex items-center gap-1"
                          >
                            <Gavel className="w-3 h-3" /> 分配评审
                          </button>
                          {s.status === 'submitted' && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) handleDecision(s.id, e.target.value as AdminDecisionValue)
                              }}
                              className="text-xs border border-[#E2E8F0] rounded-lg px-2 py-1"
                              defaultValue=""
                            >
                              <option value="" disabled>决定...</option>
                              {DECISIONS.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {pagination && pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-sm text-[#64748B]">共 {pagination.total} 条</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]">上一页</button>
                  <button onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))} disabled={page >= pagination.total_pages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]">下一页</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
