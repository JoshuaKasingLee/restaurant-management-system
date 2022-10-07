from flask import Blueprint
from flask import request
from __init__res import restaurant

manager_routes = Blueprint('manager_routes', __name__)


@manager_routes.route('/users', methods=['GET'])
def get_restaurant_info():
    #forgot to check token
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    restaurant.manager_validate(token)
    return restaurant.get_restaurant_info()
    


@manager_routes.route('/users', methods=['POST'])
def change_restaurant_info():
    #forgot to check token
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    restaurant.manager_validate(token)
    data = request.get_json()
    rest_obj = data["restaurant"] 
    pass_obj = data["passwords"]
    restaurant.change_restaurant_info(rest_obj["name"], rest_obj["tables"], rest_obj["image"], pass_obj["kitchen"], pass_obj["wait"], pass_obj["manager"])
    return restaurant.get_restaurant_info()
    
