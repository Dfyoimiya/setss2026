# SETSS 2026 前端开发工作记录

> **项目名称**：SETSS 2026 — 第八届可信软件系统工程春季学校会议网站  
> **技术栈**：React 19 + TypeScript + Tailwind CSS + Vite + Zustand + React Query  
> **开发周期**：两周（2026年4月）  
> **负责范围**：全部前端开发（共 7 大页 × 15 个 Section 组件，8000+ 行代码）

---

## 第一周：功能草图与骨架搭建

**阶段目标**：完成全站功能草图，所有页面可正常访问，核心交互机制跑通，内容基本填充完毕。

### 任务 1：竞品调研与模块拆解

**工作内容**
- 调研 SETSS 2025、SETSS 2026（上届）、ICASSP 2026 三个学术会议网站
- 拆解各网站功能模块：导航体系、页面层级、信息架构、视觉风格
- 输出可复用功能清单与设计参考，为项目提供优先级建议

**调研发现**
- SETSS 系列保持统一的深蓝 + 金色配色体系（`#1a365d` / `#b8860b`）
- ICASSP 提供完整的注册 + 投稿 + 评审流程，是 Dashboard 设计的参考源
- 学术会议网站核心模块：Hero 标题区、讲者展示、日程安排、注册入口、往届回顾

**产出**：功能优先级矩阵，明确首页 > 课程 > 注册 > 交通 > 住宿的开发顺序

---

### 任务 2：模块分析与页面结构规划

**工作内容**
- 规划 7 个核心页面结构：

| 页面 | 核心结构 |
|------|---------|
| **Home** | Hero → Countdown → Welcome → Speakers → Schedule → Registration → Footer |
| **Courses** | 讲者卡片列表（照片 + 姓名 + 机构 + 课程标题 + Bio/Abstract） |
| **Committee** | 组委会成员三列网格（照片 + 姓名 + 角色 + 简介） |
| **Registration** | 注册费用表 + 银行转账信息 + QR Code + 通知公告 |
| **Transportation** | 5 条路线卡片（机场 / 北站 / 西站 / 东站 + 自驾）+ 快速导航 |
| **Accommodation** | 4 个酒店卡片 + 切换选择器 + 距离/步行时间标注 |
| **Dashboard/Admin** | 论文管理 + 评审分配 + 用户管理 + 投稿周期控制 |

**技术决策**
- 使用 GSAP + ScrollTrigger 驱动滚动动画
- 使用 Lenis 实现平滑滚动体验
- 采用 Zustand (persist middleware) 管理认证状态
- 采用 React Query (`@tanstack/react-query`) 管理服务端状态

**产出**：完整的 `pages/` 和 `sections/` 目录结构，组件树规划文档

---

### 任务 3：核心交互机制草图实现

**视差滚动效果**
- 使用 `@studio-freight/lenis` 替代浏览器原生滚动
- GSAP ScrollTrigger 绑定 Lenis ticker，实现多段进入动画
- 首页多层背景速度差滚动，构建视觉层次

**搜索框检索定位**
- 实现 `useGlobalSearch` Hook：全文搜索 45 条索引，按标题/内容/关键词加权评分
- **Enter 两步确认**：首次 Enter 确认输入停留搜索框，二次 Enter 跳转至首结果
- 实时下拉提示：`highlightMatches()` 函数分词匹配 + 合并重叠区间 + `<<HL>>` 标记渲染
- 结果分类标签：Speaker（蓝色）、Course（绿色）、Hotel（棕色）、Transport（深棕）
- 同页跳转：`document.getElementById(sectionId)` + `ring-2 ring-[#b8860b]` 金框高亮 2.5s

**侧边栏导航机制**
- Courses 页面左侧粘性侧边栏（`lg:block hidden`，`sticky top-20`）
- 讲者名字索引（01–09 Prof. Xxx），点击平滑滚动定位
- 与搜索索引联动：`sectionId: 'speaker-N'` 精确匹配 DOM `id="speaker-N"`

