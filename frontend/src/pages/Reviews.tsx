import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { useMyReviews, useAcceptAssignment, useDeclineAssignment } from '@/hooks/useReviewQuery'
import PageHeader from '@/components/PageHeader'
import { ASSIGNMENT_STATUS_MAP } from '@/api/types'

export default function Reviews() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMyReviews(page, 20)
  const acceptMutation = useAcceptAssignment()
  const declineMutation = useDeclineAssignment()

  const reviews = data?.data || []
  const pagination = data?.pagination

  const handleAccept = (id: string) => acceptMutation.mutate({ id })
  const handleDecline = (id: string) => declineMutation.mutate(id)

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="评审任务"
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '仪表盘', href: '/dashboard' }, { label: '评审任务' }]}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => {
            const st = ASSIGNMENT_STATUS_MAP[r.status]
            const isOverdue = new Date(r.deadline) < new Date()
            return (
              <div key={r.id} className="card-standard flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/reviews/${r.id}`} className="text-sm font-medium text-[#1E293B] hover:text-[#00629B] transition-colors">
                      论文 #{r.submission_id.slice(0, 8)}...
                    </Link>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color}`}>
                      {st?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className={isOverdue ? 'text-red-500' : ''}>
                        截止: {new Date(r.deadline).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    {r.completed_at && (
                      <span>完成于: {new Date(r.completed_at).toLocaleString('zh-CN')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(r.id)}
                        disabled={acceptMutation.isPending}
                        className="btn-accent text-xs px-3 py-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        接受
                      </button>
                      <button
                        onClick={() => handleDecline(r.id)}
                        disabled={declineMutation.isPending}
                        className="btn-accent-outline text-xs px-3 py-1.5 text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        拒绝
                      </button>
                    </>
                  )}
                  {(r.status === 'accepted' || r.status === 'in_review') && (
                    <Link to={`/reviews/${r.id}`} className="btn-accent text-xs px-3 py-1.5">
                      开始评审
                    </Link>
                  )}
                  {r.status === 'completed' && (
                    <Link to={`/reviews/${r.id}`} className="btn-accent-outline text-xs px-3 py-1.5">
                      查看评审
                    </Link>
                  )}
                </div>
              </div>
            )
          })}

          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-[#64748B]">
                共 {pagination.total} 条，第 {pagination.page} / {pagination.total_pages} 页
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm border border-[#E2E8F0] rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={page >= pagination.total_pages}
                  className="px-3 py-1.5 text-sm border border-[#E2E8F0] rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-[#64748B]">
          暂无评审任务
        </div>
      )}
    </div>
  )
}
