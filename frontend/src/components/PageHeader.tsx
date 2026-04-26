import { useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface PageHeaderProps {
  badge?: { icon: React.ReactNode; text: string }
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHeader({ badge, title, subtitle, children }: PageHeaderProps) {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const isZh = lang === 'zh'

  return (
    <div className="relative bg-[#1a365d] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="phGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#phGrid)" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b8860b]/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#b8860b]" />

      <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            {badge.icon}
            <span className="text-[12px] font-semibold text-white/90 tracking-[0.15em] uppercase">
              {badge.text}
            </span>
          </div>
        )}

        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white tracking-tight leading-tight mb-5">
          {title}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-[1px] bg-[#b8860b]/60" />
          <div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" />
          <div className="w-16 h-[1px] bg-[#b8860b]/60" />
        </div>

        {subtitle && (
          <p className="max-w-[600px] mx-auto text-[14px] text-white/70 leading-[1.8]">
            {subtitle}
          </p>
        )}

        {children}
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 52C672 56 768 64 864 66.7C960 69 1056 67 1152 61.3C1248 56 1344 48 1392 44L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#faf9f6" />
        </svg>
      </div>
    </div>
  )
}

export function PageTopBar() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-[#e8e4df] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
  )
}

export function PageFooter() {
  return (
    <footer className="bg-[#1a365d] py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="pfGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pfGrid)" />
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
  )
}
