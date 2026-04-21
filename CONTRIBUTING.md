# Contributing to SETSS 2026

感谢你对 SETSS 2026 项目的贡献！本文件描述了我们团队的协作规范，请仔细阅读后再提交代码。

---

## 🌳 Git 工作流

我们采用 **Git Flow** 简化版：

```
main       ← 生产分支，只接受合并，禁止直接推送
  ↑
dev        ← 日常开发分支，功能完成后合并至此
  ↑
feature/*  ← 功能分支，从 dev 切出
bugfix/*   ← Bug 修复分支
hotfix/*   ← 线上紧急修复，从 main 切出
refactor/* ← 代码重构（无功能变化），从 dev 切出
docs/*     ← 文档更新，从 dev 切出
test/*     ← 补充/增加测试用例，从 dev 切出
chore/*    ← 杂项（构建脚本、工具配置、清理等）
deps/*     ← 依赖升级/降级
ci/*       ← CI/CD 流水线变更
style/*    ← 代码格式、命名、无逻辑变更
perf/*     ← 性能优化
config/*   ← 业务配置变更（无代码变化）
exper/*    ← 实验性代码，不合并
```

### 分支命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 功能 | `feature/<ticket-id>-short-desc` | `feature/42-user-login` |
| 修复 | `fix/<ticket-id>-short-desc` | `fix/55-email-regex` |
| 热修 | `hotfix/<version>-short-desc` | `hotfix/v1.0.1-sql-inject` |
| 文档 | `docs/<short-desc>` | `docs/api-auth-guide` |

### Commit Message 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**常用 type：**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响逻辑）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具/依赖更新

**示例：**
```
feat(auth): add JWT refresh token endpoint

- Implement /auth/refresh endpoint
- Add refresh_token to login response
- Update tests

Closes #123
```

---

## 🔀 Pull Request 流程

1. **创建分支**：从最新的 `dev` 切出你的分支
2. **本地验证**：确保 `make lint` 和 `make test`（或前端等价命令）全部通过
3. **提交 PR**：推送到远程并创建 Pull Request 到 `dev`
4. **填写模板**：按 PR 模板填写变更说明、测试方式、影响范围
5. **Code Review**：至少 **1 位** 团队成员 Approve 后方可合并
6. **CI 通过**：所有 GitHub Actions 检查必须绿灯
7. **合并方式**：使用 **Squash and Merge**，保持主分支历史整洁

---

## 🧹 代码规范

### Python (Backend)
- 使用 **Ruff** 进行 Lint 和 Format：`make lint`、`make format`
- 类型注解：公共函数必须标注参数和返回值类型
- 文档字符串：模块、类、公共函数使用 Google Style Docstring
- 异常处理：使用 `app/core/exceptions.py` 中定义的业务异常，禁止裸抛 `Exception`

### TypeScript / React (Frontend)
- 使用 **ESLint** + **Prettier**：`npm run lint`、`npm run format`
- 组件命名：PascalCase，文件同名
- Hooks 命名：以 `use` 开头，camelCase
- 类型定义：优先使用 `interface`，放在 `src/types/` 或同文件顶部
- API 调用：统一通过 `src/api/` 下的封装层，禁止组件内裸调 `axios`

---

## 🧪 测试要求

- **后端**：新增业务逻辑必须附带单元测试，覆盖率不降低
- **前端**：关键组件和工具函数鼓励补测试
- **API 变更**：如修改接口契约，需同步更新接口文档或通知前端

---

## 📝 文档同步

如果你修改了以下内容，请同步更新对应文档：

| 修改内容 | 需更新文档 |
|---------|-----------|
| 环境变量 | `backend/.env.example`、`docs/deployment.md` |
| API 接口 | 自动生成的 OpenAPI + `docs/api/` 变更记录 |
| 数据库模型 | Alembic 迁移 + `docs/database/` 数据字典 |
| 部署方式 | `docs/deployment.md` |
| 开发流程 | `docs/development.md` |

---

## 💬 沟通渠道

- 日常讨论：PR 评论 / Issue 讨论
- 技术方案：先开 Issue 或 Discussion，达成共识后再开发
- 紧急问题：@ 对应模块负责人

---

## ✅ PR Checklist（提交前自检）

- [ ] 代码已自测通过
- [ ] `make lint` / `npm run lint` 无错误
- [ ] `make test` / `npm run test` 全部通过
- [ ] 新功能已补充测试
- [ ] 文档已同步更新
- [ ] Commit Message 符合规范
- [ ] 无敏感信息（密码、密钥、token）提交

---

再次感谢你的贡献！🎸
