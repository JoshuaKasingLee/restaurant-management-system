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

# cur = conn.cursor()


# cur.execute("INSERT INTO category(name, visible, display_order) values ('frenche', TRUE, 92);")
# conn.commit
# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargote', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'frenche'), null, TRUE);")
# cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False);")

# restaurant = Restaurant("Catalina")
# frenche = Category("frenche")
# wait_staff = WaitStaff("test123", restaurant)
# kitchen_staff = KitchenStaff("test123", restaurant)
# m1 = MenuItem("Escargote", "Snails in butter", "Snails, butter, oil", 20.80, frenche)
# m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, frenche)
# m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, frenche)

# restaurant.populate()
# # restaurant.clear_leaderboard()
# # restaurant.add_leaderboard_entry('Sam', 'Sam@gmail.com', 25)
# # restaurant.add_leaderboard_entry('John', 'Johnmy@gmail.com', 12)
# # restaurant.add_leaderboard_entry('Cameron', 'Cameron@gmail.com', 1)
# # restaurant.add_leaderboard_entry('Abi', 'Abi@gmail.com', 59)
# # restaurant.add_leaderboard_entry('Gianne', 'Gianne@gmail.com', 11)
# # restaurant.add_leaderboard_entry('Jewel', 'Jewel@gmail.com', 24)
# # restaurant.add_leaderboard_entry('Gorgina', 'Gorgina@gmail.com', 25)
# # restaurant.add_leaderboard_entry('Edina', 'Edina@gmail.com', 25)
# # restaurant.add_leaderboard_entry('Wendy', 'Wendy@gmail.com', 27)
# # restaurant.add_leaderboard_entry('Cathy', 'Cathy@gmail.com', 102)


# # print(restaurant.get_leaderboard())

# # print(restaurant.get_entertainment())

# print(restaurant.tables)

# table1 = restaurant.tables[0]

# table1.order_dish(m1)
# table1.order_dish(m2)
# table1.order_dish(m3)
# table1.order_dish(m2)
# table1.order_dish(m1)

# ordered_list = restaurant.get_order_list()

# cur.execute("select * from orders")
# print(cur.fetchall())

# from menu_item import MenuItem
# from category import Category
# from helper import OrderStatus
# from wait_staff import WaitStaff
# from kitchen_staff import KitchenStaff
# import time

cur = conn.cursor()

# restaurant = Restaurant("plateup")
# # cur.execute("INSERT INTO category(name, visible, display_order) values ('Sashimi_test', TRUE, 1)")
# # cur.execute("INSERT INTO category(name, visible, display_order) values ('Dessert_test', TRUE, 4)")

# # cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ahi_test', 'Tuna (raw)', 'Tuna', 5, 1, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")
# # cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aji_test', 'Spanish Mackerel (raw)', 'Mackerel', 6, 2, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")

# # cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Banana Sushi_test', 'This Japanese-inspired dessert combines bananas, chocolate, and pistachios to make one heavenly bite. It may not be authentic wagashi, but it sure is yummy.', 'Bananas, Chocolate', 17.5, 51, (SELECT id from category WHERE name = 'Dessert_test'), null, TRUE)")

# cur.execute("DELETE FROM menu_item")
# cur.execute("DELETE FROM category")

# cur.execute("INSERT INTO category(name, visible, display_order) values ('Sashimi_test', TRUE, 1)")
# cur.execute("INSERT INTO category(name, visible, display_order) values ('Dessert_test', TRUE, 4)")

# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ahi_test', 'Tuna (raw)', 'Tuna', 5, 1, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")
# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aji_test', 'Spanish Mackerel (raw)', 'Mackerel', 6, 2, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")

# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Banana Sushi_test', 'banana sushi!!', 'Bananas, Chocolate', 17.5, 51, (SELECT id from category WHERE name = 'Dessert_test'), null, TRUE)")    

# restaurant.populate()

# res = restaurant.menu_to_JSON(restaurant)

# cur.execute("DELETE FROM menu_item")
# cur.execute("DELETE FROM category")


# print(res)
# # # restaurant.get_menu(restaurant)

# # # print(restaurant.get_category(restaurant, 'Sashimi'))

# # # restaurant.get_menu_items(restaurant)

# print((restaurant.menu_to_JSON(restaurant)))

# # french = Category("French")
# # m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
# # m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
# # m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

# # restaurant.populate()

restaurant = Restaurant("Catalina")
french = Category("french")
wait_staff = WaitStaff("test123", restaurant)
kitchen_staff = KitchenStaff("test123", restaurant)
m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

cur = conn.cursor()


cur = conn.cursor()

query = '''
    DELETE FROM orders;
    DELETE FROM menu_item;
    DELETE FROM category;
    DELETE FROM tables;
    INSERT INTO category(name, visible, display_order) values ('french', TRUE, 1);
    INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'french'), null, TRUE);
    INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Croissant', 'Filled with almond praline cream', 'Flour, almonds, butter', 6, 2, (SELECT id from category WHERE name = 'french'), null, TRUE);
    INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Steak', 'Medium rare', 'Beef, red wine jus', 48.50, 3, (SELECT id from category WHERE name = 'french'), null, TRUE);
    INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False);
'''

cur.execute(query)

# time.sleep(2)
# cur.execute("INSERT INTO category(name, visible, display_order) values ('french', TRUE, 1);")
# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'french'), null, TRUE);")
# cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False);")
# conn.commit


restaurant.populate()

table1 = restaurant.tables[0]

table1.order_dish(m1)
table1.order_dish(m2)
table1.order_dish(m3)
table1.order_dish(m2)
table1.order_dish(m1)

ordered_list = restaurant.get_order_list()

cur.execute("select * from orders")
print(cur.fetchall())

table1.update_order_status(ordered_list[0]['id'], OrderStatus.COOKING)
table1.update_order_status(ordered_list[1]['id'], OrderStatus.PREPARED)
table1.update_order_status(ordered_list[2]['id'], OrderStatus.PREPARED)
table1.update_order_status(ordered_list[3]['id'], OrderStatus.COMPLETED)
table1.update_order_status(ordered_list[4]['id'], OrderStatus.ORDERED)
ordered_list = restaurant.get_order_list()

# cur.execute("UPDATE orders SET status = 'cooking' WHERE id = 0")
conn.commit()


cur.execute("select * from orders")
# cur.execute("select id from orders")
print(cur.fetchall())

print("--- Wait Staff ---")
print(wait_staff.get_order_list())

print("--- Kitchen Staff ---")
print(kitchen_staff.get_order_list())


# print(restaurant.get_order_list())


expected = OrderStatus.COOKING


cur.execute("DELETE FROM orders")
cur.execute("DELETE FROM menu_item")
cur.execute("DELETE FROM category")
cur.execute("DELETE FROM tables")
conn.commit()