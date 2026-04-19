"""
Author: K-ON! Team
文件描述: 集成测试 — 论文投稿、查询与权限控制
"""

import io
import httpx
import pytest

from tests.integration.conftest import (
    AUTHOR1_ID, AUTHOR2_ID,
    PAPER1_ID, PAPER2_ID, PAPER3_ID, PAPER4_ID, PAPER5_ID,
)

# 最小合法 PDF（1字节 header 不合法，用 application/octet-stream 绕过类型检查）
DUMMY_PDF = b"%PDF-1.4 1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"


class TestPaperList:
    """投稿列表测试"""

    def test_list_my_papers_author1(self, api: httpx.Client, author1_headers):
        """author1 能看到自己的 2 篇论文"""
        resp = api.get("/api/v1/papers/", headers=author1_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        ids = [p["id"] for p in data["items"]]
        assert PAPER1_ID in ids
        assert PAPER2_ID in ids

    def test_list_my_papers_author2(self, api: httpx.Client, author2_headers):
        """author2 能看到自己的 3 篇论文"""
        resp = api.get("/api/v1/papers/", headers=author2_headers)
        assert resp.status_code == 200
        assert resp.json()["total"] == 3

    def test_list_papers_unauthenticated(self, api: httpx.Client):
        """未登录不能访问论文列表"""
        resp = api.get("/api/v1/papers/")
        assert resp.status_code == 401


class TestPaperDetail:
    """论文详情与权限测试"""

    def test_owner_can_view_own_paper(self, api: httpx.Client, author1_headers):
        """投稿人可查看自己的论文完整信息"""
        resp = api.get(f"/api/v1/papers/{PAPER1_ID}", headers=author1_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["submitter_id"] == AUTHOR1_ID
        assert "abstract" in data
        assert "co_authors" in data

    def test_reviewer_sees_blind_info(self, api: httpx.Client, reviewer1_headers):
        """审稿人看到双盲版本，不含作者 ID"""
        resp = api.get(f"/api/v1/papers/{PAPER1_ID}", headers=reviewer1_headers)
        assert resp.status_code == 200
        data = resp.json()
        # 双盲响应不包含 submitter_id
        assert "submitter_id" not in data, "审稿人不应看到提交者信息"

    def test_admin_can_view_any_paper(self, api: httpx.Client, admin_headers):
        """管理员可查看任意论文完整信息"""
        resp = api.get(f"/api/v1/papers/{PAPER3_ID}", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["submitter_id"] == AUTHOR2_ID

    def test_other_author_cannot_view(self, api: httpx.Client, author1_headers):
        """author1 不能查看 author2 的论文"""
        resp = api.get(f"/api/v1/papers/{PAPER3_ID}", headers=author1_headers)
        assert resp.status_code == 403

    def test_paper_not_found(self, api: httpx.Client, admin_headers):
        """不存在的论文 ID 返回 404"""
        resp = api.get("/api/v1/papers/nonexistent-paper-id", headers=admin_headers)
        assert resp.status_code == 404


class TestPaperSubmit:
    """论文投稿（multipart/form-data）测试"""

    def test_submit_paper_success(self, api: httpx.Client, author1_headers):
        """成功提交论文（含 PDF 上传）"""
        files = {"file": ("test.pdf", io.BytesIO(DUMMY_PDF), "application/pdf")}
        data = {
            "title": "集成测试论文标题",
            "abstract": "这是集成测试自动生成的摘要，用于验证论文投稿接口。",
            "keywords": "集成测试,自动化,FastAPI",
            "topic": "软件工程方法与实践",
            "co_authors": "[]",
        }
        resp = api.post("/api/v1/papers/", data=data, files=files, headers=author1_headers)
        assert resp.status_code == 201, f"投稿失败: {resp.text}"
        paper = resp.json()
        assert paper["title"] == "集成测试论文标题"
        assert paper["status"] == "submitted"
        assert paper["submitter_id"] == AUTHOR1_ID
        assert paper["submission_number"].startswith("SETSS-")
        return paper["id"]

    def test_submit_paper_unauthenticated(self, api: httpx.Client):
        """未登录无法投稿"""
        files = {"file": ("test.pdf", io.BytesIO(DUMMY_PDF), "application/pdf")}
        data = {"title": "t", "abstract": "a", "keywords": "k", "topic": "其他", "co_authors": "[]"}
        resp = api.post("/api/v1/papers/", data=data, files=files)
        assert resp.status_code == 401

    def test_submit_non_pdf_rejected(self, api: httpx.Client, author1_headers):
        """上传非 PDF 文件应被拒绝"""
        files = {"file": ("test.txt", io.BytesIO(b"plain text"), "text/plain")}
        data = {"title": "t", "abstract": "a", "keywords": "k", "topic": "其他", "co_authors": "[]"}
        resp = api.post("/api/v1/papers/", data=data, files=files, headers=author1_headers)
        assert resp.status_code == 400

    def test_update_paper_metadata_by_owner(self, api: httpx.Client, author1_headers):
        """投稿人可修改 submitted 状态的论文元数据"""
        resp = api.put(f"/api/v1/papers/{PAPER2_ID}", params={
            "title": "更新后标题（集成测试）",
        }, headers=author1_headers)
        assert resp.status_code == 200
        assert resp.json()["title"] == "更新后标题（集成测试）"

    def test_update_accepted_paper_rejected(self, api: httpx.Client, author2_headers):
        """已接受（accepted）的论文不允许再修改元数据"""
        resp = api.put(f"/api/v1/papers/{PAPER3_ID}", params={
            "title": "试图修改已接受论文",
        }, headers=author2_headers)
        assert resp.status_code == 400

    def test_update_paper_by_non_owner_forbidden(self, api: httpx.Client, author2_headers):
        """非投稿人不能修改论文"""
        resp = api.put(f"/api/v1/papers/{PAPER2_ID}", params={
            "title": "越权修改",
        }, headers=author2_headers)
        assert resp.status_code == 403


class TestAdminPaperManagement:
    """管理员论文管理测试"""

    def test_admin_list_all_papers(self, api: httpx.Client, admin_headers):
        """管理员可获取全部论文列表"""
        resp = api.get("/api/v1/admin/papers/", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 5

    def test_admin_filter_papers_by_status(self, api: httpx.Client, admin_headers):
        """管理员可按状态过滤论文"""
        resp = api.get("/api/v1/admin/papers/?status=accepted", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        for paper in data["items"]:
            assert paper["status"] == "accepted"

    def test_admin_export_papers_csv(self, api: httpx.Client, admin_headers):
        """管理员可导出 CSV"""
        resp = api.get("/api/v1/admin/papers/export", headers=admin_headers)
        assert resp.status_code == 200
        assert "text/csv" in resp.headers["content-type"]
        content = resp.content.decode("utf-8-sig")
        assert "投稿编号" in content
        assert "SETSS-0001" in content

    def test_admin_update_paper_status(self, api: httpx.Client, admin_headers):
        """管理员可修改论文状态"""
        # 将论文5从 rejected 改回 submitted（用于测试，不影响其他测试）
        resp = api.patch(f"/api/v1/admin/papers/{PAPER5_ID}/status",
                         json={"status": "submitted"},
                         headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "submitted"
        # 改回原始状态
        api.patch(f"/api/v1/admin/papers/{PAPER5_ID}/status",
                  json={"status": "rejected"},
                  headers=admin_headers)

    def test_admin_assign_and_remove_reviewer(self, api: httpx.Client, admin_headers):
        """管理员分配审稿人，再删除分配"""
        # paper2 目前没有 reviewer1 的分配（reviewer1 审的是 paper1）
        # 先分配
        assign_resp = api.post(
            f"/api/v1/admin/papers/{PAPER2_ID}/assign-reviewer",
            json={"reviewer_id": REVIEWER1_ID},
            headers=admin_headers,
        )
        assert assign_resp.status_code == 200

        # 再分配同一人应失败
        dup_resp = api.post(
            f"/api/v1/admin/papers/{PAPER2_ID}/assign-reviewer",
            json={"reviewer_id": REVIEWER1_ID},
            headers=admin_headers,
        )
        assert dup_resp.status_code == 400

        # 删除分配
        del_resp = api.delete(
            f"/api/v1/admin/papers/{PAPER2_ID}/assign-reviewer/{REVIEWER1_ID}",
            headers=admin_headers,
        )
        assert del_resp.status_code == 200

    def test_non_admin_cannot_access_admin_papers(self, api: httpx.Client, author1_headers):
        """普通用户不能访问管理端论文接口"""
        resp = api.get("/api/v1/admin/papers/", headers=author1_headers)
        assert resp.status_code == 403


# 需要在 conftest 中暴露 REVIEWER1_ID
from tests.integration.conftest import REVIEWER1_ID
