from datetime import datetime

class LeaderboardEntry:
    def __init__(self, name: str, email: str, score: int, time_played: datetime = datetime.now()):
        self.name = name
        self.email = email
        self.score = score
        self.time_played = time_played