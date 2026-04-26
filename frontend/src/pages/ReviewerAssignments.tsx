import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Eye, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import PageHeader, { PageTopBar, PageFooter } from '@/components/PageHeader'

interface Assignment {
  id: string
  submission_id: string
  status: string
  deadline: string
  completed_at: string | null
  created_at: string
}

export default function ReviewerAssignments() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get<Assignment[]>('/api/v1/review/assignments')
      .then((res) => setAssignments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusMap: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: 'Pending', icon: Clock, color: '#7a5c20' },
    accepted: { label: 'Accepted', icon: CheckCircle2, color: '#2d5a4a' },
    in_review: { label: 'In Review', icon: Clock, color: '#1a365d' },
    completed: { label: 'Completed', icon: CheckCircle2, color: '#1a6b3c' },
    declined: { label: 'Declined', icon: XCircle, color: '#b91c1c' },
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />
      <PageHeader
        badge={{ icon: <ClipboardList className="w-4 h-4 text-[#b8860b]" />, text: 'Reviewer' }}
        title="My Review Assignments"
        subtitle="Papers assigned to you for peer review"
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#005C99] animate-spin" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#e8e4df] rounded-2xl">
            <ClipboardList className="w-10 h-10 text-[#d4d0ca] mx-auto mb-3" />
            <p className="text-[14px] text-[#8a8680]">No review assignments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => {
              const st = statusMap[a.status] || statusMap.pending
              const Icon = st.icon
              return (
                <div key={a.id} className="flex items-center justify-between p-5 bg-white border border-[#e8e4df] rounded-xl hover:shadow-[0_4px_20px_rgba(26,54,93,0.06)] transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ backgroundColor: st.color + '10', color: st.color }}>
                        <Icon className="w-3 h-3 inline mr-1" />{st.label}
                      </span>
                      <span className="text-[11px] text-[#8a8680]">Submission #{a.submission_id.slice(0, 8)}</span>
                    </div>
                    <p className="text-[11px] text-[#8a8680]">
                      Deadline: {new Date(a.deadline).toLocaleDateString()}
                      {a.completed_at && ` · Completed: ${new Date(a.completed_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <button onClick={() => navigate(`/reviewer/assignments/${a.id}`)} className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-[#1a365d] border border-[#e8e4df] rounded-lg hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all font-medium flex-shrink-0">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  )
}
