from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRY: int
    DATABASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings() # type: ignore