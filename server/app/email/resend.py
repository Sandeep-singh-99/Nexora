import logging
import resend
from app.core.config import settings

logger = logging.getLogger(__name__)

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY


async def send_verification_email(email: str, token: str) -> bool:
    """Send an email verification link using Resend."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
        .header {{ background-color: #4f46e5; padding: 30px; text-align: center; color: white; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 600; }}
        .content {{ padding: 40px 30px; color: #333333; line-height: 1.6; }}
        .button-container {{ text-align: center; margin: 30px 0; }}
        .btn {{ background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; display: inline-block; }}
        .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for signing up for Nexora! Please verify your email address to complete your registration and activate your account.</p>
          <div class="button-container">
            <a href="{verification_url}" class="btn" target="_blank">Verify Email</a>
          </div>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p><a href="{verification_url}" style="color: #4f46e5;">{verification_url}</a></p>
          <p>This link will expire in {settings.VERIFICATION_TOKEN_EXPIRE_HOURS} hours.</p>
        </div>
        <div class="footer">
          <p>If you did not create an account with Nexora, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
    """

    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set. Verification URL for %s: %s", email, verification_url)
        return True

    try:
        params: resend.Emails.SendParams = {
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email],
            "subject": "Verify your Nexora Account",
            "html": html_content,
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        logger.error("Failed to send verification email to %s: %s", email, str(e))
        return False


async def send_password_reset_email(email: str, token: str) -> bool:
    """Send a password reset link using Resend."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
        .header {{ background-color: #dc2626; padding: 30px; text-align: center; color: white; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 600; }}
        .content {{ padding: 40px 30px; color: #333333; line-height: 1.6; }}
        .button-container {{ text-align: center; margin: 30px 0; }}
        .btn {{ background-color: #dc2626; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; display: inline-block; }}
        .footer {{ background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset the password for your Nexora account. Click the button below to set a new password:</p>
          <div class="button-container">
            <a href="{reset_url}" class="btn" target="_blank">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p><a href="{reset_url}" style="color: #dc2626;">{reset_url}</a></p>
          <p>This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
        </div>
        <div class="footer">
          <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
      </div>
    </body>
    </html>
    """

    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set. Reset URL for %s: %s", email, reset_url)
        return True

    try:
        params: resend.Emails.SendParams = {
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email],
            "subject": "Reset your Nexora Password",
            "html": html_content,
        }
        resend.Emails.send(params)
        return True
    except Exception as e:
        logger.error("Failed to send password reset email to %s: %s", email, str(e))
        return False
