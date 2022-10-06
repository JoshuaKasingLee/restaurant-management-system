from flask import Blueprint
from flask import request
from __init__res import restaurant
from json import dumps

manager_routes = Blueprint('manager_routes', __name__)


@manager_routes.route('/users', methods=['GET'])
def get_restaurant_info():
    return dumps(restaurant.get_restaurant_info())
    


@manager_routes.route('/users', methods=['POST'])
def change_restaurant_info():
    data = request.get_json()
    rest_obj = data["restaurant"] 
    pass_obj = data["passwords"]
    restaurant.change_restaurant_info(rest_obj["name"], rest_obj["tables"], rest_obj["image"], pass_obj["kitchen"], pass_obj["wait"], pass_obj["manager"])
    return dumps(restaurant.get_restaurant_info())
    


