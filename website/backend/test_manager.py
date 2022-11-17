# This file tests the edge case functionality of managers including functions related to
# adding, editing, and removing categories, menu items and number of tables

import pytest
from manager import Manager
from restaurant import Restaurant
from category import Category
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from menu_item import MenuItem
from table import Table
from init_db import conn

# manager initialisation

def test_make_manager():
    r = Restaurant("Tom's Tacos")
    m = Manager("tom123", r)
    assert(m.password == "tom123")
    assert(m.restaurant.name == "Tom's Tacos")

# add categories

def test_add_categories():
    cur = conn.cursor()
    cur.execute("delete from category")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    m1.add_category("Japanese")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(r1.category_exists("Japanese") == True)
    m1.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 3)
    assert(r1.category_exists("Burgers") == True)
    cur.execute("delete from category")
    conn.commit()

def test_add_duplicate_categories():
    cur = conn.cursor()
    cur.execute("delete from category")
    r = Restaurant("Maccas")
    m = Manager("password", r)
    m.add_category("Unassigned")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(r.category_exists("Burgers") == True)
    with pytest.raises(Exception):
        m.add_category("Burgers")
    cur.execute("delete from category")
    conn.commit()

# remove categories

def test_remove_categories_no_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Unassigned")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    m.add_category("Japanese")
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 3)
    assert(len(r.categories) == 3)
    cur.execute("select id from category where name = %s", ["Japanese"])
    j_id = cur.fetchone()[0]
    m.remove_category(j_id, "removeItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(len(r.categories) == 2)
    assert(r.category_exists("Burgers") == True)
    assert(r.category_exists("Japanese") == False)
    cur.execute("select id from category where name = %s", ["Burgers"])
    b_id = cur.fetchone()[0]
    m.remove_category(b_id, "removeItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    assert(len(r.categories) == 1)
    cur.execute("delete from category")
    conn.commit()

def test_remove_categories_removeItems():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Unassigned")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    m.add_category("Japanese")
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 3)
    assert(len(r.categories) == 3)
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    m.add_menu_item("Golden fish", "Shiny", "Block of gold", "1000", "Japanese")
    m.add_menu_item("Fattest big mac", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Burgers")
    m.add_menu_item("Chicken burger", "Shiny", "Block of gold", "1000", "Burgers")
    assert(len(r.menu_items) == 4)
    cur.execute("select id from category where name = %s", ["Japanese"])
    j_id = cur.fetchone()[0]
    m.remove_category(j_id, "removeItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(len(r.categories) == 2)
    assert(len(r.menu_items) == 2)
    assert(r.category_exists("Burgers") == True)
    assert(r.category_exists("Japanese") == False)
    cur.execute("select id from category where name = %s", ["Burgers"])
    b_id = cur.fetchone()[0]
    m.remove_category(b_id, "removeItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    assert(len(r.categories) == 1)
    assert(len(r.menu_items) == 0)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_remove_categories_keepItems():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    m.add_category("Unassigned")
    m.add_category("Japanese")
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 3)
    assert(len(r.categories) == 3)
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    m.add_menu_item("Golden fish", "Shiny", "Block of gold", "1000", "Japanese")
    m.add_menu_item("Fattest big mac", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Burgers")
    m.add_menu_item("Chicken burger", "Shiny", "Block of gold", "1000", "Burgers")
    assert(len(r.menu_items) == 4)
    cur.execute("select id from category where name = %s", ["Unassigned"])
    u_id = cur.fetchone()[0]
    cur.execute("select id from category where name = %s", ["Japanese"])
    j_id = cur.fetchone()[0]
    cur.execute("select id from category where name = %s", ["Burgers"])
    b_id = cur.fetchone()[0]
    m.remove_category(j_id, "keepItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(len(r.categories) == 2)
    assert(len(r.menu_items) == 4)
    assert(r.category_exists("Burgers") == True)
    assert(r.category_exists("Japanese") == False)
    cur.execute("select * from menu_item where category = %s", [u_id])
    assert(len(cur.fetchall()) == 2)
    cur.execute("select * from menu_item where category = %s", [b_id])
    assert(len(cur.fetchall()) == 2)
    m.remove_category(b_id, "keepItems")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    assert(len(r.categories) == 1)
    assert(len(r.menu_items) == 4)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

# add menu items

def test_add_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    jap = m1.add_category("Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 0)
    m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    assert(r1.menu_contains("Sashimi") == True)
    burgers = m1.add_category("Burgers")
    m1.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", "Burgers")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 2)
    assert(r1.menu_contains("Cheeseburger") == True)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_add_duplicate_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r = Restaurant("Maccas")
    m = Manager("password", r)
    m.add_category("Unassigned")
    burgers = m.add_category("Burgers")
    m.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", "Burgers")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    assert(r.menu_contains("Cheeseburger") == True)
    with pytest.raises(Exception):
        m.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", "Burgers")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_add_menu_item_with_no_tags():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    cur.execute("delete from menu_item_tags")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    jap = m1.add_category("Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 0)
    cur.execute("select * from menu_item_tags")
    assert(len(cur.fetchall()) == 0)
    cur.execute("select * from tag")
    assert(len(cur.fetchall()) == 6)
    item = m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese", {"vegetarian": False, "vegan": False, "gluten free": False, "nut free": False, "dairy free": False, "chef recommended": False})
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    cur.execute("select * from menu_item_tags")
    assert(len(cur.fetchall()) == 0)
    assert(item.tags == {"vegetarian": False, "vegan": False, "gluten free": False, "nut free": False, "dairy free": False, "chef recommended": False})
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from menu_item_tags")
    conn.commit()

# add tags

def test_add_menu_item_with_tags():
    cur = conn.cursor()
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    jap = m1.add_category("Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 0)
    cur.execute("select * from menu_item_tags")
    assert(len(cur.fetchall()) == 0)
    cur.execute("select * from tag")
    assert(len(cur.fetchall()) == 6)
    item = m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese", {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    cur.execute("select * from menu_item_tags")
    assert(len(cur.fetchall()) == 2)
    assert(item.tags == {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})

    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_add_menu_item_with_all_tags():
    cur = conn.cursor()
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    jap = m1.add_category("Japanese")
    item = m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese", {"vegetarian": True, "vegan": True, "gluten free": True, "nut free": True, "dairy free": True, "chef recommended": True})
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    cur.execute("select * from menu_item_tags")
    assert(len(cur.fetchall()) == 6)
    assert(item.tags == {"vegetarian": True, "vegan": True, "gluten free": True, "nut free": True, "dairy free": True, "chef recommended": True})
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

# # remove menu items

def test_remove_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Unassigned")
    jap = m.add_category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    m.add_menu_item("Udon", "Very yummy", "Noodles, miso, beef", "10.99", "Japanese")
    assert(len(r.menu_items) == 2)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 2)
    cur.execute("select id from menu_item where name = %s", ["Udon"])
    u_id = cur.fetchone()[0]
    m.remove_menu_item(u_id)
    assert(len(r.menu_items) == 1)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    assert(r.menu_contains("Sashimi") == True)
    assert(r.menu_contains("Udon") == False)
    cur.execute("select id from menu_item where name = %s", ["Sashimi"])
    s_id = cur.fetchone()[0]
    m.remove_menu_item(s_id)
    assert(len(r.menu_items) == 0)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 0)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_remove_nonexistent_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Unassigned")
    jap = m.add_category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    with pytest.raises(Exception):
        m.remove_menu_item(99)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_remove_menu_item_when_in_orders():
    cur = conn.cursor()
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit
    cur.execute("INSERT INTO category(name, visible, display_order) values ('frenche', TRUE, 92);")
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Escargote', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, (SELECT id from category WHERE name = 'frenche'), null, TRUE);")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False);")
    conn.commit
    restaurant = Restaurant("Catalina")
    frenche = Category("frenche")
    manager = Manager("bigboss", restaurant)
    m1 = MenuItem("Escargote", "Snails in butter", "Snails, butter, oil", 20.80, frenche)
    m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, frenche)
    m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, frenche)
    restaurant.populate()
    print(restaurant.tables)
    table1 = restaurant.tables[0]
    table1.order_dish(m1)
    print(restaurant.orders_contain("Escargote"))
    cur.execute("select id from menu_item where name = %s", ['Escargote'])
    menu_item_id = cur.fetchall()[0][0]
    print(menu_item_id)
    with pytest.raises(Exception):
        manager.remove_menu_item(menu_item_id)
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

# changing passwords

def test_change_manager_pw():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    r.manager = m
    cur = conn.cursor()
    cur.execute("select password from staff where role = 'manager'")
    orig = cur.fetchall()[0][0]
    m.change_manager_pw("Bob@5aaaaaaaa")
    assert(r.manager.password == "Bob@5aaaaaaaa")
    cur.execute("select password from staff where role = 'manager'")
    assert(cur.fetchone()[0] == "Bob@5aaaaaaaa")
    cur.execute("""update staff set password = %s where role = 'manager'""", [orig])
    conn.commit()
    
def test_change_wait_pw():
    r = Restaurant("Kelly's Kitchen")
    w = WaitStaff("kellyscool", r)
    r.wait = w
    m = Manager("tomiscool", r)
    r.manager = m
    cur = conn.cursor()
    cur.execute("select password from staff where role = 'wait'")
    orig = cur.fetchall()[0][0]
    m.change_wait_pw("Bob@5aaaaaaaa")
    assert(r.wait.password == "Bob@5aaaaaaaa")
    cur.execute("select password from staff where role = 'wait'")
    assert(cur.fetchone()[0] == "Bob@5aaaaaaaa")
    cur.execute("""update staff set password = %s where role = 'wait'""", [orig])
    conn.commit()
    

def test_change_kitchen_pw():
    r = Restaurant("Kelly's Kitchen")
    k = KitchenStaff("kellyscool", r)
    r.kitchen = k
    m = Manager("tomiscool", r)
    r.manager = m
    cur = conn.cursor()
    cur.execute("select password from staff where role = 'kitchen'")
    orig = cur.fetchall()[0][0]
    m.change_kitchen_pw("Bob@5aaaaaaaa")
    assert(r.kitchen.password == "Bob@5aaaaaaaa")
    cur.execute("select password from staff where role = 'kitchen'")
    assert(cur.fetchone()[0] == "Bob@5aaaaaaaa")
    cur.execute("""update staff set password = %s where role = 'kitchen'""", [orig])
    conn.commit()

# update number of tables

def test_choose_table_amt_need_more_tables():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(50000)
    t2 = Table(30000)
    t3 = Table(30001)
    t4 = Table(1)
    t5 = Table(2)
    t6 = Table(3)
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t6)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    cur = conn.cursor()
    cur.execute("delete from tables where num != 9999")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (50000, null, False, False), (30000, null, False, False), (30001, null, False, False)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, False), (3, null, False, False)")
    m.choose_table_amt(7)
    assert(len(r.tables) == 7)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 7)
    m.choose_table_amt(9)
    assert(len(r.tables) == 9)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 9)
    cur.execute("delete from tables where num != 9999")
    conn.commit()
    
