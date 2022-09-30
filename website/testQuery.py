from init_db import query_db



print(query_db("select * from staff"))

class Restaurant:
    def __init__(self, name, menu=None):
        self.name = name
        self.tables = []
        if menu is None:
          menu = []
        self.menu = menu
        self.leaderboard = []
        self.manager = None
        self.wait = None
        self.kitchen = None
        
        

a = Restaurant("jeez");
b = Restaurant("jeez");

a.menu.append("tee");


print(a.menu)
print(b.menu)


class Table:
    def __init__(self, number, budget = None, orders=None, needs_assistance = False, occupied = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied
        
        
aee = Table(1,2);
print(aee.occupied)