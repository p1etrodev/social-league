from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/social_league"
    cors_origins: list[str] = ["http://localhost:3000"]
    post_max_length: int = 280


settings = Settings()
