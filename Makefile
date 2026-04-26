.PHONY: dev dev-down migrate migrate-new test-unit test-integration build

dev:
	@test -f .env || cp .env.example .env
	docker compose up -d --build

dev-down:
	docker compose down

migrate:
	docker compose exec backend alembic upgrade head

migrate-new:
	@read -p "Migration message: " msg; \
	docker compose exec backend alembic revision --autogenerate -m "$$msg"

test-unit:
	cd backend && uv sync --group dev && uv run pytest tests/unit -v

test-integration:
	docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from backend postgres minio backend
	docker compose -f docker-compose.yml -f docker-compose.test.yml down -v

build:
	docker compose -f docker-compose.yml build

format:
	cd backend && uv sync --group dev && uvx ruff check . --fix && uvx ruff format .

lint:
	cd backend && uv sync --group dev && uvx ruff check .