from .staff import Staff
# from helper import StaffRole

class WaitStaff(Staff):
    def __init__(self, password, restaurant):
        super().__init__(self, password, restaurant)