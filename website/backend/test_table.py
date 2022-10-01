import pytest
from table import Table
from menu_item import MenuItem
from category import Category
from helper import OrderStatus

french = Category("French")
m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

# order menu items

def test_order_dish():
    table = Table(1)
    table.order_dish(m1)
    assert(len(table.orders) == 1)
    assert(table.orders[0].menu_item.name == "Escargot")
    assert(table.orders[0].status == OrderStatus.ORDERED)

def test_order_multiple_dishes():
    table = Table(1)
    table.order_dish(m1)
    table.order_dish(m2)
    table.order_dish(m3)
    assert(len(table.orders) == 3)
    assert(table.orders[0].status == OrderStatus.ORDERED)
    assert(table.orders[1].status == OrderStatus.ORDERED)
    assert(table.orders[2].status == OrderStatus.ORDERED)

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

pytest.main()