# SETSS 2026 — 开发环境搭建指南

> 本文档面向新加入的开发者，帮助你快速在本地跑起项目。

---

## 📋 前置依赖

| 工具 | 版本 | 用途 | 安装链接 |
|------|------|------|---------|
| Docker | 最新 | 运行 PostgreSQL、MinIO | [Get Docker](https://docs.docker.com/get-docker/) |
| Docker Compose | 最新 | 编排容器 | 随 Docker Desktop 附带 |
| Python | 3.12 | 后端运行时 | [python.org](https://www.python.org/) |
| uv | 最新 | Python 包管理 | [astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/) |
| Node.js | 20+ | 前端运行时 | [nodejs.org](https://nodejs.org/) |
| npm | 10+ | 前端包管理 | 随 Node.js 附带 |
| Git | 最新 | 版本控制 | [git-scm.com](https://git-scm.com/) |

---

## 🚀 快速启动

### 1. 克隆仓库

```bash
git clone <repository-url>
cd setss2026
```

### 2. 启动基础设施（PostgreSQL + MinIO）

```bash
cd backend
docker compose up -d postgres minio
```

验证：
- PostgreSQL: `docker ps` 应看到 `setss_postgres`（端口 5432）
- MinIO: `docker ps` 应看到 `setss_minio`（端口 9000/9001）

### 3. 初始化数据库

```bash
cd backend
uv run alembic upgrade head
```

> 如果这是第一次运行且没有迁移文件，可先执行 `make migrate` 或在 Python 中调用 `models.Base.metadata.create_all()`（仅限开发）。

### 4. 安装后端依赖并启动

```bash
cd backend
uv sync --group dev
make gateway
```

后端服务将在 http://localhost:8001 启动，Swagger UI: http://localhost:8001/docs

### 5. 安装前端依赖并启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:5173 启动，并通过代理将 `/api` 请求转发到后端。

---

## 🛠️ 常用命令

### 根目录（跨项目）

```bash
make help           # 查看所有可用命令
make install        # 安装前后端所有依赖
make test           # 运行所有测试
make lint           # 运行所有 linter
make format         # 运行所有 formatter
make type-check     # 前端类型检查
make migrate        # 执行数据库迁移
make clean          # 清理构建产物和缓存
```

### 后端（`cd backend`）

```bash
make gateway        # 启动开发服务器（热重载）
make test           # 运行 pytest
make lint           # Ruff lint
make format         # Ruff format + fix

uv run alembic revision --autogenerate -m "describe change"   # 生成迁移
uv run alembic upgrade head                                    # 应用迁移
uv run alembic downgrade -1                                    # 回退一级
```

### 前端（`cd frontend`）

```bash
npm run dev         # 启动开发服务器
npm run build       # 生产构建
npm run lint        # ESLint
npm run format      # Prettier 格式化
npm run format:check # Prettier 格式检查
npm run type-check  # TypeScript 类型检查（不输出文件）
```

---

## ⚙️ 环境变量

### 后端

复制 `backend/.env.example` 到 `backend/.env.local`（不要提交到 Git）：

```bash
cp backend/.env.example backend/.env.local
# 按需修改
```

关键变量：
- `DATABASE_URL` — PostgreSQL 连接串
- `SECRET_KEY` — JWT 签名密钥（生产环境必须修改！）
- `MINIO_*` — 对象存储配置
- `EMAIL_*` — SMTP 邮件配置

### 前端

复制 `frontend/.env.example` 到 `frontend/.env.local`：

```bash
cp frontend/.env.example frontend/.env.local
```

关键变量：
- `VITE_API_BASE_URL` — 后端 API 地址
- `VITE_MINIO_PUBLIC_ENDPOINT` — MinIO 公网访问地址

---

## 🧪 运行测试

### 后端测试

```bash
cd backend
make test                    # 全部测试
uv run pytest -m unit        # 仅单元测试
uv run pytest -m integration # 仅集成测试
uv run pytest --cov=app      # 带覆盖率报告
```

### 前端测试

```bash
cd frontend
# 单元测试（待配置 Vitest）
# npm run test
```

---

## 🔧 推荐 IDE 配置

### VS Code

推荐安装以下扩展：

- Python（Microsoft）
- Ruff（Astral Software）
- ESLint（Microsoft）
- Prettier（Prettier）
- Tailwind CSS IntelliSense
- Docker（Microsoft）
- Thunder Client（API 测试）

工作区设置已包含在 `setss2026.code-workspace` 中。

### PyCharm / WebStorm

- 启用 ESLint 和 Prettier 集成
- 配置 Python 解释器指向 `backend/.venv`

---

## 🐛 常见问题

### 1. `uv sync` 失败 / 找不到 Python 3.12

```bash
# 确保 Python 3.12 已安装
python3.12 --version

# 或使用 uv 安装
uv python install 3.12
```

### 2. PostgreSQL 连接失败

```bash
# 检查容器是否运行
docker compose ps

# 查看日志
docker compose logs postgres

# 确保 DATABASE_URL 中的主机名正确（本地用 localhost，容器内用 postgres）
```

### 3. MinIO 无法访问

- 确认 `minio` 容器健康：`docker compose ps`
- 首次需要创建 bucket：访问 http://localhost:9001，用 minioadmin/minioadmin 登录，手动创建 `setss-papers` bucket

### 4. 前端代理不生效

- 确认后端运行在 `localhost:8001`
- 检查 `vite.config.ts` 中的 `proxy` 配置
- 确保前端请求以 `/api` 开头（如 `/api/v1/users`）

### 5. Alembic 迁移生成空文件

- 确认 `alembic/env.py` 中正确导入了 `Base` 和模型
- 确认模型有实际变更
- 检查 `sqlalchemy.url` 是否指向正确的数据库

---

## 📞 获取帮助

- 技术问题：在 GitHub 创建 Issue（选择 `Bug Report` 模板）
- 功能建议：在 GitHub 创建 Issue（选择 `Feature Request` 模板）
- 紧急问题：@ 对应模块负责人
