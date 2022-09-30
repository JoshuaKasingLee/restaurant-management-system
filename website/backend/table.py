class Table:
    def __init__(self, number, budget = None, orders=None, needs_assistance = False, occupied = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied