import os
from pathlib import Path

# Resolve base project directory relative to this file: backend/app/config.py -> parents[2] is RR_Solution root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = "ClutchIQ Analytics Platform"
    API_V1_STR: str = "/api"
    ROOT_DIR: str = str(BASE_DIR)
    DATA_DIR: str = os.getenv("DATA_DIR", str(BASE_DIR / "data" / "processed"))
    RANKINGS_DIR: str = os.getenv("RANKINGS_DIR", str(BASE_DIR / "reports" / "rankings"))
    MAPPING_PATH: str = os.getenv("MAPPING_PATH", str(BASE_DIR / "competition_team_player_mapping.csv"))
    CORS_ORIGINS: list = ["*"]

settings = Settings()
