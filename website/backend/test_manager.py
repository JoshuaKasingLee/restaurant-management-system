import pytest
from manager import Manager
from restaurant import Restaurant
from category import Category
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
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
    r2 = Restaurant("Maccas")
    m1 = Manager("password", r1)
    m2 = Manager("mmmmmm", r2)

    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    m1.add_category("Japanese")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)

    assert(r1.category_exists("Japanese") == True)
    assert(r2.category_exists("Japanese") == False)

    m2.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)

    assert(r1.category_exists("Burgers") == False)
    assert(r2.category_exists("Burgers") == True)

    cur.execute("delete from category")
    conn.commit()

def test_add_duplicate_categories():
    cur = conn.cursor()
    cur.execute("delete from category")

    r = Restaurant("Maccas")
    m = Manager("password", r)

    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)

    assert(r.category_exists("Burgers") == True)
    with pytest.raises(Exception):
        m.add_category("Burgers")

    cur.execute("delete from category")
    conn.commit()

# remove categories

def test_remove_categories():
    cur = conn.cursor()
    cur.execute("delete from category")

    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)

    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    m.add_category("Japanese")
    m.add_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 2)
    assert(len(r.categories) == 2)

    m.remove_category("Japanese")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    assert(len(r.categories) == 1)

    assert(r.category_exists("Burgers") == True)
    assert(r.category_exists("Japanese") == False)

    m.remove_category("Burgers")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    assert(len(r.categories) == 0)

    cur.execute("delete from category")
    conn.commit()

def test_remove_nonexistent_categories():
    cur = conn.cursor()
    cur.execute("delete from category")

    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)

    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 0)
    m.add_category("Japanese")
    cur.execute("select * from category")
    assert(len(cur.fetchall()) == 1)
    with pytest.raises(Exception):
        m.remove_menu_item("Burgers")

    cur.execute("delete from category")
    conn.commit()

# add menu items

def test_add_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")

    r1 = Restaurant("Nobu")
    r2 = Restaurant("Maccas")
    m1 = Manager("password", r1)
    m2 = Manager("mmmmmm", r2)

    jap = m1.add_category("Japanese")

    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 0)
    m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")

    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    assert(r1.menu_contains("Sashimi") == True)
    assert(r2.menu_contains("Sashimi") == False)

    burgers = m2.add_category("Burgers")
    m2.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", "Burgers")

    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 2)
    assert(r1.menu_contains("Cheeseburger") == False)
    assert(r2.menu_contains("Cheeseburger") == True)

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()

def test_add_duplicate_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")

    r = Restaurant("Maccas")
    m = Manager("password", r)

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

def test_add_menu_item_with_tags():
    cur = conn.cursor()
    cur.execute("delete from menu_item_tags")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")

    r1 = Restaurant("Nobu")
    m1 = Manager("password", r1)

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

# remove menu items

def test_remove_menu_items():
    cur = conn.cursor()
    cur.execute("delete from category")
    cur.execute("delete from menu_item")

    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    jap = m.add_category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    m.add_menu_item("Udon", "Very yummy", "Noodles, miso, beef", "10.99", "Japanese")
    assert(len(r.menu_items) == 2)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 2)

    m.remove_menu_item("Udon")
    assert(len(r.menu_items) == 1)
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    assert(r.menu_contains("Sashimi") == True)
    assert(r.menu_contains("Udon") == False)

    m.remove_menu_item("Sashimi")
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
    jap = m.add_category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", "Japanese")
    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)
    with pytest.raises(Exception):
        m.remove_menu_item("Udon")

    cur.execute("select * from menu_item")
    assert(len(cur.fetchall()) == 1)

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    conn.commit()
        

def test_change_manager_pw():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    r.manager = m
    #have to keep original pw stored before editing then reset at the end
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
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t2)
    r.tables.append(t3)
    cur = conn.cursor()
    cur.execute("delete from tables where num != 9999")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (4, null, False, False), (5, null, False, False)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, False), (2, null, False, False), (3, null, False, False)")
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
        



    
    

pytest.main()