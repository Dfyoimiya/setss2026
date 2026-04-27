import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Award, GraduationCap, ImageOff } from 'lucide-react';
import { useLanguage, getAllSpeakers, type SpeakerData } from '@/hooks/useLanguage';

export default function Courses() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const coursesData: SpeakerData[] = getAllSpeakers(t);

  useEffect(() => {
    window.scrollTo(0, 0);

    const speakerParam = searchParams.get('speaker');
    if (!speakerParam) return;

    const speakerId = parseInt(speakerParam, 10);
    if (isNaN(speakerId)) return;

    const targetCourse = coursesData.find((c) => c.id === speakerId);
    if (!targetCourse) return;

    let attempts = 0;
    const maxAttempts = 10;
    const tryScroll = () => {
      const el = sectionRefs.current[targetCourse.name];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-[#b8860b]', 'ring-offset-4', 'rounded');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#b8860b]', 'ring-offset-4', 'rounded');
        }, 2500);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 150);
      }
    };
    setTimeout(tryScroll, 100);
  }, [searchParams, coursesData]);

  const getSpeakerId = (name: string) => name.replace(/\s+/g, '-');

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#e8e4df] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[13px] text-[#5c5a56] hover:text-[#1a365d] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[13px] font-semibold text-[#1a365d]">SETSS 2026</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#1a365d] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-6">
            <Award className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]">
              {t('coursesBadge')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('coursesTitle')}
          </h1>
          <p className="max-w-[600px] mx-auto text-[14px] text-white/60 leading-relaxed">
            {t('coursesSubtitle')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf9f6]" />
      </div>

      {/* Quick nav */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[1000px] mx-auto px-4 py-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em] mr-2">
            {t('coursesQuickNav')}
          </span>
          {coursesData.map((course, idx) => (
            <a
              key={course.name}
              href={`#${getSpeakerId(course.name)}`}
              onClick={(e) => {
                e.preventDefault();
                const el = sectionRefs.current[course.name];
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-[11px] px-2.5 py-1 rounded-md border border-[#e8e4df] text-[#5c5a56] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-colors"
            >
              {String(idx + 1)}. {course.name.split('Prof. ').pop()?.split(',')[0]}
            </a>
          ))}
        </div>
      </div>

      {/* Speaker list */}
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-10">
          {coursesData.map((course, idx) => {
            const isTuring = course.name.includes('Turing') || course.name.includes('图灵');
            const hasError = imgErrors[idx];
            const filename = course.photo.split('/').pop() || '';

            return (
              <div
                key={course.name}
                ref={(el) => { sectionRefs.current[course.name] = el; }}
                id={getSpeakerId(course.name)}
                className="scroll-mt-20 bg-white border border-[#e8e4df] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Photo */}
                    <div className="flex-shrink-0 self-center sm:self-start">
                      <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-lg overflow-hidden border border-[#e8e4df] bg-[#faf9f6]">
                        {!hasError ? (
                          <img
                            src={course.photo}
                            alt={course.name}
                            className="w-full h-full object-cover"
                            onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            <ImageOff className="w-5 h-5 text-[#d4d0ca] mb-1" />
                            <p className="text-[9px] text-red-400 font-mono break-all leading-tight">{filename}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {isTuring && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#b8860b]/10 rounded text-[10px] font-bold text-[#7a5c20]">
                            <Award className="w-3 h-3" />
                            {t('coursesTuringLaureate')}
                          </span>
                        )}
                        {course.highlight && !isTuring && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1a365d]/5 rounded text-[10px] font-medium text-[#1a365d]">
                            <Award className="w-3 h-3" />
                            {course.highlight}
                          </span>
                        )}
                        <span className="text-[11px] text-[#8a8680]">
                          {course.title}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[#1a2a3a] mb-1.5">
                        {course.name}
                      </h2>
                      <p className="text-[13px] text-[#8a8680] italic mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {course.affiliation}
                      </p>

                      {/* Course title */}
                      <div className="bg-[#faf9f6] border-l-[3px] border-[#b8860b] rounded-r-lg px-4 py-2.5 mb-3">
                        <p className="text-[10px] font-bold text-[#8a8680] uppercase tracking-wide mb-0.5">
                          {t('coursesCourseLabel')}
                        </p>
                        <p className="text-[14px] font-semibold text-[#1a2a3a] leading-snug">
                          {course.course}
                        </p>
                      </div>

                      {/* Tabs: Bio / Abstract */}
                      <details className="group" open={idx === 0}>
                        <summary className="flex items-center gap-4 cursor-pointer py-2 text-[13px] font-semibold text-[#1a365d] hover:text-[#b8860b] transition-colors select-none">
                          <span className="flex items-center gap-1.5">
                            {t('coursesTabBio')}
                          </span>
                          <span className="text-[10px] text-[#8a8680]">|</span>
                          <span className="flex items-center gap-1.5">
                            {t('coursesTabAbstract')}
                          </span>
                          <span className="text-[10px] text-[#8a8680] ml-auto group-open:hidden">展开</span>
                          <span className="text-[10px] text-[#8a8680] ml-auto hidden group-open:inline">收起</span>
                        </summary>
                        <div className="mt-2 space-y-3">
                          <p className="text-[13px] text-[#4a4844] leading-[1.8]">
                            {course.bio}
                          </p>
                          <div className="border-t border-[#f0ede8] pt-3">
                            <p className="text-[13px] text-[#4a4844] leading-[1.8]">
                              {course.abstract}
                            </p>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a365d] py-10">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[13px] font-semibold text-white/80">SETSS 2026</span>
          </div>
          <p className="text-[11px] text-white/35">
            Spring School on Engineering Trustworthy Software Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
