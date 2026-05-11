from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    admin_username: str = "admin"
    admin_password: str = "changeme"
    jwt_secret_key: str = "change-this-secret-key-in-production-render-env-vars"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
