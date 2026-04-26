import { useEffect, useState } from 'react'
import { Calendar, Plus, Loader2, Trash2, Save, X } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

interface Period {
  id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  review_deadline?: string
  rebuttal_deadline?: string
  final_decision_deadline?: string
  reviewers_per_paper?: number
  is_active: boolean
  created_at?: string
}

export default function AdminPeriods() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', review_deadline: '', rebuttal_deadline: '', final_decision_deadline: '', reviewers_per_paper: 3 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    loadPeriods()
  }, [])

  const loadPeriods = async () => {
    setLoading(true)
    try {
      const res = await api.get<Period[]>('/api/v1/admin/periods')
      setPeriods(res.data)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/api/v1/admin/periods', {
        name: form.name,
        description: form.description || undefined,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        review_deadline: new Date(form.review_deadline).toISOString(),
        rebuttal_deadline: new Date(form.rebuttal_deadline).toISOString(),
        final_decision_deadline: new Date(form.final_decision_deadline).toISOString(),
        reviewers_per_paper: form.reviewers_per_paper,
      })
      setMsg('Period created successfully')
      setShowCreate(false)
      setForm({ name: '', description: '', start_date: '', end_date: '', review_deadline: '', rebuttal_deadline: '', final_decision_deadline: '', reviewers_per_paper: 3 })
      await loadPeriods()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this period?')) return
    try {
      await api.delete(`/api/v1/admin/periods/${id}`)
      await loadPeriods()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    }
  }

  return (
    <div className="space-y-6">
      {msg && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-[12px] text-green-700">{msg}</div>}

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-[#1a2a3a]">Submission Periods</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:underline font-medium">
          <Plus className="w-3.5 h-3.5" /> New Period
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white border border-[#e8e4df] rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,54,93,0.04)] space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Name *</label>
              <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Reviewers per Paper</label>
              <input type="number" value={form.reviewers_per_paper} onChange={(e) => setForm(prev => ({ ...prev, reviewers_per_paper: Number(e.target.value) }))} min={1} max={10}
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Start Date *</label>
              <input type="datetime-local" value={form.start_date} onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">End Date *</label>
              <input type="datetime-local" value={form.end_date} onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Review Deadline *</label>
              <input type="datetime-local" value={form.review_deadline} onChange={(e) => setForm(prev => ({ ...prev, review_deadline: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Rebuttal Deadline *</label>
              <input type="datetime-local" value={form.rebuttal_deadline} onChange={(e) => setForm(prev => ({ ...prev, rebuttal_deadline: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8a8680] uppercase">Decision Deadline *</label>
              <input type="datetime-local" value={form.final_decision_deadline} onChange={(e) => setForm(prev => ({ ...prev, final_decision_deadline: e.target.value }))} required
                className="w-full mt-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-[12px] py-2 px-5 flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Save className="w-3.5 h-3.5" /> Create Period
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-[12px] text-[#8a8680] hover:text-[#5c5a56] font-medium">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#005C99] animate-spin" /></div>
      ) : periods.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e8e4df] rounded-2xl">
          <Calendar className="w-10 h-10 text-[#d4d0ca] mx-auto mb-3" />
          <p className="text-[14px] text-[#8a8680]">No submission periods defined</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {periods.map(p => (
            <div key={p.id} className="bg-white border border-[#e8e4df] rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif text-[15px] font-bold text-[#1a2a3a]">{p.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[12px] text-[#8a8680]">
                  {new Date(p.start_date).toLocaleDateString()} — {new Date(p.end_date).toLocaleDateString()}
                </p>
                <p className="text-[11px] text-[#8a8680] font-mono mt-0.5">ID: {p.id}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
