from flask import Blueprint
from flask import request
from __init__res import restaurant

manager_routes = Blueprint('manager_routes', __name__)


@manager_routes.route('/users', methods=['GET'])
def get_restaurant_info():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    return restaurant.get_restaurant_info()
    


@manager_routes.route('/users', methods=['POST']) # is this meant to be put?
def change_restaurant_info():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    rest_obj = data["restaurant"] 
    pass_obj = data["passwords"]
    restaurant.change_restaurant_info(rest_obj["name"], rest_obj["tables"], rest_obj["image"], pass_obj["kitchen"], pass_obj["wait"], pass_obj["manager"])
    return restaurant.get_restaurant_info()
    
@manager_routes.route('/menu', methods=['GET'])
def edit_menu():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    res = restaurant.menu_to_JSON()
    return res

@manager_routes.route('/categories', methods=['POST'])
def add_category():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    cat_name = data["name"]
    cat = restaurant.manager.add_category(cat_name)
    return {
        "name": cat.name,
        "show": cat.visible,
        "positionId": cat.display_order
    }
    
@manager_routes.route('/items', methods=['POST'])
def add_menu_item():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    name = data["name"]
    desc = data["description"]
    ingredients = data["ingredients"]
    cost = data["cost"]
    category = data["category"]
    tags = data["tags"]
    img = data["img"]
    restaurant.manager.add_menu_item(name, desc, ingredients, cost, category, tags, img)
    res = restaurant.category_to_JSON(category)
    return res

@manager_routes.route('/items/<path:ItemName>', methods=['DELETE'])
def remove_menu_item(ItemName):
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    category = data["category"]
    restaurant.manager.remove_menu_item(ItemName)
    res = restaurant.category_to_JSON(category)
    return res