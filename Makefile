# Root Makefile — Unified entry point for Monorepo
.PHONY: help install dev test lint format type-check migrate clean

help:
	@echo "Available commands:"
	@echo "  make install      Install all dependencies (backend + frontend)"
	@echo "  make dev          Start development servers (requires tmux or two terminals)"
	@echo "  make test         Run all tests (backend + frontend)"
	@echo "  make lint         Run linters on backend and frontend"
	@echo "  make format       Run formatters on backend and frontend"
	@echo "  make type-check   Run frontend TypeScript type check"
	@echo "  make migrate      Run database migrations"
	@echo "  make clean        Remove build artifacts and cache files"

install:
	@echo "==> Installing backend dependencies..."
	cd backend && uv sync --group dev
	@echo "==> Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Start backend:  cd backend && make gateway"
	@echo "Start frontend: cd frontend && npm run dev"

test:
	@echo "==> Running backend tests..."
	cd backend && make test
	@echo "==> Frontend tests not yet configured (run: cd frontend && npm run test)"

lint:
	@echo "==> Linting backend..."
	cd backend && make lint
	@echo "==> Linting frontend..."
	cd frontend && npm run lint

format:
	@echo "==> Formatting backend..."
	cd backend && make format
	@echo "==> Formatting frontend..."
	cd frontend && npm run format

type-check:
	@echo "==> Running frontend type check..."
	cd frontend && npm run type-check

migrate:
	@echo "==> Running database migrations..."
	cd backend && uv run alembic upgrade head

clean:
	@echo "==> Cleaning backend artifacts..."
	cd backend && rm -rf .pytest_cache .ruff_cache __pycache__ test.db test_setss.db
	find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@echo "==> Cleaning frontend artifacts..."
	cd frontend && rm -rf dist node_modules/.cache
	find frontend -type d -name node_modules -prune -o -type d -name dist -exec rm -rf {} + 2>/dev/null || true
