FROM python:3.12-slim

# 安装 curl 以支持 docker-compose.test.yml 中的 healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache

COPY ./app /app/app

EXPOSE 8001

CMD ["uv", "run", "uvicorn", "app.gateway.app:app", "--host", "0.0.0.0", "--port", "8001"]