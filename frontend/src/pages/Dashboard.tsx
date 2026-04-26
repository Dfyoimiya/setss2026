import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Building2, Lock, FileText, Plus, Eye, Edit3,
  Save, X, Loader2, AlertCircle, CheckCircle2, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { api, ApiError } from '@/lib/api'
import PageHeader, { PageTopBar, PageFooter } from '@/components/PageHeader'

interface SubmissionItem {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, updateProfile, changePassword, logout } = useAuth()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formName, setFormName] = useState(user?.full_name || '')
  const [formInst, setFormInst] = useState(user?.institution || '')
  const [msg, setMsg] = useState('')

  const [showPw, setShowPw] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get<SubmissionItem[]>('/api/v1/submissions')
      .then((res) => setSubmissions(res.data))
      .catch(() => {})
      .finally(() => setLoadingSubs(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      await updateProfile({ full_name: formName, institution: formInst })
      setEditing(false)
      setMsg('Profile updated successfully')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg('')
    setPwErr(false)
    if (newPw.length < 8) {
      setPwMsg('Password must be at least 8 characters')
      setPwErr(true)
      return
    }
    try {
      await changePassword(oldPw, newPw)
      setPwMsg('Password changed successfully')
      setPwErr(false)
      setOldPw('')
      setNewPw('')
      setShowPw(false)
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : 'Change failed')
      setPwErr(true)
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

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <PageTopBar />
      <PageHeader
        badge={{ icon: <User className="w-4 h-4 text-[#b8860b]" />, text: 'Dashboard' }}
        title="My Dashboard"
        subtitle={user?.email}
      />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Profile Card */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-[#1a2a3a]">Profile</h2>
            {!editing && (
              <button onClick={() => { setEditing(true); setFormName(user?.full_name || ''); setFormInst(user?.institution || ''); }} className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:underline font-medium">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Full Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#8a8680] uppercase tracking-wide">Institution</label>
                <input value={formInst} onChange={(e) => setFormInst(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary text-[12px] py-2 px-5 flex items-center gap-2">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => setEditing(false)} className="text-[12px] text-[#8a8680] hover:text-[#5c5a56] font-medium">Cancel</button>
              </div>
              {msg && <p className={`text-[12px] ${msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#8a8680]" />
                <span className="text-[14px] text-[#1a2a3a] font-medium">{user?.full_name || user?.name || '-'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#8a8680]" />
                <span className="text-[14px] text-[#1a2a3a]">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#8a8680]" />
                <span className="text-[14px] text-[#1a2a3a]">{user?.institution || '-'}</span>
              </div>
            </div>
          )}

          <hr className="my-6 border-[#f0ede8]" />

          <div>
            <button onClick={() => setShowPw(!showPw)} className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:underline font-medium mb-3">
              <Lock className="w-3.5 h-3.5" /> Change Password
            </button>
            {showPw && (
              <form onSubmit={handleChangePw} className="space-y-3 p-4 bg-[#faf9f6] rounded-xl border border-[#e8e4df]">
                <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="Current password" required className="w-full px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password (min 8 chars)" required className="w-full px-3 py-2.5 border border-[#e8e4df] rounded-lg text-[13px]" />
                <div className="flex items-center gap-3">
                  <button type="submit" className="btn-primary text-[12px] py-2 px-5">Update Password</button>
                  <button type="button" onClick={() => { setShowPw(false); setPwMsg(''); }} className="text-[12px] text-[#8a8680] hover:text-[#5c5a56] font-medium">Cancel</button>
                </div>
                {pwMsg && (
                  <div className={`flex items-center gap-2 text-[12px] ${pwErr ? 'text-red-500' : 'text-green-600'}`}>
                    {pwErr ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {pwMsg}
                  </div>
                )}
              </form>
            )}
          </div>
        </section>

        {/* My Submissions */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(26,54,93,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-[#1a2a3a]">My Submissions</h2>
            <button onClick={() => navigate('/submissions/new')} className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:underline font-medium">
              <Plus className="w-3.5 h-3.5" /> New Submission
            </button>
          </div>

          {loadingSubs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#005C99] animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-[#d4d0ca] mx-auto mb-3" />
              <p className="text-[13px] text-[#8a8680]">No submissions yet</p>
              <button onClick={() => navigate('/submissions/new')} className="mt-3 btn-primary text-[12px] py-2 px-5">Create First Submission</button>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const st = statusLabel(sub.status)
                return (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-[#faf9f6] border border-[#e8e4df] rounded-xl hover:border-[#1a365d]/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1a2a3a] truncate">{sub.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span className="text-[11px] text-[#8a8680]">{new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/submissions/${sub.id}`)} className="flex items-center gap-1 ml-4 px-3 py-1.5 text-[11px] text-[#1a365d] border border-[#e8e4df] rounded-lg hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all font-medium flex-shrink-0">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <PageFooter />
    </div>
  )
}
