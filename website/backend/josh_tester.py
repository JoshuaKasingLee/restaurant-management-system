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

r1 = Restaurant("Nobu")
m1 = Manager("password", r1)
m1.add_category("Tasty")
m1.add_category("Yummers")
m1.category_visiblity_change(1, True)
assert(m1.restaurant.categories[0].visible)

conn.commit()