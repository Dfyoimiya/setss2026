# ---------- 阶段1：基础 + 依赖 ----------
FROM python:3.12-slim-bookworm AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
ENV PATH="/app/.venv/bin:$PATH"

# ---------- 阶段2：开发/测试（含 dev 依赖） ----------
FROM base AS dev
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --group dev
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ---------- 阶段3：生产 ----------
FROM base AS prod
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-group dev
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
