from flask import Blueprint
from flask import request
from __init__res import restaurant, kitchen_staff
from helper import OrderStatus

kitchen_routes = Blueprint('kitchen_routes', __name__)

@kitchen_routes.route('/orders', methods=['PUT'])
def kitchen_update_order():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.kitchen_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    id = data['id']
    given_status = data['status']
    if given_status == 'cooking':
        status = OrderStatus.COOKING
    elif given_status == 'prepared':
        status = OrderStatus.PREPARED
    kitchen_staff.update_status(id, status)
    res = kitchen_staff.get_order_list()
    return {
        'orders': res
    }

@kitchen_routes.route('/orders', methods=['GET'])
def kitchen_orders():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.kitchen_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    res = kitchen_staff.get_order_list()
    return {
        'orders': res
    }