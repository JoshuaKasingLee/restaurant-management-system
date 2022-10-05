from flask import Blueprint

waiter_routes = Blueprint('waiter_routes', __name__)

@waiter_routes.route('/waiter')
def home():
    return "<h1>Test</h1>"