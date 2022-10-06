from datetime import datetime
from helper import OrderStatus
import json

class Order:
    def __init__(self, menu_item, table, status = OrderStatus.ORDERED, time_ordered = datetime.now()):
        self.menu_item = menu_item
        self.table = table
        self.status = status
        self.time_ordered = time_ordered
        
    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)