from flask import Response, Blueprint
from flask import request
from __init__res import restaurant
from json import dumps

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

    
    

    
