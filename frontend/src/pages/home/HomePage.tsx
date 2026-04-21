import { useRef } from 'react'
import { Button, Space, Typography } from 'antd'
import {
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ArrowDownOutlined,
  RightOutlined,
} from '@ant-design/icons'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { announcementApi } from '@/api/announcements'
import { useAuthStore } from '@/store/authStore'

const { Title, Text, Paragraph } = Typography

// ─── 重要日期数据 ───────────────────────────────────────────────
const DATES = [
  { key: 'submission_deadline', date: '2026-06-01', label: '论文投稿截止', color: '#1677ff' },
  { key: 'notification_date', date: '2026-07-15', label: '录用通知', color: '#52c41a' },
  { key: 'registration_deadline', date: '2026-08-01', label: '注册报名截止', color: '#faad14' },
  { key: 'conference_start', date: '2026-09-15', label: '会议开幕', color: '#722ed1' },
]

// ─── 会议主题 ───────────────────────────────────────────────────
const TOPICS = [
  { icon: '🧠', title: '人工智能与机器学习', desc: 'AI/ML 前沿理论与工程实践' },
  { icon: '☁️', title: '分布式系统与云计算', desc: '大规模系统架构与云原生技术' },
  { icon: '🔐', title: '网络安全', desc: '系统安全、密码学与隐私保护' },
  { icon: '🖥️', title: '软件工程方法与实践', desc: '敏捷开发、DevOps 与质量保障' },
  { icon: '📊', title: '大数据与数据工程', desc: '数据处理、分析与可视化' },
  { icon: '🤝', title: '人机交互', desc: '用户体验设计与可用性研究' },
]

