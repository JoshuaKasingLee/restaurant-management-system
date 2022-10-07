from order import Order
from init_db import conn
from datetime import datetime
from helper import OrderStatus


import json

class Table:
    def __init__(self, number: int, budget = None, orders=None, needs_assistance = False, occupied = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied
        self.token = None

    # order menu items

    def order_dish(self, menu_item):
        cur = conn.cursor()
        try:
            cur.execute("select id from menu_item where name = %s", [menu_item.name])
            item_id = cur.fetchone()[0]
            cur.execute("select id from tables where num = %s", [self.number])
            table_id = cur.fetchone()[0]
            cur.execute("""INSERT INTO orders(menu_item, table_num, status) values (%s, %s, %s)""", [item_id, table_id, OrderStatus.ORDERED.value])
        except Exception as err:
            conn.rollback()
            raise Exception("Order insert failed")

        conn.commit()
        order_id = cur.lastrowid
        self.add_order_to_table(menu_item, order_id)

    def add_order_to_table(self, menu_item, order_id = None):
        new_order = Order(menu_item, self.number, datetime.now(), order_id)
        self.orders.append(new_order)

    # request assistance

    def toggle_assistance(self):
        if (self.needs_assistance):
            self.needs_assistance = False
        else:
            self.needs_assistance = True

    # request the (split) bill

    def get_total_cost(self):
        cost = 0
        for order in self.orders:
            cost += order.menu_item.cost
        return cost

    # budgeting solution functions

    def set_budget(self, budget = None):
        self.budget = budget
        # check whether we need to validate here > 0

    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)