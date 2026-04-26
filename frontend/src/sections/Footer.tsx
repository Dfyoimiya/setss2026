import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t, lang } = useLanguage();

  const quickLinks = [
    { key: 'home', href: '#hero' },
    { key: 'about', href: '#about' },
    { key: 'speakers', href: '#speakers' },
    { key: 'programSchedule', href: '#schedule' },
    { key: 'registration', href: '#registration' },
  ];

  const editions = [
    'SETSS 2025 (Beijing)', 'SETSS 2024 (Chongqing)', 'SETSS 2019 (Chongqing)',
    'SETSS 2018 (Chongqing)', 'SETSS 2017 (Chongqing)',
  ];

  return (
    <footer className="bg-[#1a1a2e] text-white/70">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">{t('footerAboutTitle')}</h4>
            <p className="text-[11px] leading-relaxed text-white/50">{t('footerAboutDesc')}</p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-[11px] text-white/50 hover:text-white transition-colors">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">{t('previousEditions')}</h4>
            <ul className="space-y-2">
              {editions.map((ed) => (
                <li key={ed}><span className="text-[11px] text-white/50">{ed}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">{t('footerContact')}</h4>
            <div className="space-y-2 text-[11px] text-white/50">
              <p>{t('footerAddress1')}</p>
              <p>{t('footerAddress2')}</p>
              <p>{t('footerAddress3')}</p>
              <p>liubocq@swu.edu.cn</p>
              <a href="https://www.rise-swu.cn/SETSS2026" target="_blank" rel="noopener noreferrer"
                className="text-[#005C99] hover:underline block mt-2">
                www.rise-swu.cn/SETSS2026
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/40">&copy; 2026 SETSS. {t('allRightsReserved')}</p>
            <p className="text-[10px] text-white/40">{t('conferenceFullName')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}