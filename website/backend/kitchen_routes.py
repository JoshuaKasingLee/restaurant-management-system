from flask import Blueprint
from flask import request
from __init__res import restaurant
from json import dumps

kitchen_routes = Blueprint('kitchen_routes', __name__)

# @kitchen_routes.route('/kitchen')
# def home():
#     return "<h1>Test</h1>"