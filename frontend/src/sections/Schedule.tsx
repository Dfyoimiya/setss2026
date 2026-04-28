import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Coffee, Utensils, Camera, Ship } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

gsap.registerPlugin(ScrollTrigger);

const scheduleData = [
  {
    dateKey: 'scheduleDate1', dayKey: 'scheduleDay1',
    events: [
      { time: '08:30-09:15', title: 'Opening Session', detail: 'Welcome speeches by SWU President, Dean of CIS, and SETSS Briefing by Prof. Zhiming Liu. School Photo Taking.', type: 'special' },
      { time: '09:15-09:30', title: 'Testing Online Meeting', detail: 'Connectivity test with Prof. Moshe Y. Vardi', type: 'break' },
      { time: '09:30-10:30', title: 'Lecture: Are AI minds genuine minds?', speaker: 'Prof. Moshe Y. Vardi', type: 'lecture' },
      { time: '10:30-10:45', title: 'Coffee Break', type: 'break' },
      { time: '10:45-11:45', title: "Lecture: Tony Hoare: A Life of Logic, Theory, and Practice", speaker: 'Prof. Moshe Y. Vardi', type: 'lecture' },
      { time: '11:45-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
    ],
  },
  {
    dateKey: 'scheduleDate2', dayKey: 'scheduleDay2',
    events: [
      { time: '08:30-09:30', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Lecture: Digital Twins: Connecting Models with The Real World', speaker: 'Prof. Einar Broch Johnsen', type: 'lecture' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
    ],
  },
  {
    dateKey: 'scheduleDate3', dayKey: 'scheduleDay3',
    events: [
      { time: '08:30-09:30', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS', speaker: 'Prof. Kim Guldstrand Larsen', type: 'lecture' },
      { time: '17:30-21:00', title: 'Social Activity: Hot Pot Feast', type: 'social' },
    ],
  },
  {
    dateKey: 'scheduleDate4', dayKey: 'scheduleDay4',
    events: [
      { time: '08:30-09:30', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Lecture: Automata Learning and Testing with AALpy', speaker: 'Prof. Bernhard Aichernig', type: 'lecture' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
    ],
  },
  {
    dateKey: 'scheduleDate5', dayKey: 'scheduleDay5',
    events: [
      { time: '08:30-09:30', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring', speaker: 'Prof. Emily Yu', type: 'lecture' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Bringing AI to Autonomous Systems', speaker: 'Prof. Joseph Sifakis', type: 'lecture' },
      { time: '15:00-21:00', title: 'Social Activity: Chongqing Liangjiang Night Cruise', type: 'social' },
    ],
  },
  {
    dateKey: 'scheduleDate6', dayKey: 'scheduleDay6',
    events: [
      { time: '08:30-09:30', title: 'Lecture: Formal and intelligent synthesis for high confidence HCPS software', speaker: 'Prof. Wei Dong', type: 'lecture' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Lecture: Formal and intelligent synthesis for high confidence HCPS software', speaker: 'Prof. Wei Dong', type: 'lecture' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Lecture: Formal and intelligent synthesis for high confidence HCPS software', speaker: 'Prof. Wei Dong', type: 'lecture' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Lecture: Learning and Verifying Timed Systems', speaker: 'Prof. Miaomiao Zhang', type: 'lecture' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Lecture: Learning and Verifying Timed Systems', speaker: 'Prof. Miaomiao Zhang', type: 'lecture' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Lecture: Learning and Verifying Timed Systems', speaker: 'Prof. Miaomiao Zhang', type: 'lecture' },
    ],
  },
  {
    dateKey: 'scheduleDate7', dayKey: 'scheduleDay7',
    events: [
      { time: '08:30-09:30', title: 'Workshop Session', type: 'workshop' },
      { time: '09:30-09:45', title: 'Coffee Break', type: 'break' },
      { time: '09:45-10:45', title: 'Workshop Session', type: 'workshop' },
      { time: '10:45-11:00', title: 'Coffee Break', type: 'break' },
      { time: '11:00-12:00', title: 'Workshop Session', type: 'workshop' },
      { time: '12:00-14:00', title: 'Lunch', type: 'meal' },
      { time: '14:00-15:00', title: 'Workshop Session', type: 'workshop' },
      { time: '15:00-15:15', title: 'Coffee Break', type: 'break' },
      { time: '15:15-16:15', title: 'Workshop Session', type: 'workshop' },
      { time: '16:15-16:30', title: 'Coffee Break', type: 'break' },
      { time: '16:30-17:30', title: 'Workshop Session & Closing', type: 'workshop' },
    ],
  },
];

const typeIcons: Record<string, React.ElementType> = {
  lecture: Clock, break: Coffee, meal: Utensils, special: Camera, social: Ship, workshop: Clock,
};

const typeColors: Record<string, string> = {
  lecture: 'border-l-[#00629B] bg-white', break: 'border-l-slate-300 bg-slate-50', meal: 'border-l-amber-400 bg-amber-50',
  special: 'border-l-emerald-500 bg-emerald-50', social: 'border-l-purple-400 bg-purple-50', workshop: 'border-l-orange-400 bg-orange-50',
};

const lectureTitleMap: Record<string, { en: string; zh: string }> = {
  'Lecture: Are AI minds genuine minds?': {
    en: 'Lecture: Are AI minds genuine minds?',
    zh: '讲座：AI 的心智是真正的心智吗？',
  },
  "Lecture: Tony Hoare: A Life of Logic, Theory, and Practice": {
    en: "Lecture: Tony Hoare: A Life of Logic, Theory, and Practice",
    zh: '讲座：Tony Hoare 的科学人生与成就',
  },
  'Lecture: Digital Twins: Connecting Models with The Real World': {
    en: 'Lecture: Digital Twins: Connecting Models with The Real World',
    zh: '讲座：数字孪生：将模型与现实世界连接',
  },
  'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS': {
    en: 'Lecture: Model Checking, Monitoring, Performance Analysis, Synthesis and Learning for CPS',
    zh: '讲座：信息物理系统的模型检验、监控、性能分析、合成与学习',
  },
  'Lecture: Automata Learning and Testing with AALpy': {
    en: 'Lecture: Automata Learning and Testing with AALpy',
    zh: '讲座：自动机学习与 AALpy 测试',
  },
  'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring': {
    en: 'Lecture: Trustworthy Systems through Automated Reasoning, Certificates, and Runtime Monitoring',
    zh: '讲座：通过自动推理、证书与运行时监控实现可信系统',
  },
  'Lecture: Bringing AI to Autonomous Systems': {
    en: 'Lecture: Bringing AI to Autonomous Systems',
    zh: '讲座：将 AI 引入自主系统',
  },
  'Lecture: Formal and intelligent synthesis for high confidence HCPS software': {
    en: 'Lecture: Formal and intelligent synthesis for high confidence HCPS software',
    zh: '讲座：高置信度 HCPS 软件的形式化与智能合成',
  },
  'Lecture: Learning and Verifying Timed Systems': {
    en: 'Lecture: Learning and Verifying Timed Systems',
    zh: '讲座：实时系统的学习与验证',
  },
};

export default function Schedule() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll('.sched-animate');
    const tl = gsap.fromTo(items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' } }
    );
    return () => { tl.kill(); };
  }, []);

  const getEventTitle = (title: string, type: string) => {
    if (type === 'break' && title === 'Coffee Break') return t('eventCoffeeBreak');
    if (type === 'meal' && title === 'Lunch') return t('eventLunch');
    if (type === 'special' && title === 'Opening Session') return t('eventOpening');
    if (type === 'break' && title === 'Testing Online Meeting') return t('eventTesting');
    if (type === 'workshop' && title === 'Workshop Session') return t('eventWorkshop');
    if (type === 'workshop' && title === 'Workshop Session & Closing') return t('eventWorkshopClosing');
    if (type === 'social') {
      if (title === 'Social Activity: Hot Pot Feast') return `${t('eventSocialPrefix')}: ${t('activityHotPot')}`;
      if (title === 'Social Activity: Chongqing Liangjiang Night Cruise') return `${t('eventSocialPrefix')}: ${t('activityCruise')}`;
    }
    if (type === 'lecture') {
      const mapped = lectureTitleMap[title];
      if (mapped) return mapped[lang];
    }
    return title;
  };

  const getEventDetail = (detail: string | undefined, title: string, type: string) => {
    if (!detail) return undefined;
    if (type === 'special' && title === 'Opening Session') return t('eventOpeningDetail');
    if (type === 'break' && title === 'Testing Online Meeting') return t('eventTestingDetail');
    return detail;
  };

  return (
    <section id="schedule" ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="sched-animate text-[11px] font-bold tracking-[0.2em] text-[#00629B] uppercase mb-2">
            {t('programSubtitle')}
          </p>
          <h2 className="sched-animate section-title">{t('programSchedule')}</h2>
          <div className="w-12 h-1 bg-[#00629B] mx-auto mt-4" />
        </div>

        <div className="sched-animate flex flex-wrap gap-1 mb-8 border-b border-slate-200">
          {scheduleData.map((day, idx) => (
            <button key={idx} onClick={() => setActiveDay(idx)}
              className={`px-4 py-2.5 text-[11px] sm:text-[12px] font-semibold transition-colors border-b-2 ${
                activeDay === idx ? 'border-[#00629B] text-[#00629B]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t(day.dateKey)}
            </button>
          ))}
        </div>

        <div className="sched-animate">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-bold text-white bg-[#00629B] px-2.5 py-1 uppercase tracking-wider">
              {t(scheduleData[activeDay].dayKey)}
            </span>
            <span className="text-[13px] font-semibold text-slate-700">{t(scheduleData[activeDay].dateKey)}</span>
          </div>

          <div className="space-y-2">
            {scheduleData[activeDay].events.map((event, idx) => {
              const Icon = typeIcons[event.type] || Clock;
              const displayTitle = getEventTitle(event.title, event.type);
              const displayDetail = getEventDetail(event.detail, event.title, event.type);
              return (
                <div key={idx} className={`flex items-start gap-3 p-3 border-l-4 ${typeColors[event.type]} transition-colors hover:bg-slate-50`}>
                  <div className="flex items-center gap-2 min-w-[100px] flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-mono text-slate-500">{event.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] sm:text-[13px] leading-snug ${
                      event.type === 'lecture' ? 'font-semibold text-slate-800' :
                      event.type === 'social' ? 'font-semibold text-purple-700' :
                      event.type === 'special' ? 'font-semibold text-emerald-700' : 'text-slate-600'
                    }`}>{displayTitle}</p>
                    {event.speaker && <p className="text-[11px] text-[#00629B] mt-0.5 font-medium">{event.speaker}</p>}
                    {displayDetail && <p className="text-[11px] text-slate-500 mt-0.5">{displayDetail}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}