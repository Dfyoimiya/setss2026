"""Root conftest — sets shared environment defaults only.

Database setup is handled per test suite:
- tests/unit/conftest.py  → in-memory SQLite
- tests/integration/conftest.py → real PostgreSQL (from DATABASE_URL env var)
"""

import os

os.environ.setdefault("SECRET_KEY", "test-secret")
