# Manager object class adhering to Object-Oriented design as per the UML diagram
# Functionality pertains the actions that the manager would require including adding, editing, and removing categories, menu items, and number of tables

from staff import Staff
from menu_item import MenuItem
from category import Category
from table import Table
from init_db import conn
from helper import TagNames
from db_service import DbService

class Manager(Staff):
    def __init__(self, password: str, restaurant):
        super().__init__(password, restaurant)

    def add_category(self, name: str) -> Category:
        if self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} already exists")
        else:
            c = Category(name)
            cur = conn.cursor()
            if name != "Unassigned":
                unassigned = self.restaurant.find_category('Unassigned')
                try:
                    cur.execute("update category set display_order = %s where name = 'Unassigned'", [c.display_order])
                    cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [name, False, unassigned.display_order])
                except Exception as err:
                    conn.rollback()
                    raise Exception("Inserting new category failed")
                conn.commit()
                old_unassigned_display_order = unassigned.display_order
                unassigned.display_order = c.display_order
                c.display_order = old_unassigned_display_order
            else:
                try:
                    cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [name, False, c.display_order])
                except Exception as err:
                    conn.rollback()
                    raise Exception("Inserting new category failed")
                conn.commit()

            self.restaurant.categories.append(c)
            return c

    def remove_category(self, cat_id: int, type: str) -> bool:
        cur = conn.cursor()
        name = DbService.get_category_name(cat_id)
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")

        if type == "removeItems":
            # delete tags first
            menu_ids = DbService.get_all_menu_items_in_category(cat_id)
            for row in menu_ids:
                DbService.delete_menu_item_tags(row[0])
            DbService.delete_all_menu_items_with_category(cat_id)
            
            to_remove = []
            for item in self.restaurant.menu_items:
                if item.category.name == name:
                    to_remove.append(item)
            
            for item in to_remove:
                self.restaurant.menu_items.remove(item)
                         
        elif type == "keepItems":
            try:
                unassigned_id = DbService.get_category_id("Unassigned")
                cur.execute("update menu_item set category = %s where category = %s", [unassigned_id, cat_id])
            except:
                conn.rollback()
                raise Exception("Moving menu items to Unassigned category failed")
            for item in self.restaurant.menu_items:
                if item.category.name == name:
                    item.category = self.restaurant.find_category("Unassigned")

        DbService.delete_category_name(name)
        cat = self.restaurant.find_category(name)
        if cat != None:
            self.restaurant.categories.remove(cat)
            return True
        # check if exception needs to be thrown if no category was found
        return False
        
    def update_categories_display_order(self, category_display_orders: list):
        cur = conn.cursor()
    
        for category in category_display_orders:
            cat_name = DbService.get_category_name(category["id"])
            cur.execute("""update category set display_order = %s where id = %s""", [category["positionId"], category["id"]])
            if cur.rowcount == 1:
                cat = self.restaurant.find_category(cat_name)
                if cat != None:
                    cat.display_order = category["positionId"]
            else:
                raise Exception("Display order update failed")
        
        conn.commit()
    
    def update_menu_items_display_order(self, menu_item_display_orders: list):
        cur = conn.cursor()
    
        for item in menu_item_display_orders:
            item_name = DbService.get_menu_item_name(item["id"])
            cur.execute("""update menu_item set display_order = %s where id = %s""", [item["positionId"], item["id"]])
            if cur.rowcount == 1:
                menu_item = self.restaurant.find_menu_item(item_name)
                if menu_item != None:
                    menu_item.display_order = item["positionId"]
            else:
                raise Exception("Display order update failed")
                
                    
        conn.commit()
    
    def edit_menu_item(self, id: int, name: str, category: str, desc: str, ingredients: str, cost: float, show: bool, tags = None, img = None) -> MenuItem:
        cur = conn.cursor()

        oldname = DbService.get_menu_item_name(id)
        if not self.restaurant.menu_contains(oldname):
            raise Exception(f"Menu item with name {oldname} does not exist")
        else:
            try:
                cat_id = DbService.get_category_id(category)
                cur.execute("""update menu_item set name = %s, category = %s, description = %s, ingredients = %s, cost = %s, visible = %s, image = %s where name = %s""", [name, cat_id, desc, ingredients, cost, show, img, oldname])
            except Exception as err:
                conn.rollback()
                raise Exception("Updating menu item failed")
            conn.commit()
        
            if tags != None:
                cur.execute("delete from menu_item_tags where menu_item = (select id from menu_item where name = %s)", [name])
                for tag in tags.keys():
                    if tags[tag]:
                        try:
                            cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = %s));", [name, tag])
                        except Exception as err:
                            conn.rollback()
                            raise Exception("Inserting tag failed")
                        
            for item in self.restaurant.menu_items:
                if item.name == oldname:
                    item.name = name
                    #find category object please
                    item.category = self.restaurant.find_category(category)
                    item.desc = desc
                    item.ingredients = ingredients
                    item.cost = cost 
                    item.tags = tags
                    item.visible = show
                    item.img = img
                    return item


    def add_menu_item(self, name: str, desc: str, ingredients: str, cost: float, category: str, tags = None, img = None) -> MenuItem:
        if self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} already exists")
        else:
            m = MenuItem(name, desc, ingredients, cost, self.restaurant.find_category(category), tags, img)
            cur = conn.cursor()
            try:
                cat_id = DbService.get_category_id(category)
                cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values (%s, %s, %s, %s, %s, %s, %s, %s);", [name, desc, ingredients, cost, m.display_order, cat_id, img, False]) # need to change to default order at end
            except Exception as err:
                conn.rollback()
                raise Exception("Inserting new menu item failed")
            conn.commit()

            if tags != None:
                if tags[TagNames.VEGETARIAN.value]:
                    DbService.insert_menu_item_tag(name, TagNames.VEGETARIAN.value)
                if tags[TagNames.VEGAN.value]:
                    DbService.insert_menu_item_tag(name, TagNames.VEGAN.value)
                if tags[TagNames.GF.value]:
                    DbService.insert_menu_item_tag(name, TagNames.GF.value)
                if tags[TagNames.NF.value]:
                    DbService.insert_menu_item_tag(name, TagNames.NF.value)
                if tags[TagNames.DF.value]:
                    DbService.insert_menu_item_tag(name, TagNames.DF.value)
                if tags[TagNames.CR.value]:
                    DbService.insert_menu_item_tag(name, TagNames.CR.value)
            
            self.restaurant.menu_items.append(m)
            return m
                

    def remove_menu_item(self, id: int) -> bool:
        name = DbService.get_menu_item_name(id)
        if not self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} does not exist")

        # remove from database
        item_id = DbService.get_menu_item_id(name)
        DbService.delete_menu_item_tags(item_id)
        DbService.delete_menu_item(name)

        # if successful, remove from objects
        item = self.restaurant.find_menu_item(name)
        if item != None:
            self.restaurant.menu_items.remove(item)
            return True
        return False

    def change_wait_pw(self, new_pw: str):
        DbService.update_staff_password("wait", new_pw)
        self.restaurant.wait.password = new_pw
        
    def change_kitchen_pw(self, new_pw: str):
        DbService.update_staff_password("kitchen", new_pw)
        self.restaurant.kitchen.password = new_pw
        
    def change_manager_pw(self, new_pw: str):
        DbService.update_staff_password("manager", new_pw)
        self.password = new_pw
        
    def choose_table_amt(self, number: int):
        if (number < 0):
            raise Exception("Number of tables cannot be negative")
            
        table_num = 1
        cur = conn.cursor()
            
        while (len(self.restaurant.tables) < number):

            while (self.restaurant.tab_num_exist(table_num)):
                table_num += 1
            try:
                cur.execute("""INSERT INTO tables(num, budget, needs_assistance, occupied) values (%s, null, False, False)""", [table_num])
            except Exception as err:
                conn.rollback()
                raise Exception("SQL Statement Failed")
            conn.commit()
            self.restaurant.tables.append(Table(table_num))
                
        while (len(self.restaurant.tables) > number):
            self.restaurant.remove_table()
        conn.commit()
    
    def category_edit(self, cat_id: int, show: bool, new_name: str):
        name = DbService.get_category_name(cat_id)
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")

        DbService.update_category(cat_id, show, new_name)
        cat = self.restaurant.find_category(name)
        if cat != None:
            cat.visible = show
            cat.name = new_name

