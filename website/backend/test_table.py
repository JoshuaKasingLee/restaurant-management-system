import pytest
from table import Table
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from helper import OrderStatus
from init_db import conn
from category import Category


french = Category("French")
m1 = MenuItem("Escargot", "Snails in butter", "Snails, butter, oil", 20.80, french)
m2 = MenuItem("Croissant", "Filled with almond praline cream", "Flour, almonds, butter", 6, french)
m3 = MenuItem("Steak", "Medium rare", "Beef, red wine jus", 48.50, french)

# order menu items

def test_check_order_no_budget():
    cur = conn.cursor()
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])

    table = Table(1)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")
    
    assert(table.check_order_budget("Escargot", 1) == True)
    assert(table.check_order_budget("Escargot", 1000) == True)

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()


def test_check_order_with_budget():
    cur = conn.cursor()
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])

    table = Table(1, 100)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    assert(table.check_order_budget("Escargot", 1) == True)
    assert(table.check_order_budget("Escargot", 4) == True)
    assert(table.check_order_budget("Escargot", 5) == False)
    assert(table.check_order_budget("Escargot", 1000) == False)

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

def test_check_and_order():
    cur = conn.cursor()
    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])

    table = Table(1, 100)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    times_ordered = 0
    while (table.check_order_budget("Escargot", 1)):
        table.order_dishes("Escargot", 1)
        times_ordered += 1

    assert(times_ordered == 4)

    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()


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
    table.order_dishes("Escargot", 1)
    
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

    cur.execute("select * from orders")
    assert(len(cur.fetchall()) == 0)
    table.order_dishes("Escargot", 20)

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

def test_get_bill_together():
    cur = conn.cursor()
    cur.execute("delete from menu_item")
    cur.execute("delete from category")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Croissant', 'Filled with almond praline cream', 'Flour, almonds, butter', 6, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Steak', 'Medium rare', 'Beef, red wine jus', 48.50, 1, %s, TRUE);", [cat_id])

    table = Table(1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m2)
    table.add_order_to_table(m3)
    table.add_order_to_table(m3)
    expected_cost = 20.80*3 + 6 + 48.50*2
    assert(table.get_bill('together') == {
        "total": expected_cost,
        "charge": [expected_cost, 0, 0, 0],
        "order_items": [{
            "name": "Croissant",
            "quantity": 1,
            "cost": 6
        }, {
            "name": "Escargot",
            "quantity": 3,
            "cost": 20.80*3
        }, {
            "name": "Steak",
            "quantity": 2,
            "cost": 48.50*2
        }]
    })

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.close()

def test_get_bill_equal_split():
    cur = conn.cursor()
    cur.execute("delete from menu_item")
    cur.execute("delete from category")

    cur.execute("INSERT INTO category(name, visible, display_order) values ('French', TRUE, 1);")
    cur.execute("select id from category where name = %s", ['French'])
    cat_id = cur.fetchall()[0]
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Escargot', 'Snails in butter', 'Snails, butter, oil', 20.80, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Croissant', 'Filled with almond praline cream', 'Flour, almonds, butter', 6, 1, %s, TRUE);", [cat_id])
    cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, visible) values ('Steak', 'Medium rare', 'Beef, red wine jus', 48.50, 1, %s, TRUE);", [cat_id])

    table = Table(1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m1)
    table.add_order_to_table(m2)
    table.add_order_to_table(m3)
    table.add_order_to_table(m3)
    expected_cost = 20.80*3 + 6 + 48.50*2
    assert(table.get_bill('equal', 3) == {
        "total": expected_cost,
        "charge": [expected_cost / 3, expected_cost / 3, expected_cost / 3, 0],
        "order_items": [{
            "name": "Croissant",
            "quantity": 1,
            "cost": 6
        }, {
            "name": "Escargot",
            "quantity": 3,
            "cost": 20.80*3
        }, {
            "name": "Steak",
            "quantity": 2,
            "cost": 48.50*2
        }]
    })

    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.close()

def test_get_dishes_split_helper():
    table = Table(1)
    dishes = {"person1": [1, 2], "person2": [2, 3], "person3": [4], "person4": []}
    expected = {1: 1, 2: 2, 3: 1, 4: 1}
    assert(table.get_dishes_split(dishes) == expected)

