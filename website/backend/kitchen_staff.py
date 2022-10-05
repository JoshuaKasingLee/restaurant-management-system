from staff import Staff
# from helper import StaffRole

class KitchenStaff(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)