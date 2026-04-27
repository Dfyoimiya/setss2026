import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Send } from 'lucide-react'
import { useReviewDetail, useSubmitReview, useUpdateReview } from '@/hooks/useReviewQuery'
import PageHeader from '@/components/PageHeader'
import { RECOMMENDATION_MAP } from '@/api/types'
import type { ReviewRecommendation } from '@/api/types'

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: assignment, isLoading } = useReviewDetail(id)
  const submitMutation = useSubmitReview()
  const updateMutation = useUpdateReview()

  const [score, setScore] = useState<number>(5)
  const [comments, setComments] = useState('')
  const [recommendation, setRecommendation] = useState<ReviewRecommendation>('minor_revision')

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-96 w-full" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B]">评审任务未找到</p>
        <Link to="/reviews" className="text-[#00629B] hover:underline text-sm mt-2 inline-block">返回列表</Link>
      </div>
    )
  }

  const existingReview = assignment.review
  const isReadOnly = assignment.status === 'completed'

  const handleSubmit = () => {
    if (!id) return
    const data = { overall_score: score, detailed_comments: comments, recommendation }
    if (existingReview) {
      updateMutation.mutate({ id, data })
    } else {
      submitMutation.mutate({ id, data })
    }
  }

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <PageHeader
        title={assignment.submission?.title || '评审详情'}
        breadcrumbs={[
          { label: '首页', href: '/' },
          { label: '仪表盘', href: '/dashboard' },
          { label: '评审任务', href: '/reviews' },
          { label: '评审详情' },
        ]}
        actions={
          !isReadOnly && (
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || updateMutation.isPending || !comments.trim()}
              className="btn-accent"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {existingReview ? '更新评审' : '提交评审'}
            </button>
          )
        }
      />

      {/* 论文摘要（匿名） */}
      {assignment.submission && (
        <div className="card-standard mb-6">
          <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">论文信息（匿名）</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#64748B] mb-1">摘要</p>
              <p className="text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">{assignment.submission.abstract}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">关键词</p>
              <p className="text-sm text-[#1E293B]">{assignment.submission.keywords}</p>
            </div>
            {assignment.submission.files.length > 0 && (
              <div>
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/review/assignments/${id}/file/download`}
                  className="btn-accent-outline text-xs px-3 py-1.5 inline-flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> 下载论文 PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 评审表单 */}
      {!isReadOnly ? (
        <div className="card-standard mb-6 space-y-6">
          <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">评审意见</h3>

          {/* 评分 */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-3">
              总体评分 (1-10): <span className="text-[#00629B] font-semibold">{score}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#00629B]"
            />
            <div className="flex justify-between text-xs text-[#64748B] mt-1">
              <span>1 - 低</span><span>10 - 高</span>
            </div>
          </div>

          {/* 评审意见 */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1.5">详细评审意见 *</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input-standard min-h-[200px] resize-y"
              placeholder="请详细评价论文的质量、创新性、实验设计、写作质量等方面..."
            />
          </div>

          {/* 推荐建议 */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">推荐建议</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(RECOMMENDATION_MAP) as [ReviewRecommendation, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setRecommendation(key)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    recommendation === key
                      ? 'border-[#00629B] bg-[#00629B]/10 text-[#00629B] font-medium'
                      : 'border-[#E2E8F0] text-[#64748B] hover:border-[#00629B]/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 只读模式：显示已提交的评审 */
        existingReview && (
          <div className="card-standard mb-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">已提交的评审</h3>
            <div>
              <p className="text-xs text-[#64748B] mb-1">评分</p>
              <p className="text-2xl font-bold text-[#00629B]">{existingReview.overall_score} / 10</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">推荐</p>
              <p className="text-sm font-medium text-[#1E293B]">{RECOMMENDATION_MAP[existingReview.recommendation as ReviewRecommendation] || existingReview.recommendation}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">详细意见</p>
              <p className="text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">{existingReview.detailed_comments}</p>
            </div>
          </div>
        )
      )}

      {/* 已提交回调提示 */}
      {isReadOnly && (
        <div className="flex justify-end">
          <Link to="/reviews" className="btn-accent-outline">返回评审列表</Link>
        </div>
      )}
    </div>
  )
}
