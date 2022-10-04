import pytest
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from table import Table

# restaurant initialisation
def test_make_restaurant():
    r = Restaurant("Kelly's Kitchen")
    assert(r.name == "Kelly's Kitchen")
    assert(r.tables == [])
    assert(r.menu == [])
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
    r1.menu.append(m)
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
    
def test_tab_num_exist():
    r = Restaurant("Kelly's Kitchen")
    t = Table(5)
    t2 = Table(3)
    r.tables.append(t)
    r.tables.append(t2)
    assert(r.tab_num_exist(5))
    assert(r.tab_num_exist(3))
    assert(not r.tab_num_exist(1))
    
def test_count_unoccupied():
    r = Restaurant("Kelly's Kitchen")
    t = Table(5)
    t2 = Table(3)
    r.tables.append(t)
    r.tables.append(t2)
    t.occupied = True
    t2.occupied = True
    assert(r.count_unoccupied() == 0)
    t.occupied = False
    assert(r.count_unoccupied() == 1)
    
def test_remove_unoccupied():
    r = Restaurant("Kelly's Kitchen")
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    t3.occupied = True
    assert(r.count_unoccupied() == 2)
    r.remove_unoccupied()
    assert(r.count_unoccupied() == 1)
    r.remove_unoccupied()
    assert(r.count_unoccupied() == 0)
    r.remove_unoccupied()
    assert(r.count_unoccupied() == 0)
    
def choose_table():
    r = Restaurant("Kelly's Kitchen")
    t = Table(5)
    t2 = Table(3)
    t3 = Table(30)
    r.tables.append(t)
    r.tables.append(t2)
    r.tables.append(t3)
    choose_table(5)
    assert(t.occupied)
    

pytest.main()