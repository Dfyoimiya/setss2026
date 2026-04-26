import { useState } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  onLogin: (name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, mode, setMode, onLogin }: AuthModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(t('authFillRequired'));
      return;
    }
    if (mode === 'register' && !name) {
      setError(t('authEnterName'));
      return;
    }
    const displayName = mode === 'register' ? name : email.split('@')[0];
    onLogin(displayName, email);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-slate-200 shadow-2xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-6">
          {mode === 'login' ? t('login') : t('register')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
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
                  className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                />
              </div>
            </div>
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
                className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
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
                className="w-full bg-white border border-slate-300 pl-10 pr-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
              />
            </div>
          </div>

          {error && <p className="text-[11px] text-red-500">{error}</p>}

          <button type="submit" className="w-full btn-primary py-2.5">
            {mode === 'login' ? t('login') : t('register')}
          </button>
        </form>

        <p className="mt-4 text-center text-[12px] text-slate-500">
          {mode === 'login' ? (
            <>
              {t('authNoAccount')}{' '}
              <button onClick={() => setMode('register')} className="text-[#005C99] hover:underline font-medium">
                {t('register')}
              </button>
            </>
          ) : (
            <>
              {t('authHasAccount')}{' '}
              <button onClick={() => setMode('login')} className="text-[#005C99] hover:underline font-medium">
                {t('login')}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}