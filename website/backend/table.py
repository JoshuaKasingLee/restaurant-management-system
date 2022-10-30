from order import Order
from init_db import conn
from datetime import datetime
from helper import OrderStatus
from category import Category
from menu_item import MenuItem

import json


class Table:
    def __init__(self, number: int, budget = None, orders=None, needs_assistance = False, occupied = False):
        self.number = number
        self.budget = budget
        if orders is None:
            orders = []
        self.orders = orders
        self.needs_assistance = needs_assistance
        self.occupied = occupied
        self.token = None
    
    def to_JSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)

    # order menu items

    def order_dishes(self, menu_item_name, quantity: int):
        if quantity > 0:
            cur = conn.cursor()
            try:
                # need to check row count instead
                cur.execute("select name, description, ingredients, cost, category, image, visible, display_order from menu_item where name = %s", [menu_item_name])
            except Exception as err:
                conn.rollback()
                raise Exception("Menu item could not be found")

            # print(cur.fetchone())
            result = cur.fetchone()
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
            cur.execute("select id from menu_item where name = %s", [menu_item.name])
            item_id = cur.fetchone()[0]
            cur.execute("select id from tables where num = %s", [self.number])
            table_id = cur.fetchone()[0]
            cur.execute("""INSERT INTO orders(menu_item, table_num, status) values (%s, %s, %s)""", [item_id, table_id, OrderStatus.ORDERED.value])
        except Exception as err:
            conn.rollback()
            raise Exception("Order insert failed")

        conn.commit()
        cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
        order_id = cur.fetchone()[0]
        self.add_order_to_table(menu_item, order_id)

    def add_order_to_table(self, menu_item, order_id = None):
        new_order = Order(menu_item, self.number, datetime.now(), order_id)
        self.orders.append(new_order)

    # view orders

    def view_orders(self):
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

    def toggle_assistance(self):
        cur = conn.cursor()

        if (self.needs_assistance):
            try:
                cur.execute("update tables set needs_assistance = %s where num = %s", [False, self.number])
            except Exception as err:
                conn.rollback()
                raise Exception("Unrequesting assistance failed")
            conn.commit()

            self.needs_assistance = False
        else:
            try:
                cur.execute("update tables set needs_assistance = %s where num = %s", [True, self.number])
            except Exception as err:
                conn.rollback()
                raise Exception("Requesting assistance failed")
            conn.commit()
            self.needs_assistance = True


    # request the (split) bill

    def get_total_cost(self):
        cost = 0
        for order in self.orders:
            cost += order.menu_item.cost
        return cost

    def get_bill(self, type: str, num_split: int = 0):
        cur = conn.cursor()

        receipt = []

        for dish_name, quantity in self.get_order_quantities().items():
            cur.execute("select cost from menu_item where name = %s", [dish_name])
            item_cost = cur.fetchone()[0]

            receipt.append({
                "name": dish_name,
                "quantity": quantity,
                "cost": quantity * item_cost
            })

        receipt = sorted(receipt, key = lambda k : k['name'])

        if (type == 'together'):
            return {
                "total": self.get_total_cost(),
                "charge": [self.get_total_cost(), 0, 0, 0],
                "order_items": receipt
            }

        if (type == 'equal'):
            cost_pp = self.get_total_cost() / num_split
            charge_array = []
            i = 0
            while i < 4:
                if i < num_split:
                    charge_array.append(cost_pp)
                else:
                    charge_array.append(0)
                i += 1

            return {
                "total": self.get_total_cost(),
                "charge": charge_array,
                "order_items": receipt
            }

        if (type == 'dish'):
            return self.get_order_quantities()

    def get_order_quantities(self) -> dict:
        receipt = {}
        for order in self.orders:
            if order.menu_item.name in receipt:
                receipt[order.menu_item.name] += 1
            else:
                receipt[order.menu_item.name] = 1
        return receipt

    # budgeting solution functions

    def set_budget(self, budget = None):
        self.budget = budget
        # check whether we need to validate here > 0

    # clear table

    def clear_table(self):
        cur = conn.cursor()

        try:
            cur.execute("select id from tables where num = %s", [self.number])
            table_id = cur.fetchone()[0]
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
    def update_order_status(self, id, status):
        for order in self.orders:
            if order.id == id:
                cur = conn.cursor()
                try:
                    cur.execute("""UPDATE orders SET status = %s WHERE id = %s""", [status.value, id])
                except Exception as err:
                    conn.rollback()
                    raise Exception("Order update failed")
                conn.commit()
                order.update_status(status)
