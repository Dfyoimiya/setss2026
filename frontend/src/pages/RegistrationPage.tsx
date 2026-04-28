import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  QrCode,
  Globe,
  FileText,
  Banknote,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Landmark,
  Hash,
  Receipt,
  Mail,
  AlertCircle,
  Clock,
  Users,
  ImageOff,
  GraduationCap,
  BookOpen,
  Award,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function RegistrationPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [qrError, setQrError] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* 顶部导航栏 */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-[#e8e4df] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
      <div className="bg-[#1a365d] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-6">
            <Award className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]">
              {t('registrationBadge') || '8th Spring School'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('registrationHeroTitle') || t('registrationTitle') || (
              <>{isZh ? '可信软件系统工程春季学校' : 'Spring School on Engineering Trustworthy Software Systems'}</>
            )}
          </h1>

          <p className="max-w-[650px] mx-auto text-[14px] text-white/60 leading-relaxed">
            {t('registrationHeroDesc') || (isZh
              ? '欢迎参加第八届可信软件系统工程春季学校，请仔细阅读以下注册信息，完成报名流程。'
              : 'Welcome to the 8th Spring School on Engineering Trustworthy Software Systems. Please review the registration details carefully and complete the enrollment process.')}
          </p>

          <div className="mt-8 inline-flex items-center gap-6 bg-white/10 rounded-2xl px-8 py-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#b8860b]" />
              <span className="text-[14px] text-white/90 font-medium">May 11 – 17, 2026</span>
            </div>
            <div className="w-[1px] h-5 bg-white/20" />
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#b8860b]" />
              <span className="text-[14px] text-white/90 font-medium">
                {t('registrationHeroLocation') || (isZh ? '西南大学 · 重庆' : 'Southwest University · Chongqing')}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf9f6]" />
      </div>

      <main id="registration-page" className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-10">
        {/* 会议通知 */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-8 sm:p-10 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-shadow duration-500">
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#f0ede8]">
            <div className="w-12 h-12 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#1a365d]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a2a3a] leading-tight">{t('registrationNoticeTitle')}</h2>
              <p className="text-[13px] text-[#8a8680] mt-1.5 font-medium tracking-wide">SETSS 2026 Registration Notice</p>
            </div>
          </div>
          <div className="text-[15px] text-[#4a4844] leading-[1.9] space-y-5">
            <p>{t('registrationNoticeP1')}</p>
            <p>{t('registrationNoticeP2')}</p>
          </div>
        </section>

        {/* 时间地点 */}
        <section className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white border border-[#e8e4df] rounded-2xl p-7 flex items-start gap-5 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-all duration-500 group">
            <div className="w-14 h-14 rounded-2xl bg-[#1a365d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#1a365d]/15 group-hover:shadow-xl group-hover:shadow-[#1a365d]/20 transition-all duration-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="pt-1">
              <h3 className="text-[11px] font-bold text-[#8a8680] uppercase tracking-[0.15em] mb-2">
                {t('registrationTime')}
              </h3>
              <p className="text-[20px] font-bold text-[#1a2a3a] font-serif">May 11–17, 2026</p>
              <p className="text-[13px] text-[#8a8680] mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {t('registrationDuration') || (isZh ? '为期7天' : '7 days duration')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e8e4df] rounded-2xl p-7 flex items-start gap-5 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-all duration-500 group">
            <div className="w-14 h-14 rounded-2xl bg-[#2d5a4a] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2d5a4a]/15 group-hover:shadow-xl group-hover:shadow-[#2d5a4a]/20 transition-all duration-500">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="pt-1">
              <h3 className="text-[11px] font-bold text-[#8a8680] uppercase tracking-[0.15em] mb-2">
                {t('registrationVenue')}
              </h3>
              <p className="text-[15px] font-semibold text-[#1a2a3a] leading-snug">
                {t('registrationVenueLine1')}
              </p>
              <p className="text-[13px] text-[#8a8680] mt-1.5">
                {t('registrationVenueLine2')}
              </p>
            </div>
          </div>
        </section>

        {/* 注册方式 */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-8 sm:p-10 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-shadow duration-500">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-[#1a365d]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a2a3a] leading-tight">{t('registrationMethod')}</h2>
              <p className="text-[13px] text-[#8a8680] mt-1.5">Two convenient options available</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-[#faf9f6] rounded-xl border border-[#e8e4df] hover:border-[#1a365d]/20 transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#1a365d] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[13px] font-bold">1</span>
              </div>
              <span className="text-[14px] text-[#4a4844] font-medium">{t('registrationMethodOnsite')}</span>
            </div>
            <div className="flex items-center gap-4 p-5 bg-[#faf9f6] rounded-xl border border-[#e8e4df] hover:border-[#1a365d]/20 transition-colors duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#1a365d] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[13px] font-bold">2</span>
              </div>
              <span className="text-[14px] text-[#4a4844] font-medium">{t('registrationMethodOnline')}</span>
            </div>
          </div>
        </section>

        {/* 注册费用表格 */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-shadow duration-500">
          <div className="p-8 sm:p-10 border-b border-[#f0ede8] bg-[#faf9f6]/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5 text-[#1a365d]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1a2a3a] leading-tight">{t('registrationTitle')}</h2>
                <p className="text-[13px] text-[#8a8680] mt-1.5">{t('registrationFeeIncludes')}</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a365d] text-white">
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-[0.15em]">
                    {t('registrationFeeCategory')}
                  </th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-[0.15em] text-right">
                    {t('registrationFeeFee')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede8]">
                <tr className="bg-white hover:bg-[#faf9f6] transition-colors duration-300">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center">
                        <Users className="w-4.5 h-4.5 text-[#1a365d]" />
                      </div>
                      <div>
                        <span className="text-[15px] text-[#1a2a3a] font-semibold block">
                          {t('registrationFeeLectures')}
                        </span>
                        <span className="text-[12px] text-[#8a8680] mt-0.5">{t('registrationFeeDescFull') || (isZh ? '全程参与所有课程与活动' : 'Full access to all lectures & activities')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <span className="text-[24px] font-bold text-[#1a365d] font-serif">1600</span>
                    <span className="text-[13px] text-[#8a8680] ml-1.5">RMB / person</span>
                  </td>
                </tr>
                <tr className="bg-white hover:bg-[#faf9f6] transition-colors duration-300">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2d5a4a]/10 flex items-center justify-center">
                        <Users className="w-4.5 h-4.5 text-[#2d5a4a]" />
                      </div>
                      <div>
                        <span className="text-[15px] text-[#1a2a3a] font-semibold block">
                          {t('registrationFeeWorkshop')}
                        </span>
                        <span className="text-[12px] text-[#8a8680] mt-0.5">{t('registrationFeeDescWorkshop') || (isZh ? '专题工作坊参与' : 'Workshop participation only')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <span className="text-[24px] font-bold text-[#2d5a4a] font-serif">500</span>
                    <span className="text-[13px] text-[#8a8680] ml-1.5">RMB / person</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 银行转账信息 */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-8 sm:p-10 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-shadow duration-500">
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#f0ede8]">
            <div className="w-12 h-12 rounded-xl bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0">
              <Landmark className="w-5 h-5 text-[#1a365d]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a2a3a] leading-tight">{t('bankTransferTitle')}</h2>
              <p className="text-[13px] text-[#8a8680] mt-1.5">{t('bankTransferHint') || (isZh ? '请通过银行转账完成费用支付' : 'Please complete payment via bank transfer')}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-[#faf9f6] rounded-xl p-6 border border-[#e8e4df] hover:border-[#1a365d]/15 transition-colors duration-300 group">
              <div className="flex items-center gap-2.5 mb-3">
                <Building2 className="w-4 h-4 text-[#8a8680]" />
                <p className="text-[11px] text-[#8a8680] uppercase tracking-[0.15em] font-bold">{t('bankAccountName')}</p>
              </div>
              <p className="text-[15px] font-bold text-[#1a2a3a] leading-snug">{t('bankAccountNameValue')}</p>
            </div>
            <div className="bg-[#faf9f6] rounded-xl p-6 border border-[#e8e4df] hover:border-[#1a365d]/15 transition-colors duration-300 group">
              <div className="flex items-center gap-2.5 mb-3">
                <Landmark className="w-4 h-4 text-[#8a8680]" />
                <p className="text-[11px] text-[#8a8680] uppercase tracking-[0.15em] font-bold">{t('bankName')}</p>
              </div>
              <p className="text-[14px] font-semibold text-[#1a2a3a] leading-snug">{t('bankNameValue')}</p>
            </div>
            <div className="bg-[#faf9f6] rounded-xl p-6 border border-[#e8e4df] hover:border-[#1a365d]/15 transition-colors duration-300 group">
              <div className="flex items-center gap-2.5 mb-3">
                <Hash className="w-4 h-4 text-[#8a8680]" />
                <p className="text-[11px] text-[#8a8680] uppercase tracking-[0.15em] font-bold">{t('bankAccountNumber')}</p>
              </div>
              <p className="text-[16px] font-bold text-[#1a2a3a] font-mono tracking-[0.05em]">3100028109024968877</p>
            </div>
            <div className="bg-[#faf9f6] rounded-xl p-6 border border-[#e8e4df] hover:border-[#1a365d]/15 transition-colors duration-300 group">
              <div className="flex items-center gap-2.5 mb-3">
                <Receipt className="w-4 h-4 text-[#8a8680]" />
                <p className="text-[11px] text-[#8a8680] uppercase tracking-[0.15em] font-bold">{t('bankCode')}</p>
              </div>
              <p className="text-[16px] font-bold text-[#1a2a3a] font-mono tracking-[0.05em]">102653000474</p>
            </div>
          </div>

          <div className="mt-6 bg-[#b8860b]/[0.06] border border-[#b8860b]/15 rounded-xl p-6 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-[#b8860b]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#7a5c20] mb-1.5">{t('bankRemittanceNote')}</p>
              <p className="text-[13px] text-[#8a7a5a] leading-relaxed">{t('bankRemittanceNoteText')}</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-4 p-5 bg-[#faf9f6] rounded-xl border border-[#e8e4df]">
            <div className="w-8 h-8 rounded-lg bg-[#1a365d]/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[#1a365d]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1a2a3a] mb-1.5">{t('bankAfterPayment')}</p>
              <p className="text-[13px] text-[#6a6864] leading-relaxed">{t('bankAfterPaymentText')}</p>
            </div>
          </div>
        </section>

        {/* 二维码 + 在线注册 */}
        <section className="bg-[#1a365d] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden shadow-[0_8px_40px_rgba(26,54,93,0.25)]">
          {/* 装饰元素 */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#b8860b]/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

          {/* 顶部金色装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />

          <div className="relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
              <QrCode className="w-8 h-8 text-[#b8860b]" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">{t('scanToRegister')}</h3>
            <p className="text-[14px] text-white/60 mb-10">{t('scanToRegisterDesc')}</p>

            {/* 二维码区域 */}
            <div className="max-w-[220px] mx-auto mb-10">
              <div className="aspect-square rounded-2xl overflow-hidden border-[3px] border-white/15 bg-white shadow-2xl p-3">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#faf9f6] flex items-center justify-center">
                  {!qrError ? (
                    <img
                      src="/images/2weima.jpg"
                      alt={t('qrCodeAlt')}
                      className="w-full h-full object-contain"
                      onError={() => setQrError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8a8680] p-4">
                      <ImageOff className="w-10 h-10 mb-2" />
                      <p className="text-[12px] text-center">二维码加载失败</p>
                      <p className="text-[11px] text-center mt-1">请检查 /public/image/2weima.jpg 是否存在</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <a
              href="https://docs.qq.com/form/page/DTVZ6TUFUS0d0QU9k#/fill"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#1a365d] text-[14px] font-bold rounded-xl hover:bg-[#faf9f6] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Globe className="w-4 h-4" />
              {t('registrationMethodOnline')}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* 其他信息 */}
        <section className="bg-white border border-[#e8e4df] rounded-2xl p-8 sm:p-10 shadow-[0_2px_20px_rgba(26,54,93,0.04)] hover:shadow-[0_4px_30px_rgba(26,54,93,0.08)] transition-shadow duration-500">
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#f0ede8]">
            <div className="w-12 h-12 rounded-xl bg-[#faf9f6] flex items-center justify-center flex-shrink-0 border border-[#e8e4df]">
              <FileText className="w-5 h-5 text-[#1a365d]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a2a3a] leading-tight">{t('otherInfoTitle')}</h2>
              <p className="text-[13px] text-[#8a8680] mt-1.5">{t('otherInfoTitle')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-[#faf9f6] rounded-xl border border-[#e8e4df]">
              <div className="w-6 h-6 rounded-full bg-[#8a8680]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8a8680]" />
              </div>
              <p className="text-[14px] text-[#5a5854] leading-[1.8]">{t('otherInfoTravel')}</p>
            </div>
            <div className="flex items-start gap-4 p-5 bg-[#1a365d]/[0.03] rounded-xl border border-[#1a365d]/10">
              <div className="w-6 h-6 rounded-full bg-[#1a365d]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-3.5 h-3.5 text-[#1a365d]" />
              </div>
              <p className="text-[14px] text-[#1a2a3a] leading-[1.8] font-medium">
                {t('otherInfoCertificate')}
              </p>
            </div>
          </div>
        </section>

        {/* 官方网站 */}
        <div className="text-center pt-6 pb-12">
          <a
            href="https://www.rise-swu.cn/SETSS2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white border border-[#e8e4df] text-[14px] text-[#1a365d] hover:border-[#1a365d] hover:bg-[#1a365d]/[0.02] rounded-xl transition-all duration-300 font-medium shadow-[0_2px_12px_rgba(26,54,93,0.06)]"
          >
            <Globe className="w-4 h-4" />
            {t('officialWebsiteLabel')}
            <span className="text-[#8a8680] font-normal hidden sm:inline text-[13px]">rise-swu.cn/SETSS2026</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
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