def test_choose_table_amt_need_less_tables():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(1)
    t2 = Table(2)
    t3 = Table(3)
    t4 = Table(4)
    t5 = Table(5)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    r.tables.append(t4)
    r.tables.append(t5)
    cur = conn.cursor()
    cur.execute("delete from tables where num != 9999")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, False), (3, null, False, False)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (4, null, False, False), (5, null, False, False)")
    m.choose_table_amt(3)
    assert(len(r.tables) == 3)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 3)
    m.choose_table_amt(1)
    assert(len(r.tables) == 1)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 1)
    cur.execute("delete from tables where num != 9999")
    conn.commit()
    

def test_choose_table_amt_need_less_tables_but_occupied():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(1)
    t2 = Table(2)
    t3 = Table(3)
    t4 = Table(4)
    t5 = Table(5)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    r.tables.append(t4)
    r.tables.append(t5)
    cur = conn.cursor()
    cur.execute("delete from tables where num != 9999")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, False), (3, null, False, False)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (4, null, False, True), (5, null, False, False)")
    with pytest.raises(Exception):
        m.choose_table_amt(3)
    assert(len(r.tables) == 5)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 5)
    m.choose_table_amt(4)
    assert(len(r.tables) == 4)
    cur.execute("select * from tables")
    assert(len(cur.fetchall()) == 4)
    cur.execute("delete from tables where num != 9999")
    conn.commit()

