import json

class MenuItem:
    def __init__(self, name, desc, ingredients, cost, category, tags = None, img = None, visible = False, display_order = 0):
        self.name = name
        self.desc = desc
        self.ingredients = ingredients
        self.cost = cost
        self.category = category
        if tags is None:
            tags = []
        self.tags = tags
        self.img = img
        self.visible = visible
        self.display_order = display_order
    
    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)