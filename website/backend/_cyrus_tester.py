from restaurant import Restaurant
from init_db import query_db
from init_db import conn

cur = conn.cursor()

restaurant = Restaurant("plateup")

restaurant.populate()

restaurant.get_menu(restaurant)
