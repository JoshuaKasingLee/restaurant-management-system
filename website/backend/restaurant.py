from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table
from menu_item import MenuItem
from tag import Tag
from category import Category
from init_db import conn

class Restaurant:
    def __init__(self, name):
        self.name = name
        self.tables = []
        self.categories = []
        self.menu_items = []
        self.leaderboard = []
        self.manager = None
        self.wait = None
        self.kitchen = None
        #may need token thingy for customer and everyone not sure
        
    def populate(self):
        #make for each entry in db, menu items, tables, leaderboard entries, manager, waiter, kitchen
        cur = conn.cursor()
        cur.execute("select password from staff where role = 'manager'")
        result = cur.fetchall()
        m_pw = result[0][0]
        new_m = Manager(m_pw, self)
        self.manager = new_m
        
        cur.execute("select password from staff where role = 'wait'")
        result = cur.fetchall()
        w_pw = result[0][0]
        new_w = WaitStaff(w_pw, self)
        self.wait = new_w
        
        cur.execute("select password from staff where role = 'kitchen'")
        result = cur.fetchall()
        k_pw = result[0][0]
        new_k = KitchenStaff(k_pw, self)
        self.kitchen = new_k
        
        cur.execute("select num, budget from tables")
        result = cur.fetchall()
        for tab in result:
            self.tables.append(Table(tab[0], tab[1]))

        cur.execute("select name, visible, display_order from category")
        result = cur.fetchall()
        for cat in result:
            self.categories.append(Category(cat[0], cat[1], cat[2]))
            
        cur.execute("select mi.id, mi.name, mi.cost, mi.category, mi.visible, mi.display_order, mi.description, mi.ingredients, mi.image from menu_item mi")
        result = cur.fetchall()
        for item in result:
            id, name, cost, category_id, visible, display_order, description, ingredients, image = item; 

            # get the tags assigned to the menu_item
            tag_query = """select t.name from tag t join menu_item_tags mit on mit.tag = t.id where mit.menu_item = %s"""
            cur.execute(tag_query, [id])
            tag_list = cur.fetchall()
            menu_tags = []
            for tag_name in tag_list:
                for tag in tag_name:
                    menu_tags.append(Tag(tag))
            
            # get the category where the id is a match (SQL)
            category_query = """SELECT c.name FROM category c JOIN menu_item m ON m.category = c.id WHERE m.id = %s"""
            cur.execute(category_query, [id])
            category_name = cur.fetchone()[0]
            
            # get the name where the name is a match (python)
            for category in self.categories:
                if category_name == category.name:
                    menu_item_category = category
                break
            
            self.menu_items.append(MenuItem(name, description, ingredients, cost, menu_item_category, menu_tags, image, visible, display_order))
            
            
    # menu editor helper function
    def menu_contains(self, name):
        for item in self.menu_items:
            if item.name == name:
                return True
        return False

    def category_exists(self, name):
        for cat in self.categories:
            if cat.name == name:
                return True
        return False

    def get_menu(self, name):
        # for category in self.categories:
        #     print(category.name)
        for menu_item in self.menu_items:
            print(menu_item.get_menu_item())


        return self.menu_items
        
        
    def tab_num_exist(self, number):
        for table in self.tables:
            if (table.number == number):
                return True
        return False
        
        
    # def count_unoccupied(self):
    #     counter = 0
    #     for table in self.tables:
    #         if (not table.occupied):
    #             counter += 1
    #     return counter
        
    def remove_table(self):
        cur = conn.cursor()
        table_index = len(self.tables) - 1     
        cur.execute("""delete from tables where num = %s""", [self.tables[table_index].number])
        conn.commit()
        self.tables.remove(self.tables[table_index])
                
                
    def choose_table(self, number):
        cur = conn.cursor()
        for table in self.tables:
            if (table.number == number):
                cur.execute("""update tables set occupied = True where num = %s""", [number])
                conn.commit()
                table.occupied = True
    
    # converts a category to JSON
    def category_to_JSON(self, name, category_name):
        for category in self.categories:
            if category.name == category_name:
                item_list = []
                for menu_item in self.menu_items:
                    if menu_item.category == category:
                        item_list.append(menu_item.to_JSON())
                return {
                    "name": category.name,
                    "visible": category.visible,
                    "display_order": category.display_order,
                    "menu_items": item_list
                }
        
       
    def menu_to_JSON(self, name):
        categories = []
        for category in self.categories:
            categories.append(self.category_to_JSON(self, category.name))
        return categories
