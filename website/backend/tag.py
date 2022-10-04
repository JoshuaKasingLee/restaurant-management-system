class Tag:
    def __init__(self, name):
        self.name = name
    
    def get_tag(self):
        return {
            "name": self.name
        }