import pytest
from staff import Staff
from restaurant import Restaurant
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table
from order import Order
from menu_item import MenuItem
from category import Category
from init_db import conn
import time
from datetime import datetime

def test_get_restaurant():
    r = Restaurant("Kelly's Kitchen")
    s = Staff("test123", r)
    assert(s.restaurant.name == "Kelly's Kitchen")

# def test_get_time_sorted_orders():
#     restaurant = Restaurant("Catalina")
#     french = Category("french")
#     m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
#     m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
#     m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

#     cur = conn.cursor()

#     cur.execute("DELETE FROM menu_item")
#     cur.execute("DELETE FROM category")
#     cur.execute("DELETE FROM tables")

#     cur.execute("INSERT INTO category(name, visible, display_order) values ('french', TRUE, 1)")
#     cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'french'), null, TRUE)")
#     cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Croissant', 'Filled with almond praline cream', 'Flour, almonds, butter', 6, 2, (SELECT id from category WHERE name = 'french'), null, TRUE)")
#     cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Steak', 'Medium rare', 'Beef, red wine jus', 48.50, 3, (SELECT id from category WHERE name = 'french'), null, TRUE)")

#     cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, True), (3, null, True, True)")

#     restaurant.populate()
    
#     table1 = restaurant.tables[0]
#     table2 = restaurant.tables[1]
#     table3 = restaurant.tables[2]

#     table3.order_dish(m3)
#     time.sleep(0.1)
#     table2.order_dish(m1)
#     time.sleep(0.1)
#     table1.order_dish(m1)
#     time.sleep(0.1)
#     table3.order_dish(m2)

#     ordered_list = restaurant.get_order_list()
#     ordered_item_list = []

#     for order in ordered_list:
#         ordered_item_list.append(order['menu_item'].name)
    
#     cur.execute("DELETE FROM menu_item")
#     cur.execute("DELETE FROM category")
#     cur.execute("DELETE FROM tables")

#     expected = ['Steak', 'Escargot', 'Escargot', 'Croissant']
#     assert(ordered_item_list == expected)

pytest.main()