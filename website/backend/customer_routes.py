from flask import Blueprint
from json import dumps

customer_routes = Blueprint('customer_routes', __name__)

@customer_routes.route('/')
def home():
    return "<h1>Test</h1>"

@customer_routes.route('/menu', methods=['GET'])
def customer_menu():
    return "<h1>Test</h1>"

@customer_routes.route('/table', methods=['GET'])
def select_table():
    return {"numTables": 10}