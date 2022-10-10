from re import L
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table
from menu_item import MenuItem
from tag import Tag
from category import Category
from helper import OrderStatus
from init_db import conn
from uuid import uuid4
import json

from order import Order

class Restaurant:
    def __init__(self, name):
        self.name = name
        self.pic = "sunnies.jpg"
        self.tables = []
        self.categories = []
        self.menu_items = []
        self.leaderboard = []
        self.manager = None
        self.wait = None
        self.kitchen = None
        self.manager_tokens = []
        self.wait_tokens = []
        self.kitchen_tokens = []
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
        
    def tab_num_exist(self, number):
        for table in self.tables:
            if (table.number == number):
                return True
        return False
        
        
    def count_tables(self):
        counter = 0
        for table in self.tables:
            counter += 1
        return counter
        
    def remove_table(self):
        cur = conn.cursor()
        table_index = len(self.tables) - 1
        cur.execute("""delete from tables where num = %s""", [self.tables[table_index].number])
        if (cur.rowcount == 1):
            self.tables.remove(self.tables[table_index])
        conn.commit()
                
                
    def choose_table(self, number):
        cur = conn.cursor()
        for table in self.tables:
            if (table.number == number):
                cur.execute("""update tables set occupied = True where num = %s""", [number])
                if (cur.rowcount == 1):
                    cust_token = uuid4()
                    table.occupied = True
                    table.token = str(cust_token)    
                    conn.commit()
                    return str(cust_token)
        raise Exception("Cannot find table")
        
                
    def login(self, user, password):
        if (user == 'manager' and password == self.manager.password):
            manager_token = uuid4()
            self.manager_tokens.append(str(manager_token))
            return str(manager_token)
        elif (user == 'wait' and password == self.wait.password):
            wait_token = uuid4()
            self.wait_tokens.append(str(wait_token))
            return str(wait_token)
        elif (user == 'kitchen' and password == self.kitchen.password):
            kitchen_token = uuid4()
            self.kitchen_tokens.append(str(kitchen_token))
            return str(kitchen_token)
        else:
            return None
    
    def kitchen_validate(self, token):
        for tok in self.kitchen_tokens:
            if (tok == token):
                return True 
        raise Exception("Cannot validate")

    def wait_validate(self, token):
        for tok in self.wait_tokens:
            if (tok == token):
                return True 
        raise Exception("Cannot validate")

    def manager_validate(self, token):
        for tok in self.manager_tokens:
            if (tok == token):
                return True 
        raise Exception("Cannot validate")

    def customer_validate(self, token):
        for table in self.tables:
            if (table.token == token):
                return True 
        raise Exception("Cannot validate")
    
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
        return {
            "categories": categories
        }


    def get_restaurant_info(self):
        rest_obj = {
            "name": self.name,
            "tables": self.count_tables(),
            "image": self.pic
        }
        password_obj = {
            "kitchen": self.kitchen.password,
            "wait": self.wait.password,
            "manager": self.manager.password
        }
        return {
            "restaurant": rest_obj,
            "passwords": password_obj
        }
        
    def change_restaurant_info(self, name, tab_num, image, kitchen, wait, manager):
        self.name = name
        self.pic = image 
        self.manager.change_kitchen_pw(kitchen)
        self.manager.change_wait_pw(wait)
        self.manager.change_manager_pw(manager)
        self.manager.choose_table_amt(tab_num)

    def get_order_list(self):
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])

    def get_wait_order_list(self):
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                if order.status == OrderStatus.PREPARED:
                    orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])
    
    def get_kitchen_order_list(self):
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                if order.status == OrderStatus.ORDERED or order.status == OrderStatus.COOKING:
                    orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])