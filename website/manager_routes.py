from flask import Blueprint

manager_routes = Blueprint('manager_routes', __name__)

@manager_routes.route('/manager')
def home():
    return "<h1>Test</h1>"