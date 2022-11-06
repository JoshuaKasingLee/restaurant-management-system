from restaurant import Restaurant
from init_db import query_db
from init_db import conn
import json
from table import Table
from menu_item import MenuItem
from category import Category
from helper import OrderStatus
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
import time
from manager import Manager

cur = conn.cursor()

restaurant = Restaurant("Catalina")
m = Manager("josh", restaurant)

# cur = conn.cursor()


# cur = conn.cursor()

# time.sleep(2)
# cur.execute("INSERT INTO category(name, visible, display_order) values ('french', TRUE, 1);")
# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'french'), null, TRUE);")
# cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False);")
# conn.commit


restaurant.populate()
# restaurant.clear_leaderboard()
# restaurant.add_leaderboard_entry('Sam', 'Sam@gmail.com', 25)
# restaurant.add_leaderboard_entry('John', 'Johnmy@gmail.com', 12)
# restaurant.add_leaderboard_entry('Cameron', 'Cameron@gmail.com', 1)
# restaurant.add_leaderboard_entry('Abi', 'Abi@gmail.com', 59)
# restaurant.add_leaderboard_entry('Gianne', 'Gianne@gmail.com', 11)
# restaurant.add_leaderboard_entry('Jewel', 'Jewel@gmail.com', 24)
# restaurant.add_leaderboard_entry('Gorgina', 'Gorgina@gmail.com', 25)
# restaurant.add_leaderboard_entry('Edina', 'Edina@gmail.com', 25)
# restaurant.add_leaderboard_entry('Wendy', 'Wendy@gmail.com', 27)
# restaurant.add_leaderboard_entry('Cathy', 'Cathy@gmail.com', 102)


# print(restaurant.get_leaderboard())

print(restaurant.get_entertainment())

# table1 = restaurant.tables[0]

# table1.order_dish(m1)
# table1.order_dish(m2)
# table1.order_dish(m3)
# table1.order_dish(m2)
# table1.order_dish(m1)

# ordered_list = restaurant.get_order_list()

# cur.execute("select * from orders")
# print(cur.fetchall())
