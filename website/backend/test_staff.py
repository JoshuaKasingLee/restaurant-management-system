import pytest
from staff import Staff
from restaurant import Restaurant

def test_get_restaurant():
    r = Restaurant("Kelly's Kitchen")
    s = Staff("test123", r)
    assert(s.restaurant.name == "Kelly's Kitchen")

pytest.main()