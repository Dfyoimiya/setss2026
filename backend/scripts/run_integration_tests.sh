#!/usr/bin/env bash
# =============================================================================
# run_integration_tests.sh — 一键运行集成测试
# =============================================================================
# 用法：
#   cd backend/
#   bash scripts/run_integration_tests.sh [pytest 额外参数...]
#
# 示例：
#   bash scripts/run_integration_tests.sh                        # 运行全部集成测试
#   bash scripts/run_integration_tests.sh -k test_health         # 只运行 health 测试
#   bash scripts/run_integration_tests.sh tests/integration/test_papers.py -v
#
# 环境变量（可选覆盖）：
#   COMPOSE_FILE  — docker-compose 配置文件（默认 docker-compose.test.yml）
#   BASE_URL      — 测试 API 基地址（默认 http://localhost:8002）
#   WAIT_TIMEOUT  — 最长等待后端就绪秒数（默认 120）
# =============================================================================

set -euo pipefail

# --------------------------------------------------------------------------- #
# 配置
# --------------------------------------------------------------------------- #
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-${BACKEND_DIR}/docker-compose.test.yml}"
BASE_URL="${BASE_URL:-http://localhost:8002}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-120}"
PYTEST_EXTRA_ARGS=("$@")          # 转发给 pytest 的额外参数

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'   # No Color

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# --------------------------------------------------------------------------- #
# 保证退出时清理 compose stack
# --------------------------------------------------------------------------- #
cleanup() {
    local exit_code=$?
    echo ""
    info "清理测试环境..."
    docker compose -f "${COMPOSE_FILE}" down --volumes --remove-orphans 2>/dev/null || true
    if [[ $exit_code -eq 0 ]]; then
        success "集成测试全部通过 ✓"
    else
        error "集成测试失败（exit code: ${exit_code}）"
    fi
    exit $exit_code
}
trap cleanup EXIT

# --------------------------------------------------------------------------- #
# 1. 检查依赖
# --------------------------------------------------------------------------- #
info "检查依赖工具..."

for cmd in docker uv; do
    if ! command -v "$cmd" &>/dev/null; then
        error "未找到命令: $cmd"
        exit 1
    fi
done

if ! docker compose version &>/dev/null; then
    error "需要 Docker Compose v2（docker compose 子命令）"
    exit 1
fi

success "依赖检查通过（docker, uv）"

# --------------------------------------------------------------------------- #
# 2. 切换到 backend 目录
# --------------------------------------------------------------------------- #
cd "${BACKEND_DIR}"
info "工作目录: ${BACKEND_DIR}"

# --------------------------------------------------------------------------- #
# 3. 停止可能残留的旧容器
# --------------------------------------------------------------------------- #
info "清理可能残留的旧测试容器..."
docker compose -f "${COMPOSE_FILE}" down --volumes --remove-orphans 2>/dev/null || true

# --------------------------------------------------------------------------- #
# 4. 构建并启动测试环境
# --------------------------------------------------------------------------- #
info "构建并启动测试环境（${COMPOSE_FILE}）..."
docker compose -f "${COMPOSE_FILE}" up --build -d

# --------------------------------------------------------------------------- #
# 5. 等待后端健康检查通过
# --------------------------------------------------------------------------- #
info "等待后端服务就绪（最长 ${WAIT_TIMEOUT}s）..."

ELAPSED=0
INTERVAL=3
until curl -sf "${BASE_URL}/health" > /dev/null 2>&1; do
    if [[ $ELAPSED -ge $WAIT_TIMEOUT ]]; then
        error "后端在 ${WAIT_TIMEOUT}s 内未就绪，放弃等待。"
        echo ""
        warn "=== postgres 容器日志 ==="
        docker compose -f "${COMPOSE_FILE}" logs postgres_test 2>/dev/null | tail -30 || true
        echo ""
        warn "=== backend 容器日志 ==="
        docker compose -f "${COMPOSE_FILE}" logs backend_test 2>/dev/null | tail -50 || true
        exit 1
    fi
    printf "  %-4s后端尚未就绪，等待 %ds...\r" "" $INTERVAL
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

success "后端已就绪（${BASE_URL}/health 返回 200）"

# --------------------------------------------------------------------------- #
# 6. 安装依赖（确保 httpx 等测试包已安装）
# --------------------------------------------------------------------------- #
info "同步 Python 依赖..."
uv sync --quiet

# --------------------------------------------------------------------------- #
# 7. 运行集成测试
# --------------------------------------------------------------------------- #
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "开始运行集成测试..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

INTEGRATION_BASE_URL="${BASE_URL}" \
PYTHONPATH=. \
uv run pytest tests/integration/ \
    -v \
    --tb=short \
    -m "integration or not integration" \
    "${PYTEST_EXTRA_ARGS[@]+"${PYTEST_EXTRA_ARGS[@]}"}"

# cleanup() 会在 EXIT trap 中执行