**中英切换校准**
- `LanguageContext.tsx`：200+ 翻译键，`t(key)` 统一调用
- 语言状态持久化到 localStorage（key: `setss-lang`）
- 浏览器语言自动检测（中文浏览器默认 zh）
- 路由状态保持：切换语言不丢失当前页面位置

**涉及技术**
`React Hooks` · `TypeScript Generics` · `GSAP ScrollTrigger` · `Lenis Smooth Scroll` · `localStorage Persist`

---

### 任务 4：静态资源整理与内容填充

**工作内容**
- 收集处理 9 位讲者头像（`/images/speakers/` 目录）
- 会议 Logo 适配（`/images/setss-logo.png`）
- 填充中英文文案：
  - 首页欢迎语、会议介绍、注册信息
  - 9 位讲者完整 Bio + Abstract（中英双语，共 18 段长文本）
  - 委员会名单（Chair、Organisation Chair、Publicity Chair）
  - 交通指南（5 条路线、地铁换乘、时间预估）
  - 住宿推荐（4 个酒店、地址、电话、步行距离）
- `searchIndex.ts`：建立 45 条双语搜索索引，覆盖全部页面
- 完成所有页面的初版排版与基础 Tailwind 样式

**产出**：全站内容就绪，7 个页面均可正常访问浏览

---

### 第一周产出总结

| 维度 | 成果 |
|------|------|
| 页面数量 | 7 个完整页面 + 15 个 Section 组件 |
| 组件数量 | 30+ React 组件（Header、Navigation、Footer、AuthModal 等） |
| 交互机制 | 视差滚动、搜索定位、侧边栏导航、中英切换 |
| 数据体系 | 45 条搜索索引、200+ 翻译键、Zustand 持久化认证 |
| 内容填充 | 中英文双语文案全部就绪，图片资源整理完成 |

---

## 第二周：精细化调整、美化与测试

**阶段目标**：全站视觉统一精致，交互流畅，前后端联通正常，主要 Bug 修复完毕，具备上线条件。

### 任务 5：页面视觉完善与美化设计

#### Home 页面

| 优化项 | 具体工作 | 涉及技术 |
|--------|---------|---------|
| 信息层级重排 | 倒计时组件上移至 Hero 下方更显眼位置 | `gsap.to()` 数值动画 |
| 注册入口突出 | "Register Now" 按钮加大 + 箭头图标，提升 CTA 转化 | Tailwind `btn-primary` |
| 导航优化 | 登录后 Header 显示 Dashboard/Admin 入口，Navigation 中移除重复板块 | 条件渲染 `{user && ...}` |
| 外部跳转 | Registration "了解更多" → `<a href="http://www.rise-swu.cn/SETSS2026" target="_blank">` | 外链跳转 |
| 双语校准 | 确保所有文案通过 `t()` 获取，经 `LanguageContext` 实时切换 | `useLanguage()` Hook |

#### Courses 页面

| 优化项 | 具体工作 | 涉及技术 |
|--------|---------|---------|
| 侧边栏重构 | 将"教授/副教授"分类按钮改为完整讲者名字导航 | `sticky top-20` 粘性定位 |
| 搜索索引优化 | 18 条讲者/课程条目 `sectionId: 'courses'` → `'speaker-0'`~`'speaker-8'` | `searchIndex.ts` 精确映射 |
| 讲者卡片美化 | 头像 → 姓名 → 职称标签（Turing Award 金标）→ 机构 → 课程标题 | Tailwind 卡片组件 |
| 折叠展开删除 | `<details><summary>` 替换为始终可见的 Bio + Abstract | DOM 结构简化 |
| 标题背景统一 | 删除波浪 SVG / 网格纹理 / 发光圆圈 → `h-12 bg-gradient-to-t` | 视觉统一 |

**解决的关键问题**：
- `getSpeakerId(name)` 生成的 DOM ID（如 `Prof.-Bernhard-K.-Aichernig`）与 searchIndex 的 `speaker-N` 不匹配
  - 修复：统一改为 `` id={`speaker-${idx}`} ``，确保跨页搜索跳转可正确定位

