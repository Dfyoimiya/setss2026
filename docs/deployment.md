# SETSS 2026 — 部署指南

> 本文档描述如何将 SETSS 2026 部署到生产环境。

---

## 📋 环境要求

| 组件 | 版本 | 说明 |
|------|------|------|
| Docker | 24+ | 容器运行时 |
| Docker Compose | 2.20+ | 编排工具 |
| 服务器 | 2 vCPU / 4GB RAM | 最低配置 |
| 域名 + SSL 证书 | — | HTTPS 强制 |

---

## 🏗️ 架构概览

```
Internet
    │
    ▼
 Nginx / Caddy（反向代理 + SSL 终结）
    │
    ├──→ /api/*  →  Backend 容器 (FastAPI + Uvicorn)
    └──→ /*      →  Frontend 静态文件 (Nginx)
                         │
                    PostgreSQL (容器 / 云 RDS)
                    MinIO (对象存储)
```

---

## 🔐 安全清单（部署前必读）

- [ ] 修改所有默认密码（`SECRET_KEY`、`MINIO_ROOT_PASSWORD`、`POSTGRES_PASSWORD`、`SMTP_PASSWORD`）
- [ ] `SECRET_KEY` 使用 `openssl rand -hex 32` 生成
- [ ] 关闭调试模式，设置 `DEBUG=false`
- [ ] CORS 白名单化，禁止 `allow_origins=["*"]`
- [ ] 启用 HTTPS（Let's Encrypt / Cloudflare）
- [ ] 配置防火墙，只暴露 80/443
- [ ] 数据库不使用默认端口暴露到公网
- [ ] 启用 fail2ban 或云服务器安全组
- [ ] 配置日志收集和监控告警

---

## 🚀 部署步骤

### 1. 准备服务器

```bash
# 安装 Docker & Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose-plugin

# 克隆代码
git clone <repository-url>
cd setss2026
```

### 2. 配置环境变量

```bash
# 后端
cp backend/.env.example backend/.env
nano backend/.env
# 修改所有密码和连接地址

# 前端构建参数（如有需要）
cp frontend/.env.example frontend/.env.local
# 配置 API 地址
```

### 3. 构建并启动

```bash
# 方式一：使用 Docker Compose（推荐）
cd backend
docker compose -f docker-compose.yml up -d --build

# 运行数据库迁移
docker compose exec backend uv run alembic upgrade head
```

### 4. 配置反向代理（Nginx 示例）

```nginx
server {
    listen 80;
    server_name setss2026.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name setss2026.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /var/www/setss2026/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Docs (optional, restrict by IP in production)
    location /docs {
        proxy_pass http://localhost:8001/docs;
        # allow 10.0.0.0/8;
        # deny all;
    }
}
```

---

## 🔄 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建
cd backend
docker compose up -d --build

# 3. 执行数据库迁移
docker compose exec backend uv run alembic upgrade head

# 4. 检查状态
docker compose ps
docker compose logs -f backend
```

---

## 📊 监控与日志

### 查看日志

```bash
cd backend
docker compose logs -f backend
docker compose logs -f postgres
```

### 健康检查

后端已内置健康检查端点（如配置）：

```bash
curl http://localhost:8001/health
```

> 如需添加健康检查路由，请在 `app/gateway/app.py` 中实现。

---

## 🗄️ 数据库备份

```bash
# 手动备份
docker compose exec postgres pg_dump -U setss_user setss_db > backup_$(date +%F).sql

# 恢复
cat backup_2026-04-21.sql | docker compose exec -T postgres psql -U setss_user setss_db
```

建议配置定时任务（cron）自动备份。

---

## 🆘 回滚策略

1. 代码回滚：`git reset --hard <last-stable-commit>` + 重新部署
2. 数据库回滚：`alembic downgrade -1` 或恢复到备份
3. 容器回滚：保留上一个版本的 Docker Image tag

---

## 📞 故障排查

| 现象 | 可能原因 | 解决方案 |
|------|---------|---------|
| 502 Bad Gateway | 后端未启动 | `docker compose ps` 检查状态，查看日志 |
| 数据库连接失败 | 网络/凭据错误 | 检查 `DATABASE_URL`，确认容器间网络连通 |
| 静态资源 404 | 前端未构建/路径错误 | 确认 `dist/` 目录存在，Nginx root 路径正确 |
| CORS 错误 | 配置不匹配 | 检查后端 `allow_origins` 是否包含前端域名 |
| 邮件发送失败 | SMTP 配置错误 | 检查 `EMAIL_ENABLED` 和 SMTP 参数 |

---

## 📚 相关文档

- [架构设计](./architecture.md)
- [开发指南](./development.md)
- [需求规格](./requirements.md)
