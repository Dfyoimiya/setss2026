"""
Author: K-ON! Team
文件描述: 邮件发送服务，基于 SMTP，支持 SSL/TLS
"""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger(__name__)


def _send(to_email: str, subject: str, html_body: str) -> None:
    if not settings.email_enabled:
        logger.info(f"[Email disabled] To: {to_email} | Subject: {subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_user}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        if settings.smtp_ssl:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port) as server:
                server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(settings.smtp_user, to_email, msg.as_string())
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(settings.smtp_user, to_email, msg.as_string())
        logger.info(f"Email sent to {to_email}: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")


def send_verification_email(to_email: str, full_name: str, token: str) -> None:
    link = f"{settings.frontend_base_url}/verify-email?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#003a70">欢迎加入 SETSS 2026</h2>
      <p>您好，{full_name or to_email}，</p>
      <p>请点击下方链接验证您的邮箱地址，链接有效期 <strong>24 小时</strong>：</p>
      <p style="margin:24px 0">
        <a href="{link}" style="background:#1677ff;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px">
          验证邮箱
        </a>
      </p>
      <p style="color:#888;font-size:12px">如果您没有注册 SETSS 2026，请忽略此邮件。</p>
    </div>
    """
    _send(to_email, "【SETSS 2026】请验证您的邮箱", html)


def send_password_reset_email(to_email: str, full_name: str, token: str) -> None:
    link = f"{settings.frontend_base_url}/reset-password?token={token}"
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#003a70">SETSS 2026 密码重置</h2>
      <p>您好，{full_name or to_email}，</p>
      <p>我们收到了您的密码重置请求。请点击下方链接重置密码，链接有效期 <strong>1 小时</strong>：</p>
      <p style="margin:24px 0">
        <a href="{link}" style="background:#1677ff;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px">
          重置密码
        </a>
      </p>
      <p style="color:#888;font-size:12px">如果您没有发起此请求，请忽略此邮件。</p>
    </div>
    """
    _send(to_email, "【SETSS 2026】密码重置请求", html)


def send_paper_status_email(to_email: str, full_name: str, paper_title: str, status: str) -> None:
    status_map = {
        "accepted": ("录用通知", "#52c41a", "恭喜！您的论文已被接受。请登录系统上传最终版本（Camera-Ready）。"),
        "rejected": ("拒稿通知", "#ff4d4f", "感谢您的投稿。经过评审，您的论文未能被本次会议接受。"),
        "revision_required": ("修改通知", "#faad14", "您的论文需要修改后再审。请查看审稿意见并在截止日期前提交修改版本。"),
    }
    label, color, body = status_map.get(status, ("状态更新", "#1677ff", "您的论文状态已更新，请登录系统查看。"))
    link = f"{settings.frontend_base_url}/submission"
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:{color}">SETSS 2026 — {label}</h2>
      <p>您好，{full_name or to_email}，</p>
      <p>您投稿的论文 <strong>《{paper_title}》</strong> 审稿结果已出：</p>
      <p>{body}</p>
      <p style="margin:24px 0">
        <a href="{link}" style="background:#1677ff;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px">
          查看投稿详情
        </a>
      </p>
    </div>
    """
    _send(to_email, f"【SETSS 2026】{label} — {paper_title}", html)


def send_registration_confirmation_email(to_email: str, full_name: str, confirmation_code: str) -> None:
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#003a70">SETSS 2026 — 注册确认</h2>
      <p>您好，{full_name or to_email}，</p>
      <p>您已成功完成 SETSS 2026 国际学术会议的参会注册！</p>
      <div style="background:#f0f5ff;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;font-size:14px;color:#666">您的注册确认码</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:700;color:#1677ff;letter-spacing:4px">{confirmation_code}</p>
      </div>
      <p>会议时间：2026年9月15日 — 17日</p>
      <p>会议地点：西南大学行政楼报告厅，重庆</p>
      <p style="color:#888;font-size:12px">请妥善保管您的确认码，入场时可能需要出示。</p>
    </div>
    """
    _send(to_email, "【SETSS 2026】参会注册确认", html)


def send_review_reminder_email(to_email: str, full_name: str, paper_count: int) -> None:
    link = f"{settings.frontend_base_url}/review"
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#faad14">SETSS 2026 — 审稿提醒</h2>
      <p>您好，{full_name or to_email}，</p>
      <p>您还有 <strong>{paper_count}</strong> 篇论文待审稿，请尽快完成评审。</p>
      <p style="margin:24px 0">
        <a href="{link}" style="background:#1677ff;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px">
          前往审稿
        </a>
      </p>
    </div>
    """
    _send(to_email, "【SETSS 2026】审稿提醒", html)