#### Committee 页面

| 优化项 | 具体工作 |
|--------|---------|
| 标题背景统一 | 波浪 SVG → 蓝白渐变横线 |
| 历届排序 | 从 7th → 1st 倒序排列，视觉突出本届 8th |
| 成员卡片交互 | 整卡可点击，跳转个人主页 URL |
| 视觉区分 | 与 Courses 风格区分，统一背景色 |
| 照片简化 | 移除照片下方多余小图标 |
| 角色突出 | Conference Chair 等重点标注 |

#### Transportation 页面

| 优化项 | 具体工作 |
|--------|---------|
| 标题背景统一 | 波浪 → 蓝白渐变横线，与 Courses 一致 |
| 路线可视化 | 5 条路线用独立卡片 + 图标区分 |
| 信息突出 | 时间、费用用标签/色块区分 |
| 关键信息放大 | 推荐路线加粗，辅助信息弱化 |
| 双语对照 | 地点名称保留英文方便实际导航识别 |

#### Accommodation 页面

| 优化项 | 具体工作 |
|--------|---------|
| 标题背景统一 | 波浪 SVG → 蓝白渐变横线 |
| 酒店选择器 | 4 个酒店通过顶部 Tab 切换展示 |
| 信息卡片 | 距离、步行时间、联系方式结构化展示 |
| 特色标签 | 每个酒店标注 3 个核心特色（如"步行可达"、"近地铁"） |

#### Dashboard / Admin 页面

| 优化项 | 具体工作 | 涉及技术 |
|--------|---------|---------|
| 注册后自动登录 | 注册成功自动调用 `loginMutation.mutate()` 完成登录 → 刷新页面 | React Query `onSuccess` 链式调用 |
| 登录后自动刷新 | `useLogin()` 成功回调添加 `window.location.reload()` | 页面重载 |
| 侧边栏个人信息 | 新增机构名称 + 中文角色标签（管理员 / 组织者 / 审稿人 / 作者） | `DashboardLayout.tsx` |
| 个人信息编辑 | Dashboard 新增可编辑表单（姓名、机构），调用 `useUpdateProfile` API | React Query Mutation |
| 摘要换行修复 | `whitespace-pre-wrap` + `replace(/\\n/g, '\n')` 处理后端 literal `\n` | CSS + 字符串替换 |

---

### 任务 6：交互体验优化

**搜索功能完善**
- 讲者精确跳转：searchIndex `sectionId` 统一为 `speaker-N` 格式
- Courses 总览保留：`sectionId: 'courses'` 保持不变
- 同页跳转高亮：`ring-2 ring-[#b8860b] ring-offset-4` 2.5s 自动消失 — 同步应用于 Home、Courses 等所有页
- 跨页跳转：`navigate(${item.page}?scrollTo=${item.sectionId})` — Courses 页解析 `?scrollTo=speaker-N`

**路由跳转优化**
- 外部链接（CCF、讲者个人主页）使用 `<a target="_blank" rel="noopener noreferrer">`
- 站内锚点跳转使用 `scrollIntoView({ behavior: 'smooth', block: 'start' })`
- 跨页跳转保留 `?scrollTo=` 参数，确保目标页加载后自动定位

**状态管理**
- Zustand + persist：token 和 user 信息持久化到 localStorage，刷新不丢失登录态
- React Query：论文列表、评审任务等服务端状态自动缓存与刷新
- `staleTime: 10min` 策略平衡实时性与请求量

---

### 任务 7：前后端联调与测试调试

**接口对接**

| 接口 | 方法 | 用途 |
|------|------|------|
| `/api/v1/users/register` | POST | 用户注册 |
| `/api/v1/users/login` | POST | 用户登录，返回 JWT token |
| `/api/v1/users/me` | GET | 获取当前用户信息（含 role） |
| `/api/v1/users/me` | PATCH | 更新个人信息 |
| 论文 CRUD 接口 | GET/POST/PUT/DELETE | 论文提交、列表、详情、编辑、删除 |
| 评审接口 | GET/POST | 评审任务查看与提交 |

