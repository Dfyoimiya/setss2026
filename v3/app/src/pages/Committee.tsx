import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Committee() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const members = [
    {
      photo: '/images/committee/lzm.jpg',
      name: 'Zhiming Liu',
      title: 'Chair of the School Academic Committee, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/liuzhiming.html',
    },
    {
      photo: '/images/committee/lb.jpg',
      name: 'Bo Liu',
      title: 'Chair of the Organisation Committee, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/liubo.html',
    },
    {
      photo: '/images/committee/zmy.jpg',
      name: 'Mingyue Zhang',
      title: 'Chair of Publicity, Southwest University, China',
      link: 'https://www.rise-swu.cn/en/zhangmingyue.html',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部返回栏 */}
      <div className="bg-[#005C99]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/90 hover:text-white text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome') || (lang === 'zh' ? '返回首页' : 'Back to Home')}
          </button>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 标题 */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {t('conferenceChair') || 'Conference Chair'}
          </h1>
          <div className="w-16 h-[3px] bg-[#005C99] mx-auto mt-5" />
        </div>

        {/* 成员列表 */}
        <div className="space-y-10">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 p-6 sm:p-8 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-slate-200 transition-all"
            >
              {/* 照片 - 可点击跳转 */}
              <div className="flex-shrink-0">
                <a
                  href={member.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                  title={`${member.name} - Personal Page`}
                >
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group-hover:shadow-lg group-hover:border-[#005C99]/30 transition-all">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </a>
              </div>

              {/* 信息 */}
              <div className="flex-1 text-center sm:text-left pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
                  {member.name}
                </h2>
                <p className="text-sm sm:text-[15px] text-slate-500 leading-relaxed max-w-lg">
                  {member.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-[1400px] mx-auto px-4 text-center text-[12px] text-slate-400">
          © 2026 SETSS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}