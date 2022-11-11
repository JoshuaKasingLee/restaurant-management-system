from staff import Staff
from helper import OrderStatus

class KitchenStaff(Staff):
    def __init__(self, password: str, restaurant):
        super().__init__(password, restaurant)

    def update_status(self, id: int, status: OrderStatus):
        for table in self.restaurant.tables:
            table.update_order_status(id, status)
    
    def get_order_list(self) -> list:
        all_orders = self.restaurant.get_kitchen_order_list()
        orders = []
        for order in all_orders:
            to_append = {
                'id': order['id'],
                'table': order['table'],
                'name': order['menu_item'],
                'status': order['status'],
                'time_ordered': order['time_ordered'].strftime("%Y-%m-%d %H:%M:%S")
            }
            orders.append(to_append)
        return orders