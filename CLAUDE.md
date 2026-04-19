# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**SETSS 2026** is a university course project (K-ON! team, Software Engineering Class 2, Southwest University) building an international academic conference website. Monorepo with an active Python backend and a planned frontend.

## Backend Commands

All commands run from `backend/`:

```bash
uv sync                  # install dependencies (or: make install)
make gateway             # run dev server on port 8001 (PYTHONPATH=. uvicorn app.gateway.app:app --host 0.0.0.0 --port 8001)
make test                # run all tests (PYTHONPATH=. uv run pytest tests/ -v)
make lint                # ruff lint check
make format              # ruff auto-fix + format
```

Run a single test file:
```bash
cd backend && PYTHONPATH=. uv run pytest tests/test_tmp_main.py -v
```

## Architecture

The backend uses a **gateway pattern**:
- `app/gateway/app.py` — the FastAPI application and main entry point (`app.gateway.app:app`)
- `app/main.py` — placeholder, not used by the server
- `tests/` — pytest test suite

`PYTHONPATH=.` must be set when running the server or tests from within `backend/` so that `app.*` imports resolve correctly.

The frontend folder is not yet implemented; the VS Code workspace (`setss2026.code-workspace`) already has a placeholder launch config for it.

## CI/CD

GitHub Actions (`.github/workflows/backend-unit-tests.yml`) runs `make test` on pushes to `main` and on non-draft PRs that touch `backend/**`. Concurrent runs for the same PR are cancelled automatically.

## Tooling

- **Package manager:** `uv` (not pip). Use `uv sync` to install, `uv run` to execute.
- **Linter/formatter:** Ruff. VS Code auto-formats Python on save via the Ruff extension.
- **Python version:** 3.12 (pinned in `backend/.python-version`)
- **Container:** `backend/Dockerfile` uses `uv sync --frozen` for reproducible builds.
