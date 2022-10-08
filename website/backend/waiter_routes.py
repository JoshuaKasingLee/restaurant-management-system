from flask import Blueprint
from flask import request
from __init__res import restaurant, wait_staff
from wait_staff import WaitStaff
from helper import OrderStatus

waiter_routes = Blueprint('waiter_routes', __name__)

@waiter_routes.route('/orders', methods=['PUT'])
def waiter_update_order():
    data = request.get_json()
    id = data['id']
    given_status = data['status']

    if given_status == 'completed':
        status = OrderStatus.COMPLETED

    wait_staff.get_order_list()
    res = WaitStaff.order_list(restaurant)
    return {
        'orders': res
    }

@waiter_routes.route('/orders', methods=['GET'])
def waiter_orders():
    res = wait_staff.get_order_list()
    return {
        'orders': res
    }