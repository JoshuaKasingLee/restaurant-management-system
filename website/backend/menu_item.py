class MenuItem:
    def __init__(self, name, cost, category, visible = False, display_order = 0, desc = "", ingredients = "", tags=None, img = None):
        self.name = name
        self.cost = cost
        self.category = category
        self.visible = visible
        self.display_order = display_order
        self.desc = desc
        self.ingredients = ingredients
        if tags is None:
            tags = []
        self.tags = tags
        self.img = img