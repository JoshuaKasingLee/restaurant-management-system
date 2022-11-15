# This file uses whitebox testing of the edge case functionality of the restaurant class including
# functions related to adding, editing, and removing categories, menu items and number of tables

import pytest
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from table import Table
from init_db import conn
from staff import Staff
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff

# restaurant initialisation

def test_get_restaurant():
    r = Restaurant("Kelly's Kitchen")
    s = Staff("test123", r)
    assert(s.restaurant.name == "Kelly's Kitchen")

def test_make_restaurant():
    r = Restaurant("Kelly's Kitchen")
    assert(r.name == "Kelly's Kitchen")
    assert(r.tables == [])
    assert(r.menu_items == [])
    assert(r.leaderboard == [])
    assert(r.manager == None)
    assert(r.wait == None)
    assert(r.kitchen == None)

# menu helper functions

def test_menu_contains():
    r1 = Restaurant("Kelly's Kitchen")
    r2 = Restaurant("Josh's Jams")
    assert(r1.menu_contains("Sashimi") == False)
    assert(r2.menu_contains("Sashimi") == False)
    m = MenuItem("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", Category("Japanese"))
    r1.menu_items.append(m)
    assert(r1.menu_contains("Sashimi") == True)
    assert(r1.menu_contains("Cheeseburger") == False)
    assert(r2.menu_contains("Sashimi") == False)

def test_category_exists():
    r1 = Restaurant("Kelly's Kitchen")
    r2 = Restaurant("Josh's Jams")
    assert(r1.category_exists("Desserts") == False)
    assert(r2.category_exists("Desserts") == False)
    c = Category("Desserts")
    r1.categories.append(c)
    assert(r1.category_exists("Desserts") == True)
    assert(r1.category_exists("Indian") == False)
    assert(r2.category_exists("Desserts") == False)

# table helper functions

def test_tab_num_exist():
    r = Restaurant("Kelly's Kitchen")
    t = Table(5)
    t2 = Table(3)
    r.tables.append(t)
    r.tables.append(t2)
    assert(r.tab_num_exist(5))
    assert(r.tab_num_exist(3))
    assert(not r.tab_num_exist(1))
    
def test_count_tables():
    r = Restaurant("Kelly's Kitchen")
    t = Table(1)
    t2 = Table(2)
    r.tables.append(t)
    r.tables.append(t2)
    assert(r.count_tables() == 2)
    
# token validation tests

def test_login_and_validate():
    r = Restaurant("Kelly's Kitchen")
    k = KitchenStaff("kellyscool", r)
    r.kitchen = k
    m = Manager("tomiscool", r)
    r.manager = m
    w = WaitStaff("bobiscool", r)
    r.wait = w
    k_tok = r.login('kitchen', 'kellyscool')
    w_tok = r.login('wait', 'bobiscool')
    m_tok = r.login('manager', 'tomiscool')
    assert (r.kitchen_validate(k_tok))
    assert (r.wait_validate(w_tok))
    assert (r.manager_validate(m_tok))
    k_tok2 = r.login('kitchen', 'kellyscool')
    assert (r.kitchen_validate(k_tok2))
    assert(k_tok2 != k_tok)
    t = Table(1)
    r.tables.append(t)
    cur = conn.cursor()
    cur.execute("delete from tables where num = 1")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False)")
    c_tok = r.choose_table(1)
    assert(t.occupied)
    assert(r.customer_validate(c_tok))
    cur.execute("delete from tables where num = 1")
    conn.commit()

# restaurant information functions

def test_get_restaurant_info():
    r = Restaurant("cool")
    k = KitchenStaff("kellyscool", r)
    r.kitchen = k
    m = Manager("tomiscool", r)
    r.manager = m
    w = WaitStaff("bobiscool", r)
    r.wait = w
    t = Table(1)
    t2 = Table(2)
    r.tables.append(t)
    r.tables.append(t2)
    res_data = r.get_restaurant_info()
    rest_obj = res_data["restaurant"]
    password_obj = res_data["passwords"]
    assert(rest_obj["name"] == "cool")
    assert(rest_obj["tables"] == 2)
    assert(rest_obj["image"] == "https://media.istockphoto.com/vectors/sushi-logo-vector-id1257720422?k=20&m=1257720422&s=612x612&w=0&h=uryvlA7FalZfJeXcK2OkChqEfVxV0GX3FxvZP_J4tl0=")
    assert(password_obj["kitchen"] == "kellyscool")
    assert(password_obj["wait"] == "bobiscool")
    assert(password_obj["manager"] == "tomiscool")

def test_change_restaurant_info():
    r = Restaurant("cool")
    k = KitchenStaff("kellyscool", r)
    r.kitchen = k
    m = Manager("tomiscool", r)
    r.manager = m
    w = WaitStaff("bobiscool", r)
    r.wait = w
    t = Table(1)
    t2 = Table(2)
    r.tables.append(t)
    r.tables.append(t2)
    cur = conn.cursor()
    r.change_restaurant_info("nice", 5, "sunnies.jpg", "epicA0aaaaaaa", "coolA0aaaaaaa", "greatA0aaaaaaa")
    res_data = r.get_restaurant_info()
    rest_obj = res_data["restaurant"]
    password_obj = res_data["passwords"]
    assert(rest_obj["name"] == "nice")
    assert(rest_obj["tables"] == 5)
    assert(rest_obj["image"] == "sunnies.jpg")
    assert(password_obj["kitchen"] == "epicA0aaaaaaa")
    assert(password_obj["wait"] == "coolA0aaaaaaa")
    assert(password_obj["manager"] == "greatA0aaaaaaa")
    cur.execute("delete from tables where num != 9999")
    m.change_kitchen_pw("kitchenA0five")
    m.change_manager_pw('managerA0five')
    m.change_wait_pw('waiterA0five')
    conn.commit()

pytest.main()
