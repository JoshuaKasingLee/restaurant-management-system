from operator import truediv
from staff import Staff
from menu_item import MenuItem
from category import Category
# from helper import StaffRole

class Manager(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)

    # menu editor functions

    def add_category(self, name):
        if self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} already exists")
        else:
            c = Category(name)
            self.restaurant.categories.append(c)
            return c

    def remove_category(self, name):
        if not self.restaurant.category_exists(name):
            raise Exception(f"Category with name {name} does not exist")
        for cat in self.restaurant.categories:
            if cat.name == name:
                self.restaurant.categories.remove(cat)
                return True
        # check if exception needs to be thrown if no category was found
        return False

    def add_menu_item(self, name, desc, ingredients, cost, category, tags = None, img = None):
        if self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} already exists")
        else:
            m = MenuItem(name, desc, ingredients, cost, category, tags, img)
            self.restaurant.menu.append(m)
            return m

    def remove_menu_item(self, name):
        if not self.restaurant.menu_contains(name):
            raise Exception(f"Menu item with name {name} does not exist")
        for item in self.restaurant.menu:
            if item.name == name:
                self.restaurant.menu.remove(item)
                return True
        # check if exception needs to be thrown if no item was found
        return False

    