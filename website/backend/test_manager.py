import pytest
from manager import Manager
from restaurant import Restaurant
from category import Category
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from table import Table

# manager initialisation

def test_make_manager():
    r = Restaurant("Tom's Tacos")
    m = Manager("tom123", r)
    assert(m.password == "tom123")
    assert(m.restaurant.name == "Tom's Tacos")

# add categories

def test_add_categories():
    r1 = Restaurant("Nobu")
    r2 = Restaurant("Maccas")
    m1 = Manager("password", r1)
    m2 = Manager("mmmmmm", r2)

    m1.add_category("Japanese")
    assert(r1.category_exists("Japanese") == True)
    assert(r2.category_exists("Japanese") == False)

    m2.add_category("Burgers")
    assert(r1.category_exists("Burgers") == False)
    assert(r2.category_exists("Burgers") == True)

def test_add_duplicate_categories():
    r = Restaurant("Maccas")
    m = Manager("password", r)

    burgers = Category("Burgers")
    m.add_category("Burgers")
    assert(r.category_exists("Burgers") == True)
    with pytest.raises(Exception):
        m.add_category("Burgers")

# remove categories

def test_remove_categories():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Japanese")
    m.add_category("Burgers")
    assert(len(r.categories) == 2)

    m.remove_category("Japanese")
    assert(len(r.categories) == 1)
    assert(r.category_exists("Burgers") == True)
    assert(r.category_exists("Japanese") == False)

def test_remove_nonexistent_categories():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    m.add_category("Japanese")
    with pytest.raises(Exception):
        m.remove_menu_item("Burgers")

# add menu items

def test_add_menu_items():
    r1 = Restaurant("Nobu")
    r2 = Restaurant("Maccas")
    m1 = Manager("password", r1)
    m2 = Manager("mmmmmm", r2)

    jap = Category("Japanese")
    m1.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", jap)
    assert(r1.menu_contains("Sashimi") == True)
    assert(r2.menu_contains("Sashimi") == False)

    burgers = Category("Burgers")
    m2.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", burgers)
    assert(r1.menu_contains("Cheeseburger") == False)
    assert(r2.menu_contains("Cheeseburger") == True)

def test_add_duplicate_menu_items():
    r = Restaurant("Maccas")
    m = Manager("password", r)

    burgers = Category("Burgers")
    m.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", burgers)
    assert(r.menu_contains("Cheeseburger") == True)
    with pytest.raises(Exception):
        m.add_menu_item("Cheeseburger", "Beef & cheese", "Beef, cheese, bread", "18.2", burgers)

# remove menu items

def test_remove_menu_items():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    jap = Category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", jap)
    m.add_menu_item("Udon", "Very yummy", "Noodles, miso, beef", "10.99", jap)
    assert(len(r.menu) == 2)

    m.remove_menu_item("Udon")
    assert(len(r.menu) == 1)
    assert(r.menu_contains("Sashimi") == True)
    assert(r.menu_contains("Udon") == False)

def test_remove_nonexistent_menu_items():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    jap = Category("Japanese")
    m.add_menu_item("Sashimi", "Very yummy", "Raw salmon, rice, seawood", "12.4", jap)
    with pytest.raises(Exception):
        m.remove_menu_item("Udon")
        
def test_change_manager_pw():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("kellyscool", r)
    r.manager = m
    m.change_manager_pw("Bob@5")
    assert(r.manager.password == "Bob@5")

def test_change_wait_pw():
    r = Restaurant("Kelly's Kitchen")
    w = WaitStaff("kellyscool", r)
    r.wait = w
    m = Manager("tomiscool", r)
    r.manager = m
    m.change_wait_pw("Bob@5")
    assert(r.wait.password == "Bob@5")
    

def test_change_kitchen_pw():
    r = Restaurant("Kelly's Kitchen")
    k = KitchenStaff("kellyscool", r)
    r.kitchen = k
    m = Manager("tomiscool", r)
    r.manager = m
    m.change_kitchen_pw("Bob@5")
    assert(r.kitchen.password == "Bob@5")
    
def test_choose_table_amt_need_more_tables():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    m.choose_table_amt(5)
    assert(len(r.tables) == 5)
    
    m.choose_table_amt(10)
    assert(len(r.tables) == 10)
    
def test_choose_table_amt_need_less_tables():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    t4 = Table(20)
    t5 = Table(10)
    r.tables.append(t)
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t2)
    r.tables.append(t3)
    m.choose_table_amt(3)
    assert(len(r.tables) == 3)
    m.choose_table_amt(1)
    assert(len(r.tables) == 1)
    
def test_choose_table_amt_negative():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    t4 = Table(20)
    t5 = Table(10)
    r.tables.append(t)
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t2)
    r.tables.append(t3)
    with pytest.raises(Exception):
        m.choose_table_amt(-3)
        
def test_choose_table_amt_need_less_tables():
    r = Restaurant("Kelly's Kitchen")
    m = Manager("tomiscool", r)
    r.manager = m
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    t4 = Table(20)
    t5 = Table(10)
    r.tables.append(t)
    r.tables.append(t4)
    r.tables.append(t5)
    r.tables.append(t2)
    r.tables.append(t3)
    t.occupied = True
    t2.occupied = True
    t3.occupied = True
    t4.occupied = True
    with pytest.raises(Exception):
        m.choose_table_amt(2)


    
    

pytest.main()