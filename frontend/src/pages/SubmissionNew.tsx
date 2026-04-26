import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Plus, Trash2, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import PageHeader, { PageTopBar, PageFooter } from '@/components/PageHeader'

interface Author {
  name: string
  institution: string
  email: string
}

export default function SubmissionNew() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [keywords, setKeywords] = useState('')
  const [authors, setAuthors] = useState<Author[]>([{ name: '', institution: '', email: '' }])
  const [corrName, setCorrName] = useState('')
  const [corrInst, setCorrInst] = useState('')
  const [corrEmail, setCorrEmail] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const addAuthor = () => setAuthors([...authors, { name: '', institution: '', email: '' }])
  const removeAuthor = (i: number) => setAuthors(authors.filter((_, idx) => idx !== i))
  const updateAuthor = (i: number, field: keyof Author, value: string) => {
    const next = [...authors]
    next[i] = { ...next[i], [field]: value }
    setAuthors(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !abstract.trim() || !keywords.trim()) {
      setError('Title, abstract, and keywords are required')
      return
    }
    if (authors.some(a => !a.name.trim() || !a.institution.trim() || !a.email.trim())) {
      setError('All author fields must be filled')
      return
    }
    if (!corrName.trim() || !corrInst.trim() || !corrEmail.trim()) {
      setError('Corresponding author fields are required')
      return
    }
    if (!periodId.trim()) {
      setError('Submission period ID is required (check with organizers)')
      return
    }

    setLoading(true)
    try {
      const res = await api.post<{ id: string; status: string }>('/api/v1/submissions', {
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywords.trim(),
        authors: authors.map(a => ({ name: a.name.trim(), institution: a.institution.trim(), email: a.email.trim() })),
        corresponding_author: { name: corrName.trim(), institution: corrInst.trim(), email: corrEmail.trim() },
        period_id: periodId.trim(),
      })
      setSuccess('Submission created successfully!')
      setTimeout(() => navigate(`/submissions/${res.data.id}`), 1500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create submission')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />
      <PageHeader
        badge={{ icon: <FileText className="w-4 h-4 text-[#b8860b]" />, text: 'Submission' }}
        title="New Submission"
        subtitle="Fill in the details below to create a new paper submission"
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-5">Paper Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={500}
                  className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px] focus:outline-none focus:border-[#005C99]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Abstract *</label>
                <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={6}
                  className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px] focus:outline-none focus:border-[#005C99] resize-y" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Keywords * (comma-separated)</label>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)} maxLength={1024}
                  className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px] focus:outline-none focus:border-[#005C99]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Submission Period ID *</label>
                <input value={periodId} onChange={(e) => setPeriodId(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px] focus:outline-none focus:border-[#005C99]" placeholder="Get this from organizers" />
              </div>
            </div>
          </section>

          {/* Authors */}
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-[#1a2a3a]">Authors</h2>
              <button type="button" onClick={addAuthor} className="flex items-center gap-1 text-[12px] text-[#005C99] hover:underline font-medium">
                <Plus className="w-3.5 h-3.5" /> Add Author
              </button>
            </div>
            <div className="space-y-4">
              {authors.map((a, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 bg-[#faf9f6] rounded-xl border border-[#e8e4df]">
                  <input value={a.name} onChange={(e) => updateAuthor(i, 'name', e.target.value)} placeholder="Name *" className="flex-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
                  <input value={a.institution} onChange={(e) => updateAuthor(i, 'institution', e.target.value)} placeholder="Institution *" className="flex-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
                  <input value={a.email} onChange={(e) => updateAuthor(i, 'email', e.target.value)} placeholder="Email *" className="flex-1 px-3 py-2 border border-[#e8e4df] rounded-lg text-[13px]" />
                  {authors.length > 1 && (
                    <button type="button" onClick={() => removeAuthor(i)} className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Corresponding Author */}
          <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
            <h2 className="font-serif text-lg font-bold text-[#1a2a3a] mb-5">Corresponding Author</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Name *</label>
                <input value={corrName} onChange={(e) => setCorrName(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Institution *</label>
                <input value={corrInst} onChange={(e) => setCorrInst(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Email *</label>
                <input value={corrEmail} onChange={(e) => setCorrEmail(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-[13px] text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-[13px] text-green-700">{success}</p>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary text-[13px] py-3 px-8 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Submission
            </button>
          </div>
        </form>
      </main>

      <PageFooter />
    </div>
  )
}
