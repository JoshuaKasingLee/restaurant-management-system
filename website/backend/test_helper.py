import pytest
from init_db import conn
from helper import get_dish_cost
from table import Table

def test_get_dish_cost():
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
    order_id = cur.fetchone()[0]
    assert(get_dish_cost(order_id) == 20.80)

    table.order_dishes("Croissant", 1)
    cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
    order_id = cur.fetchone()[0]
    assert(get_dish_cost(order_id) == 6)

    table.order_dishes("Steak", 1)
    cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
    order_id = cur.fetchone()[0]
    assert(get_dish_cost(order_id) == 48.50)

    cur.execute("delete from orders")
    cur.execute("delete from menu_item")
    cur.execute("delete from category")
    cur.execute("delete from tables")
    conn.commit()

pytest.main()
