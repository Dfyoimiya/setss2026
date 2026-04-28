import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminUsers, useUpdateRole, useUpdateUserStatus } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'

const ROLE_OPTIONS = [
  { value: 'speaker', label: '演讲者' },
  { value: 'participant', label: '参会者' },
  { value: 'reviewer', label: '评审人' },
  { value: 'organizer', label: '组织者' },
  { value: 'admin', label: '管理员' },
]

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { data, isLoading } = useAdminUsers(page, 20, keyword)
  const roleMutation = useUpdateRole()
  const statusMutation = useUpdateUserStatus()

  const users = data?.data || []
  const pagination = data?.pagination

  const handleRoleChange = (userId: string, role: string) => {
    roleMutation.mutate({ userId, data: { role } })
  }

  const handleStatusToggle = (userId: string, isActive: boolean) => {
    statusMutation.mutate({ userId, data: { is_active: !isActive } })
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="用户管理"
        breadcrumbs={[{ label: '管理后台' }, { label: '用户管理' }]}
      />

      {/* 搜索 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索用户邮箱或姓名..."
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
                  <th className="px-6 py-3 text-left">用户</th>
                  <th className="px-6 py-3 text-left">邮箱</th>
                  <th className="px-6 py-3 text-left">机构</th>
                  <th className="px-6 py-3 text-left">角色</th>
                  <th className="px-6 py-3 text-left">状态</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00629B]/10 flex items-center justify-center text-xs font-medium text-[#00629B]">
                          {(u.full_name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[#1E293B]">{u.full_name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-[#64748B]">{u.email}</td>
                    <td className="px-6 py-3 text-sm text-[#64748B]">{u.institution || '-'}</td>
                    <td className="px-6 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs border border-[#E2E8F0] rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-[#00629B]/20"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={u.is_active}
                          onChange={() => handleStatusToggle(u.id, u.is_active)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00629B]" />
                      </label>
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-[#64748B]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('zh-CN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-sm text-[#64748B]">共 {pagination.total} 条</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]"
                  >上一页</button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                    disabled={page >= pagination.total_pages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-[#F8FAFC]"
                  >下一页</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
