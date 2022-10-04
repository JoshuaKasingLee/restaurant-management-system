class Tag:
    def __init__(self, name):
        self.name = name
    
    def to_JSON(self):
        return {
            "name": self.name
        }