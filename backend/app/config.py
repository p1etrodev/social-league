import json
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/social_league"
    # NoDecode: pydantic-settings otherwise tries to JSON-decode list-typed
    # env vars before validators run, so a plain "https://a.com" from a
    # hosting dashboard would crash on boot before _parse_cors_origins sees it.
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]
    post_max_length: int = 280

    @field_validator("database_url")
    @classmethod
    def _use_psycopg_driver(cls, value: str) -> str:
        # Hosting platforms (Railway, Heroku, ...) inject DATABASE_URL as a
        # plain "postgresql://" scheme, which makes SQLAlchemy default to
        # psycopg2 -- this project only installs psycopg (v3, async).
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _parse_cors_origins(cls, value: object) -> object:
        # Accepts either JSON (CORS_ORIGINS=["https://a.com"]) or a plain
        # comma-separated string (CORS_ORIGINS=https://a.com,https://b.com),
        # since hosting dashboards naturally invite the latter.
        if isinstance(value, str):
            stripped = value.strip()
            if stripped.startswith("["):
                return json.loads(stripped)
            return [origin.strip() for origin in stripped.split(",") if origin.strip()]
        return value


settings = Settings()
