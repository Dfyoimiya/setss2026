"""
Author: K-ON! Team
文件描述: 论文投稿 CRUD 操作
"""

from sqlalchemy.orm import Session

from app import models, schemas


def generate_submission_number(db: Session) -> str:
    count = db.query(models.Paper).count()
    return f"SETSS-{count + 1:04d}"


def get_papers_by_user(
    db: Session, user_id: str, skip: int = 0, limit: int = 20
) -> tuple[list[models.Paper], int]:
    query = db.query(models.Paper).filter(models.Paper.submitter_id == user_id)
    total = query.count()
    return query.order_by(models.Paper.created_at.desc()).offset(skip).limit(
        limit
    ).all(), total


def get_all_papers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status: str | None = None,
    topic: str | None = None,
) -> tuple[list[models.Paper], int]:
    query = db.query(models.Paper)
    if status:
        query = query.filter(models.Paper.status == status)
    if topic:
        query = query.filter(models.Paper.topic == topic)
    total = query.count()
    return query.order_by(models.Paper.created_at.desc()).offset(skip).limit(
        limit
    ).all(), total


def get_paper(db: Session, paper_id: str) -> models.Paper | None:
    return db.query(models.Paper).filter(models.Paper.id == paper_id).first()


def create_paper(
    db: Session,
    title: str,
    abstract: str,
    keywords: str,
    topic: str,
    submitter_id: str,
    co_authors: list[schemas.PaperAuthorCreate] | None = None,
) -> models.Paper:
    submission_number = generate_submission_number(db)
    db_paper = models.Paper(
        submission_number=submission_number,
        title=title,
        abstract=abstract,
        keywords=keywords,
        topic=topic,
        submitter_id=submitter_id,
    )
    db.add(db_paper)
    db.flush()  # 获取 id

    if co_authors:
        for author_data in co_authors:
            db_author = models.PaperAuthor(
                paper_id=db_paper.id,
                name=author_data.name,
                email=author_data.email,
                institution=author_data.institution,
                is_corresponding=author_data.is_corresponding,
                order=author_data.order,
            )
            db.add(db_author)

    db.commit()
    db.refresh(db_paper)
    return db_paper


def update_paper_metadata(
    db: Session,
    paper: models.Paper,
    title: str | None = None,
    abstract: str | None = None,
    keywords: str | None = None,
    topic: str | None = None,
) -> models.Paper:
    if title is not None:
        paper.title = title
    if abstract is not None:
        paper.abstract = abstract
    if keywords is not None:
        paper.keywords = keywords
    if topic is not None:
        paper.topic = topic
    db.commit()
    db.refresh(paper)
    return paper


def update_paper_file(db: Session, paper: models.Paper, file_path: str) -> models.Paper:
    paper.file_path = file_path
    db.commit()
    db.refresh(paper)
    return paper


def update_camera_ready(
    db: Session, paper: models.Paper, file_path: str
) -> models.Paper:
    paper.camera_ready_path = file_path
    db.commit()
    db.refresh(paper)
    return paper


def update_paper_status(db: Session, paper: models.Paper, status: str) -> models.Paper:
    paper.status = status
    db.commit()
    db.refresh(paper)
    return paper
