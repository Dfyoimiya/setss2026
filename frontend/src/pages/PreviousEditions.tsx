import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Globe,
  CalendarDays,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Edition {
  edition: string;
  year: string;
  materials: { label: string; url: string; icon: typeof BookOpen }[];
}

const editionsData: Edition[] = [
  {
    edition: '7th',
    year: '2025',
    materials: [
      { label: 'Website', url: 'https://tis.ios.ac.cn/SETSS2025/', icon: Globe },
      { label: 'Proceedings', url: 'https://link.springer.com/series/4477', icon: BookOpen },
    ],
  },
  {
    edition: '6th',
    year: '2024',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-981-96-4656-2', icon: BookOpen }],
  },
  {
    edition: '5th',
    year: '2019',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-3-030-55089-9', icon: BookOpen }],
  },
  {
    edition: '4th',
    year: '2018',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-3-030-17601-3', icon: BookOpen }],
  },
  {
    edition: '3rd',
    year: '2017',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-3-030-02928-9', icon: BookOpen }],
  },
  {
    edition: '2nd',
    year: '2016',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-3-319-56841-6', icon: BookOpen }],
  },
  {
    edition: '1st',
    year: '2014',
    materials: [{ label: 'Proceedings', url: 'https://link.springer.com/book/10.1007/978-3-319-29628-9', icon: BookOpen }],
  },
];

export default function PreviousEditions() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

 useEffect(() => {
  window.scrollTo(0, 0);

  // 处理从搜索跳转过来的 scrollTo 参数
  const scrollToId = searchParams.get('scrollTo');
  if (scrollToId) {
    setTimeout(() => {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 可选：添加高亮动画
        el.classList.add('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
        }, 2500);
      }
    }, 400);
  }
}, [searchParams]);

  const isZh = lang === 'zh';

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* 顶部导航栏 */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-[#e8e4df] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#5c5a56] hover:text-[#1a365d] text-[13px] font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1a365d] flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[#1a365d] tracking-wide">
              SETSS
            </span>
          </div>
        </div>
      </div>

      {/* Hero 标题区域 */}
      <div className="bg-[#1a365d] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-6">
            <Clock className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]">
              2014 — 2025
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('previousEditionsTitle')}
          </h1>

          <p className="max-w-[700px] mx-auto text-[14px] text-white/60 leading-relaxed">
            {t('previousEditionsDesc')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf9f6]" />
      </div>

      {/* 主体内容 */}
      <main id="previous-editions" className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* 时间线标题 */}
        <div className="flex items-center gap-5 mb-14">
          <div className="h-px flex-1 bg-[#e8e4df]" />
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-[#b8860b]" />
            <h2 className="text-[13px] font-bold text-[#8a8680] uppercase tracking-[0.2em]">
              {t('historyTimeline')}
            </h2>
          </div>
          <div className="h-px flex-1 bg-[#e8e4df]" />
        </div>

        {/* 时间线列表 */}
        <div className="relative">
          {/* 中央时间线 */}
          <div className="absolute left-7 sm:left-8 top-8 bottom-8 w-[1.5px] bg-[#e8e4df] hidden sm:block" />
          
          <div className="space-y-6">
            {editionsData.map((item, idx) => (
              <div
                key={idx}
                className="group relative"
              >
                {/* 桌面端时间线节点 */}
                <div className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-[#faf9f6] border-[2.5px] border-[#b8860b] group-hover:scale-125 group-hover:bg-[#b8860b] transition-all duration-300" />
                </div>

                <div className="sm:pl-20">
                  <div className="bg-white border border-[#e8e4df] rounded-2xl p-6 sm:p-7 hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] hover:border-[#1a365d]/10 transition-all duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                      {/* 版本与年份 */}
                      <div className="flex items-center gap-4 sm:w-48 flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-[#1a365d] flex flex-col items-center justify-center text-white shadow-lg shadow-[#1a365d]/15 group-hover:shadow-xl group-hover:shadow-[#1a365d]/20 group-hover:scale-105 transition-all duration-500">
                          <span className="text-[10px] font-medium text-white/70 uppercase leading-none tracking-wider">
                            {t('edition')}
                          </span>
                          <span className="text-lg font-bold leading-none mt-0.5 font-serif">
                            {item.edition}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#8a8680] font-bold uppercase tracking-[0.15em]">
                            {t('year')}
                          </p>
                          <p className="text-[22px] font-bold text-[#1a2a3a] font-serif">
                            {item.year}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:block w-px h-14 bg-[#f0ede8]" />

                      {/* 资料链接 */}
                      <div className="flex-1">
                        <p className="text-[11px] text-[#8a8680] font-bold uppercase tracking-[0.15em] mb-3 sm:hidden">
                          {t('material')}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          {item.materials.map((mat, mIdx) => (
                            <a
                              key={mIdx}
                              href={mat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#faf9f6] border border-[#e8e4df] text-[#4a4844] text-[13px] font-medium rounded-xl hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all duration-300 group/link"
                            >
                              <mat.icon className="w-4 h-4 text-[#1a365d] group-hover/link:text-white transition-colors" />
                              <span>{mat.label}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 -ml-1 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all duration-300" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 即将到来的会议提示 */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#1a365d]/[0.03] border border-[#1a365d]/10 rounded-2xl">
            <div className="w-2 h-2 bg-[#b8860b] rounded-full animate-pulse" />
            <span className="text-[13px] text-[#1a2a3a] font-medium">
              {isZh ? '第八届会议将于 2026 年 5 月 11–17 日举行' : 'The 8th edition will be held on May 11–17, 2026'}
            </span>
            <span className="text-[11px] text-[#8a8680] bg-white px-2.5 py-1 rounded-full border border-[#e8e4df]">
              Upcoming
            </span>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-[#1a365d] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="footerGridPrev" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerGridPrev)" />
          </svg>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-[#b8860b]" />
            <span className="text-[14px] font-semibold text-white/90">SETSS 2026</span>
          </div>
          <p className="text-[12px] text-white/40">
            © 2026 Spring School on Engineering Trustworthy Software Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}