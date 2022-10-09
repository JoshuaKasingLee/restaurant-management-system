from staff import Staff
# from helper import StaffRole

class WaitStaff(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)

    def update_status(self, id, status):
        for table in self.restaurant.tables:
            table.update_order_status(id, status)
    
    def get_order_list(self):
        return self.restaurant.get_wait_order_list()