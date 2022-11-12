# Menu-item object class adhering to Object-Oriented design as per the UML diagram

from init_db import conn
from category import Category

class MenuItem:
    curr_max_display_order = 0
    def __init__(self, name: str, desc: str, ingredients: str, cost: str, category: Category, tags = None, img = 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg', visible = False, display_order = 0):
        self.name = name
        self.desc = desc
        self.ingredients = ingredients
        self.cost = cost
        self.category = category
        if tags is None:
            tags = {"vegetarian": False, "vegan": False, "gluten free": False, "nut free": False, "dairy free": False, "chef recommended": False}
        self.tags = tags
        self.img = img
        self.visible = visible
        if (display_order == 0):
            MenuItem.curr_max_display_order += 1
            self.display_order = MenuItem.curr_max_display_order
        else:
            self.display_order = display_order
            if (display_order > MenuItem.curr_max_display_order): 
                MenuItem.curr_max_display_order = display_order
    
    def to_JSON(self) -> dict:
        cur = conn.cursor()
        cur.execute("select id from menu_item where name = %s", [self.name])
        item_id = cur.fetchone()[0]
        
        return {
            "id": item_id,
            "name": self.name,
            "description": self.desc,
            "ingredients": self.ingredients,
            "cost": self.cost,
            "category": self.category.name,
            "tags": self.tags,
            "img": self.img,
            "visible": self.visible,
            "display_order": self.display_order
        }

