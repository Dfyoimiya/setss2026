import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NavChild {
  key: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  key: string;
  href: string;
  children?: NavChild[];
}

export default function Navigation() {
  const { t } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems: NavItem[] = [
    { key: 'home', href: '#hero' },
    {
      key: 'about',
      href: '#about',
      children: [
        { key: 'aboutSetss', href: '#about' },
        { key: 'joinCff', href: 'https://www.ccf.org.cn/en/', external: true },
        { key: 'organizingCommittee', href: '/committee' },
      ],
    },
    {
      key: 'authors',
      href: '#authors',
      children: [
        { key: 'importantDates', href: '#countdown' },
        { key: 'setss2026Submission', href: '#registration' },
        { key: 'paperSubmissionInstructions', href: '#registration' },
      ],
    },
    { key: 'speakers', href: '#speakers' },
    {
      key: 'program',
      href: '#schedule',
      children: [
        { key: 'programSchedule', href: '#schedule' },
        { key: 'previousEditions', href: '#about' },
      ],
    },
    {
      key: 'attend',
      href: '#registration',
      children: [
        { key: 'registration', href: '#registration' },
        { key: 'gettingThere', href: '#registration' },
        { key: 'accommodation', href: '#registration' },
      ],
    },
  ];

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveDropdown(null);
  };

  const renderChild = (child: NavChild) => {
    const className =
      'progress-bar-hover block w-full text-left px-5 py-2.5 text-[12px] text-slate-600 hover:text-[#005C99] hover:bg-slate-50 transition-colors';

    if (child.external || child.href.startsWith('http')) {
      return (
        <a
          key={child.key}
          href={child.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={() => setActiveDropdown(null)}
        >
          {t(child.key)}
        </a>
      );
    }

    if (child.href.startsWith('/')) {
      return (
        <Link
          key={child.key}
          to={child.href}
          className={className}
          onClick={() => setActiveDropdown(null)}
        >
          {t(child.key)}
        </Link>
      );
    }

    return (
      <button
        key={child.key}
        onClick={() => scrollToSection(child.href)}
        className={className}
      >
        {t(child.key)}
      </button>
    );
  };

  return (
    <nav className="bg-[#005C99] relative z-[55]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-11">
          <ul className="flex items-center gap-0">
            {navItems.map((item) => (
              <li
                key={item.key}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="nav-link-text relative flex items-center gap-1 px-4 py-3 text-[12px] font-bold tracking-wider text-white uppercase"
                >
                  {t(item.key)}
                  {item.children && <ChevronDown className="w-3 h-3 opacity-70" />}
                </button>

                {item.children && activeDropdown === item.key && (
                  <div
                    className="absolute top-full left-0 bg-white border border-slate-200 shadow-lg min-w-[240px] overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(item.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.children.map((child) => renderChild(child))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}