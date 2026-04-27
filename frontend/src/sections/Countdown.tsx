import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  const targetDate = new Date('2026-05-11T00:00:00+08:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.count-item');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  const formatNumber = (n: number) => String(n).padStart(2, '0');
  const units: (keyof TimeLeft)[] = ['days', 'hours', 'minutes', 'seconds'];

  return (
    <section id="countdown" ref={sectionRef} className="relative bg-[#00629B] overflow-hidden">
      {/* 细微背景纹理 */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="cdGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cdGrid)" />
        </svg>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />

      <div className="relative max-w-[700px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 紧凑的横向排列 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {units.map((unit, idx) => (
            <div key={unit} className="count-item flex items-center gap-2 sm:gap-3">
              <div className="text-center">
                <div className="inline-flex items-center justify-center min-w-[56px] sm:min-w-[68px] h-12 sm:h-14 bg-white/[0.08] border border-white/[0.12] rounded-md">
                  <span className="text-[22px] sm:text-[28px] font-bold text-white font-mono tracking-tight">
                    {formatNumber(timeLeft[unit])}
                  </span>
                </div>
                <span className="block mt-1 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold">
                  {t(unit)}
                </span>
              </div>
              {idx < units.length - 1 && (
                <span className="text-white/15 text-lg sm:text-xl font-light -mt-3">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}