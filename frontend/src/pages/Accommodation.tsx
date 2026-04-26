import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Hotel,
  MapPin,
  Phone,
  Star,
  Info,
  CalendarCheck,
  GraduationCap,
  Navigation,
  CheckCircle2,
  Wifi,
  Coffee,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface HotelInfo {
  name: string;
  nameZh: string;
  address: string;
  addressZh: string;
  tel: string;
  distance: string;
  walkTime: string;
  features: string[];
  featuresZh: string[];
  accent: string;
  recommended?: boolean;
}

export default function Accommodation() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeHotel, setActiveHotel] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const scrollToId = searchParams.get('scrollTo');
    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-[#b8860b]', 'ring-offset-4');
          }, 2500);
        }
      }, 400);
    }
  }, [searchParams]);

  const isZh = lang === 'zh';


  const hotels: HotelInfo[] = [
    {
      name: t('ningdengHotel') || 'Ningdeng Hotel',
      nameZh: '宁登酒店',
      address: t('ningdengAddress') || 'No. 2-1 Tiansheng Road, Beibei District, Chongqing',
      addressZh: '重庆市北碚区天生路2号附1号',
      tel: '023-60310999, 023-60301999',
      distance: '≈ 500m',
      walkTime: '≈ 7 min',
      features: ['Adjacent to Campus', 'Business Facilities', 'Free Breakfast'],
      featuresZh: ['紧邻校园', '商务设施', '免费早餐'],
      accent: '#1a365d',
      recommended: true,
    },
    {
      name: t('bolianhuiHotel') || 'Bolianhui Hotel',
      nameZh: '铂莲荟酒店',
      address: t('bolianhuiAddress') || 'No. 2-2 Tiansheng Road, Beibei District, Chongqing',
      addressZh: '重庆市北碚区天生路2号附2号',
      tel: '023-86030333',
      distance: '≈ 600m',
      walkTime: '≈ 8 min',
      features: ['Walkable', 'Near Metro', '24h Reception'],
      featuresZh: ['步行可达', '近地铁站', '24h前台'],
      accent: '#2d5a4a',
    },
    {
      name: t('bluesHotel') || 'Blues Hotel',
      nameZh: '布鲁斯酒店',
      address: t('bluesAddress') || 'No. 2-3 Tiansheng Road, Beibei District, Chongqing',
      addressZh: '重庆市北碚区天生路2号附3号',
      tel: '023-68369909',
      distance: '≈ 700m',
      walkTime: '≈ 10 min',
      features: ['Quiet & Comfortable', 'Near Bus Stop', 'Good Value'],
      featuresZh: ['安静舒适', '近公交站', '性价比高'],
      accent: '#7a5c20',
    },
    {
      name: t('boreeHotel') || 'Boree Hotel',
      nameZh: '柏瑞酒店',
      address: t('boreeAddress') || 'No. 2-4 Tiansheng Road, Beibei District, Chongqing',
      addressZh: '重庆市北碚区天生路2号附4号',
      tel: '19936673214',
      distance: '≈ 800m',
      walkTime: '≈ 12 min',
      features: ['Boutique Rooms', 'Near Shopping', 'Laundry Service'],
      featuresZh: ['精品客房', '近商圈', '洗衣服务'],
      accent: '#5c4033',
    },
  ];

  const activeData = hotels[activeHotel];

  // 根据当前语言返回对应文本
  const txt = (en: string, zh: string) => (isZh ? zh : en);

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
            {t('backToHome') || 'Back to Home'}
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
            <Hotel className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[12px] font-semibold text-white/90 tracking-[0.15em] uppercase">
              {txt('Accommodation', '住宿推荐')}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white tracking-tight leading-[1.15] mb-6">
            {t('accommodationTitle') || 'Accommodation'}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
            <div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" />
            <div className="w-16 h-[1px] bg-[#b8860b]/60" />
          </div>

          <p className="max-w-[650px] mx-auto text-[15px] text-white/70 leading-[1.8] font-light">
            {t('accommodationSubtitle') ||
              'The following hotels are all located near Southwest University within walking distance to the venue. Early booking is recommended.'}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 52C672 56 768 64 864 66.7C960 69 1056 67 1152 61.3C1248 56 1344 48 1392 44L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#faf9f6" />
          </svg>
        </div>
      </div>

      {/* 酒店选择器 */}
      <div className="bg-white border-b border-[#e8e4df]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {hotels.map((hotel, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHotel(idx)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 whitespace-nowrap ${
                  idx === activeHotel
                    ? 'bg-[#1a365d] text-white shadow-md shadow-[#1a365d]/15'
                    : 'bg-[#faf9f6] text-[#5c5a56] border border-[#e8e4df] hover:border-[#1a365d]/20 hover:text-[#1a365d]'
                }`}
              >
                <Hotel className="w-4 h-4" />
                {isZh ? hotel.nameZh : hotel.name}
                {hotel.recommended && (
                  <span className={`ml-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                    idx === activeHotel ? 'bg-[#b8860b] text-white' : 'bg-[#b8860b]/10 text-[#7a5c20]'
                  }`}>
                    {txt('Top', '推荐')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <main id="accommodation" className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* 当前选中的酒店详情 */}
        <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(26,54,93,0.04)] mb-10">
          <div className="h-[2px]" style={{ backgroundColor: activeData.accent }} />

          <div className="p-6 sm:p-8">
            {/* 酒店名称行 */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-serif text-2xl sm:text-[28px] font-bold text-[#1a2a3a] leading-tight">
                    {isZh ? activeData.nameZh : activeData.name}
                  </h2>
                  {activeData.recommended && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#b8860b]/10 border border-[#b8860b]/20 rounded-full text-[11px] font-bold text-[#7a5c20]">
                      <Star className="w-3 h-3" />
                      {txt('Conference Recommended', '会议推荐酒店')}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#8a8680]">
                  {isZh ? activeData.name : activeData.nameZh}
                </p>
              </div>
              <a
                href={`tel:${activeData.tel.replace(/[^0-9,]/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#faf9f6] border border-[#e8e4df] rounded-xl text-[13px] text-[#1a365d] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] transition-all duration-300 font-medium flex-shrink-0"
              >
                <Phone className="w-4 h-4" />
                {txt('Book Now', '立即预订')}
              </a>
            </div>

            {/* 三列信息卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#faf9f6] border border-[#e8e4df] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a365d]/[0.06] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#1a365d]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em]">
                    {txt('Address', '地址')}
                  </span>
                </div>
                <p className="text-[13px] text-[#1a2a3a] leading-[1.7] font-medium">
                  {isZh ? activeData.addressZh : activeData.address}
                </p>
              </div>

              <div className="bg-[#faf9f6] border border-[#e8e4df] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a365d]/[0.06] flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#1a365d]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em]">
                    {txt('Telephone', '预订电话')}
                  </span>
                </div>
                <p className="text-[14px] text-[#1a2a3a] font-mono font-bold tracking-wide">
                  {activeData.tel}
                </p>
              </div>

              <div className="bg-[#faf9f6] border border-[#e8e4df] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a365d]/[0.06] flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-[#1a365d]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.15em]">
                    {txt('To Venue', '距会场')}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold text-[#1a365d] font-mono">{activeData.distance}</span>
                  <span className="text-[11px] text-[#8a8680]">
                    ({activeData.walkTime} {txt('walk', '步行')})
                  </span>
                </div>
              </div>
            </div>

            {/* 特色设施 */}
            <div>
              <p className="text-[10px] font-bold text-[#8a8680] uppercase tracking-[0.2em] mb-3">
                {txt('Highlights', '酒店特色')}
              </p>
              <div className="flex flex-wrap gap-2">
                {(isZh ? activeData.featuresZh : activeData.features).map((feature, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf9f6] border border-[#e8e4df] rounded-lg text-[12px] text-[#4a4844] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#b8860b]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 酒店横向对比表 */}
        <div className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden mb-10">
          <div className="p-5 sm:p-6 border-b border-[#f0ede8] bg-[#faf9f6]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center">
                <Hotel className="w-5 h-5 text-[#1a365d]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1a2a3a]">
                  {txt('Hotel Comparison', '酒店对比一览')}
                </h3>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a365d] text-white">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                    {txt('Hotel', '酒店')}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                    {txt('Distance', '距离会场')}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                    {txt('Walk', '步行时间')}
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-right">
                    {txt('Phone', '预订电话')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede8]">
                {hotels.map((hotel, hIdx) => (
                  <tr
                    key={hIdx}
                    className={`hover:bg-[#faf9f6] transition-colors cursor-pointer ${
                      hIdx === activeHotel ? 'bg-[#faf9f6]' : ''
                    }`}
                    onClick={() => setActiveHotel(hIdx)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: hotel.accent }}
                        />
                        <span className="text-[13px] font-semibold text-[#1a2a3a]">
                          {isZh ? hotel.nameZh : hotel.name}
                        </span>
                        {hotel.recommended && (
                          <span className="px-1.5 py-0.5 bg-[#b8860b]/10 text-[#7a5c20] text-[10px] font-bold rounded">
                            {txt('Top', '推荐')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#5a5854]">{hotel.distance}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] text-[#5a5854]">{hotel.walkTime}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[12px] text-[#1a365d] font-mono font-medium">{hotel.tel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 提示卡片 */}
        <div className="bg-[#b8860b]/[0.06] border border-[#b8860b]/15 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-[#b8860b]" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#7a5c20] mb-2">
              {t('hotelNote') || 'Booking Tips'}
            </p>
            <p className="text-[13px] text-[#8a7a5a] leading-[1.8]">
              {t('hotelNoteText') ||
                'Early booking is recommended as the conference period coincides with peak season. Mention "SETSS 2026" for potential conference rates. Contact the organizing committee for assistance.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8e4df] rounded-lg text-[11px] text-[#5a5854]">
                <CalendarCheck className="w-3 h-3 text-[#b8860b]" />
                {txt('Book Early', '建议提前预订')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8e4df] rounded-lg text-[11px] text-[#5a5854]">
                <Wifi className="w-3 h-3 text-[#b8860b]" />
                {txt('Free WiFi', '免费WiFi')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e8e4df] rounded-lg text-[11px] text-[#5a5854]">
                <Coffee className="w-3 h-3 text-[#b8860b]" />
                {txt('Breakfast', '含早餐')}
              </span>
            </div>
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