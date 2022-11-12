from enum import Enum
from init_db import conn

# enums used

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

# helper functions

def get_dish_cost(order_id: int) -> float:
    cur = conn.cursor()
    cur.execute("select menu_item from orders where id = %s", [order_id])
    if (cur.rowcount == 1):
        menu_item_id = cur.fetchone()[0]
        cur.execute("select cost from menu_item where id = %s", [menu_item_id])
        if (cur.rowcount == 1):
            return cur.fetchone()[0]
        else:
            raise Exception("Menu item could not be found")
    else:
        raise Exception("Order could not be found")
