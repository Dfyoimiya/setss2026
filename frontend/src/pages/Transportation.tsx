import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import {
  ArrowLeft,
  Plane,
  TrainFront,
  Bus,
  Car,
  Clock,
  Wallet,
  MapPin,
  Navigation,
  Footprints,
  ArrowRight,
  Star,
  CircleDot,
  MapPinned,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TransportOption {
  method: string;
  route: string;
  price: string;
  time: string;
  icon: typeof Bus;
  color: string;
  bgColor: string;
  recommended?: boolean;
}

interface TransportSection {
  key: string;
  title: string;
  subTitle: string;
  icon: typeof Plane | typeof TrainFront;
  options: TransportOption[];
}

export default function Transportation() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
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

  const sections: TransportSection[] = [
    {
      key: 'airport',
      title: t('fromAirport') || (isZh ? '从江北机场出发' : 'From Jiangbei Airport'),
      subTitle: isZh ? '重庆江北国际机场 (CKG)' : 'Chongqing Jiangbei Int\'l Airport (CKG)',
      icon: Plane,
      options: [
        {
          method: t('metro') || (isZh ? '轨道交通' : 'Metro'),
          route: t('airportMetroRoute') || (isZh
            ? '江北机场 T2/T3 → 轨道 10号线 → 红土地换乘 6号线 → 西南大学站'
            : 'Airport T2/T3 → Line 10 → Hongtudi (transfer to Line 6) → Southwest University'),
          price: '≈ 7 RMB',
          time: '≈ 100 min',
          icon: Bus,
          color: '#1a365d',
          bgColor: '#1a365d10',
          recommended: true,
        },
        {
          method: t('taxi') || (isZh ? '出租车 / 网约车' : 'Taxi / Ride-hailing'),
          route: t('airportTaxiRoute') || (isZh
            ? '机场快速路 → 内环高速 → 兰海高速 → 西南大学北碚校区'
            : 'Airport Expwy → Inner Ring → Lanhai Expwy → SWU Beibei Campus'),
          price: '≈ 60 RMB',
          time: '≈ 40 min',
          icon: Car,
          color: '#2d5a4a',
          bgColor: '#2d5a4a10',
        },
      ],
    },
    {
      key: 'chongqingbei',
      title: t('fromChongqingbei') || (isZh ? '从重庆北站出发' : 'From Chongqing North Station'),
      subTitle: isZh ? '重庆北站北广场 / 南广场' : 'Chongqing North Railway Station',
      icon: TrainFront,
      options: [
        {
          method: t('metro') || (isZh ? '轨道交通' : 'Metro'),
          route: t('chongqingbeiMetroRoute') || (isZh
            ? '重庆北站 → 轨道 4号线 → 五里店换乘 6号线 → 西南大学站'
            : 'North Station → Line 4 → Wulidian (transfer to Line 6) → SWU'),
          price: '≈ 6 RMB',
          time: '≈ 55 min',
          icon: Bus,
          color: '#1a365d',
          bgColor: '#1a365d10',
          recommended: true,
        },
        {
          method: t('taxi') || (isZh ? '出租车 / 网约车' : 'Taxi / Ride-hailing'),
          route: t('chongqingbeiTaxiRoute') || (isZh
            ? '昆仑大道 → 内环快速 → 兰海高速 → 西南大学北碚校区'
            : 'Kunlun Ave → Inner Ring → Lanhai Expwy → SWU Beibei Campus'),
          price: '≈ 55 RMB',
          time: '≈ 35 min',
          icon: Car,
          color: '#2d5a4a',
          bgColor: '#2d5a4a10',
        },
      ],
    },
    {
      key: 'chongqingxi',
      title: t('fromChongqingxi') || (isZh ? '从重庆西站出发' : 'From Chongqing West Station'),
      subTitle: isZh ? '重庆西站' : 'Chongqing West Railway Station',
      icon: TrainFront,
      options: [
        {
          method: t('metro') || (isZh ? '轨道交通' : 'Metro'),
          route: t('chongqingxiMetroRoute') || (isZh
            ? '重庆西站 → 轨道 环线 → 冉家坝换乘 6号线 → 西南大学站'
            : 'West Station → Loop Line → Ranjiaba (transfer to Line 6) → SWU'),
          price: '≈ 6 RMB',
          time: '≈ 70 min',
          icon: Bus,
          color: '#1a365d',
          bgColor: '#1a365d10',
          recommended: true,
        },
        {
          method: t('taxi') || (isZh ? '出租车 / 网约车' : 'Taxi / Ride-hailing'),
          route: t('chongqingxiTaxiRoute') || (isZh
            ? '凤中路 → 内环快速 → 兰海高速 → 西南大学北碚校区'
            : 'Fengzhong Rd → Inner Ring → Lanhai Expwy → SWU Beibei Campus'),
          price: '≈ 70 RMB',
          time: '≈ 45 min',
          icon: Car,
          color: '#2d5a4a',
          bgColor: '#2d5a4a10',
        },
      ],
    },
    {
      key: 'chongqingdong',
      title: t('fromChongqingdong') || (isZh ? '从重庆东站出发' : 'From Chongqing East Station'),
      subTitle: isZh ? '重庆东站' : 'Chongqing East Railway Station',
      icon: TrainFront,
      options: [
        {
          method: t('metro') || (isZh ? '轨道交通' : 'Metro'),
          route: t('chongqingdongMetroRoute') || (isZh
            ? '重庆东站 → 轨道 6号线（直达）→ 西南大学站'
            : 'East Station → Line 6 (direct) → Southwest University'),
          price: '≈ 7 RMB',
          time: '≈ 80 min',
          icon: Bus,
          color: '#1a365d',
          bgColor: '#1a365d10',
          recommended: true,
        },
        {
          method: t('taxi') || (isZh ? '出租车 / 网约车' : 'Taxi / Ride-hailing'),
          route: t('chongqingdongTaxiRoute') || (isZh
            ? '开迎路 → 内环快速 → 兰海高速 → 西南大学北碚校区'
            : 'Kaiying Rd → Inner Ring → Lanhai Expwy → SWU Beibei Campus'),
          price: '≈ 85 RMB',
          time: '≈ 50 min',
          icon: Car,
          color: '#2d5a4a',
          bgColor: '#2d5a4a10',
        },
      ],
    },
  ];

  // 将路线字符串拆分为步骤
  const parseRoute = (route: string) => {
    return route.split(/→|→/).map(s => s.trim()).filter(Boolean);
  };

  const activeData = sections[activeSection];

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
            {t('backToHome') || (isZh ? '返回首页' : 'Back to Home')}
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
            <Navigation className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[12px] font-semibold text-white/90 tracking-[0.15em] uppercase">
              {isZh ? '交通指南' : 'Transportation'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.15] mb-6">
            {t('transportationTitle') || (isZh ? '如何到达' : 'Getting There')}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
            <div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" />
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
          </div>

          <p className="max-w-[650px] mx-auto text-[15px] text-white/70 leading-[1.8] font-light">
            {t('transportationSubtitle') || (isZh
              ? '西南大学位于重庆市北碚区。以下是从各主要交通枢纽前往会场的路线指南。'
              : 'Southwest University is located in Beibei District, Chongqing. Below are directions from major transport hubs.')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 52C672 56 768 64 864 66.7C960 69 1056 67 1152 61.3C1248 56 1344 48 1392 44L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#faf9f6" />
          </svg>
        </div>
      </div>

      {/* 快速导航选择器 */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              const isActive = idx === activeSection;
              return (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1a365d] text-white shadow-md shadow-[#1a365d]/15'
                      : 'bg-[#faf9f6] text-[#5c5a56] border border-[#e8e4df] hover:border-[#1a365d]/20 hover:text-[#1a365d]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title.split(isZh ? '从' : 'From')[isZh ? 0 : 1]?.trim() || section.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主体内容 — 当前选中的站点详情 */}
      <main id="transportation" className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* 站点标题 */}
        <div className="flex items-start gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ backgroundColor: '#1a365d' }}
          >
            <activeData.icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a2a3a] leading-tight">
              {activeData.title}
            </h2>
            <p className="text-[13px] text-[#8a8680] mt-1.5">
              {activeData.subTitle}
              <span className="mx-2 text-[#e8e4df]">|</span>
              {isZh ? '目的地：西南大学北碚校区' : 'Destination: SWU Beibei Campus'}
            </p>
          </div>
        </div>

        {/* 两种方式对比卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {activeData.options.map((opt) => {
            const OptIcon = opt.icon;
            const steps = parseRoute(opt.route);
            return (
              <div
                key={opt.method}
                className="relative bg-white border border-[#e8e4df] rounded-2xl overflow-hidden hover:shadow-[0_8px_40px_rgba(26,54,93,0.08)] transition-all duration-500"
              >
                {/* 推荐标签 */}
                {opt.recommended && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-[#b8860b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {isZh ? '推荐' : 'Recommended'}
                    </div>
                  </div>
                )}

                {/* 顶部装饰线 */}
                <div className="h-[2px]" style={{ backgroundColor: opt.color }} />

                <div className="p-6 sm:p-7">
                  {/* 交通方式标题 */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: opt.bgColor }}
                    >
                      <OptIcon className="w-5 h-5" style={{ color: opt.color }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1a2a3a]">{opt.method}</h3>
                      {opt.recommended && (
                        <p className="text-[11px] text-[#b8860b] font-medium">{isZh ? '经济实惠 · 便捷可靠' : 'Economical & Reliable'}</p>
                      )}
                    </div>
                  </div>

                  {/* 路线步骤 */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.2em] mb-3">
                      {isZh ? '路线' : 'Route'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                      {steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#faf9f6] border border-[#e8e4df] rounded-lg text-[12px] text-[#4a4844] font-medium">
                            {sIdx === 0 && <CircleDot className="w-3 h-3 text-[#b8860b]" />}
                            {sIdx === steps.length - 1 && <MapPinned className="w-3 h-3 text-[#2d5a4a]" />}
                            {sIdx > 0 && sIdx < steps.length - 1 && <Footprints className="w-3 h-3 text-[#8a8680]" />}
                            {step}
                          </span>
                          {sIdx < steps.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-[#d4d0ca] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 价格与时间 — 大字突出 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-4 border"
                      style={{ backgroundColor: opt.bgColor, borderColor: opt.color + '20' }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Wallet className="w-3.5 h-3.5" style={{ color: opt.color }} />
                        <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em]">
                          {isZh ? '费用' : 'Price'}
                        </span>
                      </div>
                      <span className="text-[22px] font-bold font-mono" style={{ color: opt.color }}>
                        {opt.price.replace('≈ ', '')}
                      </span>
                    </div>
                    <div
                      className="rounded-xl p-4 border"
                      style={{ backgroundColor: opt.bgColor, borderColor: opt.color + '20' }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5" style={{ color: opt.color }} />
                        <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em]">
                          {isZh ? '用时' : 'Time'}
                        </span>
                      </div>
                      <span className="text-[22px] font-bold font-mono" style={{ color: opt.color }}>
                        {opt.time.replace('≈ ', '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 所有站点快速对比表 */}
        <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden mb-10">
          <div className="p-5 sm:p-6 border-b border-[#f0ede8] bg-[#faf9f6]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#1a365d]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2a3a]">
                  {isZh ? '各站点对比一览' : 'All Stations at a Glance'}
                </h3>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a365d] text-white">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                    {isZh ? '出发站点' : 'From'}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                    {isZh ? '地铁' : 'Metro'}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-right">
                    {isZh ? '地铁用时' : 'Metro Time'}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-right">
                    {isZh ? '出租车' : 'Taxi'}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-right">
                    {isZh ? '出租用时' : 'Taxi Time'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede8]">
                {sections.map((sec) => (
                  <tr
                    key={sec.key}
                    className={`hover:bg-[#faf9f6] transition-colors cursor-pointer ${
                      sec.key === activeData.key ? 'bg-[#faf9f6]' : ''
                    }`}
                    onClick={() => setActiveSection(sections.findIndex(s => s.key === sec.key))}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <sec.icon className="w-4 h-4 text-[#1a365d]" />
                        <span className="text-[13px] font-semibold text-[#1a2a3a]">
                          {sec.title.split(isZh ? '从' : 'From')[isZh ? 0 : 1]?.trim() || sec.title}
                        </span>
                        {sec.key === activeData.key && (
                          <span className="px-1.5 py-0.5 bg-[#b8860b]/10 text-[#7a5c20] text-[10px] font-bold rounded">
                            {isZh ? '当前' : 'Now'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-bold text-[#1a365d]">{sec.options[0].price}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[13px] text-[#5a5854]">{sec.options[0].time}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[13px] font-bold text-[#2d5a4a]">{sec.options[1].price}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[13px] text-[#5a5854]">{sec.options[1].time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 会议地点醒目提示 */}
        <div className="relative bg-[#1a365d] rounded-2xl p-7 sm:p-9 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b8860b]/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
              <MapPinned className="w-7 h-7 text-[#b8860b]" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1.5">
                {isZh ? '会议地点' : 'Venue'}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {isZh
                  ? '西南大学北碚校区 · 第25教学楼 0114报告厅'
                  : 'Southwest University (Beibei Campus) · Lecture Hall 0114, Building 25'}
              </h3>
              <p className="text-[13px] text-white/60">
                {isZh
                  ? '重庆市北碚区天生路2号'
                  : '2 Tiansheng Road, Beibei District, Chongqing, China'}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=西南大学"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#1a365d] text-[13px] font-bold rounded-xl hover:bg-[#faf9f6] transition-colors shadow-lg flex-shrink-0"
            >
              <Navigation className="w-4 h-4" />
              {isZh ? '导航前往' : 'Navigate'}
            </a>
          </div>
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