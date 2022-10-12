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
    if (tok == None):
        return {"error": "Wrong username or password"}, 401
    res = {"token": tok}
    return res

@customer_routes.route('/menu', methods=['GET'])
def display_menu():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    res = restaurant.menu_to_JSON()
    return res

@customer_routes.route('/order', methods=['POST'])
def order_dishes():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    table = data["table"]
    menu_item = data["menuItem"]
    quantity = data ["quantity"]
    for t in restaurant.tables:
        if t.number == int(table):
            t.order_dishes(menu_item, quantity)
            return {}
    raise Exception("Cannot find table")

@customer_routes.route('/order', methods=['GET'])
def view_orders():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    args = request.args
    table = args.get("table")
    orders = {}
    for t in restaurant.tables:
        if t.number == int(table):
            orders = t.view_orders()
            return orders
    raise Exception("Cannot find table")

@customer_routes.route('/bill', methods=['POST'])
def get_bill():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    table = data["table"]
    type = data["type"]
    for t in restaurant.tables:
        if t.number == int(table):
            if type == 'together':
                cost = t.get_total_cost()
                t.clear_table()
                return {
                    "charge": [cost, 0, 0, 0]
                }
    raise Exception("Cannot find table")