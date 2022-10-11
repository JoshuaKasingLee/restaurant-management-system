from operator import truediv
from staff import Staff
from menu_item import MenuItem
from category import Category
from table import Table
from init_db import conn

class Manager(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)

    # menu editor functions

    def add_category(self, name):
        if self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} already exists")
        else:
            cur = conn.cursor()
            try:
                # cur.execute("""select count * from category""")
                # display = cur.fetchone()[0]
                cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [name, False, 0]) # need to change to default order at end
            except Exception as err:
                conn.rollback()
                raise Exception("Inserting new category failed")
            conn.commit()
            # cat_id = cur.lastrowid
            c = Category(name)
            
            self.restaurant.categories.append(c)
            return c


    def remove_category(self, name):
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")

        cur = conn.cursor()
        try:
            cur.execute("""DELETE FROM category where name = %s""", [name])
        except Exception as err:
            conn.rollback()
            raise Exception("Deleting category failed")
        conn.commit()
        
        for cat in self.restaurant.categories:
            if cat.name == name:
                self.restaurant.categories.remove(cat)
                return True
        # check if exception needs to be thrown if no category was found
        return False

    def add_menu_item(self, name, desc, ingredients, cost, category: str, tags = None, img = None):
        if self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} already exists")
        else:
            cur = conn.cursor()
            try:
                cur.execute("select id from category where name = %s", [category])
                cat_id = cur.fetchone()[0]
                cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values (%s, %s, %s, %s, %s, %s, %s, %s);", [name, desc, ingredients, cost, 0, cat_id, img, False]) # need to change to default order at end
            except Exception as err:
                conn.rollback()
                raise Exception("Inserting new menu item failed")
            conn.commit()

            # adding tags
            if tags != None:
                if tags["vegetarian"]:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'vegetarian'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
                if tags['vegan']:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'vegan'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
                if tags['gluten free']:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'gluten free'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
                if tags['nut free']:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'nut free'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
                if tags['dairy free']:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'dairy free'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
                if tags['chef recommended']:
                    try:
                        cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = 'chef recommended'));", [name])
                    except Exception as err:
                        conn.rollback()
                        raise Exception("Inserting new tag failed")
            conn.commit()

            m = MenuItem(name, desc, ingredients, cost, Category(category), tags, img)
            self.restaurant.menu_items.append(m)
            return m
                

    def remove_menu_item(self, name):
        if not self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} does not exist")

        cur = conn.cursor()
        try:
            cur.execute("select id from menu_item where name = %s", [name])
            item_id = cur.fetchone()[0]
            cur.execute("""DELETE FROM menu_item_tags where menu_item = %s""", [item_id])
            cur.execute("""DELETE FROM menu_item where name = %s""", [name])
        except Exception as err:
            conn.rollback()
            raise Exception("Deleting menuitem failed")
        conn.commit()

        for item in self.restaurant.menu_items:
            if item.name == name:
                self.restaurant.menu_items.remove(item)
                return True
        # check if exception needs to be thrown if no item was found
        return False


    def change_wait_pw(self, new_pw):
        cur = conn.cursor()
        cur.execute("""update staff set password = %s where role = 'wait'""", [new_pw])
        if (cur.rowcount == 1): 
            self.restaurant.wait.password = new_pw
        conn.commit()
        
    def change_kitchen_pw(self, new_pw):
        cur = conn.cursor()
        cur.execute("""update staff set password = %s where role = 'kitchen'""", [new_pw])
        if (cur.rowcount == 1): 
            self.restaurant.kitchen.password = new_pw
        conn.commit()
        
    def change_manager_pw(self, new_pw):
        cur = conn.cursor()
        cur.execute("""update staff set password = %s where role = 'manager'""", [new_pw])
        if (cur.rowcount == 1): 
            self.password = new_pw
        conn.commit()
        
        
    def choose_table_amt(self, number):
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
                
        
        # if (len(self.restaurant.tables) - number > self.restaurant.count_unoccupied()):
        #     raise Exception("Not enough tables able to be removed")
            
        while (len(self.restaurant.tables) > number):
            self.restaurant.remove_table()
        
        conn.commit()
    