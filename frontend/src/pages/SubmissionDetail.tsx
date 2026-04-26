import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FileText, Upload, Download, Send, Loader2, AlertCircle, CheckCircle2,
  Edit3, Save, X, Trash2, MessageCircle, Eye,
} from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { PageTopBar, PageFooter } from '@/components/PageHeader'

interface FileInfo {
  id: string
  file_name: string
  file_size: number
  version: number
  is_current: boolean
  uploaded_at: string
}

interface RebuttalData {
  id: string
  review_id: string
  content: string
  is_visible_to_reviewer: boolean
  created_at: string
}

interface ReviewData {
  id: string
  overall_score: number
  detailed_comments: string
  recommendation: string
  created_at: string
  reviewer_number: number
  rebuttal: RebuttalData | null
}

interface SubmissionDetail {
  id: string
  title: string
  abstract: string
  keywords: string
  authors: { name: string; institution: string; email: string }[]
  corresponding_author: { name: string; institution: string; email: string }
  status: string
  created_at: string
  updated_at: string
  files: FileInfo[]
  reviews?: ReviewData[]
}

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sub, setSub] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rebuttalText, setRebuttalText] = useState<Record<string, string>>({})
  const [rebuttalSubmitting, setRebuttalSubmitting] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    loadSubmission()
  }, [id])

  const loadSubmission = async () => {
    setLoading(true)
    try {
      const res = await api.get<SubmissionDetail>(`/api/v1/submissions/${id}`)
      setSub(res.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file || !id) return
    setUploading(true)
    setMsg('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.upload(`/api/v1/submissions/${id}/files`, fd)
      setMsg('File uploaded successfully')
      await loadSubmission()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!id) return
    setSubmitting(true)
    setMsg('')
    try {
      await api.post(`/api/v1/submissions/${id}/submit`)
      setMsg('Submission submitted for review')
      await loadSubmission()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdraw = async () => {
    if (!id || !confirm('Are you sure you want to withdraw this submission?')) return
    try {
      await api.delete(`/api/v1/submissions/${id}`)
      navigate('/dashboard')
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Withdraw failed')
    }
  }

  const handleRebuttal = async (reviewId: string) => {
    const content = rebuttalText[reviewId]?.trim()
    if (!content) return
    setRebuttalSubmitting(prev => ({ ...prev, [reviewId]: true }))
    try {
      await api.post(`/api/v1/submissions/reviews/${reviewId}/rebuttal`, { content })
      setRebuttalText(prev => ({ ...prev, [reviewId]: '' }))
      await loadSubmission()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : 'Rebuttal failed')
    } finally {
      setRebuttalSubmitting(prev => ({ ...prev, [reviewId]: false }))
    }
  }

  const statusLabel = (s: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      draft: { label: 'Draft', color: '#8a8680', bg: '#f5f3f0' },
      submitted: { label: 'Submitted', color: '#1a365d', bg: '#1a365d10' },
      under_review: { label: 'Under Review', color: '#2d5a4a', bg: '#2d5a4a10' },
      accepted: { label: 'Accepted', color: '#1a6b3c', bg: '#1a6b3c10' },
      rejected: { label: 'Rejected', color: '#b91c1c', bg: '#b91c1c10' },
      minor_revision: { label: 'Minor Revision', color: '#7a5c20', bg: '#b8860b10' },
      major_revision: { label: 'Major Revision', color: '#b8860b', bg: '#b8860b10' },
      withdrawn: { label: 'Withdrawn', color: '#6b7280', bg: '#f9fafb' },
    }
    return map[s] || { label: s, color: '#8a8680', bg: '#f5f3f0' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#005C99] animate-spin" />
      </div>
    )
  }

  if (error || !sub) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <PageTopBar />
        <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-[15px] text-red-600">{error || 'Submission not found'}</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 btn-primary text-[13px] py-2 px-6">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const st = statusLabel(sub.status)
  const canEdit = ['draft', 'minor_revision', 'major_revision'].includes(sub.status)
  const canSubmit = sub.status === 'draft'

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />

      {/* Header */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide" style={{ backgroundColor: st.bg, color: st.color }}>
              {st.label}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-[28px] font-bold text-[#1a2a3a] leading-tight">{sub.title}</h1>
          <p className="text-[12px] text-[#8a8680] mt-2">Created {new Date(sub.created_at).toLocaleString()}</p>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3">
          {canSubmit && (
            <button onClick={handleSubmit} disabled={submitting || sub.files.length === 0} className="btn-primary text-[12px] py-2 px-5 flex items-center gap-2">
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Send className="w-3.5 h-3.5" /> Submit for Review
            </button>
          )}
          <button onClick={() => handleWithdraw()} className="text-[12px] text-red-500 hover:bg-red-50 py-2 px-4 rounded-lg border border-red-200 font-medium flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Withdraw
          </button>
        </div>

        {/* Paper Info */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Abstract</h2>
          <p className="text-[14px] text-[#4a4844] leading-[1.8]">{sub.abstract}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sub.keywords.split(',').map(kw => (
              <span key={kw} className="px-2.5 py-1 bg-[#faf9f6] border border-[#e8e4df] rounded-lg text-[11px] text-[#5a5854]">{kw.trim()}</span>
            ))}
          </div>
        </section>

        {/* Authors */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Authors</h2>
          <div className="space-y-2">
            {sub.authors.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] text-[#4a4844]">
                <span className="font-medium">{a.name}</span>
                <span className="text-[#8a8680]">— {a.institution}</span>
                <span className="text-[#8a8680] text-[11px]">{a.email}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#f0ede8]">
            <p className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide mb-1">Corresponding Author</p>
            <p className="text-[13px] font-medium text-[#1a2a3a]">
              {sub.corresponding_author.name} — {sub.corresponding_author.institution} ({sub.corresponding_author.email})
            </p>
          </div>
        </section>

        {/* Files */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Files</h2>
          {sub.files.length > 0 ? (
            <div className="space-y-2 mb-4">
              {sub.files.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-[#faf9f6] border border-[#e8e4df] rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#1a365d]" />
                    <div>
                      <p className="text-[13px] font-medium text-[#1a2a3a]">{f.file_name}</p>
                      <p className="text-[11px] text-[#8a8680]">v{f.version} · {(f.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <a href={`/api/v1/submissions/${id}/files/${f.id}/download`} className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#1a365d] border border-[#e8e4df] rounded-lg hover:bg-[#1a365d] hover:text-white transition-all font-medium">
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#8a8680] mb-4">No files uploaded yet. Upload a PDF to proceed.</p>
          )}
          {canEdit && (
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="application/pdf" className="text-[12px]" />
              <button onClick={handleUpload} disabled={uploading} className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:underline font-medium">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload PDF
              </button>
            </div>
          )}
        </section>

        {/* Reviews */}
        {sub.reviews && sub.reviews.length > 0 && (
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-4">Reviews</h2>
            <div className="space-y-4">
              {sub.reviews.map(rv => (
                <div key={rv.id} className="p-5 bg-[#faf9f6] border border-[#e8e4df] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-bold text-[#8a8680] uppercase">Reviewer #{rv.reviewer_number}</span>
                    <span className="text-[11px] text-[#8a8680]">{new Date(rv.created_at).toLocaleDateString()}</span>
                    <span className="text-[12px] font-bold text-[#1a365d]">Score: {rv.overall_score}/10</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase" style={{
                      color: rv.recommendation === 'accept' ? '#1a6b3c' : rv.recommendation === 'reject' ? '#b91c1c' : '#7a5c20',
                      backgroundColor: rv.recommendation === 'accept' ? '#1a6b3c10' : rv.recommendation === 'reject' ? '#b91c1c10' : '#b8860b10',
                    }}>{rv.recommendation}</span>
                  </div>
                  <p className="text-[13px] text-[#4a4844] leading-relaxed">{rv.detailed_comments}</p>

                  {/* Rebuttal */}
                  {rv.rebuttal ? (
                    <div className="mt-4 p-4 bg-white border border-[#e8e4df] rounded-lg">
                      <p className="text-[11px] font-bold text-[#8a8680] uppercase mb-1">Your Rebuttal</p>
                      <p className="text-[12px] text-[#4a4844]">{rv.rebuttal.content}</p>
                      <p className="text-[10px] text-[#8a8680] mt-1">{new Date(rv.rebuttal.created_at).toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <textarea
                        value={rebuttalText[rv.id] || ''}
                        onChange={(e) => setRebuttalText(prev => ({ ...prev, [rv.id]: e.target.value }))}
                        placeholder="Write a rebuttal to this review..."
                        rows={3}
                        className="w-full px-3 py-2 border border-[#e8e4df] rounded-lg text-[12px] focus:outline-none focus:border-[#005C99] resize-y"
                      />
                      <button
                        onClick={() => handleRebuttal(rv.id)}
                        disabled={rebuttalSubmitting[rv.id] || !rebuttalText[rv.id]?.trim()}
                        className="mt-2 flex items-center gap-1.5 text-[11px] text-[#005C99] hover:underline font-medium disabled:opacity-50"
                      >
                        {rebuttalSubmitting[rv.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                        <MessageCircle className="w-3.5 h-3.5" /> Submit Rebuttal
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {msg && (
          <div className={`flex items-center gap-2 p-4 rounded-xl ${msg.includes('success') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {msg.includes('success') ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <p className="text-[13px]">{msg}</p>
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  )
}
