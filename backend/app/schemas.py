"""
Author: K-ON! Team
最后修改时间: 2026-04-16
文件描述: Pydantic v2 数据 Schema，用于 API 请求/响应验证
"""

from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, EmailStr

# ─────────────────────────────────────────────
# 通用分页
# ─────────────────────────────────────────────

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    size: int


# ─────────────────────────────────────────────
# 认证
# ─────────────────────────────────────────────


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ─────────────────────────────────────────────
# 用户
# ─────────────────────────────────────────────


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    institution: str | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    institution: str | None = None
    phone: str | None = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


class UserResponse(BaseModel):
    id: str
    email: str

    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    id: str
    email: str
    full_name: str | None
    institution: str | None
    phone: str | None
    role: str
    is_active: bool
    created_at: datetime | None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# 公告
# ─────────────────────────────────────────────


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    is_published: bool = True


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    is_published: bool | None = None


class AnnouncementResponse(BaseModel):
    id: str
    title: str
    content: str
    is_published: bool
    author_id: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# 系统配置
# ─────────────────────────────────────────────


class ConfigUpdate(BaseModel):
    value: str
    description: str | None = None


class ConfigResponse(BaseModel):
    key: str
    value: str
    description: str | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# 论文
# ─────────────────────────────────────────────


class PaperAuthorCreate(BaseModel):
    name: str
    email: str
    institution: str | None = None
    is_corresponding: bool = False
    order: int = 0


class PaperAuthorResponse(BaseModel):
    id: str
    name: str
    email: str
    institution: str | None
    is_corresponding: bool
    order: int

    class Config:
        from_attributes = True


class PaperResponse(BaseModel):
    """完整论文信息（作者和管理员可见）"""

    id: str
    submission_number: str
    title: str
    abstract: str
    keywords: str
    topic: str
    status: str
    submitter_id: str
    file_path: str | None
    camera_ready_path: str | None
    created_at: datetime | None
    updated_at: datetime | None
    co_authors: list[PaperAuthorResponse] = []

    class Config:
        from_attributes = True


class PaperBlindResponse(BaseModel):
    """双盲信息（审稿人可见，不含作者信息）"""

    id: str
    submission_number: str
    title: str
    abstract: str
    keywords: str
    topic: str

    class Config:
        from_attributes = True


class PaperStatusUpdate(BaseModel):
    status: str


# ─────────────────────────────────────────────
# 审稿
# ─────────────────────────────────────────────


class ReviewResponse(BaseModel):
    id: str
    paper_id: str
    reviewer_id: str
    score: int | None
    comments: str | None
    recommendation: str | None
    status: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


class ReviewWithPaperResponse(BaseModel):
    """审稿人视角：含双盲论文信息"""

    id: str
    paper: PaperBlindResponse
    score: int | None
    comments: str | None
    recommendation: str | None
    status: str

    class Config:
        from_attributes = True


class ReviewSubmit(BaseModel):
    score: int  # 1-5
    comments: str
    recommendation: str  # accept | reject | revise


# ─────────────────────────────────────────────
# 参会注册
# ─────────────────────────────────────────────


class RegistrationCreate(BaseModel):
    registration_type: str  # student | regular | speaker | virtual
    institution: str | None = None
    position: str | None = None
    dietary_preference: str | None = None


class RegistrationUpdate(BaseModel):
    institution: str | None = None
    position: str | None = None
    dietary_preference: str | None = None
    registration_type: str | None = None


class RegistrationResponse(BaseModel):
    id: str
    confirmation_code: str
    user_id: str
    registration_type: str
    institution: str | None
    position: str | None
    dietary_preference: str | None
    status: str
    created_at: datetime | None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────────
# 管理员
# ─────────────────────────────────────────────


class RoleUpdate(BaseModel):
    role: str


class StatusUpdate(BaseModel):
    is_active: bool


class AssignReviewerRequest(BaseModel):
    reviewer_id: str


class MessageResponse(BaseModel):
    message: str
    data: Any = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class DownloadUrlResponse(BaseModel):
    url: str
    filename: str


class AdminStatsResponse(BaseModel):
    total_users: int
    total_papers: int
    papers_by_status: dict[str, int]
    total_reviews: int
    pending_reviews: int
    total_registrations: int
    registrations_by_type: dict[str, int]
