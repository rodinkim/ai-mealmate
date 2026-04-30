from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    anthropic_api_key: str
    backend_port: int = 8080

    llm_model: str = "claude-haiku-4-5-20251001"
    llm_temperature: float = 0.7

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
