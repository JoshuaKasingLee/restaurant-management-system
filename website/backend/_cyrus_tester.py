from restaurant import Restaurant
from init_db import query_db
from init_db import conn
import json

cur = conn.cursor()

# cur.execute("INSERT INTO category(name, visible, display_order) values ('Sashimi_test', TRUE, 1)")
# cur.execute("INSERT INTO category(name, visible, display_order) values ('Dessert_test', TRUE, 4)")

# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Ahi_test', 'Tuna (raw)', 'Tuna', 5, 1, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")
# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Aji_test', 'Spanish Mackerel (raw)', 'Mackerel', 6, 2, (SELECT id from category WHERE name = 'Sashimi_test'), null, TRUE)")

# cur.execute("INSERT INTO menu_item(name, description, ingredients, cost, display_order, category, image, visible) values ('Banana Sushi_test', 'This Japanese-inspired dessert combines bananas, chocolate, and pistachios to make one heavenly bite. It may not be authentic wagashi, but it sure is yummy.', 'Bananas, Chocolate', 17.5, 51, (SELECT id from category WHERE name = 'Dessert_test'), null, TRUE)")

restaurant = Restaurant("plateup")

restaurant.populate()

# restaurant.get_menu(restaurant)

# print(restaurant.get_category(restaurant, 'Sashimi'))

# restaurant.get_menu_items(restaurant)

print((restaurant.menu_to_JSON(restaurant)))



