import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Nexora")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/auth")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # JWT & Auth
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15")
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")
    )
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", "30")
    )

    # Frontend
    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000",
    )

    # Cookies
    COOKIE_SECURE: bool = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    COOKIE_DOMAIN: Optional[str] = os.getenv("COOKIE_DOMAIN") or None
    COOKIE_SAMESITE: str = os.getenv("COOKIE_SAMESITE", "lax")

    @property
    def get_async_database_url(self) -> str:
        """Return database URL compatible with asyncpg."""

        url = self.DATABASE_URL

        if url.startswith("postgresql://"):
            url = url.replace(
                "postgresql://",
                "postgresql+asyncpg://",
                1,
            )
        elif url.startswith("postgres://"):
            url = url.replace(
                "postgres://",
                "postgresql+asyncpg://",
                1,
            )

        if "?" in url:
            base, query = url.split("?", 1)

            params = query.split("&")
            new_params = []

            for param in params:
                if param.startswith("channel_binding="):
                    continue

                if param.startswith("sslmode="):
                    value = param.split("=", 1)[1]
                    new_params.append(f"ssl={value}")
                else:
                    new_params.append(param)

            url = (
                f"{base}?{'&'.join(new_params)}"
                if new_params
                else base
            )

        return url


settings = Settings()