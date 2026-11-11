import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = "ClutchIQ — Pressure Performance Intelligence"
    API_V1_STR: str = "/api"
    ROOT_DIR: str = str(BASE_DIR)
    DATA_DIR: str = os.getenv("DATA_DIR", str(BASE_DIR / "data" / "processed"))
    RANKINGS_DIR: str = os.getenv("RANKINGS_DIR", str(BASE_DIR / "reports" / "rankings"))
    MAPPING_PATH: str = os.getenv("MAPPING_PATH", str(BASE_DIR / "competition_team_player_mapping.csv"))
    CORS_ORIGINS: list = ["*"]
    # Empirical Bayes calibrated priors
    BATTING_PRIOR_MEAN: float = 2.97
    BOWLING_PRIOR_MEAN: float = 1.97
    SHRINKAGE_K: float = 150.0

settings = Settings()
