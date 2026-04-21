"""
Author: K-ON! Team
文件描述: 集成测试 — 公告与系统配置
"""

import httpx

from tests.integration.conftest import ANN1_ID, ANN4_ID


class TestAnnouncements:
    """公告读取测试"""

    def test_list_announcements_public(self, api: httpx.Client):
        """匿名用户可获取已发布公告列表"""
        resp = api.get("/api/v1/announcements/")
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert data["total"] >= 3          # 至少3条已发布公告
        assert data["page"] == 1
        # 确认未发布公告不在列表中
        ids = [item["id"] for item in data["items"]]
        assert ANN4_ID not in ids, "未发布公告不应出现在公开列表"

    def test_get_published_announcement(self, api: httpx.Client):
        """获取单条已发布公告"""
        resp = api.get(f"/api/v1/announcements/{ANN1_ID}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == ANN1_ID
        assert data["is_published"] is True
        assert "SETSS 2026" in data["title"]

    def test_get_unpublished_announcement_returns_404(self, api: httpx.Client):
        """获取未发布公告应返回 404（公开 API）"""
        resp = api.get(f"/api/v1/announcements/{ANN4_ID}")
        assert resp.status_code == 404

    def test_list_announcements_pagination(self, api: httpx.Client):
        """分页参数测试"""
        resp = api.get("/api/v1/announcements/?page=1&size=1")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) <= 1
        assert data["size"] == 1

    def test_create_announcement_admin(self, api: httpx.Client, admin_headers):
        """管理员可以创建公告"""
        resp = api.post("/api/v1/announcements/", json={
            "title": "集成测试公告",
            "content": "这是集成测试自动创建的公告，可安全删除。",
            "is_published": True,
        }, headers=admin_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "集成测试公告"
        return data["id"]

    def test_create_announcement_non_admin_forbidden(self, api: httpx.Client, author1_headers):
        """普通用户无法创建公告"""
        resp = api.post("/api/v1/announcements/", json={
            "title": "越权公告", "content": "Not allowed", "is_published": True,
        }, headers=author1_headers)
        assert resp.status_code == 403

    def test_create_announcement_unauthenticated_forbidden(self, api: httpx.Client):
        """未登录无法创建公告"""
        resp = api.post("/api/v1/announcements/", json={
            "title": "匿名公告", "content": "Not allowed", "is_published": True,
        })
        assert resp.status_code == 401


class TestSystemConfig:
    """系统配置测试"""

    def test_get_public_configs(self, api: httpx.Client):
        """匿名用户可获取公开配置"""
        resp = api.get("/api/v1/config/")
        assert resp.status_code == 200
        configs = {c["key"]: c["value"] for c in resp.json()}
        assert "submission_deadline" in configs
        assert "conference_venue" in configs
        assert configs["conference_venue"] == "西南大学 行政楼报告厅"

    def test_get_single_config(self, api: httpx.Client):
        """获取单个配置项"""
        resp = api.get("/api/v1/config/submission_deadline")
        assert resp.status_code == 200
        assert resp.json()["value"] == "2026-06-01"

    def test_get_nonexistent_config(self, api: httpx.Client):
        """不存在的 key 返回 404"""
        resp = api.get("/api/v1/config/nonexistent_key_xyz")
        assert resp.status_code == 404

    def test_admin_update_config(self, api: httpx.Client, admin_headers):
        """管理员可修改配置"""
        resp = api.put("/api/v1/admin/config/conference_venue", json={
            "value": "西南大学 图书馆报告厅（更新测试）",
            "description": "会议地点（集成测试更新）",
        }, headers=admin_headers)
        assert resp.status_code == 200
        assert "图书馆" in resp.json()["value"]

        # 恢复原值
        api.put("/api/v1/admin/config/conference_venue", json={
            "value": "西南大学 行政楼报告厅",
        }, headers=admin_headers)

    def test_non_admin_cannot_update_config(self, api: httpx.Client, author1_headers):
        """普通用户不能修改系统配置"""
        resp = api.put("/api/v1/admin/config/submission_deadline", json={
            "value": "2099-01-01",
        }, headers=author1_headers)
        assert resp.status_code == 403
