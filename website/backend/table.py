from order import Order
import requests
from init_db import conn

class Table:
    def __init__(self, number, budget = None, orders=None, needs_assistance = False, occupied = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied

    # order menu items

    def order_dish(self, menu_item):
        new_order = Order(menu_item, self.number)
        self.orders.append(new_order)

    # request assistance

    def toggle_assistance(self):
        if (self.needs_assistance):
            self.needs_assistance = False
        else:
            self.needs_assistance = True

    # budgeting solution functions

    def set_budget(self, budget = None):
        self.budget = budget
        # check whether we need to validate here > 0
