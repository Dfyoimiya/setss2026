import { useState } from 'react'
import { X, User, Mail, Lock, Loader2, Building2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  setMode: (mode: 'login' | 'register') => void
}

export default function AuthModal({ isOpen, onClose, mode, setMode }: AuthModalProps) {
  const { t } = useLanguage()
  const { login, register, error: authError, setError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (!isOpen) return null

  const displayError = localError || authError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    setSuccessMsg('')
    setError(null)

    if (!email.trim() || !password) {
      setLocalError(t('authFillRequired'))
      return
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setLocalError(t('authEnterName'))
        return
      }
      if (password.length < 8) {
        setLocalError(t('authPasswordMinLength') || 'Password must be at least 8 characters')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        const ok = await login(email.trim(), password)
        if (ok) {
          setName('')
          setEmail('')
          setPassword('')
          setInstitution('')
          onClose()
          window.location.reload()
        }
      } else {
        const ok = await register(name.trim(), email.trim(), password, institution.trim() || undefined)
        if (ok) {
          setName('')
          setEmail('')
          setPassword('')
          setInstitution('')
          setSuccessMsg(t('regSuccessMsg') || 'Registration successful! You can now log in.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 shadow-2xl w-full max-w-md p-6 sm:p-8 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-6">
          {mode === 'login' ? t('login') : t('register')}
        </h2>

        {successMsg ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-green-700">{successMsg}</p>
            </div>
            <button
              onClick={() => { setSuccessMsg(''); setMode('login'); }}
              className="w-full btn-primary py-2.5"
            >
              {t('login')}
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      {t('authName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('authYourName')}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      {t('authInstitution') || 'Institution'}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder={t('authInstitutionPlaceholder') || 'Your institution'}
                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('authEmail')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('authPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                  />
                </div>
              </div>

              {displayError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-600">{displayError}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? t('login') : t('register')}
              </button>
            </form>

            <p className="mt-4 text-center text-[12px] text-slate-500">
              {mode === 'login' ? (
                <>
                  {t('authNoAccount')}{' '}
                  <button onClick={() => { setMode('register'); setLocalError(''); setSuccessMsg(''); }} className="text-[#005C99] hover:underline font-medium">
                    {t('register')}
                  </button>
                </>
              ) : (
                <>
                  {t('authHasAccount')}{' '}
                  <button onClick={() => { setMode('login'); setLocalError(''); setSuccessMsg(''); }} className="text-[#005C99] hover:underline font-medium">
                    {t('login')}
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
