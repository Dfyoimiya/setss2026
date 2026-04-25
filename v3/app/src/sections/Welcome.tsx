import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Users, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WelcomeProps {
  t: (key: string) => string;
}

export default function Welcome({ t }: WelcomeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.animate-in');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  const highlights = [
    { icon: BookOpen, key: 'welcomeHighlight1' },
    { icon: Users, key: 'welcomeHighlight2' },
    { icon: Calendar, key: 'welcomeHighlight3' },
    { icon: MapPin, key: 'welcomeHighlight4' },
  ];

  return (
    <section id="about" ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Text */}
          <div>
            <h2 className="animate-in section-title mb-4">
              {t('welcomeTitle')}
            </h2>
            <div className="animate-in w-12 h-1 bg-[#005C99] mb-6" />

            <p className="animate-in text-[14px] text-slate-600 leading-relaxed mb-6">
              {t('welcomeDesc1')}
            </p>

            <p className="animate-in text-[14px] text-slate-600 leading-relaxed mb-8">
              {t('welcomeDesc2')}
            </p>

            <div className="space-y-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="animate-in flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#005C99] flex-shrink-0" />
                  <span className="text-[13px] text-slate-600">{t(item.key)}</span>
                </div>
              ))}
            </div>

            <p className="animate-in text-[14px] text-slate-600 leading-relaxed mt-8">
              {t('welcomeDesc3')}
            </p>
          </div>

          {/* Right: Image + Info Card */}
          <div>
            <div className="animate-in relative overflow-hidden">
              <img
                src="/images/25.jpg"
                alt={t('swuCampusAlt')}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>

            <div className="animate-in mt-6 bg-slate-50 border border-slate-200 p-5">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                {t('venueInfoTitle')}
              </h3>
              <div className="space-y-2 text-[12px] text-slate-600">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#005C99] mt-0.5 flex-shrink-0" />
                  <span className="whitespace-pre-line">
                    {t('venueAddress')}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#005C99] flex-shrink-0" />
                  <span>{t('venueDate')}</span>
                </p>
              </div>
              <a
                href="http://www.rise-swu.cn/SETSS2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[12px] text-[#005C99] hover:underline font-medium"
              >
                {t('visitOfficialWebsite')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}