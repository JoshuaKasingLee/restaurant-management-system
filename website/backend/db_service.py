from init_db import conn
from datetime import datetime
from helper import OrderStatus

class DbService:
    
    # tables

    def get_table_id(num: int) -> int:
        cur = conn.cursor()
        cur.execute("select id from tables where num = %s", [num])
        if not (cur.rowcount == 1):
            raise Exception("Table could not be found")
        return cur.fetchone()[0]

    def delete_table_num(num: int):
        cur = conn.cursor()
        cur.execute("""delete from tables where num = %s""", [num])
        if not (cur.rowcount == 1):
            conn.rollback()
            raise Exception("Table could not be found")
        conn.commit()

    def insert_new_table(num: int):
        cur = conn.cursor()
        try:
            cur.execute("""INSERT INTO tables(num, budget, needs_assistance, occupied) values (%s, null, False, False)""", [num])
        except Exception as err:
            conn.rollback()
            raise Exception("SQL Statement Failed")
        conn.commit()

    def update_table_to_occupied(num: int):
        cur = conn.cursor()
        cur.execute("""update tables set occupied = True where num = %s""", [num])
        if not (cur.rowcount == 1):
            raise Exception("Table could not be found")
        conn.commit()

    def update_table_assistance(num: int, assistance: bool):
        cur = conn.cursor()
        cur.execute("update tables set needs_assistance = %s where num = %s", [assistance, num])
        if not (cur.rowcount == 1):
            conn.rollback()
            raise Exception("Assistance request failed")
        conn.commit()

    def update_table_budget(num: int, budget: float):
        cur = conn.cursor()
        cur.execute("update tables set budget = %s where num = %s", [budget, num])
        if not (cur.rowcount == 1):
            raise Exception("Setting budget failed")
        conn.commit()

    def clear_table_data(num: int):
        cur = conn.cursor()
        try:
            table_id = DbService.get_table_id(num)
            cur.execute("update tables set budget = %s, needs_assistance = %s, occupied = %s where num = %s", [None, False, False, num])
            cur.execute("delete from orders where table_num = %s", [table_id])
        except Exception as err:
            conn.rollback()
            raise Exception("Clearing table failed")
        conn.commit()

    # categories

    def get_category_name(category_id: int) -> str:
        cur = conn.cursor()
        cur.execute("select name from category where id = %s", [category_id])
        if not (cur.rowcount == 1): 
            raise Exception("No category with that id was found")
        return cur.fetchone()[0]

    def get_category_id(category_name: str) -> int:
        cur = conn.cursor()
        cur.execute("select id from category where name = %s", [category_name])
        if not (cur.rowcount == 1): 
            raise Exception("No category with that name was found")
        return cur.fetchone()[0]

    def insert_category(category_name: str, category_order: int):
        cur = conn.cursor()
        try:
            cur.execute("""INSERT INTO category(name, visible, display_order) values (%s, %s, %s)""", [category_name, False, category_order])
        except Exception as err:
            conn.rollback()
            raise Exception("Inserting new category failed")
        conn.commit()

    def update_category(cat_id: int, show: bool, new_name: str):
        cur = conn.cursor()
        cur.execute("""update category set visible = %s, name = %s where id = %s""", [show, new_name, cat_id])
        if not (cur.rowcount == 1): 
            raise Exception("Unable to update category visibility")
        conn.commit()

    def delete_category_name(category_name: str):
        cur = conn.cursor()
        cur.execute("""DELETE FROM category where name = %s""", [category_name])
        if not (cur.rowcount == 1): 
            conn.rollback()
            raise Exception("No category with that name was found")
        conn.commit()

    def update_category_display_order(display_order: int, cat_id: int):
        cur = conn.cursor()
        cur.execute("""update category set display_order = %s where id = %s""", [display_order, cat_id])
        if not (cur.rowcount == 1): 
            conn.rollback()
            raise Exception("Display order update failed")
        conn.commit()

    # menu items

    def get_menu_item_name(menu_item_id: int) -> str:
        cur = conn.cursor()
        cur.execute("select name from menu_item where id = %s", [menu_item_id])
        if not (cur.rowcount == 1): 
            raise Exception("No menu item with that id was found")
        return cur.fetchone()[0]

    def get_menu_item_id(item_name: str) -> int:
        cur = conn.cursor()
        cur.execute("select id from menu_item where name = %s", [item_name])
        if not (cur.rowcount == 1): 
            raise Exception("No menu item with that name was found")
        return cur.fetchone()[0]

    def get_menu_item_info(item_name: str) -> list:
        cur = conn.cursor()
        cur.execute("select name, description, ingredients, cost, category, image, visible, display_order from menu_item where name = %s", [item_name])
        if not (cur.rowcount == 1):
            raise Exception("Menu item could not be found")
        return cur.fetchone()

    def delete_menu_item(item_name: str):
        cur = conn.cursor()
        cur.execute("""DELETE FROM menu_item where name = %s""", [item_name])
        if not (cur.rowcount == 1): 
            conn.rollback()
            raise Exception("Deleting menu item failed")
        conn.commit()

    def delete_all_menu_items_with_category(cat_id: int):
        cur = conn.cursor()
        try:
            cur.execute("delete from menu_item where category = %s", [cat_id])
        except:
            conn.rollback()
            raise Exception("Deleting menu items from category failed")
        conn.commit()

    def insert_menu_item(name: str, desc: str, ingredients: str, cost: float, display_order: int, category: str, img):
        cur = conn.cursor()
        try:
            cat_id = DbService.get_category_id(category)
            cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values (%s, %s, %s, %s, %s, %s, %s, %s);", [name, desc, ingredients, cost, display_order, cat_id, img, False]) # need to change to default order at end
        except Exception as err:
            conn.rollback()
            raise Exception("Inserting new menu item failed")
        conn.commit()

    def update_menu_item(category: str, item_name: str, desc: str, ingredients: str, cost: float, show: bool, img, oldname: str):
        cur = conn.cursor()
        try:
            cat_id = DbService.get_category_id(category)
            cur.execute("""update menu_item set name = %s, category = %s, description = %s, ingredients = %s, cost = %s, visible = %s, image = %s where name = %s""", [item_name, cat_id, desc, ingredients, cost, show, img, oldname])
        except Exception as err:
            conn.rollback()
            raise Exception("Updating menu item failed")
        conn.commit()

    def update_menu_item_category_unassigned(category_id: int):
        cur = conn.cursor()
        try:
            unassigned_id = DbService.get_category_id("Unassigned")
            cur.execute("update menu_item set category = %s where category = %s", [unassigned_id, category_id])
        except:
            conn.rollback()
            raise Exception("Moving menu items to Unassigned category failed")
        conn.commit()

    def update_menu_item_display_order(display_order: int, item_id: int):
        cur = conn.cursor()
        cur.execute("""update menu_item set display_order = %s where id = %s""", [display_order, item_id])
        if not (cur.rowcount == 1): 
            conn.rollback()
            raise Exception("Display order update failed")
        conn.commit()


    # def update_menu_item_to_unassigned()

    # def update_menu_item_display(item_id: int, display: ):
        

    def get_all_menu_items_in_category(cat_id: int) -> list:
        cur = conn.cursor()
        cur.execute("select id from menu_item where category = %s", [cat_id])
        return cur.fetchall()

    def get_dish_cost_from_order(order_id: int) -> float:
        cur = conn.cursor()
        cur.execute("select menu_item from orders where id = %s", [order_id])
        if (cur.rowcount == 1):
            menu_item_id = cur.fetchone()[0]
            cur.execute("select cost from menu_item where id = %s", [menu_item_id])
            if (cur.rowcount == 1):
                return cur.fetchone()[0]
            else:
                raise Exception("Menu item could not be found")
        else:
            raise Exception("Order could not be found")

    def get_dish_cost_by_name(item_name: str) -> float:
        cur = conn.cursor()
        cur.execute("select cost from menu_item where name = %s", [item_name])
        if not (cur.rowcount == 1):
            raise Exception("Menu item could not be found")
        return cur.fetchone()[0]

    # menu item tags

    def insert_menu_item_tag(item_name: str, tag_name: str):
        cur = conn.cursor()
        try:
            cur.execute("INSERT INTO menu_item_tags(menu_item, tag) values ((SELECT id from menu_item WHERE name = %s), (SELECT id from tag WHERE name = %s));", [item_name, tag_name])
        except Exception as err:
            conn.rollback()
            raise Exception("Inserting new tag failed")
        conn.commit()

    def delete_menu_item_tags(item_id: str):
        cur = conn.cursor()
        try:
            cur.execute("delete from menu_item_tags where menu_item = %s", [item_id])
        except:
            conn.rollback()
            raise Exception("Deleting related menu item tags failed")
        conn.commit()

    # orders

    def insert_order(item_id: int, table_id: int):
        cur = conn.cursor()
        try:
            cur.execute("""INSERT INTO orders(menu_item, table_num, status) values (%s, %s, %s)""", [item_id, table_id, OrderStatus.ORDERED.value])
        except Exception as err:
            conn.rollback()
            raise Exception("Order insert failed")
        conn.commit()

    def update_order_status(order_id: int, status: str):
        cur = conn.cursor()
        cur.execute("""UPDATE orders SET status = %s WHERE id = %s""", [status, order_id])
        if not (cur.rowcount == 1):
            raise Exception("Order update failed")
        conn.commit()

    def get_most_recent_order() -> int:
        cur = conn.cursor()
        cur.execute("SELECT id FROM ORDERS ORDER BY time_ordered DESC LIMIT 1")
        return cur.fetchone()[0]
    
    # staff

    def update_staff_password(staff: str, password: str):
        cur = conn.cursor()
        cur.execute("""update staff set password = %s where role = %s""", [password, staff])
        if not (cur.rowcount == 1): 
            raise Exception("Updating password failed")
        conn.commit()

    # leaderboard

    def insert_leaderboard_entry(name: str, email: str, score: int, time_played: datetime):
        cur = conn.cursor()
        try:
            cur.execute("""INSERT INTO leaderboard_entry(name, email, score, time_played) values (%s, %s, %s, %s)""", [name, email, score, time_played])
        except Exception as err:
            conn.rollback()
            raise Exception("Unable to add entry")
        conn.commit()

    def clear_leaderboard():
        cur = conn.cursor()
        try:
            cur.execute("""DELETE FROM leaderboard_entry""")
        except Exception as err:
            conn.rollback()
            raise Exception("Unable to delete from leaderboard entry")
        conn.commit()