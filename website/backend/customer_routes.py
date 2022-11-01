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
            try:
                t.order_dishes(menu_item, quantity)
            except:
                return {"error": f"Ordering menu item {menu_item} failed"}, 401
            return {}
    return {"error": f"Cannot find table number {table}"}, 401

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
    return {"error": f"Cannot find table number {table}"}, 401

@customer_routes.route('/assistance', methods=['PUT'])
def toggle_assistance():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    table = data["table"]
    assistance_required = data["request"]
    for t in restaurant.tables:
        if t.number == int(table):
            if assistance_required:
                try:
                    t.request_assistance()
                except:
                    return {"error": "Assistance request failed"}, 401
            else:
                try:
                    t.unrequest_assistance()
                except:
                    return {"error": "Assistance unrequest failed"}, 401
    return {}

@customer_routes.route('/assistance', methods=['GET'])
def get_assistance_boolean():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    args = request.args
    table = args.get("table")
    for t in restaurant.tables:
        if t.number == int(table):
            return {"request": t.needs_assistance }
    return {"error": f"Cannot find table number {table}"}, 401


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
    num_split = data["numSplit"]
    for t in restaurant.tables:
        if t.number == int(table):
            res = t.get_bill(type, num_split)
            try:
                t.clear_table()
            except:
                return {"error": f"Clearing table {table} failed"}, 401
            return res
    return {"error": f"Cannot find table number {table}"}, 401

@customer_routes.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    # bearer = request.headers['Authorization']
    # token = bearer.split()[1]
    # valid = restaurant.customer_validate(token)
    # if (valid == False):
    #     return {"error": "Unable to validate"}, 401
    return restaurant.get_leaderboard()

@customer_routes.route('/leaderboard', methods=['POST'])
def add_leaderboard_entry():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.customer_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    score = data["score"]
    restaurant.add_leaderboard_entry(name, email, score)
    return {}
