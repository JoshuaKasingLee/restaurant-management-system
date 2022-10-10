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


for t in restaurant.tables:
    print(t.number)
    
    
for t in restaurant.tables:
    if t.number == int("2"):
        orders = t.view_orders()
        print(orders)