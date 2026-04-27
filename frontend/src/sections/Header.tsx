import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Search, Globe, Shield, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/hooks/useAuth';
import AuthModal from '@/sections/AuthModal';

// 引入你编写的搜索钩子与高亮函数 (请根据你的实际目录结构调整路径)
import { useGlobalSearch, highlightMatches } from '@/hooks/useGlobalSearch'; 

interface HeaderProps {
  user: AuthUser | null;
  isAdmin?: boolean;
  logout: () => void;
}

export default function Header({ user, isAdmin, logout }: HeaderProps) {
  const { lang, t, toggleLang } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hasPressedEnter, setHasPressedEnter] = useState(false);

  // 获取搜索逻辑与方法
  const { search, goToResult, getResultMeta, getPageLabel } = useGlobalSearch();
  // 实时计算当前查询的结果
  const searchResults = search(searchQuery);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleLoginSuccess = () => setShowAuth(false);

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHasPressedEnter(false); // 查询变化时重置 Enter 状态
  };

  // 处理回车：第一次 Enter 仅确认输入（不跳转），第二次 Enter 跳转至第一项
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      if (!hasPressedEnter) {
        setHasPressedEnter(true);
        return;
      }
      goToResult(searchResults[0]);
      setSearchQuery('');
      setShowSearch(false);
      setHasPressedEnter(false);
    }
  };

  // 辅助函数：将含有 <<HL>> 和 <</HL>> 的字符串渲染为 React 高亮元素
  const renderHighlightedText = (text: string, query: string) => {
    const highlighted = highlightMatches(text, query);
    const parts = highlighted.split(/(<<HL>>.*?<<\/HL>>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<<HL>>') && part.endsWith('<</HL>>')) {
        return (
          <span key={i} className="text-[#00629B] font-bold bg-blue-50/80 rounded-sm px-0.5">
            {part.slice(6, -7)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:text-[#00629B] transition-colors border border-slate-200 rounded-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'EN' : '中文'}</span>
              </button>

              {/* Search */}
              <div className="relative">
                {showSearch ? (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onBlur={() => {
                        // 稍微延迟关闭，以便让下拉菜单的 onClick 能够顺利触发
                        setTimeout(() => {
                          if (!searchQuery) setShowSearch(false);
                        }, 200);
                      }}
                      placeholder={t('search') || 'Search...'}
                      autoFocus
                      className="w-64 bg-white border border-slate-300 rounded-sm px-3 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00629B]"
                    />
                    
                    {/* 下拉搜索结果浮窗 */}
                    {searchQuery.trim() && (
                      <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-slate-200 shadow-lg rounded-sm overflow-hidden z-50 max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((res, index) => {
                            const meta = getResultMeta(res.item.type);
                            const pageLabel = getPageLabel(res.item.page);

                            return (
                              <div
                                key={index}
                                onMouseDown={(e) => e.preventDefault()} // 阻止默认行为，防止 input 失去焦点
                                onClick={() => {
                                  goToResult(res);
                                  setSearchQuery('');
                                  setShowSearch(false);
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
                            );
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
                    className="p-2 text-slate-500 hover:text-[#00629B] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-3 ml-2">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-[#00629B] bg-[#00629B]/10 hover:bg-[#00629B]/20 rounded-md transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {t('adminPanel')}
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-[#00629B] hover:bg-slate-50 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {t('dashboard')}
                  </Link>
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
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
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] ml-2">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="text-slate-600 hover:text-[#00629B] transition-colors font-medium"
                  >
                    {t('login')}
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="text-slate-600 hover:text-[#00629B] transition-colors font-medium"
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
        onLogin={handleLoginSuccess}
      />
    </>
  );
}