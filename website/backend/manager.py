# Manager object class adhering to Object-Oriented design as per the UML diagram
# Functionality pertains the actions that the manager would require including adding, editing, and removing categories, menu items, and number of tables

from staff import Staff
from menu_item import MenuItem
from category import Category
from table import Table
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
            if name != "Unassigned":
                unassigned = self.restaurant.find_category('Unassigned')
                unassigned_id = DbService.get_category_id("Unassigned")
                DbService.update_category_display_order(c.display_order, unassigned_id)
                DbService.insert_category(name, c.display_order)
                
                old_unassigned_display_order = unassigned.display_order
                unassigned.display_order = c.display_order
                c.display_order = old_unassigned_display_order
            else:
                DbService.insert_category(name, c.display_order)

            self.restaurant.categories.append(c)
            return c

    def remove_category(self, cat_id: int, type: str) -> bool:
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
            DbService.update_menu_item_category_unassigned(cat_id)
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
        for category in category_display_orders:
            cat_name = DbService.get_category_name(category["id"])
            DbService.update_category_display_order(category["positionId"], category["id"])
            cat = self.restaurant.find_category(cat_name)
            if cat != None:
                cat.display_order = category["positionId"]

    
    def update_menu_items_display_order(self, menu_item_display_orders: list):
        for item in menu_item_display_orders:
            item_name = DbService.get_menu_item_name(item["id"])
            DbService.update_menu_item_display_order(item["positionId"], item["id"])
            menu_item = self.restaurant.find_menu_item(item_name)
            if menu_item != None:
                menu_item.display_order = item["positionId"]
    
    def edit_menu_item(self, id: int, name: str, category: str, desc: str, ingredients: str, cost: float, show: bool, tags = None, img = None) -> MenuItem:
        oldname = DbService.get_menu_item_name(id)
        if not self.restaurant.menu_contains(oldname):
            raise Exception(f"Menu item with name {oldname} does not exist")
        else:
            DbService.update_menu_item(category, name, desc, ingredients, cost, show, img, oldname)

            if tags != None:
                item_id = DbService.get_menu_item_id(name)
                DbService.delete_menu_item_tags(item_id)
                for tag in tags.keys():
                    if tags[tag]:
                        DbService.insert_menu_item_tag(name, tag)
                        
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
            DbService.insert_menu_item(name, desc, ingredients, cost, m.display_order, category, img)

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
        
        if self.restaurant.orders_contain(name):
            raise Exception(f"Menu item with name {name} cannot be deleted if item exist in orders")

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
        if (self.restaurant.count_tables() < number):
            while (self.restaurant.count_tables() < number):
                while (self.restaurant.tab_num_exist(table_num)):
                    table_num += 1
                DbService.insert_new_table(table_num)
                self.restaurant.tables.append(Table(table_num))
        elif (self.restaurant.count_tables() > number):
            table_num = number + 1
            while (table_num <= self.restaurant.count_tables()):
                if (DbService.get_table_occupied(table_num)):
                    raise Exception(f"Table {table_num} is currently occupied")
                table_num += 1

            while (self.restaurant.count_tables() > number):
                self.restaurant.remove_table()
    
    def category_edit(self, cat_id: int, show: bool, new_name: str):
        name = DbService.get_category_name(cat_id)
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")

        DbService.update_category(cat_id, show, new_name)
        cat = self.restaurant.find_category(name)
        if cat != None:
            cat.visible = show
            cat.name = new_name

