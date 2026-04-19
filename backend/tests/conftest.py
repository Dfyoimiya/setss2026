"""
Author: K-ON! Team
文件描述: pytest fixtures，使用 SQLite 内存数据库隔离测试
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db

SQLALCHEMY_TEST_URL = "sqlite:///./test_setss.db"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine_test)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine_test)


@pytest.fixture(scope="function")
def client(db):
    # 构建测试 app：先 patch 掉 database.engine，再导入 app
    import app.database as db_module

    original_engine = db_module.engine
    db_module.engine = engine_test

    from app.gateway.app import app

    # 覆盖 DB 依赖
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app, raise_server_exceptions=True) as c:
        yield c

    app.dependency_overrides.clear()
    db_module.engine = original_engine
