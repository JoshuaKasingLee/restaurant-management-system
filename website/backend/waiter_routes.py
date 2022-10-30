from flask import Blueprint
from flask import request
from __init__res import restaurant, wait_staff
from wait_staff import WaitStaff
from helper import OrderStatus

waiter_routes = Blueprint('waiter_routes', __name__)

@waiter_routes.route('/orders', methods=['PUT'])
def waiter_update_order():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.wait_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    data = request.get_json()
    id = data['id']
    given_status = data['status']

    if given_status == 'completed':
        status = OrderStatus.COMPLETED

    wait_staff.update_status(id, status)
    res = wait_staff.get_order_list()
    return {
        'orders': res
    }

@waiter_routes.route('/orders', methods=['GET'])
def waiter_orders():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.wait_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    res = wait_staff.get_order_list()
    return {
        'orders': res
    }

@waiter_routes.route('/assist', methods=['GET'])
def get_assistance_requests():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.wait_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401
    res = wait_staff.get_assistance_requests()
    return {
        "tables": res
    }

@waiter_routes.route('/assist', methods=['PUT'])
def resolve_assistance_request():
    bearer = request.headers['Authorization']
    token = bearer.split()[1]
    valid = restaurant.wait_validate(token)
    if (valid == False):
        return {"error": "Unable to validate"}, 401

    data = request.get_json()
    table = data["table"]
    try:
        wait_staff.resolve_assistance_request(table)
    except:
        return {"error": "Unrequesting assistance failed"}, 401
    res = wait_staff.get_assistance_requests()
    return {
        "tables": res
    }