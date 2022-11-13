# Staff object class adhering to Object-Oriented design as per the UML diagram

class Staff:
    def __init__(self, password: str, restaurant):
        self.password = password
        self.restaurant = restaurant
