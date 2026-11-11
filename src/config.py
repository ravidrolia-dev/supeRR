"""
ClutchIQ - Rajasthan Royals SupeRR Selector Season 2
Configuration & Constants Module
"""

from pathlib import Path

# Paths
DATA_DIR = Path(".")
OUTPUT_DIR = Path("data/processed")
REPORTS_DIR = Path("reports")
DATA_AUDIT_DIR = Path("reports/data_audit")

# Source Files
FILES = {
    "competitions": DATA_DIR / "competitions.csv",
    "teams": DATA_DIR / "teams.csv",
    "matches": DATA_DIR / "matches.csv",
    "ctpm": DATA_DIR / "competition_team_player_mapping.csv",
    "playing_eleven": DATA_DIR / "playing_eleven.csv",
    "ball_by_ball": DATA_DIR / "ball_by_ball.csv",
}

# Categorical Extras Mapping
EXTRAS1_MAP = {
    1: "Overstep",
    2: "wide",
    3: "legbyes",
    4: "byes",
    5: "other",
    6: "no extra",
    7: "Penalty"
}

# Illegal delivery types that do not count as legal balls
ILLEGAL_DELIVERY_TYPES = {"wide", "Overstep", "other"}

# Bowler credited dismissal types (MCC Law 32, 33, 35, 36, 39)
BOWLER_DISMISSAL_TYPES = {
    "Bowled",
    "Caught",
    "LBW",
    "Stump",
    "Hit Wicket"
}

# Non-bowler credited dismissal types (MCC Law 25, 37, 38)
NON_BOWLER_DISMISSAL_TYPES = {
    "RunOut",
    "Retire Out",
    "Obstructing the field",
    "Obstracting the field"
}

# Innings Phases based on legal ball number in standard 20-over innings
# Powerplay: Overs 1-6 (Balls 1-36)
# Middle: Overs 7-15 (Balls 37-90)
# Death: Overs 16-20 (Balls 91-120)
PHASE_POWERPLAY_MAX_BALL = 36
PHASE_MIDDLE_MAX_BALL = 90

