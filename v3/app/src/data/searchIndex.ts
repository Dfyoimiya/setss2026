export interface SearchItem {
  id: string;
  page: string;      // 路由路径，如 '/' '/courses' '/committee'
  sectionId: string; // 页面内锚点 id，如 'welcome' 'speakers'
  title: { en: string; zh: string };
  content: { en: string; zh: string };
  keywords: string[]; // 额外匹配关键词（中英文都要）
  type: 'section' | 'person' | 'hotel' | 'transport' | 'topic';
}

export const searchIndex: SearchItem[] = [
  // ═══════════════════════════════════════════════════════════
  //  Home 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'hero',
    page: '/',
    sectionId: 'hero',
    title: { en: 'SETSS 2026', zh: 'SETSS 2026' },
    content: {
      en: 'The 8th Spring School on Engineering Trustworthy Software Systems May 11-17 2026 Chongqing China Southwest University',
      zh: '第八届可信软件系统工程春季学校 2026年5月11-17日 中国重庆 西南大学',
    },
    keywords: ['home', '首页', 'hero', 'setss', '2026', 'chongqing', '重庆', '西南大学', 'spring school'],
    type: 'section',
  },
  {
    id: 'welcome',
    page: '/',
    sectionId: 'about',
    title: { en: 'Welcome to SETSS 2026', zh: '欢迎来到 SETSS 2026' },
    content: {
      en: 'lectures on formal methods and AI world-class speakers 7-day intensive program Southwest University campus',
      zh: '形式化方法与人工智能前沿讲座 世界级讲者 7天强化课程 西南大学美丽校园',
    },
    keywords: ['welcome', '关于', 'about', 'lecture', '讲座', 'ai', '人工智能', 'speaker', '讲者', 'intro', '介绍'],
    type: 'section',
  },
  {
    id: 'countdown',
    page: '/',
    sectionId: 'countdown',
    title: { en: 'Countdown to SETSS 2026', zh: '倒计时' },
    content: { en: 'days hours minutes seconds until conference begins', zh: '距离大会开幕还有多少天时分秒' },
    keywords: ['countdown', '倒计时', 'date', '日期', 'time', '时间', 'remaining'],
    type: 'section',
  },
  {
    id: 'speakers',
    page: '/',
    sectionId: 'speakers',
    title: { en: 'Invited Speakers', zh: '特邀讲者' },
    content: {
      en: 'nine world-leading scholars covering formal methods automata learning digital twins trustworthy AI model checking',
      zh: '九位世界顶尖学者 形式化方法 自动机学习 数字孪生 可信AI 模型检验',
    },
    keywords: ['speaker', '讲者', 'lecturer', 'professor', '教授', 'invited', '特邀', 'keynote', '主讲'],
    type: 'section',
  },
  {
    id: 'schedule',
    page: '/',
    sectionId: 'schedule',
    title: { en: 'Program Schedule', zh: '日程安排' },
    content: {
      en: 'May 11 to May 17 opening session workshop digital twins automata learning model checking',
      zh: '5月11日至5月17日 开幕式 研讨会 数字孪生 自动机学习 模型检验',
    },
    keywords: ['schedule', '日程', 'program', 'agenda', '议程', 'day', '天', 'opening', '开幕', 'workshop', '研讨会', 'timeline'],
    type: 'section',
  },
  {
    id: 'registration-home',
    page: '/',
    sectionId: 'registration',
    title: { en: 'Registration', zh: '注册' },
    content: {
      en: 'register now join us contact information address email venue Southwest University',
      zh: '立即注册 加入我们 联系信息 地址 邮箱 会场 西南大学',
    },
    keywords: ['registration', '注册', 'register', '报名', 'contact', '联系', 'fee', '费用', 'price', '价格', 'signup'],
    type: 'section',
  },

  // ═══════════════════════════════════════════════════════════
  //  Committee 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'committee',
    page: '/committee',
    sectionId: 'committee',
    title: { en: 'Organizing Committee', zh: '组委会' },
    content: {
      en: 'Conference Chair Zhiming Liu Organisation Chair Bo Liu Publicity Chair Mingyue Zhang',
      zh: '学术委员会主席刘志明 组织委员会主席刘波 宣传委员会主席张明悦',
    },
    keywords: ['committee', '组委会', 'chair', '主席', 'organizing', '组织', 'contact', '联系'],
    type: 'section',
  },
  // 组委会成员（细粒度）
  {
    id: 'committee-liuzhiming',
    page: '/committee',
    sectionId: 'committee',
    title: { en: 'Zhiming Liu', zh: '刘志明' },
    content: {
      en: 'Chair of the School Academic Committee Southwest University reliable software formal methods',
      zh: '西南大学学校学术委员会主席 可信软件 形式化方法',
    },
    keywords: ['zhiming', '志ming', '刘志明', 'liuzhiming', 'academic', '学术', 'chair', '主席'],
    type: 'person',
  },
  {
    id: 'committee-liubo',
    page: '/committee',
    sectionId: 'committee',
    title: { en: 'Bo Liu', zh: '刘波' },
    content: {
      en: 'Chair of the Organisation Committee Southwest University',
      zh: '西南大学组织委员会主席',
    },
    keywords: ['bo', '波', '刘波', 'liubo', 'organisation', '组织', 'committee'],
    type: 'person',
  },
  {
    id: 'committee-zhangmingyue',
    page: '/committee',
    sectionId: 'committee',
    title: { en: 'Mingyue Zhang', zh: '张明悦' },
    content: {
      en: 'Chair of Publicity Southwest University',
      zh: '西南大学宣传委员会主席',
    },
    keywords: ['mingyue', '明悦', '张明悦', 'zhangmingyue', 'publicity', '宣传'],
    type: 'person',
  },

  // ═══════════════════════════════════════════════════════════
  //  Courses 页面 — 总览
  // ═══════════════════════════════════════════════════════════
  {
    id: 'courses',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Course Details', zh: '课程详情' },
    content: {
      en: 'Automata Learning AALpy Tony Hoare Digital Twins UPPAAL Trustworthy Systems Autonomous Systems Timed Systems',
      zh: '自动机学习 AALpy Tony Hoare 数字孪生 UPPAAL 可信系统 自主系统 实时系统',
    },
    keywords: ['course', '课程', 'lecture', '讲座', 'program', '课程表', 'session'],
    type: 'section',
  },
  // 课程主题（细粒度）
  {
    id: 'course-aalpy',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Automata Learning and Testing with AALpy', zh: 'Automata Learning and Testing with AALpy' },
    content: {
      en: 'Bernhard Aichernig Johannes Kepler University automata learning black-box testing AALpy tool python',
      zh: 'Bernhard Aichernig 约翰内斯开普勒大学 自动机学习 黑盒测试 AALpy工具',
    },
    keywords: ['aalpy', 'automata', '自动机', 'learning', '学习', 'testing', '测试', 'aichernig'],
    type: 'topic',
  },
  {
    id: 'course-hoare',
    page: '/courses',
    sectionId: 'courses',
    title: { en: "Tony Hoare's Scientific Life", zh: 'Tony Hoare 的科学人生' },
    content: {
      en: 'Jonathan Bowen quicksort algorithm Hoare logic CSP communicating sequential processes turing award',
      zh: 'Jonathan Bowen 快速排序算法 Hoare逻辑 CSP 通信顺序进程 图灵奖',
    },
    keywords: ['hoare', 'quick', '排序', 'csp', 'sequential', 'logic', '逻辑', 'bowen', 'history'],
    type: 'topic',
  },
  {
    id: 'course-digital-twins',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Digital Twins', zh: '数字孪生' },
    content: {
      en: 'Einar Broch Johnsen University of Oslo digital twins cyber-physical systems ABS SMOL sensor-driven model',
      zh: 'Einar Broch Johnsen 奥斯陆大学 数字孪生 信息物理系统 ABS SMOL',
    },
    keywords: ['digital twin', '数字孪生', 'johnsen', 'oslo', 'cyber-physical', 'model', '模型'],
    type: 'topic',
  },
  {
    id: 'course-uppaal',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Model Checking with UPPAAL', zh: 'UPPAAL 模型检验' },
    content: {
      en: 'Kim Guldstrand Larsen Aalborg University UPPAAL timed automata priced timed automata model checking CAV award',
      zh: 'Kim Guldstrand Larsen 奥尔堡大学 UPPAAL 时间自动机 模型检验',
    },
    keywords: ['uppaal', 'larsen', 'aalborg', 'timed automata', '时间自动机', 'model checking', 'cav'],
    type: 'topic',
  },
  {
    id: 'course-autonomous',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Bringing AI to Autonomous Systems', zh: '将 AI 引入自主系统' },
    content: {
      en: 'Joseph Sifakis Turing Award Verimag EPFL autonomous systems multi-agent reinforcement learning planning',
      zh: 'Joseph Sifakis 图灵奖 Verimag EPFL 自主系统 多智能体 强化学习',
    },
    keywords: ['sifakis', 'autonomous', '自主', 'multi-agent', '多智能体', 'turing', '图灵奖', 'verimag'],
    type: 'topic',
  },
  {
    id: 'course-ai-minds',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Are AI Minds Genuine Minds?', zh: 'AI 是否拥有真正的心智？' },
    content: {
      en: 'Moshe Vardi Rice University Goedel Prize Knuth Prize artificial intelligence consciousness philosophy of mind',
      zh: 'Moshe Vardi 莱斯大学 Gödel奖 Knuth奖 人工智能 意识 心智哲学',
    },
    keywords: ['vardi', 'moshe', 'ai mind', 'consciousness', '意识', 'philosophy', '哲学', 'rice'],
    type: 'topic',
  },
  {
    id: 'course-timed-systems',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Learning and Verifying Timed Systems', zh: '实时系统的学习与验证' },
    content: {
      en: 'Miaomiao Zhang Tongji University timed automata runtime verification model learning',
      zh: 'Miaomiao Zhang 同济大学 时间自动机 运行时验证 模型学习',
    },
    keywords: ['miaomiao', 'zhang', 'tongji', 'timed', '实时', 'runtime verification', '运行时验证'],
    type: 'topic',
  },
  {
    id: 'course-trustworthy',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Trustworthy Systems via Automated Reasoning', zh: '通过自动推理实现可信系统' },
    content: {
      en: 'Emily Yu Leiden University SAT SMT runtime monitoring neural certificates formal verification',
      zh: 'Emily Yu 莱顿大学 SAT SMT 运行时监控 神经证书 形式化验证',
    },
    keywords: ['emily', 'yu', 'leiden', 'reasoning', '推理', 'monitoring', '监控', 'sat', 'smt'],
    type: 'topic',
  },
  {
    id: 'course-synthesis',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Formal and Intelligent Synthesis', zh: '形式化与智能程序合成' },
    content: {
      en: 'Wei Dong NUDT National University of Defense Technology program synthesis reactive synthesis LLM code generation HCPS',
      zh: 'Wei Dong 国防科技大学 程序合成 反应式合成 LLM代码生成 人机物融合系统',
    },
    keywords: ['wei', 'dong', 'nudt', 'synthesis', '合成', 'reactive', '反应式', 'llm', 'hcps'],
    type: 'topic',
  },

  // 讲者个人（细粒度）
  {
    id: 'speaker-aichernig',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Bernhard K. Aichernig', zh: 'Prof. Bernhard K. Aichernig' },
    content: {
      en: 'Johannes Kepler University Linz Austria formal methods active learning',
      zh: '约翰内斯开普勒大学 林茨 奥地利 形式化方法',
    },
    keywords: ['aichernig', 'bernhard', 'kepler', 'linz', 'austria', '奥地利'],
    type: 'person',
  },
  {
    id: 'speaker-bowen',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Jonathan P. Bowen', zh: 'Prof. Jonathan P. Bowen' },
    content: {
      en: 'London South Bank University UK Emeritus Professor formal methods history of computing',
      zh: '伦敦南岸大学 英国 荣休教授 形式化方法 计算历史',
    },
    keywords: ['bowen', 'jonathan', 'london', 'south bank', 'emeri', '荣休'],
    type: 'person',
  },
  {
    id: 'speaker-dong',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Wei Dong', zh: 'Prof. Wei Dong' },
    content: {
      en: 'National University of Defense Technology China program analysis verification synthesis',
      zh: '国防科技大学 中国 程序分析 验证 合成',
    },
    keywords: ['dong', 'wei', 'nudt', '国防科大', 'changsha', '长沙'],
    type: 'person',
  },
  {
    id: 'speaker-johnsen',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Einar Broch Johnsen', zh: 'Prof. Einar Broch Johnsen' },
    content: {
      en: 'University of Oslo Norway digital twins ABS SMOL modeling verification',
      zh: '奥斯陆大学 挪威 数字孪生 ABS SMOL 建模验证',
    },
    keywords: ['johnsen', 'einar', 'oslo', 'norway', '挪威', 'digital twin', '数字孪生'],
    type: 'person',
  },
  {
    id: 'speaker-larsen',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Kim Guldstrand Larsen', zh: 'Prof. Kim Guldstrand Larsen' },
    content: {
      en: 'Aalborg University Denmark UPPAAL timed automata model checking CAV award',
      zh: '奥尔堡大学 丹麦 UPPAAL 时间自动机 模型检验',
    },
    keywords: ['larsen', 'kim', 'aalborg', 'denmark', '丹麦', 'uppaal', 'guldstrand'],
    type: 'person',
  },
  {
    id: 'speaker-sifakis',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Joseph Sifakis', zh: 'Prof. Joseph Sifakis' },
    content: {
      en: 'Turing Award 2007 Verimag EPFL France Switzerland autonomous systems',
      zh: '图灵奖 2007 Verimag EPFL 法国 瑞士 自主系统',
    },
    keywords: ['sifakis', 'joseph', 'turing', '图灵奖', 'verimag', 'epfl', 'france', '法国'],
    type: 'person',
  },
  {
    id: 'speaker-vardi',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Moshe Y. Vardi', zh: 'Prof. Moshe Y. Vardi' },
    content: {
      en: 'Rice University USA Goedel Prize Knuth Prize database theory constraint satisfaction',
      zh: '莱斯大学 美国 Gödel奖 Knuth奖 数据库理论 约束满足',
    },
    keywords: ['vardi', 'moshe', 'rice', 'usa', '美国', 'goedel', 'knuth', 'prize'],
    type: 'person',
  },
  {
    id: 'speaker-yu',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Emily Yu', zh: 'Prof. Emily Yu' },
    content: {
      en: 'Leiden University Netherlands SAT SMT formal verification runtime monitoring',
      zh: '莱顿大学 荷兰 SAT SMT 形式化验证 运行时监控',
    },
    keywords: ['yu', 'emily', 'leiden', 'netherlands', '荷兰', 'sat', 'smt'],
    type: 'person',
  },
  {
    id: 'speaker-miaomiao',
    page: '/courses',
    sectionId: 'courses',
    title: { en: 'Prof. Miaomiao Zhang', zh: 'Prof. Miaomiao Zhang' },
    content: {
      en: 'Tongji University China timed systems model learning verification',
      zh: '同济大学 中国 实时系统 模型学习 验证',
    },
    keywords: ['miaomiao', 'zhang', 'tongji', '同济', 'shanghai', '上海'],
    type: 'person',
  },

  // ═══════════════════════════════════════════════════════════
  //  Previous Editions 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'previous-editions',
    page: '/previous-editions',
    sectionId: 'previous-editions',
    title: { en: 'Previous Editions', zh: '往届会议' },
    content: {
      en: 'SETSS 2014 2016 2017 2018 2019 2024 2025 Springer proceedings Beijing Chongqing',
      zh: 'SETSS 2014 2016 2017 2018 2019 2024 2025 Springer 论文集 北京 重庆',
    },
    keywords: ['previous', '往届', 'history', '历史', 'edition', '届', 'springer', 'proceedings', '论文集', 'past'],
    type: 'section',
  },

  // ═══════════════════════════════════════════════════════════
  //  Registration 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'registration-page',
    page: '/registration',
    sectionId: 'registration-page',
    title: { en: 'Conference Registration', zh: '会议注册' },
    content: {
      en: 'registration fee bank transfer QR code Southwest University account 1600 RMB lectures 500 RMB workshop May 11-17',
      zh: '注册费 银行转账 二维码 西南大学 账号 1600元 讲座 500元 研讨会 5月11-17日',
    },
    keywords: ['registration', '注册', 'fee', '费用', 'bank', '银行', 'transfer', '转账', 'qr', '二维码', 'payment', '缴费', 'price', '价格'],
    type: 'section',
  },
  {
    id: 'reg-fee',
    page: '/registration',
    sectionId: 'registration-page',
    title: { en: 'Registration Fee', zh: '注册费用' },
    content: {
      en: '1600 RMB per person for lectures 500 RMB per person for workshop only',
      zh: '讲座全程每人1600元 仅研讨会每人500元',
    },
    keywords: ['fee', '费用', 'price', '价格', 'cost', '成本', 'rmb', '元', '1600', '500'],
    type: 'topic',
  },
  {
    id: 'reg-bank',
    page: '/registration',
    sectionId: 'registration-page',
    title: { en: 'Bank Transfer', zh: '银行转账' },
    content: {
      en: 'Southwest University Industrial and Commercial Bank of China account number 3100028109024968877 bank code 102653000474',
      zh: '西南大学 中国工商银行 账号 3100028109024968877 银行代码 102653000474',
    },
    keywords: ['bank', '银行', 'account', '账号', 'transfer', '转账', 'icbc', '工商', 'payment'],
    type: 'topic',
  },

  // ═══════════════════════════════════════════════════════════
  //  Transportation 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'transportation',
    page: '/transportation',
    sectionId: 'transportation',
    title: { en: 'Transportation Guide', zh: '交通指南' },
    content: {
      en: 'how to get to Southwest University from airport railway station metro taxi directions',
      zh: '如何到达西南大学 机场 火车站 地铁 出租车 路线',
    },
    keywords: ['transport', '交通', 'travel', '出行', 'direction', '方向', 'route', '路线', 'getting there'],
    type: 'section',
  },
  {
    id: 'transport-airport',
    page: '/transportation',
    sectionId: 'transportation',
    title: { en: 'From Jiangbei Airport', zh: '从江北机场出发' },
    content: {
      en: 'Jiangbei International Airport CKG line 10 line 6 Hongtudi 100 minutes 7 RMB taxi 40 minutes 60 RMB',
      zh: '江北国际机场 CKG 10号线 6号线 红土地 100分钟 7元 出租车40分钟 60元',
    },
    keywords: ['airport', '机场', 'jiangbei', '江北', 'ckg', 'flight', '航班', 'plane', '飞机'],
    type: 'transport',
  },
  {
    id: 'transport-beibei',
    page: '/transportation',
    sectionId: 'transportation',
    title: { en: 'From Chongqing North Station', zh: '从重庆北站出发' },
    content: {
      en: 'Chongqing North Railway Station line 4 line 6 Wulidian 55 minutes 6 RMB taxi 35 minutes 55 RMB',
      zh: '重庆北站 4号线 6号线 五里店 55分钟 6元 出租车35分钟 55元',
    },
    keywords: ['north', '北站', 'chongqingbei', '火车', 'railway', 'station', '车站'],
    type: 'transport',
  },
  {
    id: 'transport-xi',
    page: '/transportation',
    sectionId: 'transportation',
    title: { en: 'From Chongqing West Station', zh: '从重庆西站出发' },
    content: {
      en: 'Chongqing West Station loop line line 6 Ranjiaba 70 minutes 6 RMB taxi 45 minutes 70 RMB',
      zh: '重庆西站 环线 6号线 冉家坝 70分钟 6元 出租车45分钟 70元',
    },
    keywords: ['west', '西站', 'chongqingxi', 'railway', '火车'],
    type: 'transport',
  },
  {
    id: 'transport-dong',
    page: '/transportation',
    sectionId: 'transportation',
    title: { en: 'From Chongqing East Station', zh: '从重庆东站出发' },
    content: {
      en: 'Chongqing East Station line 6 direct 80 minutes 7 RMB taxi 50 minutes 85 RMB',
      zh: '重庆东站 6号线直达 80分钟 7元 出租车50分钟 85元',
    },
    keywords: ['east', '东站', 'chongqingdong', 'railway', '火车'],
    type: 'transport',
  },

  // ═══════════════════════════════════════════════════════════
  //  Accommodation 页面
  // ═══════════════════════════════════════════════════════════
  {
    id: 'accommodation',
    page: '/accommodation',
    sectionId: 'accommodation',
    title: { en: 'Recommended Hotels', zh: '推荐酒店' },
    content: {
      en: 'Ningdeng Bolianhui Blues Boree hotels near Southwest University Beibei walking distance',
      zh: '宁登 铂莲荟 布鲁斯 柏瑞 西南大学附近 北碚 步行可达',
    },
    keywords: ['hotel', '酒店', 'accommodation', '住宿', 'stay', '入住', 'room', '房间', 'beibei', '北碚'],
    type: 'section',
  },
  {
    id: 'hotel-ningdeng',
    page: '/accommodation',
    sectionId: 'accommodation',
    title: { en: 'Ningdeng Hotel', zh: '宁登酒店' },
    content: {
      en: 'No. 2-1 Tiansheng Road Beibei 500m from campus 7 min walk 023-60310999',
      zh: '天生路2号附1号 北碚 距校园500米 步行7分钟 023-60310999',
    },
    keywords: ['ningdeng', '宁登', 'tiansheng', '天生路', '60310999', 'recommended', '推荐'],
    type: 'hotel',
  },
  {
    id: 'hotel-bolianhui',
    page: '/accommodation',
    sectionId: 'accommodation',
    title: { en: 'Bolianhui Hotel', zh: '铂莲荟酒店' },
    content: {
      en: 'No. 2-2 Tiansheng Road Beibei 600m from campus 8 min walk near metro 023-86030333',
      zh: '天生路2号附2号 北碚 距校园600米 步行8分钟 近地铁 023-86030333',
    },
    keywords: ['bolianhui', '铂莲荟', 'tiansheng', '天生路', '86030333', 'metro', '地铁'],
    type: 'hotel',
  },
  {
    id: 'hotel-blues',
    page: '/accommodation',
    sectionId: 'accommodation',
    title: { en: 'Blues Hotel', zh: '布鲁斯酒店' },
    content: {
      en: 'No. 2-3 Tiansheng Road Beibei 700m from campus 10 min walk quiet comfortable 023-68369909',
      zh: '天生路2号附3号 北碚 距校园700米 步行10分钟 安静舒适 023-68369909',
    },
    keywords: ['blues', '布鲁斯', 'tiansheng', '天生路', '68369909', 'quiet', '安静'],
    type: 'hotel',
  },
  {
    id: 'hotel-boree',
    page: '/accommodation',
    sectionId: 'accommodation',
    title: { en: 'Boree Hotel', zh: '柏瑞酒店' },
    content: {
      en: 'No. 2-4 Tiansheng Road Beibei 800m from campus 12 min walk boutique near shopping 19936673214',
      zh: '天生路2号附4号 北碚 距校园800米 步行12分钟 精品 近商圈 19936673214',
    },
    keywords: ['boree', '柏瑞', 'tiansheng', '天生路', '19936673214', 'boutique', '精品'],
    type: 'hotel',
  },
];