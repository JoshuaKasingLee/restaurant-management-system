# Restaurant object class adhering to Object-Oriented design as per the UML diagram
# The purpose of this class is to control the inherent functionality of the restaurant allowing the interactability 
# of all users to other objects such as tables, categories, menu-items and the leaderboard

from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table
from menu_item import MenuItem
from category import Category
from leaderboard_entry import LeaderboardEntry
from helper import OrderStatus
from init_db import conn
from uuid import uuid4
from datetime import datetime

class Restaurant:
    def __init__(self, name: str):
        self.name = name
        self.pic = "https://media.istockphoto.com/vectors/sushi-logo-vector-id1257720422?k=20&m=1257720422&s=612x612&w=0&h=uryvlA7FalZfJeXcK2OkChqEfVxV0GX3FxvZP_J4tl0="
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
        
    def populate(self):
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
            tag_query = """select t.name from tag t join menu_item_tags mit on mit.tag = t.id where mit.menu_item = %s"""
            cur.execute(tag_query, [id])
            tag_list = cur.fetchall()
            menu_tags = {"vegetarian": False, "vegan": False, "gluten free": False, "nut free": False, "dairy free": False, "chef recommended": False}
            for tag_name in tag_list:
                for tag in tag_name:
                    menu_tags[tag] = True

            category_query = """SELECT c.name FROM category c JOIN menu_item m ON m.category = c.id WHERE m.id = %s"""
            cur.execute(category_query, [id])
            category_name = cur.fetchone()[0]
            
            for category in self.categories:
                if category_name == category.name:
                    menu_item_category = category
                    break
            
            self.menu_items.append(MenuItem(name, description, ingredients, cost, menu_item_category, menu_tags, image, visible, display_order))
        
        cur.execute("select name, email, score, time_played from leaderboard_entry")
        result = cur.fetchall()
        for entry in result:
            self.leaderboard.append(LeaderboardEntry(entry[0], entry[1], entry[2], entry[3]))

            
    def menu_contains(self, name: str) -> bool:
        for item in self.menu_items:
            if item.name == name:
                return True
        return False

    def category_exists(self, name: str) -> bool:
        for cat in self.categories:
            if cat.name == name:
                return True
        return False    
        
    def tab_num_exist(self, number: int) -> bool:
        for table in self.tables:
            if (table.number == number):
                return True
        return False
        
    def count_tables(self) -> int:
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
                
                
    def choose_table(self, number: int):
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
        return None
        
                
    def login(self, user: str, password: str) -> str:
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
    
    def kitchen_validate(self, token: str) -> bool:
        for tok in self.kitchen_tokens:
            if (tok == token):
                return True 
        return False

    def wait_validate(self, token: str) -> bool:
        for tok in self.wait_tokens:
            if (tok == token):
                return True 
        return False

    def manager_validate(self, token: str) -> bool:
        for tok in self.manager_tokens:
            if (tok == token):
                return True 
        return False

    def customer_validate(self, token: str) -> bool:
        for table in self.tables:
            if (table.token == token):
                return True 
        return False
    
    # converts a category to JSON
    def category_to_JSON(self, category_name: str) -> dict:
        cur = conn.cursor()
        for category in self.categories:
            if category.name == category_name:
                cur.execute("select id from category where name = %s", [category_name])
                cat_id = cur.fetchone()[0]
                item_list = []
                for menu_item in self.menu_items:
                    if menu_item.category.name == category.name:
                        item_list.append(menu_item.to_JSON())
                return {
                    "id": cat_id,
                    "name": category.name,
                    "visible": category.visible,
                    "display_order": category.display_order,
                    "menu_items": item_list
                }
        
    def menu_to_JSON(self) -> dict:
        categories = []
        for category in self.categories:
            categories.append(self.category_to_JSON(category.name))
        return {
            "categories": categories
        }

    def get_restaurant_info(self) -> dict:
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
        
    def change_restaurant_info(self, name: str, tab_num: int, image, kitchen: str, wait: str, manager: str):
        self.name = name
        self.pic = image 
        self.manager.change_kitchen_pw(kitchen)
        self.manager.change_wait_pw(wait)
        self.manager.change_manager_pw(manager)
        self.manager.choose_table_amt(tab_num)

    def get_order_list(self) -> list:
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])

    def get_wait_order_list(self) -> list:
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                if order.status == OrderStatus.PREPARED:
                    orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])
    
    def get_kitchen_order_list(self) -> list:
        orders_list = []
        for table in self.tables:
            for order in table.orders:
                if order.status == OrderStatus.ORDERED or order.status == OrderStatus.COOKING:
                    orders_list.append(order.to_JSON())
        return sorted(orders_list, key=lambda d: d['time_ordered'])
        
    def find_category(self, name: str) -> Category:
        for cat in self.categories:
            if cat.name == name:
                return cat
        return None
                
    def find_table(self, table: int) -> Table:
        for tab in self.tables:
            if tab.number == table:
                return tab
        return None
    
    def find_menu_item(self, name: str) -> MenuItem:
        for item in self.menu_items:
            if item.name == name:
                return item
        return None

    def add_leaderboard_entry(self, name: str, email: str, score: int, time_played: datetime = datetime.now()) -> LeaderboardEntry:
        entry = LeaderboardEntry(name, email, score, time_played)
        cur = conn.cursor()
        try:
            cur.execute("""INSERT INTO leaderboard_entry(name, email, score, time_played) values (%s, %s, %s, %s)""", [name, email, score, time_played])
        except Exception as err:
            conn.rollback()
            raise Exception("Unable to add entry")
        conn.commit()
        self.leaderboard.append(entry)
        return entry
    
    def clear_leaderboard(self) -> dict:
        cur = conn.cursor()
        success = True
        try:
            cur.execute("""DELETE FROM leaderboard_entry""")
        except Exception as err:
            conn.rollback()
            success = False
            raise Exception("Unable to delete from leaderboard entry")
        conn.commit()

        if (success == True):
            self.leaderboard.clear()
        
        return self.get_leaderboard()


    def get_leaderboard(self) -> dict:
        toReturn = []
        position = 1
        counter = 1
        lastScore = -1
        for entry in sorted(self.leaderboard, key=lambda x: (-x.score, x.name), reverse=False):
            if (lastScore == -1):
                lastScore = entry.score
            elif (entry.score != lastScore):
                position = counter
                lastScore = entry.score
            toReturn.append({
                "position": position,
                "name": entry.name,
                "email": entry.email,
                "score": entry.score,
                "time_played": entry.time_played.strftime("%Y-%m-%d %H:%M:%S")
            })
            counter += 1
                 
        return {
            "players": toReturn
        }

    def get_entertainment(self) -> dict:
        toReturn = []
        position = 1
        for entry in sorted(self.leaderboard, key=lambda x: x.score, reverse=True):
            toReturn.append({
                "position": position,
                "name": entry.name,
                "email": entry.email,
                "score": entry.score,
                "time_played": entry.time_played.strftime("%Y-%m-%d %H:%M:%S")
            })
            position += 1
        return {
            "gameName": "Cookie Game",
            "players": toReturn
        }
        
    def get_all_assistance(self) -> list:
        tables = []
        for t in self.tables:
            if t.needs_assistance:
                tables.append({"table": t.number})
        return tables