import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAdminReviews, useToggleReviewVisibility } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'
import { ASSIGNMENT_STATUS_MAP } from '@/api/types'

export default function AdminReviews() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminReviews(page, 20)
  const visibilityMutation = useToggleReviewVisibility()

  const reviews = data?.data || []
  const pagination = data?.pagination

  const handleToggleVisibility = (reviewId: string, currentVisible: boolean) => {
    visibilityMutation.mutate({ reviewId, data: { is_visible_to_author: !currentVisible } })
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="评审进度"
        breadcrumbs={[{ label: '管理后台' }, { label: '评审进度' }]}
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: '待响应', count: reviews.filter((r) => r.status === 'pending').length, color: 'bg-gray-100 text-gray-600' },
          { label: '已接受', count: reviews.filter((r) => r.status === 'accepted').length, color: 'bg-blue-100 text-blue-700' },
          { label: '评审中', count: reviews.filter((r) => r.status === 'in_review').length, color: 'bg-amber-100 text-amber-700' },
          { label: '已完成', count: reviews.filter((r) => r.status === 'completed').length, color: 'bg-green-100 text-green-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4">
            <p className="text-xs text-[#64748B] mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-[#1E293B]">{stat.count}</p>
          </div>
        ))}
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
                  <th className="px-6 py-3 text-left">论文 ID</th>
                  <th className="px-6 py-3 text-left">评审人</th>
                  <th className="px-6 py-3 text-left">状态</th>
                  <th className="px-6 py-3 text-left">评分</th>
                  <th className="px-6 py-3 text-left">截止日期</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => {
                  const st = ASSIGNMENT_STATUS_MAP[r.status]
                  return (
                    <tr key={r.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="px-6 py-3 text-sm font-mono text-[#1E293B]">
                        {r.submission_id?.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {r.reviewer_id?.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color}`}>
                          {st?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#1E293B]">
                        {r.review ? `${r.review.overall_score} / 10` : '-'}
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {new Date(r.deadline).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {r.review && (
                          <button
                            onClick={() => handleToggleVisibility(r.review!.id, r.review!.is_visible_to_author)}
                            className={`text-xs px-2 py-1 rounded-lg inline-flex items-center gap-1 transition-colors ${
                              r.review.is_visible_to_author
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {r.review.is_visible_to_author ? (
                              <><Eye className="w-3 h-3" /> 可见</>
                            ) : (
                              <><EyeOff className="w-3 h-3" /> 隐藏</>
                            )}
                          </button>
                        )}
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
