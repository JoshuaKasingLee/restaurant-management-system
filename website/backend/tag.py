class Tag:
    def __init__(self, name):
        self.name = name
    
    def to_JSON(self):
        return {
            "name": self.name
        }
        # return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)