// ─── 动画变体 ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── 子组件：滚动触发区块 ────────────────────────────────────────
function ScrollSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── 主页 ────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()
  const heroRef = useRef<HTMLDivElement>(null)

  // 视差滚动
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const { data: announcements } = useQuery({
    queryKey: ['announcements-home'],
    queryFn: () => announcementApi.list(1, 4),
  })

  return (
    <div style={{ margin: '-24px -48px', overflow: 'hidden' }}>

      {/* ══════════════════════════════════════════
          HERO — 全屏视差
      ══════════════════════════════════════════ */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000d1a',
        }}
      >
        {/* 背景粒子网格 */}
        <motion.div
          style={{ y: heroY, position: 'absolute', inset: 0 }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, opacity: 0.15 }}
          >
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1677ff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* 光晕 */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(22,119,255,0.25) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(114,46,209,0.2) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </motion.div>

        {/* Hero 文字内容 */}
        <motion.div
          style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}
        >
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
            <div style={{
              display: 'inline-block',
              background: 'rgba(22,119,255,0.15)',
              border: '1px solid rgba(22,119,255,0.4)',
              borderRadius: 20,
              padding: '4px 16px',
              marginBottom: 24,
            }}>
              <Text style={{ color: '#69b1ff', fontSize: 13, letterSpacing: 2 }}>
                SEPTEMBER 15–17, 2026 · CHONGQING
              </Text>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
            <Title
              level={1}
              style={{
                color: '#fff',
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 8,
                letterSpacing: -1,
              }}
            >
              SETSS
              <span style={{
                background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}> 2026</span>
            </Title>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
            <Title
              level={4}
              style={{ color: '#8ab4f8', fontWeight: 400, marginBottom: 16, fontSize: 'clamp(14px, 2vw, 20px)' }}
            >
              Software Engineering Technology Symposium & Summit
            </Title>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible">
            <Text style={{ color: '#6b7280', fontSize: 15, display: 'block', marginBottom: 40 }}>
              <EnvironmentOutlined style={{ marginRight: 6 }} />
              西南大学行政楼报告厅，重庆
            </Text>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              {isLoggedIn() ? (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FileTextOutlined />}
                    onClick={() => navigate('/submission/new')}
                    style={{ height: 48, paddingInline: 28, fontSize: 16, borderRadius: 8 }}
                  >
                    提交论文
                  </Button>
                  <Button
                    size="large"
                    ghost
                    onClick={() => navigate('/conference-registration')}
                    style={{ height: 48, paddingInline: 28, fontSize: 16, borderRadius: 8, borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    参会报名
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate('/register')}
                    style={{ height: 48, paddingInline: 28, fontSize: 16, borderRadius: 8 }}
                  >
                    立即注册
                  </Button>
                  <Button
                    size="large"
                    ghost
                    onClick={() => navigate('/login')}
                    style={{ height: 48, paddingInline: 28, fontSize: 16, borderRadius: 8, borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    登录
                  </Button>
                </>
              )}
            </Space>
          </motion.div>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            zIndex: 2,
          }}
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ArrowDownOutlined style={{ fontSize: 20 }} />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          重要日期 — 时间轴
      ══════════════════════════════════════════ */}
      <div style={{ background: '#0a0f1e', padding: '96px 48px' }}>
        <ScrollSection>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <Text style={{ color: '#1677ff', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
              Timeline
            </Text>
            <Title level={2} style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}>
              <CalendarOutlined style={{ marginRight: 12, color: '#1677ff' }} />
              重要日期
            </Title>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            maxWidth: 1000,
            margin: '0 auto',
          }}>
            {DATES.map((item, i) => (
              <motion.div
                key={item.key}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${item.color}33`,
                  borderRadius: 16,
                  padding: '28px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: item.color,
                  borderRadius: '16px 16px 0 0',
                }} />
                <Text style={{ color: item.color, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '8px 0 4px' }}>
                  {item.date}
                </div>
                <Text style={{ color: '#9ca3af', fontSize: 14 }}>{item.label}</Text>
              </motion.div>
            ))}
          </div>
        </ScrollSection>
      </div>

      {/* ══════════════════════════════════════════
          会议主题 — 卡片网格
      ══════════════════════════════════════════ */}
      <div style={{ background: '#060b16', padding: '96px 48px' }}>
        <ScrollSection>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <Text style={{ color: '#722ed1', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
              Topics
            </Text>
            <Title level={2} style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}>
              会议主题
            </Title>
            <Paragraph style={{ color: '#6b7280', marginTop: 12, fontSize: 15 }}>
              涵盖软件工程与计算机科学前沿领域
            </Paragraph>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
          }}>
            {TOPICS.map((topic, i) => (
              <motion.div
                key={topic.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                style={{
                  background: 'linear-gradient(135deg, rgba(22,119,255,0.06) 0%, rgba(114,46,209,0.06) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  cursor: 'default',
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{topic.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#e5e7eb', marginBottom: 8 }}>
                  {topic.title}
                </div>
                <Text style={{ color: '#6b7280', fontSize: 14 }}>{topic.desc}</Text>
              </motion.div>
            ))}
          </div>
        </ScrollSection>
      </div>

      {/* ══════════════════════════════════════════
          最新公告
      ══════════════════════════════════════════ */}
      <div style={{ background: '#0a0f1e', padding: '96px 48px' }}>
        <ScrollSection>
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, maxWidth: 1000, margin: '0 auto 40px' }}>
            <div>
              <Text style={{ color: '#52c41a', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase' }}>
                News
              </Text>
              <Title level={2} style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}>
                最新公告
              </Title>
            </div>
            <Link to="/announcements" style={{ color: '#1677ff', display: 'flex', alignItems: 'center', gap: 4 }}>
              查看全部 <RightOutlined style={{ fontSize: 12 }} />
            </Link>
          </motion.div>

          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(announcements?.items ?? []).length === 0 ? (
              <motion.div variants={fadeUp}>
                <Text style={{ color: '#4b5563' }}>暂无公告</Text>
              </motion.div>
            ) : (
              (announcements?.items ?? []).map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                >
                  <Link to={`/announcements/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'border-color 0.2s',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, color: '#e5e7eb', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                        <Text style={{ color: '#6b7280', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {item.content}
                        </Text>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <Text style={{ color: '#4b5563', fontSize: 12 }}>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('zh-CN') : ''}
                        </Text>
                        <RightOutlined style={{ color: '#374151', marginLeft: 12, fontSize: 12 }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </ScrollSection>
      </div>

      {/* ══════════════════════════════════════════
          CTA — 行动召唤
      ══════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #001529 0%, #0d1b3e 50%, #1a0533 100%)',
        padding: '96px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰圆 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(22,119,255,0.1)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(22,119,255,0.15)',
          pointerEvents: 'none',
        }} />

        <ScrollSection>
          <motion.div variants={fadeUp} custom={0}>
            <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
              加入 SETSS 2026
            </Title>
          </motion.div>
          <motion.div variants={fadeUp} custom={1}>
            <Paragraph style={{ color: '#9ca3af', fontSize: 16, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
              与来自全球的软件工程研究者共同探讨前沿技术，分享研究成果
            </Paragraph>
          </motion.div>
          <motion.div variants={fadeUp} custom={2}>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate(isLoggedIn() ? '/submission/new' : '/register')}
                style={{ height: 48, paddingInline: 32, fontSize: 16, borderRadius: 8 }}
              >
                {isLoggedIn() ? '提交论文' : '立即注册'}
              </Button>
              <Button
                size="large"
                ghost
                onClick={() => navigate('/call-for-papers')}
                style={{ height: 48, paddingInline: 32, fontSize: 16, borderRadius: 8, borderColor: 'rgba(255,255,255,0.2)' }}
              >
                征稿说明
              </Button>
            </Space>
          </motion.div>
        </ScrollSection>
      </div>

    </div>
  )
}
