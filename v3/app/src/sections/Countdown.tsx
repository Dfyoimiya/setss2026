import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountdownProps {
  t: (key: string) => string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ t }: CountdownProps) {
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
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  const formatNumber = (n: number) => String(n).padStart(2, '0');
  const units: (keyof TimeLeft)[] = ['days', 'hours', 'minutes', 'seconds'];

  return (
    <section id="countdown" ref={sectionRef} className="bg-[#005C99] py-8 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {units.map((unit) => (
            <div key={unit} className="count-item text-center">
              <span className="block text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
                {formatNumber(timeLeft[unit])}
              </span>
              <span className="block mt-1 text-[10px] sm:text-xs text-white/70 uppercase tracking-[0.15em] font-medium">
                {t(unit)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
