import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Clock } from 'lucide-react'
import { useAdminPeriods, useCreatePeriod, useUpdatePeriod } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'
import type { SubmissionPeriodForm, SubmissionPeriodUpdate } from '@/api/types'

function toLocalDatetime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const emptyForm: SubmissionPeriodForm = {
  name: '',
  start_date: '',
  end_date: '',
  review_deadline: '',
  rebuttal_deadline: '',
  final_decision_deadline: '',
  reviewers_per_paper: 3,
}

export default function AdminPeriods() {
  const { data: periods, isLoading } = useAdminPeriods()
  const createMutation = useCreatePeriod()
  const updateMutation = useUpdatePeriod()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SubmissionPeriodForm>(emptyForm)

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    setForm({
      name: p.name,
      start_date: toLocalDatetime(p.start_date),
      end_date: toLocalDatetime(p.end_date),
      review_deadline: toLocalDatetime(p.review_deadline),
      rebuttal_deadline: toLocalDatetime(p.rebuttal_deadline),
      final_decision_deadline: toLocalDatetime(p.final_decision_deadline),
      reviewers_per_paper: p.reviewers_per_paper ?? 3,
      description: p.description || '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!form.name || !form.start_date || !form.end_date) return

    const data = {
      ...form,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
      review_deadline: new Date(form.review_deadline || form.end_date).toISOString(),
      rebuttal_deadline: new Date(form.rebuttal_deadline || form.end_date).toISOString(),
      final_decision_deadline: new Date(form.final_decision_deadline || form.end_date).toISOString(),
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: data as SubmissionPeriodUpdate },
        { onSuccess: () => { setShowForm(false); setEditingId(null) } },
      )
    } else {
      createMutation.mutate(data as SubmissionPeriodForm, {
        onSuccess: () => { setShowForm(false) },
      })
    }
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="投稿周期管理"
        breadcrumbs={[{ label: '管理后台' }, { label: '投稿周期' }]}
        actions={
          <button onClick={openCreate} className="btn-accent text-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> 创建周期
          </button>
        }
      />

      {/* 表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1E293B]">
                {editingId ? '编辑周期' : '创建新周期'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-[#64748B] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">名称 *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-standard" placeholder="如：SETSS 2026" maxLength={255} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">描述</label>
                <input value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-standard" placeholder="可选描述" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">开始日期 *</label>
                  <input type="datetime-local" value={form.start_date}
                    onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                    className="input-standard" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">结束日期 *</label>
                  <input type="datetime-local" value={form.end_date}
                    onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                    className="input-standard" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">评审截止</label>
                <input type="datetime-local" value={form.review_deadline}
                  onChange={(e) => setForm((p) => ({ ...p, review_deadline: e.target.value }))}
                  className="input-standard" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">反驳截止</label>
                  <input type="datetime-local" value={form.rebuttal_deadline}
                    onChange={(e) => setForm((p) => ({ ...p, rebuttal_deadline: e.target.value }))}
                    className="input-standard" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">终审截止</label>
                  <input type="datetime-local" value={form.final_decision_deadline}
                    onChange={(e) => setForm((p) => ({ ...p, final_decision_deadline: e.target.value }))}
                    className="input-standard" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">每篇论文评审人数</label>
                <input type="number" min={1} max={10} value={form.reviewers_per_paper ?? 3}
                  onChange={(e) => setForm((p) => ({ ...p, reviewers_per_paper: Number(e.target.value) }))}
                  className="input-standard w-24" />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end mt-6">
              <button onClick={() => setShowForm(false)} className="btn-accent-outline">取消</button>
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}
                className="btn-accent flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {createMutation.isPending || updateMutation.isPending ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 周期列表 */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">{[1, 2].map((i) => (<div key={i} className="skeleton h-16 w-full" />))}</div>
        ) : !periods || periods.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">暂无投稿周期</p>
            <p className="text-xs text-[#94A3B8] mt-1">点击"创建周期"按钮添加</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-3 text-left">名称</th>
                <th className="px-6 py-3 text-left">时间范围</th>
                <th className="px-6 py-3 text-left">状态</th>
                <th className="px-6 py-3 text-left">评审人数</th>
                <th className="px-6 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="px-6 py-3">
                    <span className="text-sm font-medium text-[#1E293B]">{p.name}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#64748B]">
                    {new Date(p.start_date).toLocaleDateString('zh-CN')} - {new Date(p.end_date).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.is_active ? '可用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#64748B]">
                    {(p as any).reviewers_per_paper ?? 3}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-[#64748B] hover:text-[#00629B] transition-colors"
                        title="编辑">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => {
                        if (window.confirm('确定切换此周期状态？')) {
                          updateMutation.mutate({ id: p.id, data: { is_active: !p.is_active } })
                        }
                      }} className={`p-1.5 transition-colors ${p.is_active ? 'text-green-600 hover:text-red-500' : 'text-gray-400 hover:text-green-500'}`}
                        title={p.is_active ? '禁用' : '启用'}>
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
