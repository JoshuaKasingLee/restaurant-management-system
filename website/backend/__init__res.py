from restaurant import Restaurant
from kitchen_staff import KitchenStaff
from wait_staff import WaitStaff

restaurant = Restaurant("plateup")
kitchen_staff = KitchenStaff("password", restaurant)
wait_staff = WaitStaff("password", restaurant)

restaurant.populate()