import { useEffect, useState } from 'react'
import { Loader2, UserPlus, Zap, Eye } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

interface Reviewer {
  id: string
  email: string
  full_name: string | null
  institution: string | null
}

interface Assignment {
  id: string
  submission_id: string
  reviewer_id: string
  status: string
  assigned_by: string | null
  assigned_at: string | null
  deadline: string
  completed_at: string | null
}

export default function AdminReviews() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState({ reviewers: true, assignments: true })
  const [msg, setMsg] = useState('')
  const [assignForm, setAssignForm] = useState({ submissionId: '', reviewerId: '', deadline: '' })
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get<Reviewer[]>('/api/v1/admin/reviews/reviewers')
      .then((res) => setReviewers(res.data))
      .catch((err) => setMsg(err instanceof ApiError ? err.message : 'Failed'))
      .finally(() => setLoading(prev => ({ ...prev, reviewers: false })))

    api.get<Assignment[]>('/api/v1/admin/reviews/assignments')
      .then((res) => setAssignments(res.data))
      .catch(() => {})
      .finally(() => setLoading(prev => ({ ...prev, assignments: false })))
  }, [])

  const handleAssign = async () => {
    if (!assignForm.submissionId || !assignForm.reviewerId || !assignForm.deadline) return
    setAssigning(true)
    try {
      const params = new URLSearchParams()
      params.set('submission_id', assignForm.submissionId)
      params.set('reviewer_id', assignForm.reviewerId)
      params.set('deadline', new Date(assignForm.deadline).toISOString())
      await api.post(`/api/v1/admin/reviews/assignments?${params.toString()}`)
      setMsg('Reviewer assigned')
      setAssignForm({ submissionId: '', reviewerId: '', deadline: '' })
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    } finally {
      setAssigning(false)
    }
  }

  const handleAutoAssign = async (submissionId: string) => {
    try {
      const params = new URLSearchParams()
      params.set('submission_id', submissionId)
      await api.post(`/api/v1/admin/reviews/assignments/auto?${params.toString()}`)
      setMsg('Auto-assignment completed')
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    }
  }

  return (
    <div className="space-y-8">
      {msg && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-[12px] text-green-700">{msg}</div>}

      {/* Reviewer List */}
      <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
        <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Available Reviewers</h2>
        {loading.reviewers ? (
          <Loader2 className="w-6 h-6 text-[#005C99] animate-spin" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reviewers.map(r => (
              <div key={r.id} className="p-3 bg-[#faf9f6] border border-[#e8e4df] rounded-xl text-[12px]">
                <p className="font-semibold text-[#1a2a3a]">{r.full_name || 'N/A'}</p>
                <p className="text-[#8a8680]">{r.email}</p>
                <p className="text-[#8a8680] text-[11px]">{r.institution || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Manual Assign */}
      <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
        <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Manual Assignment</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <input value={assignForm.submissionId} onChange={(e) => setAssignForm(prev => ({ ...prev, submissionId: e.target.value }))}
            placeholder="Submission ID" className="px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
          <select value={assignForm.reviewerId} onChange={(e) => setAssignForm(prev => ({ ...prev, reviewerId: e.target.value }))}
            className="px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]">
            <option value="">Select Reviewer</option>
            {reviewers.map(r => <option key={r.id} value={r.id}>{r.full_name || r.email}</option>)}
          </select>
          <input type="datetime-local" value={assignForm.deadline} onChange={(e) => setAssignForm(prev => ({ ...prev, deadline: e.target.value }))}
            className="px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
          <button onClick={handleAssign} disabled={assigning} className="flex items-center justify-center gap-1.5 bg-[#1a365d] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0f2440] transition-colors">
            {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Assign
          </button>
        </div>
      </section>

      {/* Assignments List */}
      <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
        <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">All Assignments</h2>
        {loading.assignments ? (
          <Loader2 className="w-6 h-6 text-[#005C99] animate-spin" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#faf9f6]">
                  <th className="px-4 py-3 text-[11px] font-bold text-[#8a8680] uppercase">Submission</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#8a8680] uppercase">Reviewer</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#8a8680] uppercase">Status</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#8a8680] uppercase">Deadline</th>
                  <th className="px-4 py-3 text-[11px] font-bold text-[#8a8680] uppercase text-right">Auto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede8]">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-[#faf9f6]">
                    <td className="px-4 py-3 text-[12px] text-[#1a2a3a] font-mono">{a.submission_id.slice(0, 12)}...</td>
                    <td className="px-4 py-3 text-[12px] text-[#5a5854] font-mono">{a.reviewer_id.slice(0, 12)}...</td>
                    <td className="px-4 py-3"><span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{
                      backgroundColor: a.status === 'completed' ? '#1a6b3c10' : a.status === 'declined' ? '#b91c1c10' : '#1a365d10',
                      color: a.status === 'completed' ? '#1a6b3c' : a.status === 'declined' ? '#b91c1c' : '#1a365d',
                    }}>{a.status}</span></td>
                    <td className="px-4 py-3 text-[11px] text-[#8a8680]">{new Date(a.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleAutoAssign(a.submission_id)} className="inline-flex items-center gap-1 text-[11px] text-[#005C99] hover:underline font-medium">
                        <Zap className="w-3 h-3" /> Auto Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