def test_choose_table_amt_negative():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(1)
    t2 = Table(2)
    t3 = Table(3)
    t4 = Table(4)
    t5 = Table(5)
    r.tables.append(t)
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t2)
    r.tables.append(t3)
    cur = conn.cursor()
    cur.execute("delete from tables where num != 9999")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (4, null, False, False), (5, null, False, False)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, False), (3, null, False, False)")
    cur.execute("delete from tables where num != 9999")
    conn.commit()
    with pytest.raises(Exception):
        m.choose_table_amt(-3)
        
# updating display orders

def test_update_categories_display_order():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    cur = conn.cursor()
    cur.execute("delete from category") 
    m.add_category("Unassigned")
    m.add_category("Sashimi")
    m.add_category("Jap")
    m.add_category("Nice")
    m.add_category("Yum")
    cur.execute("""select id from category where name = %s""", ["Sashimi"])
    id = cur.fetchone()[0]
    cur.execute("""select id from category where name = %s""", ["Yum"])
    other_id = cur.fetchone()[0]
    m.update_categories_display_order([
    {"id": id, "positionId": 20}, {"id": other_id, "positionId": 30}
    ])
    for cat in r.categories:
        if cat.name == "Sashimi":
            assert(cat.display_order == 20)
        elif cat.name == "Yum":
            assert(cat.display_order == 30)
    cur.execute("delete from category")  
    conn.commit()

