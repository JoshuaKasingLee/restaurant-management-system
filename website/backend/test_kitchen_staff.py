import pytest
from staff import Staff
from restaurant import Restaurant
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from menu_item import MenuItem
from category import Category
from init_db import conn
from helper import OrderStatus
import time


def test_kitchen_order_cooking():
    restaurant = Restaurant("Catalina")
    kitchen_staff = KitchenStaff("test123", restaurant)
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

    kitchen_staff.update_status(ordered_list[0]['id'], OrderStatus.COOKING)

    ordered_list = restaurant.get_order_list()


    expected = OrderStatus.COOKING.value

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()
    
    assert(ordered_list[0]['status'] == expected)

def test_kitchen_order_cooking():
    restaurant = Restaurant("Catalina")
    kitchen_staff = KitchenStaff("test123", restaurant)
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

    kitchen_staff.update_status(ordered_list[0]['id'], OrderStatus.COOKING)
    kitchen_staff.update_status(ordered_list[0]['id'], OrderStatus.PREPARED)

    ordered_list = restaurant.get_order_list()


    expected = OrderStatus.PREPARED.value

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()
    
    assert(ordered_list[0]['status'] == expected)

def test_wait_order_serving():
    restaurant = Restaurant("Catalina")
    wait_staff = WaitStaff("test123", restaurant)
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

    wait_staff.update_status(ordered_list[0]['id'], OrderStatus.COMPLETED)

    ordered_list = restaurant.get_order_list()


    expected = OrderStatus.COMPLETED.value

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()
    
    assert(ordered_list[0]['status'] == expected)

def test_get_staff_menus():
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

    restaurant.populate()

    table1 = restaurant.tables[0]

    table1.order_dish(m1)
    table1.order_dish(m2)
    table1.order_dish(m3)
    table1.order_dish(m2)
    table1.order_dish(m1)

    ordered_list = restaurant.get_order_list()

    table1.update_order_status(ordered_list[0]['id'], OrderStatus.COOKING)
    table1.update_order_status(ordered_list[1]['id'], OrderStatus.PREPARED)
    table1.update_order_status(ordered_list[2]['id'], OrderStatus.PREPARED)
    table1.update_order_status(ordered_list[3]['id'], OrderStatus.COMPLETED)
    table1.update_order_status(ordered_list[4]['id'], OrderStatus.ORDERED)

    conn.commit()

    result = len(wait_staff.get_order_list())
    
    expected = 2
    assert(result == expected)

    result = len(kitchen_staff.get_order_list())
    assert(result == expected)

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()



pytest.main()