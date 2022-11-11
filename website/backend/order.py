from helper import OrderStatus
from menu_item import MenuItem
from datetime import datetime

class Order:
    def __init__(self, menu_item: MenuItem, table: int, time_ordered: datetime, id: int = None, status = OrderStatus.ORDERED):
        self.menu_item = menu_item
        self.table = table
        self.status = status
        self.time_ordered = time_ordered
        self.id = id

    def update_status(self, status):
        self.status = status
        
    def to_JSON(self):
        return {
            "id": self.id,
            "menu_item": self.menu_item.name,
            "table": self.table,
            "time_ordered": self.time_ordered,
            "status": self.status.value
        }