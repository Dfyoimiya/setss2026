'''
Author: Finley
创建时间: 2026-04-02 08:41:53
最后修改时间: 2026-04-02 08:45:09
文件路径: /setss_2026/backend/app/database.py
文件描述: 
'''
"""
Author: Finley
创建时间: 2026-03-31 18:09:21
最后修改时间: 2026-03-31 18:09:21
文件路径: /backend/app/database.py
文件描述：
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


SQLALCHEMY_DATABASE_URL = "postgresql://setss_user:setss_password@postgres:5432/setss_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# 获取数据库会话的依赖函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
