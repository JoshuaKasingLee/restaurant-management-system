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
    try:
        cat = restaurant.manager.add_category(cat_name)
    except:
        return {"error": f"Category {cat_name} cannot be added, as a category with that name already exists"}, 401
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
    try:
        restaurant.manager.add_menu_item(name, desc, ingredients, cost, category, tags, img)
    except:
        return {"error": f"Menu item {name} cannot be added, as a menu item with that name already exists"}, 401
    res = restaurant.category_to_JSON(category)
    return res

@manager_routes.route('/items/<path:ItemId>', methods=['DELETE'])
def remove_menu_item(ItemId):
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    category = data["category"]
    try:
        restaurant.manager.remove_menu_item(ItemId)
    except:
        return {"error": "Unable to delete menu item"}, 401
    res = restaurant.category_to_JSON(category)
    return res
    
    
@manager_routes.route('/categories', methods=['PUT'])
def edit_categories_display_order():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    try:
        restaurant.manager.update_categories_display_order(data["categories"])
    except:
        return {"error": "Display order update failed"}, 401
    return {}
    
@manager_routes.route('/items', methods=['PUT'])
def edit_menu_items_display_order():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    
    try:
        restaurant.manager.update_menu_items_display_order(data["items"])
    except:
        return {"error": "Display order update failed"}, 401
    return {}

@manager_routes.route('/items/<path:ItemId>', methods=['PUT'])
def edit_menu_item(ItemId):
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    try:
        restaurant.manager.edit_menu_item(ItemId, data["newName"], data["category"], data["description"], data["ingredients"], data["cost"], data["show"], data["tags"], data["img"])
    except:
        return {"error": "Editing menu item failed"}, 401
    res = restaurant.menu_to_JSON()
    return res
    
    
@manager_routes.route('/categories/<path:CategoryId>', methods=['PUT'])
def category_edit(CategoryId):
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    try:
        restaurant.manager.category_edit(int(CategoryId), data['show'], data['name'])
    except:
        return {"error": "Editing category visibility failed"}, 401
    return {}
    
    
@manager_routes.route('/categories/<path:CategoryId>', methods=['DELETE'])
def category_delete(CategoryId):
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    try:
        restaurant.manager.remove_category(CategoryId, data["type"])
    except:
        return {"error": "Unable to delete category"}, 401
    return restaurant.menu_to_JSON()
            

@manager_routes.route('/entertainment', methods=['GET'])
def get_entertainment():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    return restaurant.get_entertainment()

@manager_routes.route('/entertainment/leaderboard/reset', methods=['POST'])
def reset_leaderboard():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.manager_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    return restaurant.clear_leaderboard()