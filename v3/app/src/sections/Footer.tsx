export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white/70">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">
              About SETSS 2026
            </h4>
            <p className="text-[11px] leading-relaxed text-white/50">
              The 8th Spring School on Engineering Trustworthy Software Systems,
              held May 11-17, 2026 at Southwest University, Chongqing, China.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Speakers', 'Program Schedule', 'Registration'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[11px] text-white/50 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Previous Editions */}
          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">
              Previous Editions
            </h4>
            <ul className="space-y-2">
              {['SETSS 2025 (Beijing)', 'SETSS 2024 (Chongqing)', 'SETSS 2019 (Chongqing)', 'SETSS 2018 (Chongqing)', 'SETSS 2017 (Chongqing)'].map((ed) => (
                <li key={ed}>
                  <span className="text-[11px] text-white/50">{ed}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-bold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-[11px] text-white/50">
              <p>RISE, School of CIS</p>
              <p>Southwest University</p>
              <p>Chongqing, China 400715</p>
              <p>liubocq@swu.edu.cn</p>
              <a
                href="https://www.rise-swu.cn/SETSS2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005C99] hover:underline block mt-2"
              >
                www.rise-swu.cn/SETSS2026
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/40">
              &copy; 2026 SETSS. All rights reserved.
            </p>
            <p className="text-[10px] text-white/40">
              8th Spring School on Engineering Trustworthy Software Systems
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
