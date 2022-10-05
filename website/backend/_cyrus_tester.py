from restaurant import Restaurant
from init_db import query_db
from init_db import conn

cur = conn.cursor()

restaurant = Restaurant("plateup")

restaurant.populate()

# restaurant.get_menu(restaurant)

# print(restaurant.get_category(restaurant, 'Sashimi'))

# restaurant.get_menu_items(restaurant)

print(restaurant.menu_to_JSON(restaurant))