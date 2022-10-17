import pytest

from table import Table
from restaurant import Restaurant
from menu_item import MenuItem
from category import Category
from helper import OrderStatus
from order import Order
from init_db import conn

from staff import Staff
from manager import Manager
from wait_staff import WaitStaff
from kitchen_staff import KitchenStaff
from category import Category
import time
from datetime import datetime

def test_get_assistance_requests():
    cur = conn.cursor()
    cur.execute("delete from tables")

    restaurant = Restaurant("Catalina")
    wait = WaitStaff("test123", restaurant)

    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (2, null, False, True)")
    restaurant.populate()

    t1 = restaurant.tables[0]
    t2 = restaurant.tables[1]
    result = wait.get_assistance_requests()
    assert(result == [])

    t1.toggle_assistance()
    result = wait.get_assistance_requests()
    assert(result == [{"table": 1}])

    t2.toggle_assistance()
    result = wait.get_assistance_requests()
    assert(result == [{"table": 1}, {"table": 2}])

    wait.resolve_assistance_request(1)
    result = wait.get_assistance_requests()
    assert(result == [{"table": 2}])

    wait.resolve_assistance_request(2)
    result = wait.get_assistance_requests()
    assert(result == [])

    cur.execute("delete from tables")
    conn.commit()


def test_resolve_assistance_requests():
    cur = conn.cursor()
    cur.execute("delete from tables")

    restaurant = Restaurant("Catalina")
    wait = WaitStaff("test123", restaurant)

    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (1, null, False, True)")
    cur.execute("INSERT INTO tables(num, budget, needs_assistance, occupied) values (2, null, False, True)")

    restaurant.populate()
    t1 = restaurant.tables[0]
    t1.toggle_assistance()
    t2 = restaurant.tables[1]
    t2.toggle_assistance()

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == True)
    assert(t2.needs_assistance)

    wait.resolve_assistance_request(2)

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == False)
    assert(not t2.needs_assistance)

    wait.resolve_assistance_request(1)

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == False)
    assert(not t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == False)
    assert(not t2.needs_assistance)

    # repeat again in case

    t1.toggle_assistance()
    t2.toggle_assistance()

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == True)
    assert(t2.needs_assistance)

    wait.resolve_assistance_request(2)

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == True)
    assert(t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == False)
    assert(not t2.needs_assistance)

    wait.resolve_assistance_request(1)

    cur.execute("select needs_assistance from tables where num = %s", ['1'])
    assert(cur.fetchone()[0] == False)
    assert(not t1.needs_assistance)

    cur.execute("select needs_assistance from tables where num = %s", ['2'])
    assert(cur.fetchone()[0] == False)
    assert(not t2.needs_assistance)

    cur.execute("delete from tables")
    conn.commit()

pytest.main()