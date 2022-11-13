# Table object class adhering to Object-Oriented design as per the UML diagram
# The purpose of this class is to control the inherent functionality related to the tables including
# order functionalities, budgeting, and notification of whether tables need assistance

from order import Order
from init_db import conn
from datetime import datetime
from helper import OrderStatus
from category import Category
from menu_item import MenuItem
from db_service import DbService

import json

class Table:
    def __init__(self, number: int, budget: float = None, orders: list=None, needs_assistance: bool = False, occupied: bool = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied
        self.token = None
    
    def to_JSON(self) -> dict:
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)

    # order dishes and view orders

    def check_order_budget(self, menu_item_name: str, quantity: int) -> bool:
        if quantity > 0:
            total_cost = DbService.get_dish_cost_by_name(menu_item_name) * quantity
            current_spend = self.get_total_cost()
            pending_spend = total_cost + current_spend
            if self.budget != None and pending_spend > self.budget:
                return False
            else:
                return True

    def order_dishes(self, menu_item_name: str, quantity: int):
        if quantity > 0:
            result = DbService.get_menu_item_info(menu_item_name)
            name = result[0]
            desc = result[1]
            ingredients = result[2]
            cost = result[3]
            category = Category(result[4])
            img = result[5]
            visible = result[6]
            display_order = result[7]
            menu_item = MenuItem(name, desc, ingredients, cost, category, None, img, visible, display_order)

            i = 0
            while (i < quantity):
                self.order_dish(menu_item)
                i = i + 1

    def order_dish(self, menu_item: MenuItem):
        cur = conn.cursor()
        try:
            item_id = DbService.get_menu_item_id(menu_item.name)
            table_id = DbService.get_table_id(self.number)
            cur.execute("""INSERT INTO orders(menu_item, table_num, status) values (%s, %s, %s)""", [item_id, table_id, OrderStatus.ORDERED.value])
        except Exception as err:
            conn.rollback()
            raise Exception("Order insert failed")

        conn.commit()
        cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
        order_id = cur.fetchone()[0]
        self.add_order_to_table(menu_item, order_id)

    def add_order_to_table(self, menu_item: MenuItem, order_id: int = None):
        new_order = Order(menu_item, self.number, datetime.now(), order_id)
        self.orders.append(new_order)

    def view_orders(self) -> dict:
        order_items = []
        for order in self.orders:
            order_info = {
                "id": order.id,      
                "name": order.menu_item.name,
                "status": order.status.value,
                "cost": order.menu_item.cost,
                "img": order.menu_item.img
            }
            order_items.append(order_info)
        return {
            "total": self.get_total_cost(),
            "orderItems": order_items
        }

    # request assistance

    def request_assistance(self):
        DbService.update_table_assistance(self.number, True)
        self.needs_assistance = True

    def unrequest_assistance(self):
        DbService.update_table_assistance(self.number, False)
        self.needs_assistance = False

    # request the bill (split or together)

    def get_total_cost(self) -> float:
        cost = 0
        for order in self.orders:
            cost += order.menu_item.cost
        return cost

    def get_bill(self, type: str, num_split: int = 0, dishes: dict = {}) -> dict:
        receipt = []
        for dish_name, quantity in self.get_order_quantities().items():
            item_cost = DbService.get_dish_cost_by_name(dish_name)
            receipt.append({
                "name": dish_name,
                "quantity": quantity,
                "cost": quantity * item_cost
            })

        receipt = sorted(receipt, key = lambda k : k['name'])
        charge_array = self.get_charge_array(type, num_split, dishes)

        return {
            "total": self.get_total_cost(),
            "charge": charge_array,
            "order_items": receipt
        }

    def get_charge_array(self, type: str, num_split: int = 0, dishes: dict = {}) -> list:
        charge_array = []
        if (type == 'together'):
            charge_array = [self.get_total_cost(), 0, 0, 0]

        elif (type == 'equal'):
            cost_pp = self.get_total_cost() / num_split
            i = 0
            while i < 4:
                if i < num_split:
                    charge_array.append(cost_pp)
                else:
                    charge_array.append(0)
                i += 1

        elif (type == 'dish'):
            dishes_split = self.get_dishes_split(dishes)
            p1 = 0
            p2 = 0
            p3 = 0
            p4 = 0
            for orderId in dishes["person1"]:
                dish_cost = DbService.get_dish_cost_from_order(orderId)
                p1 += dish_cost / dishes_split[orderId]
            for orderId in dishes["person2"]:
                dish_cost = DbService.get_dish_cost_from_order(orderId)
                p2 += dish_cost / dishes_split[orderId]
            for orderId in dishes["person3"]:
                dish_cost = DbService.get_dish_cost_from_order(orderId)
                p3 += dish_cost / dishes_split[orderId]
            for orderId in dishes["person4"]:
                dish_cost = DbService.get_dish_cost_from_order(orderId)
                p4 += dish_cost / dishes_split[orderId]
            charge_array = [p1, p2, p3, p4]

        else:
            raise Exception("Request bill type does not exist")

        return charge_array

    def get_order_quantities(self) -> dict:
        receipt = {}
        for order in self.orders:
            if order.menu_item.name in receipt:
                receipt[order.menu_item.name] += 1
            else:
                receipt[order.menu_item.name] = 1
        return receipt

    def get_dishes_split(self, dishes: dict) -> dict:
        dishes_split = {}
        for orderId in dishes["person1"]:
            if orderId in dishes_split:
                dishes_split[orderId] += 1
            else:
                dishes_split[orderId] = 1
        for orderId in dishes["person2"]:
            if orderId in dishes_split:
                dishes_split[orderId] += 1
            else:
                dishes_split[orderId] = 1
        for orderId in dishes["person3"]:
            if orderId in dishes_split:
                dishes_split[orderId] += 1
            else:
                dishes_split[orderId] = 1
        for orderId in dishes["person4"]:
            if orderId in dishes_split:
                dishes_split[orderId] += 1
            else:
                dishes_split[orderId] = 1
        return dishes_split

    # set table budget

    def set_budget(self, budget: float = None):
        DbService.update_table_budget(self.number, budget)
        self.budget = budget

    # clear table after dining
        
    def clear_table(self):
        cur = conn.cursor()

        try:
            table_id = DbService.get_table_id(self.number)
            cur.execute("update tables set budget = %s, needs_assistance = %s, occupied = %s where num = %s", [None, False, False, self.number])
            cur.execute("delete from orders where table_num = %s", [table_id])
        except Exception as err:
            conn.rollback()
            raise Exception("Clearing table failed")
        conn.commit()
        
        self.budget = None
        self.orders = []
        self.needs_assistance = False
        self.occupied = False
        self.token = None

    # modifying order

    def update_order_status(self, id: int, status: OrderStatus):
        for order in self.orders:
            if order.id == id:
                DbService.update_order_status(id, status.value)
                order.update_status(status)
