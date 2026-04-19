# SETSS 2026 — 项目架构文档

> **项目**：SETSS 2026 国际学术会议网站  
> **团队**：K-ON!（西南大学软件工程二班）  
> **文档版本**：v1.0  
> **最后更新**：2026-04-16

---

## 目录

1. [总体架构概述](#1-总体架构概述)
2. [技术栈](#2-技术栈)
3. [目录结构](#3-目录结构)
4. [后端架构](#4-后端架构)
5. [前端架构](#5-前端架构)
6. [数据库设计](#6-数据库设计)
7. [部署架构](#7-部署架构)
8. [CI/CD 流水线](#8-cicd-流水线)
9. [接口规范](#9-接口规范)

---

## 1. 总体架构概述

SETSS 2026 采用**前后端分离**的单体式 Monorepo 架构，后端通过 **API Gateway 模式**统一暴露 RESTful 接口，前端为独立的 SPA 应用。两者均可独立开发、测试与部署。

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              Browser / Mobile (SPA)                     │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────────┐
│                  Frontend (React/Vite)                   │
│              Static hosting / CDN                        │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (JSON)
┌──────────────────────▼──────────────────────────────────┐
│            Backend API Gateway (FastAPI)                 │
│                   Port 8001 (dev)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Router 层 (users / papers / reviews / schedule) │   │
│  └──────────┬───────────────────────────────────────┘   │
│  ┌──────────▼───────────────────────────────────────┐   │
│  │         Service / CRUD 业务逻辑层                 │   │
│  └──────────┬───────────────────────────────────────┘   │
│  ┌──────────▼───────────────────────────────────────┐   │
│  │     SQLAlchemy ORM + Pydantic 数据模型层          │   │
│  └──────────┬───────────────────────────────────────┘   │
└─────────────┼───────────────────────────────────────────┘
              │ SQL
┌─────────────▼───────────────────────────────────────────┐
│               PostgreSQL 15 数据库                       │
│            Docker 容器 / 云托管 RDS                      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 技术栈

### 2.1 后端

| 类别 | 技术 / 工具 | 版本 | 说明 |
|------|-------------|------|------|
| 语言 | Python | 3.12 | 项目固定版本（`.python-version`） |
| Web 框架 | FastAPI | ≥0.135 | 异步 ASGI 框架，自动生成 OpenAPI 文档 |
| ASGI 服务器 | Uvicorn | ≥0.42 | 生产 & 开发服务器 |
| 数据库 ORM | SQLAlchemy | ≥2.0 | 声明式模型，支持异步扩展 |
| 数据验证 | Pydantic v2 | ≥2.12 | 请求/响应 Schema、设置管理 |
| 认证 | python-jose + passlib[bcrypt] | — | JWT Token 签发与密码哈希 |
| 数据库驱动 | psycopg2-binary | ≥2.9 | PostgreSQL 同步驱动 |
| 包管理器 | uv | latest | 替代 pip，速度更快，lock 文件精确复现 |
| 代码检查 | Ruff | ≥0.15 | Lint + Auto-format，统一代码风格 |
| 测试框架 | pytest + httpx | ≥9.0 | 单元测试 & 集成测试 |

### 2.2 前端（规划中）

| 类别 | 技术 / 工具 | 说明 |
|------|-------------|------|
| 语言 | TypeScript | 强类型，提升可维护性 |
| 框架 | React 18 | 主流 SPA 框架 |
| 构建工具 | Vite | 快速开发构建 |
| UI 组件库 | Ant Design / shadcn/ui | 学术风格界面组件（待定） |
| 状态管理 | Zustand 或 React Query | 轻量服务端状态缓存 |
| HTTP 客户端 | Axios / Fetch API | 请求后端 REST 接口 |
| CSS 方案 | Tailwind CSS | 原子化样式 |
| 包管理 | pnpm | 节省磁盘，快速安装 |

### 2.3 数据库

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 关系型数据库 | PostgreSQL | 15-alpine | 主数据库，Docker 容器化 |

### 2.4 基础设施 & DevOps

| 类别 | 技术 | 说明 |
|------|------|------|
| 容器化 | Docker + Docker Compose | 开发 & 生产环境统一 |
| CI/CD | GitHub Actions | 自动化测试流水线 |
| 版本控制 | Git / GitHub | Monorepo，主分支保护 |

---

## 3. 目录结构

```
setss2026/                          # Monorepo 根目录
├── .github/
│   └── workflows/
│       └── backend-unit-tests.yml  # CI 工作流
├── backend/                        # Python 后端（已实现）
│   ├── app/
│   │   ├── gateway/
│   │   │   ├── __init__.py
│   │   │   └── app.py              # FastAPI 应用入口（API Gateway）
│   │   ├── routers/                # （待建）各业务路由模块
│   │   │   ├── users.py
│   │   │   ├── papers.py
│   │   │   ├── reviews.py
│   │   │   └── schedule.py
│   │   ├── services/               # （待建）业务逻辑层
│   │   ├── crud/                   # （待建）数据库增删改查
│   │   ├── models.py               # SQLAlchemy ORM 模型
│   │   ├── schemas.py              # Pydantic 数据 Schema
│   │   ├── database.py             # 数据库连接 & Session
│   │   ├── auth.py                 # （待建）JWT 认证工具
│   │   ├── config.py               # （待建）pydantic-settings 配置
│   │   └── main.py                 # 占位，暂未使用
│   ├── tests/
│   │   ├── test_tmp_main.py        # CI 占位测试
│   │   ├── test_users.py           # （待建）
│   │   └── test_papers.py          # （待建）
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── Makefile
│   ├── pyproject.toml
│   ├── uv.lock
│   └── .python-version
├── frontend/                       # 前端（待实现）
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── api/
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── docs/                           # 项目文档
│   ├── architecture.md             # 本文件
│   └── requirements.md             # 功能需求文档
├── CLAUDE.md
└── setss2026.code-workspace
```

---

## 4. 后端架构

### 4.1 网关模式（Gateway Pattern）

所有请求统一进入 `app/gateway/app.py`，由 FastAPI 的路由系统分发至各业务 Router 模块。这样做的好处是：

- 统一中间件（CORS、认证、日志、限流）挂载位置
- 便于未来拆分为微服务，只需替换 Router 为 HTTP 转发

### 4.2 分层设计

```
Gateway (app.py)
    ↓
Router 层         — 处理 HTTP 路由、参数解析、鉴权装饰器
    ↓
Service 层        — 业务逻辑、事务控制、跨实体操作
    ↓
CRUD 层           — 单表原子操作，直接调用 SQLAlchemy
    ↓
Model / Schema    — ORM 表映射 & Pydantic 数据契约
    ↓
PostgreSQL
```

### 4.3 认证方案

- 注册：密码由 `passlib[bcrypt]` 哈希后入库
- 登录：校验密码后签发 JWT（`python-jose`），有效期可配置
- 鉴权：受保护路由通过 FastAPI `Depends` 解析 Bearer Token

### 4.4 配置管理

使用 `pydantic-settings` 从环境变量读取配置（数据库 URL、JWT 密钥、调试模式等），支持 `.env` 文件本地覆盖，敏感信息不硬编码。

---

## 5. 前端架构

> 前端尚未实现，以下为规划方案。

### 5.1 页面模块划分

| 模块 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 会议概览、重要日期、新闻公告 |
| 投稿系统 | `/submission` | 论文上传、状态跟踪 |
| 审稿系统 | `/review` | 审稿人工作台 |
| 日程 | `/schedule` | 会议日程查看 |
| 注册报名 | `/register` | 参会者注册 |
| 个人中心 | `/profile` | 账户信息管理 |
| 管理后台 | `/admin` | 会议管理员操作面板 |

### 5.2 状态管理策略

- **服务端状态**（API 数据）：React Query，自动缓存与失效
- **客户端状态**（登录态、UI 状态）：Zustand 轻量 store
- **表单状态**：React Hook Form + Zod 校验

---

## 6. 数据库设计

### 6.1 核心实体（E-R 概览）

```
User ─────────────< Paper >──────────── Review
  |                   |                    |
  |              (投稿者/作者)          (审稿人)
  |
  └──────────────< Registration
                 (参会报名)
```

### 6.2 主要数据表（规划）

| 表名 | 说明 |
|------|------|
| `users` | 用户账户（已建，含 UUID PK、email、hashed_password） |
| `papers` | 投稿论文（标题、摘要、文件路径、状态、作者 FK） |
| `reviews` | 审稿意见（评分、评论、审稿人 FK、论文 FK） |
| `registrations` | 参会注册信息（参会类型、支付状态） |
| `schedule_items` | 会议日程条目（时间、地点、演讲者） |
| `announcements` | 网站公告 |

### 6.3 连接配置

```
postgresql://setss_user:setss_password@postgres:5432/setss_db
```

生产环境通过环境变量 `DATABASE_URL` 注入，不硬编码。

---

## 7. 部署架构

### 7.1 开发环境

```bash
# 启动 PostgreSQL 容器
cd backend && docker compose up postgres -d

# 启动后端开发服务器（热重载）
make gateway   # → http://localhost:8001
```

### 7.2 生产环境（规划）

```
Internet
    │
    ▼
 Nginx / Caddy（反向代理 + SSL 终结）
    │
    ├──→ /api/*  →  Backend 容器（uvicorn, port 8000）
    └──→ /*      →  Frontend 静态文件
                         │
                     PostgreSQL（独立容器 / 云 RDS）
```

Docker Compose 编排所有服务，`depends_on` + `healthcheck` 保证启动顺序。

---

## 8. CI/CD 流水线

```yaml
触发条件：
  - push 到 main 分支
  - 非草稿 PR 且修改了 backend/** 文件

流程：
  1. Checkout 代码
  2. 安装 uv 并同步依赖（uv sync）
  3. 运行测试（make test）

并发控制：同一 PR 的旧 run 自动取消
```

**后续可扩展**：
- Lint 检查（`make lint`）
- Docker 镜像构建 & 推送
- 前端构建 & 产物部署
- E2E 测试（Playwright）

---

## 9. 接口规范

- **协议**：HTTP/1.1，JSON body
- **前缀**：所有 API 路由以 `/api/v1/` 为前缀
- **认证**：`Authorization: Bearer <jwt_token>`
- **文档**：FastAPI 自动生成，开发环境访问 `http://localhost:8001/docs`（Swagger UI）和 `/redoc`
- **错误格式**：统一返回 `{"detail": "错误描述"}` 或 `{"detail": [{"loc": ..., "msg": ...}]}`（422 校验错误）
- **分页**：列表接口统一支持 `?page=1&size=20` 查询参数
