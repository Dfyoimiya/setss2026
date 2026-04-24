# ---------- Stage 1: base ----------
FROM python:3.12-slim-bookworm AS base
RUN pip install uv --index-url https://pypi.tuna.tsinghua.edu.cn/simple
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
ENV PATH="/app/.venv/bin:$PATH"

# ---------- Stage 2: dev (with dev deps) ----------
FROM base AS dev
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --group dev
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]

# ---------- Stage 3: prod ----------
FROM base AS prod
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-group dev
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
