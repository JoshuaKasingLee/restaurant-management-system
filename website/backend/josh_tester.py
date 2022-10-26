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


r1 = Restaurant("Nobu")
m1 = Manager("password", r1)
cur = conn.cursor()
m1.add_category("Tasty")
m1.add_category("Japanese")
# print(r1.find_category("Japanese").name)


# print(m1.restaurant.find_category("Tasty").name)

item = m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese", {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})
# print(m1.restaurant.find_category("Tasty").name)
assert(item.tags == {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})

item = m1.edit_menu_item("Sashimi", "Awesome", "Tasty", "Sugoi", "just fish and rice", "1.50", True, {"vegetarian": True, "vegan": True, "nut free": True, "dairy free": True}, "big image of sushi")

conn.commit()
# print(item.name)
# # print(r1.find_category("Tasty").name)
# # print(m1.restaurant.find_category("Tasty").name)
# print(item.category.name)
# print(item.desc)
# print(item.ingredients)
# print(item.cost)
# print(item.tags)
# print(item.visible)
# print(item.img)
#change to asserts