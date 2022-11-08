
from init_db import conn


class MenuItem:
    curr_max_display_order = 0
    def __init__(self, name, desc, ingredients, cost, category, tags = None, img = 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg', visible = False, display_order = 0):
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
    
    # def add_tags(self, tags):
    #     cur = conn.cursor()
    #     cur.execute("SELECT id FROM MENU_ITEM where name = %s", [self.name])
    #     item_id = cur.fetchone()[0]
    #     tag_enums = [TagNames.VEGETARIAN.value, TagNames.VEGAN.value, TagNames.GF.value, TagNames.NF.value, TagNames.DF.value, TagNames.CR.value]
    #     for tag in tags:
    #         for enum in tag_enums:
    #             if tag == enum and tag[enum]:
    #                 try:
    #                     cur.execute("SELECT id FROM tag where name = %s", [enum])
    #                     tag_id = cur.fetchone()[0]
    #                     cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values (%s, %s)", [item_id, tag_id])
    #                 except Exception as err:
    #                     conn.rollback()
    #                     raise Exception("Inserting new category failed")
    #                 conn.commit()

    #                 for t in self.tags:
    #                     if t == enum:
    #                         t[enum] = True
    
    def to_JSON(self):
        # tags = []
        # for tag in self.tags:
        #     tags.append(tag.to_JSON())
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

