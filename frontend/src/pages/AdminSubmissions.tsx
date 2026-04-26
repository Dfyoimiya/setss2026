import { useEffect, useState } from 'react'
import { Loader2, Eye, FileText, Download } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

interface SubmissionItem {
  id: string
  user_id: string
  period_id: string
  title: string
  status: string
  created_at: string
  updated_at: string
}

interface SubmissionFull {
  id: string
  title: string
  abstract: string
  keywords: string
  status: string
  files: { id: string; file_name: string; file_size: number }[]
  reviews: { id: string; overall_score: number; recommendation: string; detailed_comments: string }[]
  created_at: string
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<SubmissionFull | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [decisionLoading, setDecisionLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get<SubmissionItem[]>('/api/v1/admin/submissions')
      .then((res) => setSubmissions(res.data))
      .catch((err) => setMsg(err instanceof ApiError ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [])

  const viewDetail = async (id: string) => {
    setDetailLoading(true)
    try {
      const res = await api.get<SubmissionFull>(`/api/v1/admin/submissions/${id}`)
      setDetail(res.data)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    } finally {
      setDetailLoading(false)
    }
  }

  const makeDecision = async (submissionId: string, decision: string) => {
    setDecisionLoading(true)
    try {
      await api.post(`/api/v1/admin/submissions/${submissionId}/decision`, { decision })
      setMsg(`Decision "${decision}" applied`)
      setDetail(null)
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed')
    } finally {
      setDecisionLoading(false)
    }
  }

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { draft: '#8a8680', submitted: '#1a365d', under_review: '#2d5a4a', accepted: '#1a6b3c', rejected: '#b91c1c', minor_revision: '#7a5c20', major_revision: '#b8860b' }
    return map[s] || '#8a8680'
  }

  return (
    <div>
      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-[12px] text-green-700">{msg}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#005C99] animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {/* Detail modal inline */}
          {detail && (
            <div className="bg-white border border-[#b8860b] rounded-2xl p-6 sm:p-8 shadow-[0_8px_40px_rgba(26,54,93,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-[#1a2a3a]">{detail.title}</h2>
                <span className="text-[11px] px-3 py-1 rounded-full font-bold" style={{ backgroundColor: statusLabel(detail.status) + '15', color: statusLabel(detail.status) }}>{detail.status}</span>
              </div>
              <p className="text-[14px] text-[#4a4844] leading-[1.8] mb-4">{detail.abstract}</p>
              <p className="text-[12px] text-[#8a8680] mb-4">Keywords: {detail.keywords}</p>

              {detail.files.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#8a8680] uppercase mb-2">Files</p>
                  {detail.files.map(f => (
                    <a key={f.id} href={`/api/v1/admin/submissions/${detail.id}/files/${f.id}/download`} className="inline-flex items-center gap-2 mr-3 px-3 py-1.5 text-[12px] text-[#1a365d] border border-[#e8e4df] rounded-lg hover:bg-[#1a365d] hover:text-white transition-all">
                      <Download className="w-3 h-3" /> {f.file_name}
                    </a>
                  ))}
                </div>
              )}

              {detail.reviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#8a8680] uppercase mb-2">Reviews ({detail.reviews.length})</p>
                  {detail.reviews.map(r => (
                    <div key={r.id} className="p-3 bg-[#faf9f6] rounded-lg mb-2">
                      <p className="text-[12px]"><span className="font-semibold">Score:</span> {r.overall_score}/10 · <span className="font-semibold">{r.recommendation}</span></p>
                      <p className="text-[11px] text-[#5a5854] line-clamp-2">{r.detailed_comments}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {['accepted', 'minor_revision', 'major_revision', 'rejected'].map(d => (
                  <button key={d} onClick={() => makeDecision(detail.id, d)} disabled={decisionLoading}
                    className="px-4 py-2 text-[12px] font-semibold rounded-lg border border-[#e8e4df] hover:bg-[#1a365d] hover:text-white transition-all">
                    {d.replace('_', ' ')}
                  </button>
                ))}
                <button onClick={() => setDetail(null)} className="px-4 py-2 text-[12px] text-[#8a8680] font-medium">Close</button>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#1a365d] text-white">
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase">Title</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase">Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase">Date</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede8]">
                  {submissions.map(s => (
                    <tr key={s.id} className="hover:bg-[#faf9f6]">
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1a2a3a] max-w-[300px] truncate">{s.title}</td>
                      <td className="px-5 py-4"><span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: statusLabel(s.status) + '15', color: statusLabel(s.status) }}>{s.status}</span></td>
                      <td className="px-5 py-4 text-[12px] text-[#8a8680]">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => viewDetail(s.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#1a365d] border border-[#e8e4df] rounded-lg hover:bg-[#1a365d] hover:text-white transition-all font-medium">
                          <Eye className="w-3 h-3" /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
