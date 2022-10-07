from helper import OrderStatus
from menu_item import MenuItem
import json

class Order:
    def __init__(self, menu_item: MenuItem, table, time_ordered, status = OrderStatus.ORDERED):
        self.menu_item = menu_item
        self.table = table
        self.status = status
        self.time_ordered = time_ordered
        
    def to_JSON(self):
        return {
            "menu_item": self.menu_item,
            "table": self.table,
            "time_ordered": self.time_ordered,
            "status": self.status
        }