"""
Author: K-ON! Team
最后修改时间: 2026-04-16
文件描述: SQLAlchemy ORM 数据模型定义
"""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    # 角色字符串，逗号分隔，如 "author,reviewer"
    # 可选值: author | reviewer | admin | attendee
    role = Column(String, default="author", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    papers = relationship(
        "Paper", back_populates="submitter", foreign_keys="Paper.submitter_id"
    )
    reviews_given = relationship("Review", back_populates="reviewer")
    registration = relationship("Registration", back_populates="user", uselist=False)
    announcements = relationship("Announcement", back_populates="author")


class Paper(Base):
    __tablename__ = "papers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    submission_number = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=False)
    keywords = Column(String, nullable=False)  # 逗号分隔
    topic = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    camera_ready_path = Column(String, nullable=True)
    # submitted | under_review | accepted | rejected | revision_required
    status = Column(String, default="submitted", nullable=False)
    submitter_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    submitter = relationship(
        "User", back_populates="papers", foreign_keys=[submitter_id]
    )
    co_authors = relationship(
        "PaperAuthor", back_populates="paper", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "Review", back_populates="paper", cascade="all, delete-orphan"
    )


class PaperAuthor(Base):
    """论文合作者（含通讯作者标记）"""

    __tablename__ = "paper_authors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    institution = Column(String, nullable=True)
    is_corresponding = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0, nullable=False)

    paper = relationship("Paper", back_populates="co_authors")


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("paper_id", "reviewer_id", name="uq_paper_reviewer"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    paper_id = Column(String, ForeignKey("papers.id"), nullable=False)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=True)  # 1-5，未提交时为 None
    comments = Column(Text, nullable=True)
    # accept | reject | revise
    recommendation = Column(String, nullable=True)
    # pending | submitted
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    paper = relationship("Paper", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews_given")


class Registration(Base):
    """参会注册信息"""

    __tablename__ = "registrations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    confirmation_code = Column(String, unique=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    # student | regular | speaker | virtual
    registration_type = Column(String, nullable=False)
    institution = Column(String, nullable=True)
    position = Column(String, nullable=True)
    dietary_preference = Column(String, nullable=True)
    # pending | confirmed | cancelled
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="registration")


class Announcement(Base):
    """会议公告"""

    __tablename__ = "announcements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User", back_populates="announcements")


class SystemConfig(Base):
    """系统配置键值对，存储日期、场地、主题列表等"""

    __tablename__ = "system_configs"

    key = Column(String, primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(String, nullable=True)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
