import pytest
from table import Table
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from helper import OrderStatus
from order import Order
from init_db import conn

from staff import Staff
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from category import Category
import time
from datetime import datetime


french = Category("French")
m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

# order menu items

def test_order_dish():
    cur = conn.cursor()
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])

    table = Table(1)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 0)
    table.order_dish(m1)
    
    assert(len(table.orders) == 1)
    assert(table.orders[0].menu_item.name == "Escargot")
    assert(table.orders[0].status == OrderStatus.ORDERED)

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 1)
    
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

def test_order_multiple_dishes():
    cur = conn.cursor()
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Croissant', 'Filled with almond praline cream', 'Flour, almonds, butter', 6, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Steak', 'Medium rare', 'Beef, red wine jus', 48.50, 1, %s, TRUE);", [cat_id])

    table = Table(1)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 0)
    table.order_dish(m1)
    table.order_dish(m2)
    table.order_dish(m3)

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 3)

    assert(len(table.orders) == 3)
    assert(table.orders[0].status == OrderStatus.ORDERED)
    assert(table.orders[1].status == OrderStatus.ORDERED)
    assert(table.orders[2].status == OrderStatus.ORDERED)
    
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

def test_order_duplicate_dishes():
    cur = conn.cursor()
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    table = Table(1)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])
    cur.execute("select id from menu_item where name = %s", ['Escargot'])
    item_id = cur.fetchone()[0]
    print(item_id)

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 0)
    table.order_dishes(item_id, 20)

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 20)
    assert(len(table.orders) == 20)

    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

# bill management

def test_get_total_cost():
    table = Table(1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m2)
    table.add_order_to_table(m3)
    expected_cost = 20.80*2 + 6 + 48.50
    assert(table.get_total_cost() == expected_cost)

# requests for assistance

def test_request_assistance():
    table = Table(1)
    assert(not table.needs_assistance)
    table.toggle_assistance()
    assert(table.needs_assistance)
    table.toggle_assistance()
    assert(not table.needs_assistance)

# setting budgets

def test_set_budget():
    table = Table(7)
    table.set_budget(100.50)
    assert(table.budget == 100.50)

def test_set_budget_none():
    table = Table(13)
    table.set_budget()
    assert(table.budget == None)

def test_update_order_status():
    restaurant = Restaurant("Catalina")
    french = Category("french")
    m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)

    cur = conn.cursor()

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('french', TRUE, 1)")
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'french'), null, TRUE)")

    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")


    restaurant.populate()
    
    table1 = restaurant.tables[0]

    table1.order_dish(m1)

    ordered_list = restaurant.get_order_list()

    table1.update_order_status(ordered_list[0]['id'], OrderStatus.COOKING)
    ordered_list = restaurant.get_order_list()


    expected = OrderStatus.COOKING

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()
    
    assert(ordered_list[0]['status'] == expected)

pytest.main()