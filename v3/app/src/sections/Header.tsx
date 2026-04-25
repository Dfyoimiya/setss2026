import { useState } from 'react';
import { User, LogOut, Search, Globe } from 'lucide-react';
import type { Language } from '@/hooks/useLanguage';
import type { User as AuthUser } from '@/hooks/useAuth';
import AuthModal from '@/sections/AuthModal';

interface HeaderProps {
  lang: Language;
  t: (key: string) => string;
  toggleLang: () => void;
  user: AuthUser | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export default function Header({ lang, t, toggleLang, user, login, logout }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const sections = ['welcome', 'speakers', 'schedule', 'registration', 'courses'];
      const matched = sections.find((s) => query.includes(s) || s.includes(query));
      if (matched) {
        document.getElementById(matched)?.scrollIntoView({ behavior: 'smooth' });
      }
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 relative z-[60]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Left: Logo + Conference Info */}
            <div className="flex items-center gap-4">
              <img
                src="/images/setss-logo.png"
                alt="SETSS Logo"
                className="h-14 w-auto flex-shrink-0"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {t('conferenceNameLine1')}
                </span>
                {t('conferenceNameLine2') && (
                  <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                    {t('conferenceNameLine2')}
                  </span>
                )}
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {t('conferenceDateLocation')}
                </span>
              </div>
            </div>

            {/* Right: Language + Auth + Search */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:text-[#005C99] transition-colors border border-slate-200 rounded-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'EN' : '中文'}</span>
              </button>

              {/* Search */}
              <div className="relative">
                {showSearch ? (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    onBlur={() => !searchQuery && setShowSearch(false)}
                    placeholder={t('search')}
                    autoFocus
                    className="w-44 bg-white border border-slate-300 rounded-sm px-3 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                  />
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-slate-500 hover:text-[#005C99] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-[12px] text-slate-700 hidden sm:inline">{user.name}</span>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title={t('logout')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px]">
                  <button
                    onClick={() => openAuth('login')}
                    className="text-slate-600 hover:text-[#005C99] transition-colors font-medium"
                  >
                    {t('login')}
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => openAuth('register')}
                    className="text-slate-600 hover:text-[#005C99] transition-colors font-medium"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={login}
        t={t}
      />
    </>
  );
}