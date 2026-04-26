import { useState } from 'react'
import { User, LogOut, Search, Globe, LayoutDashboard, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/sections/AuthModal'
import { useGlobalSearch, highlightMatches } from '@/hooks/useGlobalSearch'

export default function Header() {
  const { lang, t, toggleLang } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const { search, goToResult, getResultMeta, getPageLabel } = useGlobalSearch()
  const searchResults = search(searchQuery)

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      goToResult(searchResults[0])
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  const renderHighlightedText = (text: string, query: string) => {
    const highlighted = highlightMatches(text, query)
    const parts = highlighted.split(/(<<HL>>.*?<<\/HL>>)/g)
    return parts.map((part, i) => {
      if (part.startsWith('<<HL>>') && part.endsWith('<</HL>>')) {
        return (
          <span key={i} className="text-[#005C99] font-bold bg-blue-50/80 rounded-sm px-0.5">
            {part.slice(6, -7)}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  const hasRole = (role: string) => user?.role?.includes(role) ?? false

  return (
    <>
      <header className="bg-white border-b border-slate-200 relative z-[60]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
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

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:text-[#005C99] transition-colors border border-slate-200 rounded-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'EN' : '中文'}</span>
              </button>

              <div className="relative">
                {showSearch ? (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onBlur={() => {
                        setTimeout(() => {
                          if (!searchQuery) setShowSearch(false)
                        }, 200)
                      }}
                      placeholder={t('search') || 'Search...'}
                      autoFocus
                      className="w-64 bg-white border border-slate-300 rounded-sm px-3 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#005C99]"
                    />

                    {searchQuery.trim() && (
                      <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-slate-200 shadow-lg rounded-sm overflow-hidden z-50 max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((res, index) => {
                            const meta = getResultMeta(res.item.type)
                            const pageLabel = getPageLabel(res.item.page)

                            return (
                              <div
                                key={index}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  goToResult(res)
                                  setSearchQuery('')
                                  setShowSearch(false)
                                }}
                                className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[13px] font-semibold text-slate-800 line-clamp-1">
                                    {renderHighlightedText(res.item.title[lang], searchQuery)}
                                  </span>
                                  <span
                                    className="text-[10px] px-2 py-0.5 rounded-sm whitespace-nowrap ml-2 flex-shrink-0"
                                    style={{ backgroundColor: meta.bg, color: meta.color }}
                                  >
                                    {lang === 'zh' ? meta.labelZh : meta.label}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {lang === 'zh' ? pageLabel.zh : pageLabel.en}
                                </div>
                                <div className="text-[12px] text-slate-600 line-clamp-2">
                                  {res.highlights.map((excerpt, i) => (
                                    <div key={i}>{renderHighlightedText(excerpt, searchQuery)}</div>
                                  ))}
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="p-4 text-center text-[12px] text-slate-500">
                            {lang === 'zh' ? '未找到相关内容' : 'No results found'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-slate-500 hover:text-[#005C99] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 hover:border-[#005C99] transition-colors">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-[12px] text-slate-700 hidden sm:inline">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-0" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-50">
                        <button
                          onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('dashboard') || 'Dashboard'}
                        </button>
                        {(hasRole('admin') || hasRole('organizer')) && (
                          <button
                            onClick={() => { navigate('/admin'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            {t('adminPanel') || 'Admin Panel'}
                          </button>
                        )}
                        <hr className="border-slate-100" />
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] ml-2">
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
      />
    </>
  )
}
