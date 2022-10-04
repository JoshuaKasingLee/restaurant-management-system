from flask import Flask
from website.manager_routes import manager_routes
from website.waiter_routes import waiter_routes
from website.customer_routes import customer_routes
from website.kitchen_routes import kitchen_routes

def create_app():
    app = Flask(__name__)

    app.register_blueprint(manager_routes, url_prefix='/manager')
    app.register_blueprint(waiter_routes, url_prefix='/waiter')
    app.register_blueprint(customer_routes, url_prefix='/customer')
    app.register_blueprint(kitchen_routes, url_prefix='/kitchen');

    return app