from flask import Blueprint
from flask import request
from __init__res import restaurant
from json import dumps

waiter_routes = Blueprint('waiter_routes', __name__)

# @waiter_routes.route('/waiter')
# def home():
#     return "<h1>Test</h1>"