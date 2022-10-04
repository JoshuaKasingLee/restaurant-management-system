from flask import Blueprint

customer_routes = Blueprint('customer_routes', __name__)

@customer_routes.route('/customer')
def home():
    return "<h1>Test</h1>"