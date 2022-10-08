from enum import Enum

# need to check enum values

class OrderStatus(Enum):
    ORDERED = 'ordered'
    COOKING = 'cooking'
    PREPARED = 'prepared'
    COMPLETED = 'completed'

class StaffRole(Enum):
    WAIT = 1
    KITCHEN = 2
    MANAGER = 3