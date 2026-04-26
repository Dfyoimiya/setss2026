# SETSS2026

A full-stack course project with FastAPI backend, React frontend, PostgreSQL, MinIO, and Docker Compose.

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + Alembic + uv
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL 16
- **Object Storage**: MinIO
- **DevOps**: Docker Compose + GitHub Actions

## Quick Start

### Prerequisites

- Docker + Docker Compose
- (Optional) [uv](https://docs.astral.sh/uv/) for local Python development

### Development

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start all services
make dev

# 3. Open apps
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Backend docs: http://localhost:8000/docs
```

### Run Migrations

```bash
# Create a new migration
make migrate-new
# Enter migration message when prompted

# Apply migrations
make migrate
```

### Testing

```bash
# Unit tests (local, SQLite in-memory)
make test-unit

# Integration tests (Docker, real PostgreSQL)
make test-integration
```

### Production Build

```bash
make build
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # API routers
│   │   ├── core/         # Config & database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # App entrypoint
│   ├── alembic/          # Database migrations
│   ├── tests/
│   │   ├── unit/         # Unit tests (in-memory DB)
│   │   └── integration/  # Integration tests (Docker)
│   ├── Dockerfile        # Multi-stage build
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml           # Base / production
├── docker-compose.override.yml  # Development overrides
├── docker-compose.test.yml      # Test overrides
└── Makefile
```

## CI/CD

Two GitHub Actions workflows are configured:

1. **Backend Unit Tests** — Runs on every PR/push affecting `backend/**`
2. **Backend Integration Tests** — Spins up Docker Compose and runs integration tests

## Environment Variables

See `.env.example` for all available variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | App secret key |
| `MINIO_*` | MinIO configuration |
| `VITE_API_URL` | Frontend API base URL |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Hello World |
| GET | `/health` | Health check |
| GET | `/items/` | List all items |
| POST | `/items/` | Create an item |
| GET | `/items/{id}` | Get an item |
| PUT | `/items/{id}` | Update an item |
| DELETE | `/items/{id}` | Delete an item |


.....
