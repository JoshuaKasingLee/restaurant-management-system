from staff import Staff
from init_db import conn
# from helper import StaffRole

class WaitStaff(Staff):
    def __init__(self, password, restaurant):
        super().__init__(password, restaurant)

    def update_status(self, id, status):
        for table in self.restaurant.tables:
            table.update_order_status(id, status)
    
    def get_order_list(self):
        all_orders = self.restaurant.get_wait_order_list()
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

    def get_assistance_requests(self):
        tables = []
        for t in self.restaurant.tables:
            if t.needs_assistance:
                tables.append({"table": t.number})
        return tables

    def resolve_assistance_request(self, table_num):
        cur = conn.cursor()
        for t in self.restaurant.tables:
            if t.number == table_num and t.needs_assistance:
                try:
                    cur.execute("update tables set needs_assistance = %s where num = %s", [False, table_num])
                except Exception as err:
                    conn.rollback()
                    raise Exception("Unrequesting assistance failed")
                conn.commit()

                t.needs_assistance = False
        return table_num