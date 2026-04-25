import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'setss-lang';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // ... 把你 useLanguage.ts 里所有的 en 翻译键复制到这里
    home: 'Home',
    about: 'About',
    authors: 'Authors',
    speakers: 'Speakers',
    program: 'Program',
    attend: 'Attend',
    aboutSetss: 'About SETSS',
    joinCff: 'Join CFF',
    organizingCommittee: 'Organizing Committee',
    registration: 'Registration',
    gettingThere: 'Getting There',
    accommodation: 'Accommodation',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search...',
    welcomeTitle: 'Welcome to SETSS 2026',
    welcomeDesc1: 'The 8th Spring School on Engineering Trustworthy Software Systems (SETSS 2026) will be held on May 11-17, 2026 at the School of Computer and Information Science (CIS), Southwest University, Chongqing, China.',
    welcomeDesc2: 'The school offers lectures on leading-edge research in methods and tools for computer system engineering, topical talks on the history and trends of computing, and a workshop. SETSS 2026 is intended for university researchers (master\'s students, PhD students, academics) and software engineering practitioners in industry.',
    welcomeDesc3: 'Participants will gain insight into state-of-the-art software engineering methods and technological advances from both leading pioneers and outstanding young scholars in the field.',
    welcomeHighlight1: 'Cutting-edge lectures on formal methods & AI',
    welcomeHighlight2: 'World-class speakers from leading universities',
    welcomeHighlight3: '7-day intensive program with workshop',
    welcomeHighlight4: 'Beautiful campus of Southwest University',
    venueInfoTitle: 'Venue Information',
    venueAddress: 'Lecture Hall 0114, Building 25\nSchool of Computer and Information Science\nSouthwest University, Chongqing, China',
    venueDate: 'May 11 - May 17, 2026',
    visitOfficialWebsite: 'Visit Official Website →',
    swuCampusAlt: 'Southwest University',
    invitedSpeakers: 'Invited Speakers',
    speakersIntro: 'We are proud to host the following distinguished speakers (in alphabetical order of last name):',
    speakersDetail: 'For detailed information, including lecture titles, abstracts, and biographies, please visit the Speakers page.',
    speakersSubtitle: 'Distinguished Lecturers',
    speakerCourse: 'Course',
    speakerBiography: 'Biography',
    speakerAbstract: 'Abstract',
    registerNow: 'Register Now',
    registrationOpen: 'Registration is open!',
    joinUs: 'Join Us',
    regDesc1: 'Join us for an inspiring week of cutting-edge research, insightful lectures, and collaborative workshops at Southwest University, Chongqing.',
    regDesc2: 'SETSS 2026 is intended for university researchers in computer science and technology, including master\'s students, Ph.D students, academics and software engineering practitioners in industry.',
    learnMore: 'Learn More',
    contactInfoTitle: 'Contact Information',
    addressLabel: 'Address',
    addressDetail: 'School of Computer and Information Science\nSouthwest University\nNo. 2 Tiansheng Road, Beibei District\nChongqing, China 400715',
    emailLabel: 'Email',
    websiteLabel: 'Website',
    organizedBy: 'Organized by',
    organizerDetail: 'Centre for Research and Innovation in Software Engineering (RISE)\nSchool of Computer and Information Science\nSouthwest University',
    programSubtitle: '7-Day Program',
    programSchedule: 'Program Schedule',
    scheduleDay1: 'Day 1',
    scheduleDay2: 'Day 2',
    scheduleDay3: 'Day 3',
    scheduleDay4: 'Day 4',
    scheduleDay5: 'Day 5',
    scheduleDay6: 'Day 6',
    scheduleDay7: 'Day 7',
    scheduleDate1: 'May 11 (Mon)',
    scheduleDate2: 'May 12 (Tue)',
    scheduleDate3: 'May 13 (Wed)',
    scheduleDate4: 'May 14 (Thu)',
    scheduleDate5: 'May 15 (Fri)',
    scheduleDate6: 'May 16 (Sat)',
    scheduleDate7: 'May 17 (Sun)',
    eventOpening: 'Opening Session',
    eventTesting: 'Testing Online Meeting',
    eventCoffeeBreak: 'Coffee Break',
    eventLunch: 'Lunch',
    eventWorkshop: 'Workshop Session',
    eventWorkshopClosing: 'Workshop Session & Closing',
    eventSocialPrefix: 'Social Activity',
    activityHotPot: 'Hot Pot Feast',
    activityCruise: 'Chongqing Liangjiang Night Cruise',
    eventOpeningDetail: 'Welcome speeches by SWU President, Dean of CIS, and SETSS Briefing by Prof. Zhiming Liu. School Photo Taking.',
    eventTestingDetail: 'Connectivity test with Prof. Moshe Y. Vardi',
    conferenceChair: 'Conference Chair',
    backToHome: 'Back to Home',
    coursesTitle: 'Course Details',
    conferenceNameLine1: '2026 8th The Spring School on Engineering',
    conferenceNameLine2: 'Trustworthy Software Systems',
    conferenceDateLocation: 'May 11-17, 2026, Chongqing, China',
    heroDateTag: 'MAY 11-17, 2026 · CHONGQING, CHINA',
    heroSubtitle: 'The 8th Spring School on Engineering Trustworthy Software Systems',
    heroVenue: 'Southwest University, Chongqing, China',
    heroImageAlt: 'Southwest University',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    conferenceFullName: '2026 8th The Spring School on Engineering Trustworthy Software Systems',
  },
  zh: {
    // ... 把你 useLanguage.ts 里所有的 zh 翻译键复制到这里
    home: '首页',
    about: '关于',
    authors: '作者',
    speakers: '讲者',
    program: '日程',
    attend: '参会',
    aboutSetss: '关于SETSS',
    joinCff: '加入CFF',
    organizingCommittee: '组委会',
    registration: '注册',
    gettingThere: '交通指南',
    accommodation: '住宿',
    login: '登录',
    register: '注册',
    logout: '退出',
    search: '搜索...',
    welcomeTitle: '欢迎来到 SETSS 2026',
    welcomeDesc1: '第八届可信软件系统工程春季学校（SETSS 2026）将于2026年5月11日至17日在中国重庆西南大学计算机与信息科学学院（CIS）举行。',
    welcomeDesc2: '本次学校将提供关于计算机系统工程方法和工具前沿研究的讲座、关于计算历史和趋势的专题报告以及研讨会。SETSS 2026面向计算机科学与技术领域的大学研究人员（硕士生、博士生、学者）以及工业界的软件工程从业者。',
    welcomeDesc3: '参与者将深入了解软件工程领域最先进的方法和技术进展，包括杰出先驱和优秀青年学者的最新研究成果。',
    welcomeHighlight1: '形式化方法与人工智能前沿讲座',
    welcomeHighlight2: '来自顶尖大学的世界级讲者',
    welcomeHighlight3: '为期7天的强化课程与研讨会',
    welcomeHighlight4: '西南大学美丽校园',
    venueInfoTitle: '会场信息',
    venueAddress: '第25教学楼0114报告厅\n计算机与信息科学学院\n中国重庆西南大学',
    venueDate: '2026年5月11日 - 5月17日',
    visitOfficialWebsite: '访问官方网站 →',
    swuCampusAlt: '西南大学',
    invitedSpeakers: '特邀讲者',
    speakersIntro: '我们很荣幸邀请到以下杰出讲者（按姓氏字母顺序排列）：',
    speakersDetail: '点击讲者卡片查看详细信息，包括讲座标题、摘要和传记。',
    speakersSubtitle: '特邀讲者',
    speakerCourse: '讲座',
    speakerBiography: '个人简介',
    speakerAbstract: '摘要',
    registerNow: '立即注册',
    registrationOpen: '注册已开放！',
    joinUs: '加入我们',
    regDesc1: '加入我们，在重庆西南大学度过充满前沿研究、精彩讲座和协作研讨会的美好一周。',
    regDesc2: 'SETSS 2026面向计算机科学与技术领域的大学研究人员，包括硕士生、博士生、学者以及工业界的软件工程从业者。',
    learnMore: '了解更多',
    contactInfoTitle: '联系信息',
    addressLabel: '地址',
    addressDetail: '计算机与信息科学学院\n西南大学\n重庆市北碚区天生路2号\n中国 400715',
    emailLabel: '邮箱',
    websiteLabel: '网站',
    organizedBy: '主办方',
    organizerDetail: '软件工程研究与创新中心（RISE）\n计算机与信息科学学院\n西南大学',
    programSubtitle: '7天日程',
    programSchedule: '日程安排',
    scheduleDay1: '第一天',
    scheduleDay2: '第二天',
    scheduleDay3: '第三天',
    scheduleDay4: '第四天',
    scheduleDay5: '第五天',
    scheduleDay6: '第六天',
    scheduleDay7: '第七天',
    scheduleDate1: '5月11日（周一）',
    scheduleDate2: '5月12日（周二）',
    scheduleDate3: '5月13日（周三）',
    scheduleDate4: '5月14日（周四）',
    scheduleDate5: '5月15日（周五）',
    scheduleDate6: '5月16日（周六）',
    scheduleDate7: '5月17日（周日）',
    eventOpening: '开幕式',
    eventTesting: '在线会议测试',
    eventCoffeeBreak: '茶歇',
    eventLunch: '午餐',
    eventWorkshop: '研讨会',
    eventWorkshopClosing: '研讨会与闭幕式',
    eventSocialPrefix: '社交活动',
    activityHotPot: '火锅宴',
    activityCruise: '重庆两江夜游',
    eventOpeningDetail: '西南大学校长、计算机与信息科学学院院长致辞，刘志明教授作SETSS简介。集体合影。',
    eventTestingDetail: '与Moshe Y. Vardi教授进行在线连接测试',
    conferenceChair: '会议主席',
    backToHome: '返回首页',
    coursesTitle: '课程详情',
    conferenceNameLine1: '2026 第八届可信软件系统工程春季学校',
    conferenceNameLine2: '',
    conferenceDateLocation: '2026年5月11-17日，中国重庆',
    heroDateTag: '2026年5月11-17日 · 中国重庆',
    heroSubtitle: '第八届可信软件系统工程春季学校',
    heroVenue: '中国重庆西南大学',
    heroImageAlt: '西南大学',
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    conferenceFullName: '2026 第八届可信软件系统工程春季学校',
  },
};

interface LanguageContextType {
  lang: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'en' || saved === 'zh') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = translations[lang][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
        });
      }
      return text;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}