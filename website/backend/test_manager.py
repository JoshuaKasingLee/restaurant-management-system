import pytest
from manager import Manager
from restaurant import Restaurant
from category import Category

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

pytest.main()