**功能测试覆盖**

- 双语切换：7 个页面在 EN/ZH 下内容正确渲染
- 搜索跳转：讲者搜索 → 跨页跳转到 Courses → 精确定位到对应卡片
- 同页搜索：首页搜索 "speakers" → 滚动到 Speakers section → 金框高亮
- 路由跳转：所有站内链接正确定向，外部链接新标签页打开
- 响应式适配：手机（<640px）、平板（<1024px）、桌面三档布局正确
- 登录注册：注册 → 自动登录 → 刷新 → 登录态保持
- 权限控制：Admin/Reviewer/Author 角色正确显示对应功能和入口

**Bug 修复记录**

| 问题 | 根因 | 修复方案 |
|------|------|---------|
| 搜索框首次 Enter 误触跳转 | 缺少 "确认输入" 中间状态 | 新增 `hasPressedEnter` 状态，首次 Enter 仅标记，二次 Enter 才跳转 |
| 跨页跳转后高亮丢失 | Courses 页 DOM id 不匹配 searchIndex sectionId | 统一使用 `speaker-N` 作为 DOM id |
| 中英切换后侧边栏索引不同步 | `coursesData` 依赖 `t()` 动态生成，切换语言时重新渲染 | `getAllSpeakers(t)` 返回 SpeakerData[]，索引稳定 |
| 论文摘要换行显示异常 | 后端返回 literal `\n` 字符串 | 前端 `replace(/\\n/g, '\n')` + `whitespace-pre-wrap` |
| 注册后需手动登录 | 注册接口不返回 token | 注册成功回调中自动调用登录接口 `loginMutation.mutate()` |
| Dashboard 加载需手动刷新 | React Query 缓存策略导致数据不及时 | 登录成功后 `window.location.reload()` 确保全量重载 |
| Navigation 导航栏重复显示 Dashboard | 登录后同时存在于 Header 和 Navigation | 从 Navigation 组件中移除 Dashboard/Admin 条目 |

---

### 第二周产出总结

| 维度 | 成果 |
|------|------|
| 视觉统一 | 5 个页面标题背景统一为蓝白渐变横线，卡片/导航/配色全站一致 |
| 交互优化 | 搜索精确跳转、侧边栏导航、金框高亮动画、中英实时切换 |
| 前后端联调 | RESTful API 全部对接，认证流程完整（注册→自动登录→token 持久化） |
| Bug 修复 | 7 个关键 Bug 全部修复 |
| 状态 | 具备上线条件 |

---

## 技术架构总览

```
SETSS 2026 Frontend
├── src/
│   ├── api/           # API 类型定义 + authService + submissionService
│   ├── components/    # ProtectedRoute、PageHeader、ui/
│   ├── contexts/      # LanguageContext (200+ 翻译键)
│   ├── data/          # searchIndex.ts (45 条双语索引)
│   ├── hooks/         # useAuth、useGlobalSearch、useAuthQuery、useSubmissionQuery
│   ├── layouts/       # DashboardLayout (侧边栏 + 路由出口)
│   ├── lib/           # apiFetch 工具函数
│   ├── pages/         # 7 个页面 + admin/ 子目录
│   ├── sections/      # 15 个首页 Section 组件
│   └── stores/        # authStore (Zustand + persist)
```

**核心技术选型决策**

| 选型 | 理由 |
|------|------|
| Zustand (替代 Redux) | 极简 API，persist 中间件直接对接 localStorage |
| React Query (替代手动 fetch) | 自动缓存/失效/重试，代码量减少 60%+ |
| GSAP + ScrollTrigger | 学术网站需要专业级滚动动画，CSS-only 不够精细 |
| Lenis | 替代浏览器原生 scroll，与 GSAP ticker 深度绑定 |
| Tailwind CSS | 原子化 CSS，设计令牌统一，全程 0 行自定义 CSS |

---

*文档生成日期：2026年4月30日*  
*开发者：前端工程师*  
*项目状态：已完成，具备上线条件*
