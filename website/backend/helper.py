from enum import Enum

# enums used

class OrderStatus(Enum):
    ORDERED = 'ordered'
    COOKING = 'cooking'
    PREPARED = 'prepared'
    COMPLETED = 'completed'

class StaffRole(Enum):
    WAIT = 1
    KITCHEN = 2
    MANAGER = 3

class TagNames(Enum):
    VEGETARIAN = 'vegetarian'
    VEGAN = 'vegan'
    GF = 'gluten free'
    NF = 'nut free'
    DF = 'dairy free'
    CR = 'chef recommended'
