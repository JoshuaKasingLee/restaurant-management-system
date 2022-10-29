from flask import Flask, Response
from flask_cors import CORS
from manager_routes import manager_routes
from waiter_routes import waiter_routes
from customer_routes import customer_routes
from kitchen_routes import kitchen_routes
from restaurant_routes import restaurant_routes
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
    app.register_blueprint(restaurant_routes, url_prefix='/restaurant')
    
    #josh's login route here
    @app.route("/login", methods=['POST'])
    def user_login():
        data = request.get_json()
        role = data["role"]
        password = data["password"]
        token = restaurant.login(role, password)
        if (token == None):
            return {"error": "Wrong username or password"}, 401
        res = {"token": token}
        return dumps(res)
        
        
        
        
    @app.errorhandler(Exception)
    def default_error_handler(e):
        code = 500
        return {"error": "Server ran into an error!"}, 500
    return app