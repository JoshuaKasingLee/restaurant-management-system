import pytest
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from table import Table
from init_db import conn
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from __init__res import restaurant


cur = conn.cursor()
cur.execute("delete from category")
cur.execute("delete from menu_item")

r = Restaurant("Kelly's Kitchen")
m = Manager("kellyscool", r)

cur.execute("select * from category")
assert(len(cur.fetchall()) == 0)
m.add_category("Japanese")
m.add_category("Burgers")
cur.execute("select * from category")
assert(len(cur.fetchall()) == 2)
assert(len(r.categories) == 2)

m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
m.add_menu_item("Golden fish", "Shiny", "Block of gold", "1000", "Japanese")
assert(len(r.menu_items) == 2)

cur.execute("select id from category where name = %s", ["Japanese"])
j_id = cur.fetchone()[0]
m.remove_category(j_id, "removeItems")
cur.execute("select * from category")
assert(len(cur.fetchall()) == 1)
assert(len(r.categories) == 1)

assert(len(r.menu_items) == 0)

# assert(r.category_exists("Burgers") == True)
# assert(r.category_exists("Japanese") == False)
# cur.execute("select id from category where name = %s", ["Burgers"])
# b_id = cur.fetchone()[0]
# m.remove_category(b_id, "removeItems")
# cur.execute("select * from category")
# assert(len(cur.fetchall()) == 0)
# assert(len(r.categories) == 0)

conn.commit()