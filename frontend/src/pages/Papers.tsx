import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useSubmissions } from '@/hooks/useSubmissionQuery'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP } from '@/api/types'

export default function Papers() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { data, isLoading } = useSubmissions(page, 20)

  const submissions = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="我的论文"
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '仪表盘', href: '/dashboard' }, { label: '我的论文' }]}
        actions={
          <Link to="/submission" className="btn-accent text-sm">
            提交新论文
          </Link>
        }
      />

      {/* 搜索 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索论文标题..."
          className="input-standard pl-10 max-w-sm"
        />
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : submissions.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3 text-left">标题</th>
                  <th className="px-6 py-3 text-left">状态</th>
                  <th className="px-6 py-3 text-left">提交时间</th>
                  <th className="px-6 py-3 text-left">更新时间</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => {
                  const st = SUBMISSION_STATUS_MAP[s.status]
                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="px-6 py-3">
                        <Link to={`/papers/${s.id}`} className="text-sm text-[#1E293B] hover:text-[#00629B] font-medium">
                          {s.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${st?.color || ''}`}>
                          {st?.label || s.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-3 text-sm text-[#64748B]">
                        {s.updated_at ? new Date(s.updated_at).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link to={`/papers/${s.id}`} className="text-sm text-[#00629B] hover:underline">
                          查看详情
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* 分页 */}
            {pagination && pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
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
          </>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-[#64748B]">
            暂无论文，<Link to="/submission" className="text-[#00629B] hover:underline">立即提交</Link>
          </div>
        )}
      </div>
    </div>
  )
}
