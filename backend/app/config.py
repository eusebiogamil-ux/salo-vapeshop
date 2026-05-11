from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    admin_username: str = "salo"
    admin_password: str = "3usebio07"
    jwt_secret_key: str = "salo-vapeshop-jwt-secret-2026"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
