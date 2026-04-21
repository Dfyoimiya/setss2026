"""
Author: K-ON! Team
文件描述: 集成测试 — 健康检查与基础端点
"""

import httpx


class TestHealthCheck:
    """后端服务存活检测"""

    def test_root_endpoint(self, api: httpx.Client):
        """GET / 返回服务版本信息"""
        resp = api.get("/")
        assert resp.status_code == 200
        data = resp.json()
        assert "SETSS 2026" in data["message"]
        assert "version" in data

    def test_health_endpoint(self, api: httpx.Client):
        """GET /health 返回 ok"""
        resp = api.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"

    def test_openapi_docs_available(self, api: httpx.Client):
        """Swagger UI 可访问（验证 FastAPI 正常启动）"""
        resp = api.get("/docs")
        assert resp.status_code == 200
