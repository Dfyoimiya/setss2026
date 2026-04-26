import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2, AlertCircle, CheckCircle2, ClipboardList, FileText, Download,
  Star, Send, X, User,
} from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { PageTopBar, PageFooter } from '@/components/PageHeader'

interface SubmissionFile {
  id: string
  file_name: string
  file_size: number
  version: number
  is_current: boolean
}
interface SubView {
  id: string
  title: string
  abstract: string
  keywords: string
  status: string
}
interface ReviewData {
  id: string
  overall_score: number
  detailed_comments: string
  recommendation: string
  is_visible_to_author: boolean
  created_at: string
  updated_at: string
}
interface AssignmentDetail {
  id: string
  submission_id: string
  status: string
  deadline: string
  completed_at: string | null
  submission: SubView & { files: SubmissionFile[] }
  review: ReviewData | null
}

export default function AssignmentReview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(5)
  const [comments, setComments] = useState('')
  const [recommendation, setRecommendation] = useState('accept')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadAssignment()
  }, [id])

  const loadAssignment = async () => {
    try {
      const res = await api.get<AssignmentDetail>(`/api/v1/review/assignments/${id}`)
      setAssignment(res.data)
      if (res.data.review) {
        setScore(res.data.review.overall_score)
        setComments(res.data.review.detailed_comments)
        setRecommendation(res.data.review.recommendation)
      }
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed to load')
      setMsgOk(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      await api.post(`/api/v1/review/assignments/${id}/accept`)
      await loadAssignment()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed to accept')
      setMsgOk(false)
    }
  }

  const handleDecline = async () => {
    if (!confirm('Decline this assignment?')) return
    try {
      await api.post(`/api/v1/review/assignments/${id}/decline`)
      navigate('/reviewer/assignments')
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Failed to decline')
      setMsgOk(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!id) return
    setSubmitting(true)
    setMsg('')
    try {
      if (assignment?.review) {
        await api.put(`/api/v1/review/assignments/${id}/review`, {
          overall_score: score,
          detailed_comments: comments,
          recommendation,
        })
      } else {
        await api.post(`/api/v1/review/assignments/${id}/review`, {
          overall_score: score,
          detailed_comments: comments,
          recommendation,
        })
      }
      setMsg('Review submitted successfully')
      setMsgOk(true)
      await loadAssignment()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Submit failed')
      setMsgOk(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#005C99] animate-spin" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <PageTopBar />
        <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-[15px] text-red-600">{msg || 'Assignment not found'}</p>
        </div>
      </div>
    )
  }

  const a = assignment
  const canReview = a.status === 'accepted' || a.status === 'in_review'

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />

      {/* Header */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{
                  backgroundColor: a.status === 'completed' ? '#1a6b3c10' : a.status === 'declined' ? '#b91c1c10' : '#1a365d10',
                  color: a.status === 'completed' ? '#1a6b3c' : a.status === 'declined' ? '#b91c1c' : '#1a365d',
                }}>{a.status}</span>
                <span className="text-[11px] text-[#8a8680]">Deadline: {new Date(a.deadline).toLocaleDateString()}</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#1a2a3a]">{a.submission.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {a.status === 'pending' && (
                <>
                  <button onClick={handleAccept} className="flex items-center gap-1.5 px-4 py-2 bg-[#1a6b3c] text-white text-[12px] font-medium rounded-lg hover:bg-[#155a30] transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button onClick={handleDecline} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-600 text-[12px] font-medium rounded-lg hover:bg-red-200 transition-colors">
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                </>
              )}
              {a.status === 'declined' && (
                <span className="text-[12px] text-red-500 font-medium">You have declined this assignment</span>
              )}
              {a.status === 'completed' && (
                <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Abstract */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Abstract</h2>
          <p className="text-[14px] text-[#4a4844] leading-[1.8]">{a.submission.abstract}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {a.submission.keywords.split(',').map(kw => (
              <span key={kw} className="px-2.5 py-1 bg-[#faf9f6] border border-[#e8e4df] rounded-lg text-[11px] text-[#5a5854]">{kw.trim()}</span>
            ))}
          </div>
        </section>

        {/* Download Paper */}
        {a.submission.files.length > 0 && (
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Paper</h2>
            <a href={`/api/v1/review/assignments/${a.id}/file/download`} className="inline-flex items-center gap-2 px-5 py-3 bg-[#faf9f6] border border-[#e8e4df] rounded-xl text-[13px] text-[#1a365d] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all font-medium">
              <Download className="w-4 h-4" /> Download Anonymous Paper
            </a>
          </section>
        )}

        {/* Review Form */}
        {canReview && (
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-5">
              {a.review ? 'Edit Review' : 'Submit Review'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Overall Score (1-10)</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input type="range" min={1} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="flex-1" />
                  <span className="w-10 text-center text-[16px] font-bold text-[#1a365d]">{score}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#8a8680]">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => setScore(n)} className={`hover:text-[#1a365d] ${score === n ? 'text-[#b8860b] font-bold' : ''}`}>{n}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Recommendation</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {['accept', 'minor_revision', 'major_revision', 'reject'].map(r => (
                    <button key={r} onClick={() => setRecommendation(r)} className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${recommendation === r ? 'bg-[#1a365d] text-white' : 'bg-[#faf9f6] border border-[#e8e4df] text-[#5c5a56] hover:border-[#1a365d]'}`}>
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Detailed Comments</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={8}
                  className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px] focus:outline-none focus:border-[#005C99] resize-y"
                  placeholder="Provide detailed feedback..." />
              </div>

              <button onClick={handleSubmitReview} disabled={submitting} className="btn-primary text-[13px] py-3 px-6 flex items-center gap-2">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <Send className="w-4 h-4" />
                {a.review ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </section>
        )}

        {/* Existing Review */}
        {a.review && !canReview && (
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Your Review</h2>
            <div className="space-y-2">
              <p className="text-[13px]"><span className="font-semibold">Score:</span> {a.review.overall_score}/10</p>
              <p className="text-[13px]"><span className="font-semibold">Recommendation:</span> {a.review.recommendation}</p>
              <div className="p-4 bg-[#faf9f6] rounded-lg mt-2">
                <p className="text-[13px] text-[#4a4844] leading-relaxed whitespace-pre-wrap">{a.review.detailed_comments}</p>
              </div>
            </div>
          </section>
        )}

        {msg && (
          <div className={`flex items-center gap-2 p-4 rounded-xl ${msgOk ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {msgOk ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <p className="text-[13px]">{msg}</p>
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  )
}
