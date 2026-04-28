import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  ArrowUpRight,
  Landmark,
  Shield,
  Megaphone,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface CommitteeMember {
  photo: string;
  name: string;
  title: string;
  link: string;
  role: string;
  roleColor: string;
  roleIcon: typeof Landmark;
  roleDesc: string;
}

export default function Committee() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
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

  const members: CommitteeMember[] = [
    {
      photo: '/images/committee/lzm.jpg',
      name: 'Zhiming Liu',
      title: isZh
        ? '西南大学，学校学术委员会主席'
        : 'Chair of the School Academic Committee, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/liuzhiming.html',
      role: isZh ? '学术委员会' : 'Academic Committee',
      roleColor: '#1a365d',
      roleIcon: Landmark,
      roleDesc: isZh ? '主席' : 'Chair',
    },
    {
      photo: '/images/committee/lb.jpg',
      name: 'Bo Liu',
      title: isZh
        ? '西南大学，组织委员会主席'
        : 'Chair of the Organisation Committee, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/liubo.html',
      role: isZh ? '组织委员会' : 'Organisation Committee',
      roleColor: '#2d5a4a',
      roleIcon: Shield,
      roleDesc: isZh ? '主席' : 'Chair',
    },
    {
      photo: '/images/committee/zmy.jpg',
      name: 'Mingyue Zhang',
      title: isZh
        ? '西南大学，宣传委员会主席'
        : 'Chair of Publicity, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/zhangmingyue.html',
      role: isZh ? '宣传委员会' : 'Publicity Committee',
      roleColor: '#7a5c20',
      roleIcon: Megaphone,
      roleDesc: isZh ? '主席' : 'Chair',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#faf9f6] border-b border-[#e8e4df] sticky top-0 z-50">
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

      {/* 页面标题 — 深色背景，与 Courses 一致 */}
      <div className="bg-[#1a365d] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b8860b]" />

        <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-6">
            <Landmark className="w-3.5 h-3.5 text-[#b8860b]" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]">
              {t('committeeBadge') || (isZh ? '组委会' : 'Organizing Committee')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            {t('conferenceChair') || (isZh ? '会议主席' : 'Conference Chair')}
          </h1>

          <p className="max-w-[600px] mx-auto text-[14px] text-white/60 leading-relaxed">
            {t('committeeSubtitle') || (isZh
              ? '本届春季学校由西南大学可信软件与系统研究团队核心成员统筹组织。'
              : 'This edition is organized by the core members of the Reliable Software and Systems Research Group at Southwest University.')}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf9f6]" />
      </div>

      {/* 主体内容 — 横向三列网格 */}
      <main id="committee" className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {members.map((member) => {
            return (
              <a
                key={member.name}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                {/* 圆形头像 */}
                <div className="relative mb-5">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] shadow-sm group-hover:shadow-lg transition-all duration-500"
                    style={{ borderColor: member.roleColor + '30' }}
                  >
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* 角色标签 */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] mb-3"
                  style={{
                    backgroundColor: member.roleColor + '10',
                    color: member.roleColor,
                  }}
                >
                  {member.role}
                  <span className="opacity-60">·</span>
                  {member.roleDesc}
                </div>

                {/* 姓名 */}
                <h2 className="font-serif text-xl sm:text-[22px] font-bold text-[#1a2a3a] leading-tight mb-2 group-hover:text-[#1a365d] transition-colors duration-300">
                  {member.name}
                </h2>

                {/* 职位描述 */}
                <p className="text-[13px] text-[#8a8680] leading-[1.7] mb-4 max-w-[280px]">
                  {member.title}
                </p>

                {/* 外部链接提示 */}
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e8e4df] text-[12px] text-[#8a8680] group-hover:border-[#1a365d] group-hover:text-[#1a365d] transition-all duration-300 bg-white">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isZh ? '个人主页' : 'Profile'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </a>
            );
          })}
        </div>

        {/* 底部联系信息 */}
        <div className="mt-20 pt-10 border-t border-[#e8e4df]">
          <div className="text-center">
            <p className="text-[12px] font-bold text-[#8a8680] uppercase tracking-[0.2em] mb-4">
              {isZh ? '联系方式' : 'Contact'}
            </p>
            <a
              href="https://www.rise-swu.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] text-[#1a365d] hover:underline font-medium"
            >
              <Globe className="w-4 h-4" />
              rise-swu.cn
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-[#faf9f6] border-t border-[#e8e4df] py-10">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-[#b8860b]" />
            <span className="text-[13px] font-semibold text-[#1a2a3a]">SETSS 2026</span>
          </div>
          <p className="text-[11px] text-[#8a8680]">
            © 2026 Spring School on Engineering Trustworthy Software Systems
          </p>
        </div>
      </footer>
    </div>
  );
}