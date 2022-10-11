from staff import Staff
# from helper import StaffRole

class KitchenStaff(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)

    def update_status(self, id, status):
        for table in self.restaurant.tables:
            table.update_order_status(id, status)
    
    def get_order_list(self):
        all_orders = self.restaurant.get_kitchen_order_list()
        orders = []
        for order in all_orders:
            to_append = {
                'id': order['id'],
                'table': order['table'],
                'name': order['menu_item'],
                'status': order['status']
            }
            orders.append(to_append)
        return orders