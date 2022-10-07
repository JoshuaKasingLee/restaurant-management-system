from helper import OrderStatus
from menu_item import MenuItem
import json

class Order:
    def __init__(self, menu_item: MenuItem, table, time_ordered, id = None, status = OrderStatus.ORDERED):
        self.menu_item = menu_item
        self.table = table
        self.status = status
        self.time_ordered = time_ordered
        self.id = id
        
    def to_JSON(self):
        return {
            "menu_item": self.menu_item, # this is  MenuItem type FYI
            "table": self.table,
            "time_ordered": self.time_ordered,
            "status": self.status
        }