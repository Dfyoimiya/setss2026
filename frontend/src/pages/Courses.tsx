import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  FileText,
  ImageOff,
} from 'lucide-react';
import { useLanguage, getAllSpeakers, type SpeakerData } from '@/hooks/useLanguage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Courses() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Record<number, 'bio' | 'abstract'>>({});
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 所有讲者数据从 context 翻译系统获取
  const coursesData: SpeakerData[] = getAllSpeakers(t);

  useEffect(() => {
    window.scrollTo(0, 0);

    const speakerParam = searchParams.get('speaker');
    if (speakerParam) {
      setTimeout(() => {
        let targetEl: HTMLDivElement | null = null;

        // 优先按稳定ID查找（不受语言切换影响）
        const speakerId = parseInt(speakerParam, 10);
        if (!isNaN(speakerId)) {
          const targetCourse = coursesData.find((c) => c.id === speakerId);
          if (targetCourse) {
            targetEl = sectionRefs.current[targetCourse.name];
          }
        }

        // 回退：按名字查找（兼容旧URL格式）
        if (!targetEl) {
          targetEl = sectionRefs.current[speakerParam];
        }

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEl.classList.add('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
          setTimeout(() => {
            targetEl!.classList.remove('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
          }, 2500);
        }
      }, 300);
    }
  }, [searchParams]);

  useEffect(() => {
    const items = document.querySelectorAll('.course-animate');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.courses-container', start: 'top 80%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  const getSpeakerId = (name: string) => name.replace(/\s+/g, '-');

  const handleImgError = (idx: number) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  };

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
              SETSS 2026
            </span>
          </div>
        </div>
      </div>

      {/* Hero 标题区域 */}
      <div className="relative bg-[#1a365d] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b8860b]/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#b8860b]" />

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <Award className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[12px] font-semibold text-white/90 tracking-[0.15em] uppercase">
              {t('coursesBadge')}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.15] mb-6">
            {t('coursesTitle')}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
            <div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" />
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
          </div>

          <p className="max-w-[650px] mx-auto text-[15px] text-white/70 leading-[1.8] font-light">
            {t('coursesSubtitle')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 52C672 56 768 64 864 66.7C960 69 1056 67 1152 61.3C1248 56 1344 48 1392 44L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#faf9f6" />
          </svg>
        </div>
      </div>

      {/* 讲者速览导航 */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-[11px] font-bold text-[#8a8680] uppercase tracking-[0.2em] mb-4">
            {t('coursesQuickNav')}
          </p>
          <div className="flex flex-wrap gap-2">
            {coursesData.map((course, idx) => (
              <a
                key={course.name}
                href={`#${getSpeakerId(course.name)}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = sectionRefs.current[course.name];
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf9f6] border border-[#e8e4df] rounded-lg text-[12px] text-[#5c5a56] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all duration-200"
              >
                <span className="text-[10px] font-bold text-[#b8860b] font-mono">{String(idx + 1).padStart(2, '0')}</span>
                <span className="font-medium truncate max-w-[140px]">{course.name.split(' ').pop()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="courses-container max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="space-y-14">
          {coursesData.map((course, idx) => {
            const tab = activeTab[idx] ?? 'bio';
            const hasHighlight = course.highlight;
            const isTuring = course.title.includes('Turing') || course.name.includes('图灵');
            const hasError = imgErrors[idx];
            const filename = course.photo.split('/').pop() || '';

            return (
              <div
                key={course.name}
                ref={(el) => { sectionRefs.current[course.name] = el; }}
                id={getSpeakerId(course.name)}
                className="course-animate scroll-mt-24"
              >
                <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_8px_40px_rgba(26,54,93,0.1)] transition-all duration-500">
                  
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />
                    
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                        {/* 照片区域 */}
                        <div className="flex-shrink-0 flex flex-col items-center sm:items-start gap-3">
                          <div className="relative">
                            <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-xl overflow-hidden border-[2px] border-[#e8e4df] shadow-md bg-[#faf9f6]">
                              {!hasError ? (
                                <img
                                  src={course.photo}
                                  alt={course.name}
                                  className="w-full h-full object-cover"
                                  onError={() => handleImgError(idx)}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                  <ImageOff className="w-8 h-8 text-[#d4d0ca] mb-2" />
                                  <p className="text-[10px] text-[#b0aba4] font-mono break-all leading-tight">
                                    {filename}
                                  </p>
                                  <p className="text-[9px] text-red-400 mt-1">not found</p>
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#1a365d] rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-[13px] font-bold font-mono">{String(idx + 1).padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                            {isTuring && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b8860b]/10 border border-[#b8860b]/20 rounded-full text-[11px] font-bold text-[#7a5c20] tracking-wide">
                                <Award className="w-3 h-3" />
                                {t('coursesTuringLaureate')}
                              </span>
                            )}
                            {hasHighlight && !isTuring && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1a365d]/[0.05] border border-[#1a365d]/10 rounded-full text-[11px] font-bold text-[#1a365d] tracking-wide">
                                <Award className="w-3 h-3" />
                                {course.highlight}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#faf9f6] border border-[#e8e4df] rounded-full text-[11px] text-[#8a8680]">
                              <Users className="w-3 h-3" />
                              {course.title}
                            </span>
                          </div>

                          <h2 className="font-serif text-2xl sm:text-[28px] font-bold text-[#1a2a3a] leading-tight mb-2">
                            {course.name}
                          </h2>

                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[13px] text-[#8a8680] italic mb-5">
                            <MapPin className="w-3.5 h-3.5 not-italic flex-shrink-0" />
                            {course.affiliation}
                          </div>

                          <div className="relative bg-[#faf9f6] border border-[#e8e4df] rounded-xl p-4 sm:p-5">
                            <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-[#b8860b] rounded-r-full" />
                            <div className="flex items-start gap-3">
                              <BookOpen className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.2em] mb-1">
                                  {t('coursesCourseLabel')}
                                </p>
                                <p className="text-[16px] sm:text-[17px] font-semibold text-[#1a2a3a] leading-snug">
                                  {course.course}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#f0ede8]">
                    <div className="flex border-b border-[#f0ede8]">
                      <button
                        onClick={() => setActiveTab(prev => ({ ...prev, [idx]: 'bio' }))}
                        className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-[13px] font-semibold transition-colors duration-200 border-b-2 ${
                          tab === 'bio'
                            ? 'text-[#1a365d] border-[#b8860b] bg-[#faf9f6]'
                            : 'text-[#8a8680] border-transparent hover:text-[#5c5a56]'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        {t('coursesTabBio')}
                      </button>
                      <button
                        onClick={() => setActiveTab(prev => ({ ...prev, [idx]: 'abstract' }))}
                        className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-[13px] font-semibold transition-colors duration-200 border-b-2 ${
                          tab === 'abstract'
                            ? 'text-[#1a365d] border-[#b8860b] bg-[#faf9f6]'
                            : 'text-[#8a8680] border-transparent hover:text-[#5c5a56]'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {t('coursesTabAbstract')}
                      </button>
                    </div>

                    <div className="p-6 sm:p-8">
                      {tab === 'bio' ? (
                        <div className="animate-fadeIn">
                          <p className="text-[14px] sm:text-[15px] text-[#4a4844] leading-[1.9]">
                            {course.bio}
                          </p>
                        </div>
                      ) : (
                        <div className="animate-fadeIn">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <BookOpen className="w-4 h-4 text-[#1a365d]" />
                            </div>
                            <p className="text-[14px] sm:text-[15px] text-[#4a4844] leading-[1.9]">
                              {course.abstract}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-[#1a365d] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="footerGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerGrid)" />
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