# SETSS 2026 — Conference Management System

> 中文文档请见 [README_CN.md](./README_CN.md)

A full-stack web application for the **SETSS 2026** (Software Engineering Technology Symposium & Summit 2026) international academic conference. Built with modern technologies and designed for scalability, security, and maintainability.

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) 20+ (for frontend local dev)
- [Python](https://www.python.org/) 3.12+ (for backend local dev)
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### One-Command Development

```bash
# Start all services (PostgreSQL + MinIO + Backend)
cd backend && docker compose up -d

# In another terminal, start the frontend
cd frontend && npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8001
- API Docs (Swagger UI): http://localhost:8001/docs
- MinIO Console: http://localhost:9001

---

## 📁 Monorepo Structure

```
setss2026/
├── backend/                 # FastAPI + SQLAlchemy + PostgreSQL
│   ├── app/                 # Application source code
│   ├── tests/               # Test suites
│   ├── alembic/             # Database migrations
│   ├── scripts/             # Utility scripts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── pyproject.toml
├── frontend/                # React 18 + Vite + TypeScript + Ant Design
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docs/                    # Project documentation
│   ├── architecture.md
│   ├── requirements.md
│   ├── development.md
│   └── deployment.md
├── .github/
│   └── workflows/           # CI/CD pipelines
├── README.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

---

## 🛠️ Tech Stack

### Backend
| Category | Technology |
|----------|-----------|
| Language | Python 3.12 |
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL 15 |
| Object Storage | MinIO (S3-compatible) |
| Auth | JWT (python-jose) + bcrypt |
| Migration | Alembic |
| Testing | pytest + httpx |
| Lint / Format | Ruff |
| Package Manager | uv |

### Frontend
| Category | Technology |
|----------|-----------|
| Language | TypeScript |
| Framework | React 18 |
| Build Tool | Vite |
| UI Library | Ant Design |
| State Management | Zustand + React Query |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| i18n | react-i18next |

---

## 🧪 Testing

```bash
# Backend tests
cd backend && make test

# Frontend lint
cd frontend && npm run lint

# Frontend type check
cd frontend && npm run type-check
```

---

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Requirements Specification](./docs/requirements.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for our code of conduct, branch naming conventions, and pull request process.

---

## 📄 License

[MIT](./LICENSE) © K-ON! Team, Southwest University
