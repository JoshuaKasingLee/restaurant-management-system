from flask import Blueprint
from __init__res import restaurant

restaurant_routes = Blueprint('restaurant_routes', __name__)

@restaurant_routes.route('', methods=['GET'])
def restaurant_details():

    return {
        "name": restaurant.name,
        "image": restaurant.pic
    }