def test_update_menu_items_display_order():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    cur = conn.cursor()
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    m.add_category("Unassigned")
    m.add_category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    m.add_menu_item("Yum", "Nice", "super super", "1", "Japanese")
    cur.execute("""select id from menu_item where name = %s""", ["Sashimi"])
    id = cur.fetchone()[0]
    cur.execute("""select id from menu_item where name = %s""", ["Yum"])
    other_id = cur.fetchone()[0]
    m.update_menu_items_display_order([
    {"id": id, "positionId": 20}, {"id": other_id, "positionId": 30}
    ])
    for i in r.menu_items:
        if i.name == "Sashimi":
            assert(i.display_order == 20)
        elif i.name == "Yum":
            assert(i.display_order == 30)
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

# edit menu items and categories

def test_edit_menu_item():
    cur = conn.cursor()
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    m1.add_category("Tasty")
    m1.add_category("Japanese")
    item = m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese", {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})
    assert(item.tags == {"vegetarian": True, "vegan": False, "gluten free": True, "nut free": False, "dairy free": False, "chef recommended": False})
    cur.execute("select id from menu_item where name = %s", ["Sashimi"])
    s_id = cur.fetchone()[0]
    item = m1.edit_menu_item(s_id, "Awesome", "Tasty", "Sugoi", "just fish and rice", "1.50", True, {"vegetarian": True, "vegan": True, "nut free": True, "dairy free": True}, "big image of sushi")
    assert(item.name == "Awesome")
    assert(item.category.name == "Tasty")
    assert(item.desc == "Sugoi")
    assert(item.ingredients == "just fish and rice")
    assert(item.cost == "1.50")
    assert(item.tags == {"vegetarian": True, "vegan": True, "nut free": True, "dairy free": True})
    assert(item.visible == True)
    assert(item.img == "big image of sushi")  
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()
    
def test_category_edit():
    cur = conn.cursor()
    cur.execute("delete from category")
    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)
    m1.add_category("Unassigned")
    m1.add_category("Tasty")
    m1.add_category("Yummers")
    cur.execute("select id from category where name = %s", ["Tasty"])
    id = cur.fetchone()[0]
    m1.category_edit(id, True, "Bob")
    assert(m1.restaurant.categories[1].visible)
    assert(m1.restaurant.categories[1].name == "Bob")
    cur.execute("delete from category")
    conn.commit()
    
pytest.main()