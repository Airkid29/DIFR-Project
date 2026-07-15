import os
import re
import secrets
from urllib.parse import urlparse, urlunparse


def _fix_render_internal_postgres_url(url: str) -> str:
    """Render internal URLs use host 'dpg-xxx-a' which only resolves on the private network."""
    parsed = urlparse(url)
    host = parsed.hostname or ""
    if not re.fullmatch(r"dpg-[a-z0-9]+-a", host):
        return url

    region = (
        os.getenv("RENDER_POSTGRES_REGION")
        or os.getenv("RENDER_REGION")
        or "oregon"
    )
    external_host = f"{host}.{region}-postgres.render.com"
    fixed = urlunparse(parsed._replace(netloc=parsed.netloc.replace(host, external_host, 1)))
    print(f"[config] Using external Postgres host: {external_host} (region={region})")
    return fixed


def _get_env_list(key: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(key, default).split(",") if item.strip()]


def _normalize_database_url(url: str) -> str:
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    url = _fix_render_internal_postgres_url(url)

    if "render.com" in url and "sslmode" not in url:
        url += ("&" if "?" in url else "?") + "sslmode=require"
    return url


class Settings:
    APP_ENV: str = os.getenv("APP_ENV", "development").lower()
    DATABASE_URL: str = _normalize_database_url(
        os.getenv("DATABASE_EXTERNAL_URL")
        or os.getenv("DATABASE_URL")
        or "postgresql://postgres:securepassword123@localhost:5432/forensiguard"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    SECRET_KEY: str = os.getenv("SECRET_KEY") or (
        secrets.token_urlsafe(32) if APP_ENV != "production" else ""
    )
    if APP_ENV == "production" and not SECRET_KEY:
        raise EnvironmentError(
            "SECRET_KEY must be configured when APP_ENV=production."
        )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/app/uploads")
    ENABLE_CELERY_WORKER: bool = os.getenv("ENABLE_CELERY_WORKER", "true").lower() in (
        "1",
        "true",
        "yes",
    )
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    CORS_ALLOWED_ORIGINS: list[str] = _get_env_list("CORS_ALLOWED_ORIGINS", FRONTEND_URL)
    TRUSTED_HOSTS: list[str] = _get_env_list("ALLOWED_HOSTS", "localhost,127.0.0.1")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")


settings = Settings()
