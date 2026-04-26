import { useEffect, useState } from 'react'
import { Loader2, Shield, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

interface UserItem {
  id: string
  email: string
  full_name: string | null
  institution: string | null
  role: string
  is_active: boolean
  created_at: string
}

interface PagedResponse {
  code: number
  message: string
  data: UserItem[]
  pagination: { page: number; page_size: number; total: number; total_pages: number }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1, page_size: 20 })
  const [msg, setMsg] = useState('')

  const loadUsers = async (p: number) => {
    setLoading(true)
    try {
      const res = await api.get<PagedResponse>(`/api/v1/admin/users?page=${p}&size=${pagination.page_size}`)
      const data = res.data as unknown as PagedResponse
      setUsers(data.data || [])
      if (data.pagination) setPagination(data.pagination)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers(page) }, [page])

  const updateRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/api/v1/admin/users/${userId}/role`, { role })
      loadUsers(page)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Update failed')
    }
  }

  const toggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/api/v1/admin/users/${userId}/status`, { is_active: !isActive })
      loadUsers(page)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Update failed')
    }
  }

  return (
    <div>
      {msg && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600">{msg}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#005C99] animate-spin" /></div>
      ) : (
        <>
          <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#1a365d] text-white">
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide">Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide">Email</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide">Institution</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide">Role</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede8]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[#faf9f6]">
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1a2a3a]">{u.full_name || '-'}</td>
                      <td className="px-5 py-4 text-[12px] text-[#5a5854]">{u.email}</td>
                      <td className="px-5 py-4 text-[12px] text-[#5a5854]">{u.institution || '-'}</td>
                      <td className="px-5 py-4">
                        <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}
                          className="text-[12px] border border-[#e8e4df] rounded-lg px-2 py-1 bg-white">
                          <option value="user">User</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                          <option value="reviewer,organizer">Reviewer+Organizer</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${u.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => toggleStatus(u.id, u.is_active)} className={`inline-flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-lg font-medium ${u.is_active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {u.is_active ? <><UserX className="w-3 h-3" /> Disable</> : <><UserCheck className="w-3 h-3" /> Enable</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-2 text-[12px] text-[#5c5a56] border border-[#e8e4df] rounded-lg disabled:opacity-30 hover:bg-[#faf9f6]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[12px] text-[#8a8680]">Page {page} of {pagination.total_pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))} disabled={page >= pagination.total_pages}
                className="px-3 py-2 text-[12px] text-[#5c5a56] border border-[#e8e4df] rounded-lg disabled:opacity-30 hover:bg-[#faf9f6]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
