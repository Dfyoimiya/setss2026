"""
Author: K-ON! Team
文件描述: 集成测试 — 审稿流程
"""

import httpx

from tests.integration.conftest import (
    PAPER1_ID,
    REVIEW1_ID,
    REVIEW2_ID,
    REVIEWER1_ID,
)


class TestReviewList:
    """审稿任务列表测试"""

    def test_reviewer_list_assigned_reviews(self, api: httpx.Client, reviewer1_headers):
        """审稿人可获取分配给自己的审稿任务"""
        resp = api.get("/api/v1/reviews/assigned", headers=reviewer1_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 2   # reviewer1 被分配了 paper1 + paper3
        # 每个 item 包含双盲论文信息
        for item in data["items"]:
            assert "paper" in item
            assert "submission_number" in item["paper"]
            assert "submitter_id" not in item["paper"]

    def test_non_reviewer_cannot_list_reviews(self, api: httpx.Client, attendee1_headers):
        """普通与会者无法访问审稿任务列表"""
        resp = api.get("/api/v1/reviews/assigned", headers=attendee1_headers)
        assert resp.status_code == 403

    def test_unauthenticated_cannot_list_reviews(self, api: httpx.Client):
        """未登录不能访问审稿接口"""
        resp = api.get("/api/v1/reviews/assigned")
        assert resp.status_code == 401


class TestReviewDetail:
    """审稿详情测试"""

    def test_reviewer_can_view_own_review(self, api: httpx.Client, reviewer1_headers):
        """审稿人可查看自己的审稿记录"""
        resp = api.get(f"/api/v1/reviews/{REVIEW1_ID}", headers=reviewer1_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["reviewer_id"] == REVIEWER1_ID
        assert data["paper_id"] == PAPER1_ID
        assert data["status"] == "submitted"
        assert data["score"] == 4
        assert data["recommendation"] == "accept"

    def test_reviewer_cannot_view_other_review(self, api: httpx.Client, reviewer1_headers):
        """审稿人不能查看他人审稿记录"""
        # REVIEW2_ID 属于 reviewer2
        resp = api.get(f"/api/v1/reviews/{REVIEW2_ID}", headers=reviewer1_headers)
        assert resp.status_code == 403

    def test_admin_can_view_any_review(self, api: httpx.Client, admin_headers):
        """管理员可查看任意审稿记录"""
        resp = api.get(f"/api/v1/reviews/{REVIEW2_ID}", headers=admin_headers)
        assert resp.status_code == 200


class TestReviewSubmit:
    """提交 / 更新审稿意见测试"""

    def test_submit_pending_review(self, api: httpx.Client, reviewer2_headers):
        """审稿人提交待审状态的审稿意见"""
        # REVIEW2_ID 是 reviewer2 审 paper1，初始 pending
        resp = api.post(f"/api/v1/reviews/{REVIEW2_ID}/submit", json={
            "score": 3,
            "comments": "文章有一定创新性，但实验数据需要补充。",
            "recommendation": "revise",
        }, headers=reviewer2_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "submitted"
        assert data["score"] == 3
        assert data["recommendation"] == "revise"

    def test_submit_review_invalid_score(self, api: httpx.Client, reviewer2_headers):
        """评分超范围应被拒绝"""
        resp = api.post(f"/api/v1/reviews/{REVIEW2_ID}/submit", json={
            "score": 10,
            "comments": "invalid",
            "recommendation": "accept",
        }, headers=reviewer2_headers)
        assert resp.status_code == 400

    def test_submit_review_invalid_recommendation(self, api: httpx.Client, reviewer2_headers):
        """无效的 recommendation 值应被拒绝"""
        resp = api.post(f"/api/v1/reviews/{REVIEW2_ID}/submit", json={
            "score": 3,
            "comments": "ok",
            "recommendation": "maybe",  # 非法值
        }, headers=reviewer2_headers)
        assert resp.status_code == 400

    def test_wrong_reviewer_cannot_submit(self, api: httpx.Client, reviewer1_headers):
        """错误的审稿人不能提交他人的审稿"""
        resp = api.post(f"/api/v1/reviews/{REVIEW2_ID}/submit", json={
            "score": 5,
            "comments": "excellent",
            "recommendation": "accept",
        }, headers=reviewer1_headers)
        assert resp.status_code == 403

    def test_update_already_submitted_review(self, api: httpx.Client, reviewer1_headers):
        """已提交的审稿可以通过 PUT 更新"""
        resp = api.put(f"/api/v1/reviews/{REVIEW1_ID}", json={
            "score": 5,
            "comments": "更新后的意见：论文质量优秀，强烈推荐接受。",
            "recommendation": "accept",
        }, headers=reviewer1_headers)
        assert resp.status_code == 200
        assert resp.json()["score"] == 5


class TestAdminReviewManagement:
    """管理员审稿管理测试"""

    def test_admin_list_all_reviews(self, api: httpx.Client, admin_headers):
        """管理员可获取所有审稿记录"""
        resp = api.get("/api/v1/admin/reviews/", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 6

    def test_non_admin_cannot_list_all_reviews(self, api: httpx.Client, reviewer1_headers):
        """非管理员不能访问全局审稿列表"""
        resp = api.get("/api/v1/admin/reviews/", headers=reviewer1_headers)
        assert resp.status_code == 403
