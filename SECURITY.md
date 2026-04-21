# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in SETSS 2026, please report it responsibly.

**Do NOT** open a public Issue for security-related bugs.

Instead, please send an email to the team lead with the following details:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact assessment
- Suggested fix (if any)

We aim to respond within **48 hours** and will keep you updated on the remediation progress.

## Security Best Practices for Deployers

1. **Never use default secrets** — Always regenerate `SECRET_KEY`, database passwords, and MinIO credentials before deploying to production.
2. **Keep dependencies up to date** — Regularly run `npm audit` and `pip-audit` (or equivalent) to check for known vulnerabilities.
3. **Enable HTTPS** — All production deployments must use TLS/SSL.
4. **Restrict CORS** — Do not use `allow_origins=["*"]` in production.
5. **Validate file uploads** — Ensure uploaded files are type-checked and size-limited.
6. **Use environment variables** — Never commit `.env` files containing real credentials.
7. **Enable audit logging** — Log authentication attempts and sensitive operations.

## Current Security Measures

- Passwords hashed with bcrypt
- JWT-based authentication with configurable expiration
- SQL injection prevention via SQLAlchemy ORM
- File upload size and type restrictions
- Input validation via Pydantic schemas
