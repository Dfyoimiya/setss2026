import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export default function Registration() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.reg-animate');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <section id="registration" ref={sectionRef} className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Registration CTA */}
          <div>
            <p className="reg-animate text-[11px] font-bold tracking-[0.2em] text-[#00629B] uppercase mb-2">
              {t('joinUs')}
            </p>
            <h2 className="reg-animate section-title mb-4">
              {t('registrationOpen')}
            </h2>
            <div className="reg-animate w-12 h-1 bg-[#00629B] mb-6" />

            <p className="reg-animate text-[14px] text-slate-600 leading-relaxed mb-4">
              {t('regDesc1')}
            </p>

            <p className="reg-animate text-[14px] text-slate-600 leading-relaxed mb-8">
              {t('regDesc2')}
            </p>

            <div className="reg-animate flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/registration')}
                className="btn-primary"
              >
                <span>{t('registerNow')}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="btn-outline">
                {t('learnMore')}
              </button>
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="reg-animate bg-white border border-slate-200 p-6 sm:p-8">
            <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-5">
              {t('contactInfoTitle')}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00629B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-700">{t('addressLabel')}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5 whitespace-pre-line">
                    {t('addressDetail')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#00629B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-700">{t('emailLabel')}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">liubocq@swu.edu.cn</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#00629B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-700">{t('websiteLabel')}</p>
                  <a
                    href="https://www.rise-swu.cn/SETSS2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#00629B] hover:underline mt-0.5 inline-block"
                  >
                    https://www.rise-swu.cn/SETSS2026
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-[12px] font-bold text-slate-600 mb-2">{t('organizedBy')}</h4>
              <p className="text-[12px] text-slate-500 whitespace-pre-line">
                {t('organizerDetail')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}