def test_get_bill_split_by_dishes():
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
    
    table.order_dishes("Escargot", 1)
    cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
    dish1_id = cur.fetchone()[0]

    table.order_dishes("Croissant", 1)
    cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
    dish2_id = cur.fetchone()[0]

    table.order_dishes("Steak", 1)
    cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
    dish3_id = cur.fetchone()[0]

    dishes = {
        "person1": [dish1_id, dish3_id],
        "person2": [dish3_id, dish2_id],
        "person3": [dish3_id],
        "person4": []
    }
    expected_cost = 20.80+6+48.50
    expected_p1 = 20.80 + 48.5/3
    expected_p2 = 6 + 48.5/3
    expected_p3 = 48.5/3

    assert(table.get_bill('dish', 3, dishes) == {
        "total": expected_cost,
        "charge": [expected_p1, expected_p2, expected_p3, 0],
        "order_items": [{
            "name": "Croissant",
            "quantity": 1,
            "cost": 6
        }, {
            "name": "Escargot",
            "quantity": 1,
            "cost": 20.80
        }, {
            "name": "Steak",
            "quantity": 1,
            "cost": 48.50
        }]
    })

    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

# clearing table

def test_clear_table():
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

    table = Table(1, 100, [], True, True)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, 100, True, True)")
    table.order_dish(m1)
    table.order_dish(m2)
    table.order_dish(m3)

    assert(table.budget == 100)
    assert(len(table.orders) == 3)
    assert(table.needs_assistance)
    assert(table.occupied)
    table.clear_table()

    cur.execute("select budget from tables where num = %s", ['1'])
    assert(cur.fetchall()[0][0] == None)
    assert(table.budget == None)

    cur.execute("select * from orders where table_num = %s", ['1'])
    assert(len(cur.fetchall()) == 0)
    assert(len(table.orders) == 0)

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchall()[0][0] == False)
    assert(table.needs_assistance == False)

    cur.execute("select occupied from tables where num = %s", ['1'])
    assert(cur.fetchall()[0][0] == False)
    assert(table.occupied == False)

    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

# requests for assistance

def test_request_assistance():
    cur = conn.cursor()
    cur.execute("delete from tables")

    table = Table(1)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == False)
    assert(not table.needs_assistance)

    table.request_assistance()
    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(table.needs_assistance)

    table.unrequest_assistance()
    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == False)
    assert(not table.needs_assistance)

    table.request_assistance()
    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(table.needs_assistance)

    cur.execute("delete from tables")
    conn.commit()

# setting budgets

def test_set_budget():
    cur = conn.cursor()
    cur.execute("delete from tables")
    table = Table(7)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (7, null, False, True)")

    cur.execute("select budget from tables where num = %s", ['7'])
    assert(cur.fetchone()[0] == None)
    assert(table.budget == None)

    table.set_budget(100.50)
    cur.execute("select budget from tables where num = %s", ['7'])
    assert(cur.fetchone()[0] == 100.50)
    assert(table.budget == 100.50)

    table.set_budget(80.88)
    cur.execute("select budget from tables where num = %s", ['7'])
    assert(cur.fetchone()[0] == 80.88)
    assert(table.budget == 80.88)

    table.set_budget()
    cur.execute("select budget from tables where num = %s", ['7'])
    assert(cur.fetchone()[0] == None)
    assert(table.budget == None)

    cur.execute("delete from tables")
    conn.commit()

def test_set_budget_none():
    cur = conn.cursor()
    cur.execute("delete from tables")
    table = Table(13)
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (13, null, False, True)")

    cur.execute("select budget from tables where num = %s", ['13'])
    assert(cur.fetchone()[0] == None)
    assert(table.budget == None)

    table.set_budget()
    cur.execute("select budget from tables where num = %s", ['13'])
    assert(cur.fetchone()[0] == None)
    assert(table.budget == None)

    cur.execute("delete from tables")
    conn.commit()

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


    expected = OrderStatus.COOKING.value

    cur.execute("DELETE FROM orders")
    cur.execute("DELETE FROM menu_item")
    cur.execute("DELETE FROM category")
    cur.execute("DELETE FROM tables")
    conn.commit()
    
    assert(ordered_list[0]['status'] == expected)

pytest.main()