"""
Author: K-ON! Team
文件描述: 集成测试 — 参会注册与管理员管理
"""

import uuid
import httpx
import pytest

from tests.integration.conftest import (
    ATTENDEE1_EMAIL, ATTENDEE1_PASSWORD,
    REG_AUTHOR1_ID, REG_ATTENDEE2_ID,
    AUTHOR1_ID, AUTHOR2_ID,
)


class TestRegistration:
    """参会注册测试"""

    def test_get_my_registration_author1(self, api: httpx.Client, author1_headers):
        """author1 可查看自己的报名信息（seed 数据中存在）"""
        resp = api.get("/api/v1/registrations/me", headers=author1_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["user_id"] == AUTHOR1_ID
        assert data["id"] == REG_AUTHOR1_ID
        assert data["registration_type"] == "regular"
        assert data["status"] == "pending"
        assert data["confirmation_code"].startswith("REG-")

    def test_get_registration_unauthenticated(self, api: httpx.Client):
        """未登录不能查看报名信息"""
        resp = api.get("/api/v1/registrations/me")
        assert resp.status_code == 401

    def test_new_user_register_for_conference(self, api: httpx.Client):
        """新用户可以报名参会（核心流程）"""
        email = f"reg_{uuid.uuid4().hex[:8]}@test.com"
        password = "Reg@2026!"
        # 注册账号
        api.post("/api/v1/users/register", json={"email": email, "password": password})
        token = api.post("/api/v1/users/login",
                         json={"email": email, "password": password}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 报名参会
        resp = api.post("/api/v1/registrations/", json={
            "registration_type": "student",
            "institution": "测试大学",
            "position": "硕士研究生",
            "dietary_preference": "素食",
        }, headers=headers)
        assert resp.status_code == 201, f"报名失败: {resp.text}"
        data = resp.json()
        assert data["registration_type"] == "student"
        assert data["status"] == "pending"
        assert data["confirmation_code"].startswith("REG-")

    def test_duplicate_registration_rejected(self, api: httpx.Client, author1_headers):
        """重复报名应被拒绝（author1 已在 seed 数据中报名）"""
        resp = api.post("/api/v1/registrations/", json={
            "registration_type": "virtual",
        }, headers=author1_headers)
        assert resp.status_code == 400
        assert "重复" in resp.json().get("detail", "") or "已报名" in resp.json().get("detail", "")

    def test_invalid_registration_type_rejected(self, api: httpx.Client):
        """无效的注册类型应被拒绝"""
        email = f"invtype_{uuid.uuid4().hex[:8]}@test.com"
        api.post("/api/v1/users/register", json={"email": email, "password": "T@123456"})
        token = api.post("/api/v1/users/login",
                         json={"email": email, "password": "T@123456"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        resp = api.post("/api/v1/registrations/", json={
            "registration_type": "vip_special",  # 非法类型
        }, headers=headers)
        assert resp.status_code == 400

    def test_update_registration(self, api: httpx.Client, author1_headers):
        """更新报名信息"""
        resp = api.patch("/api/v1/registrations/me", json={
            "dietary_preference": "无特殊要求（更新）",
        }, headers=author1_headers)
        assert resp.status_code == 200
        assert "更新" in resp.json()["dietary_preference"]

    def test_cancelled_registration_cannot_update(self, api: httpx.Client):
        """已取消的报名不能修改（attendee2 的报名是 cancelled）"""
        # attendee2 邮箱: attendee2@org.net / Attendee@2026
        token = api.post("/api/v1/users/login", json={
            "email": "attendee2@org.net", "password": "Attendee@2026",
        }).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        resp = api.patch("/api/v1/registrations/me", json={"dietary_preference": "none"}, headers=headers)
        assert resp.status_code == 400

    def test_get_me_no_registration_returns_404(self, api: httpx.Client):
        """未报名用户查询应返回 404"""
        email = f"noreg_{uuid.uuid4().hex[:8]}@test.com"
        api.post("/api/v1/users/register", json={"email": email, "password": "NoReg@2026"})
        token = api.post("/api/v1/users/login",
                         json={"email": email, "password": "NoReg@2026"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        resp = api.get("/api/v1/registrations/me", headers=headers)
        assert resp.status_code == 404


class TestAdminRegistrationManagement:
    """管理员注册管理测试"""

    def test_admin_list_all_registrations(self, api: httpx.Client, admin_headers):
        """管理员可获取所有报名记录"""
        resp = api.get("/api/v1/admin/registrations/", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 5

    def test_admin_confirm_registration(self, api: httpx.Client, admin_headers):
        """管理员可将 pending 报名改为 confirmed"""
        resp = api.patch(f"/api/v1/admin/registrations/{REG_AUTHOR1_ID}/status",
                         json={"status": "confirmed"}, headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "confirmed"
        # 恢复为 pending
        api.patch(f"/api/v1/admin/registrations/{REG_AUTHOR1_ID}/status",
                  json={"status": "pending"}, headers=admin_headers)

    def test_admin_invalid_status_rejected(self, api: httpx.Client, admin_headers):
        """无效状态值应被拒绝"""
        resp = api.patch(f"/api/v1/admin/registrations/{REG_AUTHOR1_ID}/status",
                         json={"status": "accepted"}, headers=admin_headers)
        assert resp.status_code == 400

    def test_non_admin_cannot_list_registrations(self, api: httpx.Client, author1_headers):
        """普通用户不能访问管理端注册列表"""
        resp = api.get("/api/v1/admin/registrations/", headers=author1_headers)
        assert resp.status_code == 403


class TestAdminUserManagement:
    """管理员用户管理测试"""

    def test_admin_list_users(self, api: httpx.Client, admin_headers):
        """管理员可获取用户列表"""
        resp = api.get("/api/v1/admin/users/", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 8

    def test_admin_update_user_role(self, api: httpx.Client, admin_headers):
        """管理员可修改用户角色"""
        # 将 attendee1 升级为 reviewer
        resp = api.patch(
            f"/api/v1/admin/users/00000000-0000-0000-0000-000000000007/role",
            json={"role": "reviewer"},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["role"] == "reviewer"
        # 恢复
        api.patch(
            f"/api/v1/admin/users/00000000-0000-0000-0000-000000000007/role",
            json={"role": "attendee"},
            headers=admin_headers,
        )

    def test_admin_disable_and_enable_user(self, api: httpx.Client, admin_headers):
        """管理员可禁用并重新启用用户"""
        # 禁用 author1
        resp = api.patch(
            f"/api/v1/admin/users/{AUTHOR1_ID}/status",
            json={"is_active": False},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["is_active"] is False

        # 重新启用
        resp2 = api.patch(
            f"/api/v1/admin/users/{AUTHOR1_ID}/status",
            json={"is_active": True},
            headers=admin_headers,
        )
        assert resp2.status_code == 200
        assert resp2.json()["is_active"] is True

    def test_non_admin_cannot_list_users(self, api: httpx.Client, author1_headers):
        """普通用户不能访问管理端用户列表"""
        resp = api.get("/api/v1/admin/users/", headers=author1_headers)
        assert resp.status_code == 403
