from datetime import datetime

class LeaderboardEntry:
    def __init__(self, name, email, score, time_played = datetime.now()):
        self.name = name
        self.email = email
        self.score = score
        self.time_played = time_played