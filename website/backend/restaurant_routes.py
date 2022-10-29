from flask import Blueprint
from flask import request
from __init__res import restaurant

restaurant_routes = Blueprint('restaurant_routes', __name__)

@restaurant_routes.route('', methods=['GET'])
def restaurant_details():
    return {
        "name": "PlateUp Sushi",
        "image": "https://media.istockphoto.com/vectors/sushi-logo-vector-id1257720422?k=20&m=1257720422&s=612x612&w=0&h=uryvlA7FalZfJeXcK2OkChqEfVxV0GX3FxvZP_J4tl0="
    }