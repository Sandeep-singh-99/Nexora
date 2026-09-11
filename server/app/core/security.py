import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple
from uuid import UUID

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError

from app.core.config import settings

# Initialize Argon2id password hasher with OWASP recommended settings
_ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,  # 64MB
    parallelism=4,
    hash_len=32,
    salt_len=16,
)


def hash_password(password: str) -> str:
    """Hash a password using Argon2id."""
    return _ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against an Argon2id hash."""
    try:
        return _ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def hash_token(token: str) -> str:
    """Compute a SHA-256 hash of a raw token string for secure database storage."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def generate_secure_token() -> str:
    """Generate a URL-safe cryptographically secure random token string."""
    return secrets.token_urlsafe(32)


def create_access_token(
    user_id: UUID,
    jti: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT Access Token containing required claims (sub, jti, type, iat, exp)."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "jti": jti,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    encoded_jwt = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    user_id: UUID,
    jti: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT Refresh Token containing required claims (sub, jti, type, iat, exp)."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "jti": jti,
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    encoded_jwt = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str, expected_type: Optional[str] = None) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.
    Raises jwt.PyJWTError if invalid or expired.
    """
    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
        options={"require": ["sub", "jti", "type", "iat", "exp"]},
    )
    if expected_type and payload.get("type") != expected_type:
        raise jwt.InvalidTokenError(f"Invalid token type. Expected '{expected_type}'")
    return payload
