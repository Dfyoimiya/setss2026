"""
Author: K-ON! Team
文件描述: 集成测试 — 用户注册、登录与个人信息
         覆盖问题：新用户无法注册（数据库连接 / 表未创建）
"""

import uuid

import httpx

from tests.integration.conftest import (
    ADMIN_EMAIL,
    ADMIN_ID,
    ADMIN_PASSWORD,
    AUTHOR1_EMAIL,
    AUTHOR1_PASSWORD,
    DISABLED_EMAIL,
    DISABLED_PASSWORD,
)


class TestUserRegistration:
    """用户注册相关测试 — 重点验证数据库写入是否正常"""

    def test_register_new_user_success(self, api: httpx.Client):
        """新用户可以成功注册（核心功能，验证 PostgreSQL 写入）"""
        unique_email = f"new_user_{uuid.uuid4().hex[:8]}@test.com"
        resp = api.post("/api/v1/users/register", json={
            "email": unique_email,
            "password": "TestPass@123",
            "full_name": "新测试用户",
            "institution": "集成测试机构",
        })
        assert resp.status_code == 201, f"注册失败: {resp.text}"
        data = resp.json()
        assert data["email"] == unique_email
        assert data["full_name"] == "新测试用户"
        assert data["role"] == "author"       # 默认角色
        assert data["is_active"] is True
        assert "hashed_password" not in data  # 密码不应返回给客户端
        assert "id" in data

    def test_register_duplicate_email_rejected(self, api: httpx.Client):
        """重复邮箱注册应返回 400"""
        email = f"dup_{uuid.uuid4().hex[:8]}@test.com"
        # 第一次注册
        api.post("/api/v1/users/register", json={"email": email, "password": "Pass@1234"})
        # 第二次注册同一邮箱
        resp = api.post("/api/v1/users/register", json={"email": email, "password": "Other@9999"})
        assert resp.status_code == 400
        assert "邮箱" in resp.json().get("detail", "")

    def test_register_invalid_email_format(self, api: httpx.Client):
        """邮箱格式错误应返回 422 验证错误"""
        resp = api.post("/api/v1/users/register", json={
            "email": "not-an-email",
            "password": "Pass@1234",
        })
        assert resp.status_code == 422

    def test_register_missing_password(self, api: httpx.Client):
        """缺少密码字段应返回 422"""
        resp = api.post("/api/v1/users/register", json={
            "email": f"nopwd_{uuid.uuid4().hex[:6]}@test.com",
        })
        assert resp.status_code == 422

    def test_register_with_full_profile(self, api: httpx.Client):
        """携带完整个人信息注册"""
        resp = api.post("/api/v1/users/register", json={
            "email": f"full_{uuid.uuid4().hex[:8]}@test.com",
            "password": "FullPass@2026",
            "full_name": "完整资料用户",
            "institution": "某某大学",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["institution"] == "某某大学"


class TestUserLogin:
    """用户登录测试"""

    def test_login_seed_admin(self, api: httpx.Client):
        """种子管理员账号可以正常登录"""
        resp = api.post("/api/v1/users/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_seed_author(self, api: httpx.Client):
        """种子作者账号可以正常登录"""
        resp = api.post("/api/v1/users/login", json={
            "email": AUTHOR1_EMAIL,
            "password": AUTHOR1_PASSWORD,
        })
        assert resp.status_code == 200

    def test_login_wrong_password(self, api: httpx.Client):
        """密码错误返回 401"""
        resp = api.post("/api/v1/users/login", json={
            "email": AUTHOR1_EMAIL,
            "password": "WrongPassword!",
        })
        assert resp.status_code == 401

    def test_login_nonexistent_email(self, api: httpx.Client):
        """不存在的邮箱返回 401"""
        resp = api.post("/api/v1/users/login", json={
            "email": "ghost@nowhere.com",
            "password": "Any@pass123",
        })
        assert resp.status_code == 401

    def test_login_disabled_account(self, api: httpx.Client):
        """禁用账户登录应被拒绝（400 或 401）"""
        resp = api.post("/api/v1/users/login", json={
            "email": DISABLED_EMAIL,
            "password": DISABLED_PASSWORD,
        })
        assert resp.status_code in (400, 401)

    def test_login_newly_registered_user(self, api: httpx.Client):
        """刚注册的新用户可以立即登录（验证数据库事务提交）"""
        email = f"fresh_{uuid.uuid4().hex[:8]}@test.com"
        password = "Fresh@2026!"
        reg_resp = api.post("/api/v1/users/register", json={
            "email": email, "password": password,
        })
        assert reg_resp.status_code == 201
        # 立即登录
        login_resp = api.post("/api/v1/users/login", json={
            "email": email, "password": password,
        })
        assert login_resp.status_code == 200, "新注册用户应能立即登录"


class TestUserProfile:
    """个人信息读写测试"""

    def test_get_me_authenticated(self, api: httpx.Client, admin_headers):
        """携带有效 token 可获取自身信息"""
        resp = api.get("/api/v1/users/me", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["id"] == ADMIN_ID

    def test_get_me_unauthenticated(self, api: httpx.Client):
        """未携带 token 返回 401"""
        resp = api.get("/api/v1/users/me")
        assert resp.status_code == 401

    def test_get_me_invalid_token(self, api: httpx.Client):
        """伪造 token 返回 401"""
        resp = api.get("/api/v1/users/me", headers={"Authorization": "Bearer fake.token.here"})
        assert resp.status_code == 401

    def test_update_profile(self, api: httpx.Client):
        """更新个人信息并验证持久化"""
        # 新建一个专用测试用户
        email = f"upd_{uuid.uuid4().hex[:8]}@test.com"
        api.post("/api/v1/users/register", json={"email": email, "password": "Upd@2026!"})
        token = api.post("/api/v1/users/login", json={"email": email, "password": "Upd@2026!"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        resp = api.patch("/api/v1/users/me", json={
            "full_name": "更新后姓名",
            "institution": "更新后机构",
            "phone": "13999999999",
        }, headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["full_name"] == "更新后姓名"
        assert data["phone"] == "13999999999"

        # 重新 GET 验证数据库已持久化
        get_resp = api.get("/api/v1/users/me", headers=headers)
        assert get_resp.json()["institution"] == "更新后机构"

    def test_change_password_success(self, api: httpx.Client):
        """修改密码后可用新密码登录，旧密码失效"""
        email = f"pwd_{uuid.uuid4().hex[:8]}@test.com"
        old_pwd = "OldPass@2026"
        new_pwd = "NewPass@2026!"
        api.post("/api/v1/users/register", json={"email": email, "password": old_pwd})
        token = api.post("/api/v1/users/login", json={"email": email, "password": old_pwd}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 修改密码
        resp = api.post("/api/v1/users/me/change-password", json={
            "old_password": old_pwd, "new_password": new_pwd,
        }, headers=headers)
        assert resp.status_code == 200

        # 旧密码不能登录
        old_login = api.post("/api/v1/users/login", json={"email": email, "password": old_pwd})
        assert old_login.status_code == 401

        # 新密码可以登录
        new_login = api.post("/api/v1/users/login", json={"email": email, "password": new_pwd})
        assert new_login.status_code == 200

    def test_change_password_wrong_old(self, api: httpx.Client, author1_headers):
        """旧密码错误时修改失败"""
        resp = api.post("/api/v1/users/me/change-password", json={
            "old_password": "WrongOld@999",
            "new_password": "AnyNew@2026",
        }, headers=author1_headers)
        assert resp.status_code == 400
