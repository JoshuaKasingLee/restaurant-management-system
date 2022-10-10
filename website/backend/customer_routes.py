from flask import Response, Blueprint
from flask import request
from __init__res import restaurant

customer_routes = Blueprint('customer_routes', __name__)
    
    
@customer_routes.route('/table', methods=['GET'])
def count_tables():
    num = restaurant.count_tables()
    res = {"numTables": num}
    return res

@customer_routes.route('/table', methods=['POST'])
def choose_table():
    data = request.get_json()
    num = data["table"]
    tok = restaurant.choose_table(num)
    res = {"token": tok}
    return res

@customer_routes.route('/menu', methods=['GET'])
def display_menu():
    res = restaurant.menu_to_JSON(restaurant)
    return res

@customer_routes.route('/order', methods=['POST'])
def order_dishes():
    data = request.get_json()
    table = data["table"]
    menu_item = data["menuItem"]
    quantity = data ["quantity"]
    for t in restaurant.tables:
        if t.number == table:
<<<<<<< HEAD
            tok = t.order_dishes(menu_item, quantity)
    # TODO: @kelly fix this, replaced tok with 1 just for frontend testing - Jan
    res = {"token": 1}
    return res # need to check this token
=======
            t.order_dishes(menu_item, quantity)
    return Response(status = 200)
>>>>>>> main

@customer_routes.route('/order?<int:TableNum>', methods=['GET'])
def view_orders(TableNum):
    data = request.get_json()
    for t in restaurant.tables:
        if t.number == TableNum:
            orders = t.view_orders()
    return orders

@customer_routes.route('/bill', methods=['POST'])
def get_bill():
    data = request.get_json()
    table = data["table"]
    type = data["type"]
    for t in restaurant.tables:
        if t.number == table:
            if type == 'together':
                return {
                    "charge": [t.get_total_cost(), 0, 0, 0]
                }