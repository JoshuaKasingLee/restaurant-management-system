from enum import Enum
from init_db import conn

# need to check enum values

class OrderStatus(Enum):
    ORDERED = 'ordered'
    COOKING = 'cooking'
    PREPARED = 'prepared'
    COMPLETED = 'completed'

class StaffRole(Enum):
    WAIT = 1
    KITCHEN = 2
    MANAGER = 3

class TagNames(Enum):
    VEGETARIAN = 'vegetarian'
    VEGAN = 'vegan'
    GF = 'gluten free'
    NF = 'nut free'
    DF = 'dairy free'
    CR = 'chef recommended'

def get_dish_cost(orderId: int):
    cur = conn.cursor()
    try:
        # need to check row count instead
        cur.execute("select menu_item from orders where id = %s", [orderId])
    except Exception as err:
        conn.rollback()
        raise Exception("Order could not be found")

    menu_item_id = cur.fetchone()[0]
    
    try:
        # need to check row count instead
        cur.execute("select cost from menu_item where id = %s", [menu_item_id])
    except Exception as err:
        conn.rollback()
        raise Exception("Menu item could not be found")

    return cur.fetchone()[0]