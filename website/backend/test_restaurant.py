import pytest
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category

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

pytest.main()