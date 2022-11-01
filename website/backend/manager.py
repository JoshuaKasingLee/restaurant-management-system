from email.mime import image
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
            #bug is when for unassigned you should just ignore stuff and add it in
            c = Category(name)
            cur = conn.cursor()
            if name != "Unassigned":
                unassigned = self.restaurant.find_category('Unassigned')
                try:
                    cur.execute("update category set display_order = %s where name = 'Unassigned'", [c.display_order])
                    cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [name, False, unassigned.display_order]) # need to change to default order at end
                except Exception as err:
                    conn.rollback()
                    raise Exception("Inserting new category failed")
                conn.commit()
                old_unassigned_display_order = unassigned.display_order
                unassigned.display_order = c.display_order
                c.display_order = old_unassigned_display_order
            else:
                try:
                    cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [name, False, c.display_order]) # need to change to default order at end
                except Exception as err:
                    conn.rollback()
                    raise Exception("Inserting new category failed")
                conn.commit()

            self.restaurant.categories.append(c)
            return c

    def remove_category(self, cat_id, type):

        cur = conn.cursor()
        
        cur.execute("select name from category where id = %s", [cat_id])
        name = cur.fetchone()[0]
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")
        if type == "removeItems":
            #delete tags first
            cur.execute("select id from menu_item where category = %s", [cat_id])
            menu_ids = cur.fetchall()
            for row in menu_ids:
                try:
                    cur.execute("delete from menu_item_tags where menu_item = %s", [row[0]])
                except:
                    conn.rollback()
                    raise Exception("Deleting related menu item tags failed")
        
            try:
                cur.execute("delete from menu_item where category = %s", [cat_id])
            except:
                conn.rollback()
                raise Exception("Deleting menu items from category failed")
            
            to_remove = []
            for item in self.restaurant.menu_items:
                if item.category.name == name:
                    to_remove.append(item)
            
            for item in to_remove:
                self.restaurant.menu_items.remove(item)
                    
            
        elif type == "keepItems":
            try:
                cur.execute("update menu_item set category = (select id from category where name = %s)", ["Unassigned"])
            except:
                conn.rollback()
                raise Exception("Moving menu items to Unassigned category failed")
            for item in self.restaurant.menu_items:
                if item.category.name == name:
                    item.category = self.restaurant.find_category("Unassigned")

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
        
    def update_categories_display_order(self, category_display_orders):
        cur = conn.cursor()
    
        for category in category_display_orders:
            cur.execute("""select name from category where id = %s""", [category["id"]])
            cat_name = cur.fetchone()[0]
            cur.execute("""update category set display_order = %s where id = %s""", [category["positionId"], category["id"]])
            if cur.rowcount == 1:
                for cat in self.restaurant.categories:
                    if cat.name == cat_name:
                        cat.display_order = category["positionId"]
            else:
                raise Exception("Display order update failed")
        
        conn.commit()
    
    def update_menu_items_display_order(self, menu_item_display_orders):
        cur = conn.cursor()
    
        for item in menu_item_display_orders:
            cur.execute("""select name from menu_item where id = %s""", [item["id"]])
            item_name = cur.fetchone()[0]
            cur.execute("""update menu_item set display_order = %s where id = %s""", [item["positionId"], item["id"]])
            if cur.rowcount == 1:
                for menu_item in self.restaurant.menu_items:
                    if menu_item.name == item_name:
                        menu_item.display_order = item["positionId"]
            else:
                raise Exception("Display order update failed")
                
                    
        conn.commit()
    
    def edit_menu_item(self, id, name, category, desc, ingredients, cost, show, tags = None, img = None):
    
        cur = conn.cursor()
        cur.execute("select name from menu_item where id = %s", [id])
        oldname = cur.fetchone()[0]
        if not self.restaurant.menu_contains(oldname):
            raise Exception(f"Menu item with name {oldname} does not exist")
        else:
            try:
                cur.execute("select id from category where name = %s", [category])
                cat_id = cur.fetchone()[0]
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


    def add_menu_item(self, name, desc, ingredients, cost, category: str, tags = None, img = None):
    
        if self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} already exists")
        else:
            #find category object please
            m = MenuItem(name, desc, ingredients, cost, self.restaurant.find_category(category), tags, img)
            cur = conn.cursor()
            try:
                cur.execute("select id from category where name = %s", [category])
                cat_id = cur.fetchone()[0]
                cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values (%s, %s, %s, %s, %s, %s, %s, %s);", [name, desc, ingredients, cost, m.display_order, cat_id, img, False]) # need to change to default order at end
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
            self.restaurant.menu_items.append(m)
            return m
                

    def remove_menu_item(self, id):
        cur = conn.cursor()
        cur.execute("select name from menu_item where id = %s", [id])
        name = cur.fetchone()[0]
        
        if not self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} does not exist")

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
    
    
    def category_edit(self, cat_id, show, new_name):
        cur = conn.cursor()
        cur.execute("""select name from category where id = %s""", [cat_id])
        name = cur.fetchone()[0]
        if not self.restaurant.category_exists(name):
            
            raise Exception(f"Category with name {name} does not exist")

        cur.execute("""update category set visible = %s, name = %s where id = %s""", [show, new_name, cat_id])
        if (cur.rowcount == 1): 
            for cat in self.restaurant.categories:
                if cat.name == name:
                    cat.visible = show
                    cat.name = new_name
        else:
            raise Exception("Unable to update category visibility")
        conn.commit()
