from datetime import datetime
from helper import OrderStatus

class Order:
    def __init__(self, menu_item, table, status = OrderStatus.ORDERED, time_ordered = datetime.now()):
        self.menu_item = menu_item
        self.table = table
        self.status = status
        self.time_ordered = time_ordered
        