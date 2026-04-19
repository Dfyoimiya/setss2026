"""
Author: K-ON! Team
文件描述: 集成测试 conftest — 连接正在运行的 Docker 后端服务
         运行前需先执行: docker compose -f docker-compose.test.yml up --build -d
"""

import os
import pytest
import httpx

# 从环境变量读取后端地址，默认指向 docker-compose.test.yml 映射的 8002 端口
BASE_URL = os.getenv("INTEGRATION_BASE_URL", "http://localhost:8002")

# ─────────────────────────────────────────────
# 种子数据中的固定账号（与 scripts/seed_data.sql 保持一致）
# ─────────────────────────────────────────────
ADMIN_EMAIL        = "admin@setss2026.edu"
ADMIN_PASSWORD     = "Admin@2026"

REVIEWER1_EMAIL    = "reviewer1@setss.edu"
REVIEWER1_PASSWORD = "Reviewer@2026"

REVIEWER2_EMAIL    = "reviewer2@setss.edu"
REVIEWER2_PASSWORD = "Reviewer@2026"

AUTHOR1_EMAIL      = "author1@university.edu"
AUTHOR1_PASSWORD   = "Author@2026"

AUTHOR2_EMAIL      = "author2@institute.org"
AUTHOR2_PASSWORD   = "Author@2026"

DISABLED_EMAIL     = "author3@college.edu"
DISABLED_PASSWORD  = "Author@2026"

ATTENDEE1_EMAIL    = "attendee1@company.com"
ATTENDEE1_PASSWORD = "Attendee@2026"

# 种子数据 UUID（与 seed_data.sql 对应）
ADMIN_ID           = "00000000-0000-0000-0000-000000000001"
REVIEWER1_ID       = "00000000-0000-0000-0000-000000000002"
REVIEWER2_ID       = "00000000-0000-0000-0000-000000000003"
AUTHOR1_ID         = "00000000-0000-0000-0000-000000000004"
AUTHOR2_ID         = "00000000-0000-0000-0000-000000000005"

PAPER1_ID          = "10000000-0000-0000-0000-000000000001"
PAPER2_ID          = "10000000-0000-0000-0000-000000000002"
PAPER3_ID          = "10000000-0000-0000-0000-000000000003"  # accepted
PAPER4_ID          = "10000000-0000-0000-0000-000000000004"  # revision_required
PAPER5_ID          = "10000000-0000-0000-0000-000000000005"  # rejected

REVIEW1_ID         = "30000000-0000-0000-0000-000000000001"  # reviewer1 审 paper1，已提交
REVIEW2_ID         = "30000000-0000-0000-0000-000000000002"  # reviewer2 审 paper1，待审

REG_AUTHOR1_ID     = "40000000-0000-0000-0000-000000000002"
REG_ATTENDEE2_ID   = "40000000-0000-0000-0000-000000000005"

ANN1_ID            = "50000000-0000-0000-0000-000000000001"
ANN4_ID            = "50000000-0000-0000-0000-000000000004"  # unpublished draft


@pytest.fixture(scope="session")
def api():
    """整个测试 session 共享一个 httpx 同步客户端"""
    with httpx.Client(base_url=BASE_URL, timeout=30) as client:
        yield client


def _login(api: httpx.Client, email: str, password: str) -> str:
    """登录并返回 Bearer token"""
    resp = api.post("/api/v1/users/login", json={"email": email, "password": password})
    assert resp.status_code == 200, f"登录失败 [{email}]: {resp.text}"
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(api):
    token = _login(api, ADMIN_EMAIL, ADMIN_PASSWORD)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def reviewer1_headers(api):
    token = _login(api, REVIEWER1_EMAIL, REVIEWER1_PASSWORD)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def reviewer2_headers(api):
    token = _login(api, REVIEWER2_EMAIL, REVIEWER2_PASSWORD)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def author1_headers(api):
    token = _login(api, AUTHOR1_EMAIL, AUTHOR1_PASSWORD)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def author2_headers(api):
    token = _login(api, AUTHOR2_EMAIL, AUTHOR2_PASSWORD)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="session")
def attendee1_headers(api):
    token = _login(api, ATTENDEE1_EMAIL, ATTENDEE1_PASSWORD)
    return {"Authorization": f"Bearer {token}"}
