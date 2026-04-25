from sqlalchemy.orm import Session

from app.models.submission_file import SubmissionFile


def get(db: Session, file_id: str) -> SubmissionFile | None:
    return db.query(SubmissionFile).filter(SubmissionFile.id == file_id).first()


def get_current_by_submission(db: Session, submission_id: str) -> SubmissionFile | None:
    return (
        db.query(SubmissionFile)
        .filter(
            SubmissionFile.submission_id == submission_id,
            SubmissionFile.is_current == True,  # noqa: E712
        )
        .first()
    )


def get_by_submission(
    db: Session, submission_id: str, skip: int = 0, limit: int = 100
) -> list[SubmissionFile]:
    return (
        db.query(SubmissionFile)
        .filter(SubmissionFile.submission_id == submission_id)
        .order_by(SubmissionFile.version.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create(
    db: Session,
    submission_id: str,
    file_name: str,
    minio_key: str,
    file_size: int,
    version: int = 1,
) -> SubmissionFile:
    # Mark previous current files as not current
    db.query(SubmissionFile).filter(
        SubmissionFile.submission_id == submission_id,
        SubmissionFile.is_current == True,  # noqa: E712
    ).update({"is_current": False})

    db_obj = SubmissionFile(
        submission_id=submission_id,
        file_name=file_name,
        minio_key=minio_key,
        file_size=file_size,
        version=version,
        is_current=True,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_next_version(db: Session, submission_id: str) -> int:
    latest = (
        db.query(SubmissionFile)
        .filter(SubmissionFile.submission_id == submission_id)
        .order_by(SubmissionFile.version.desc())
        .first()
    )
    return (latest.version + 1) if latest else 1


def delete(db: Session, db_obj: SubmissionFile) -> None:
    db.delete(db_obj)
    db.commit()
