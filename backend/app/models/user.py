import uuid

from sqlalchemy import Boolean, Column, DateTime, String, func

from app.core.database import Base


class User(Base):
    """ "Model representing a user in the system.

    Attributes:
        id: Unique identifier for the user.
        email: User's email address (must be unique).
        hashed_password: Hashed password for authentication.
        full_name: User's full name.
        institution: User's affiliated institution.
        role: User's role in the system (e.g., admin, organizer, speaker, participant).
        is_active: Whether the user's account is active.
        email_verified: Whether the user's email has been verified.
        email_verify_token: Token used for email verification.
        password_reset_token: Token used for password reset.
        password_reset_expires: Expiration time for the password reset token.
        created_at: Timestamp when the user account was created.
        updated_at: Timestamp when the user account was last updated.
    """

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    # Roles: admin | organizer | speaker | participant (comma-separated for multi-role)
    role = Column(String, default="participant", nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    email_verify_token = Column(String, nullable=True, index=True)
    password_reset_token = Column(String, nullable=True, index=True)
    password_reset_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
