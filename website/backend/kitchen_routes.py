from flask import Blueprint
from flask import request
from __init__res import restaurant, kitchen_staff
from kitchen_staff import KitchenStaff
from helper import OrderStatus

kitchen_routes = Blueprint('kitchen_routes', __name__)

@kitchen_routes.route('/orders', methods=['PUT'])
def kitchen_update_order():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    restaurant.kitchen_validate(token)

    data = request.get_json()
    id = data['id']
    given_status = data['status']

    if given_status == 'cooking':
        status = OrderStatus.COOKING
    elif given_status == 'prepared':
        status = OrderStatus.PREPARED

    kitchen_staff.get_order_list()
    res = KitchenStaff.order_list(restaurant)
    return {
        'orders': res
    }

@kitchen_routes.route('/orders', methods=['GET'])
def kitchen_orders():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    print("**************", token)
    restaurant.kitchen_validate(token)
    
    res = kitchen_staff.get_order_list()
    return {
        'orders': res
    }