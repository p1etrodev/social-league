from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/social_league"
    cors_origins: list[str] = ["http://localhost:3000"]
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


settings = Settings()
