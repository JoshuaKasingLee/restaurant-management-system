from flask import Blueprint

kitchen_routes = Blueprint('kitchen_routes', __name__)

@kitchen_routes.route('/kitchen')
def home():
    return "<h1>Test</h1>"