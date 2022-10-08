from flask import Flask
from flask_cors import CORS
from manager_routes import manager_routes
from waiter_routes import waiter_routes
from customer_routes import customer_routes
from kitchen_routes import kitchen_routes
from flask import request
from __init__res import restaurant
from json import dumps

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(manager_routes, url_prefix='/manager')
    app.register_blueprint(waiter_routes, url_prefix='/waiter')
    app.register_blueprint(customer_routes, url_prefix='/customer')
    app.register_blueprint(kitchen_routes, url_prefix='/kitchen')
    
    #josh's login route here
    @app.route("/login", methods=['POST'])
    def user_login():
        data = request.get_json()
        role = data["role"]
        password = password["password"]
        token = restaurant.login(role, password)
        res = {"token": token}
        return dumps(res)
    return app