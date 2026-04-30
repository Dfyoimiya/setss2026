import { useState } from 'react'
import { X, User, Mail, Lock, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/hooks/useLanguage'
import { useLogin, useRegister } from '@/hooks/useAuthQuery'
import type { LoginRequest, RegisterRequest } from '@/api/types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  setMode: (mode: 'login' | 'register') => void
  onLogin: (name: string, email: string) => void
}

export default function AuthModal({ isOpen, onClose, mode, setMode, onLogin }: AuthModalProps) {
  const { t } = useLanguage()
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [institution, setInstitution] = useState('')

  if (!isOpen) return null

  const isLoading = loginMutation.isPending || registerMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) return
    if (mode === 'register' && !fullName) return

    if (mode === 'login') {
      const data: LoginRequest = { email, password }
      loginMutation.mutate(data, {
        onSuccess: () => {
          onLogin(fullName || email.split('@')[0], email)
          resetForm()
        },
      })
    } else {
      const data: RegisterRequest = { email, password, full_name: fullName, institution: institution || undefined }
      registerMutation.mutate(data, {
        onSuccess: () => {
          const loginData: LoginRequest = { email, password }
          loginMutation.mutate(loginData, {
            onError: () => {
              toast.info('注册成功，请手动登录')
              setMode('login')
            },
          })
          resetForm()
        },
      })
    }
  }

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPassword('')
    setInstitution('')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-[#E2E8F0] shadow-2xl rounded-xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#64748B] hover:text-[#1E293B] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-[#1E293B] mb-6">
          {mode === 'login' ? t('login') : t('register')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <Field icon={User} label={t('authName')}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('authYourName')}
                  className="input-standard pl-10"
                  required
                />
              </Field>
              <Field icon={Building2} label="机构">
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="所属机构（选填）"
                  className="input-standard pl-10"
                />
              </Field>
            </>
          )}

          <Field icon={Mail} label={t('authEmail')}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input-standard pl-10"
              required
            />
          </Field>

          <Field icon={Lock} label={t('authPassword')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-standard pl-10"
              required
              minLength={8}
            />
          </Field>

          {mode === 'register' && (
            <p className="text-xs text-[#64748B]">密码至少 8 个字符</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-accent py-2.5 disabled:opacity-60"
          >
            {isLoading ? '处理中...' : mode === 'login' ? t('login') : t('register')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#64748B]">
          {mode === 'login' ? (
            <>
              {t('authNoAccount')}{' '}
              <button onClick={() => setMode('register')} className="text-[#00629B] hover:underline font-medium">
                {t('register')}
              </button>
            </>
          ) : (
            <>
              {t('authHasAccount')}{' '}
              <button onClick={() => setMode('login')} className="text-[#00629B] hover:underline font-medium">
                {t('login')}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        {children}
      </div>
    </div>
  )
}
