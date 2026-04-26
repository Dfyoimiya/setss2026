import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const card = cardRef.current;
    if (!section || !image || !card) return;

    const triggers: ScrollTrigger[] = [];

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(image, { y: self.progress * 80 });
        gsap.set(card, { y: self.progress * 40, opacity: 1 - self.progress * 1.2 });
      },
    });
    triggers.push(st);

    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out', delay: 0.2 }
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[85vh] min-h-[600px] overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[115%] -top-[7%]"
      >
        <img
          src="/images/swu-aerial-1.jpg"
          alt={t('heroImageAlt')}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Center Card Overlay */}
      <div
        ref={cardRef}
        className="relative z-10 flex items-center justify-center h-full px-4"
      >
        <div className="bg-black/60 backdrop-blur-sm border border-white/20 px-8 py-10 sm:px-14 sm:py-14 max-w-[700px] w-full text-center">
          {/* Date Tag */}
          <p className="text-[11px] sm:text-[12px] font-bold tracking-[0.25em] text-white/80 uppercase mb-5">
            {t('heroDateTag')}
          </p>

          {/* Horizontal Lines */}
          <div className="w-16 h-[3px] bg-[#005C99] mx-auto mb-6" />

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            SETSS 2026
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed mb-3">
            {t('heroSubtitle')}
          </p>

          <p className="text-xs sm:text-sm text-white/60 mb-8">
            {t('heroVenue')}
          </p>

          {/* Register Button - 跳转到注册页面 */}
          <button
            onClick={() => navigate('/registration')}
            className="btn-primary text-[13px] tracking-wide uppercase px-8 py-3"
          >
            {t('registerNow')}
          </button>
        </div>
      </div>
    </section>
  );
}