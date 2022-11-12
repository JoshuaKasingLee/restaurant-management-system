# This file tests the edge case functionality of the game entertainment system including functions
# related to the leaderboard and scoring

import pytest
from restaurant import Restaurant
from init_db import conn

def test_add_to_leaderboard():
    restaurant = Restaurant("restaurant")

    cur = conn.cursor()

    cur.execute("DELETE FROM leaderboard_entry")
    restaurant.populate()

    assert(len(restaurant.get_leaderboard()['players']) == 0)

    restaurant.add_leaderboard_entry('Edina', 'Edina@gmail.com', 25)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Edina')

    restaurant.add_leaderboard_entry('Cathy', 'Cathy@gmail.com', 102)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Cathy')

    restaurant.add_leaderboard_entry('Wendy', 'Wendy@gmail.com', 27)
    assert(restaurant.get_leaderboard()['players'][1]['name'] == 'Wendy')

    cur.execute("DELETE FROM leaderboard_entry")
    conn.commit

def test_clear_leaderboard():
    restaurant = Restaurant("restaurant")

    cur = conn.cursor()

    cur.execute("DELETE FROM leaderboard_entry")
    restaurant.populate()

    restaurant.add_leaderboard_entry('Edina', 'Edina@gmail.com', 25)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Edina')

    restaurant.add_leaderboard_entry('Cathy', 'Cathy@gmail.com', 102)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Cathy')

    restaurant.add_leaderboard_entry('Wendy', 'Wendy@gmail.com', 27)
    assert(restaurant.get_leaderboard()['players'][1]['name'] == 'Wendy')

    restaurant.clear_leaderboard()

    assert(len(restaurant.get_leaderboard()['players']) == 0)

    cur.execute("DELETE FROM leaderboard_entry")
    conn.commit

def test_get_entertainment():
    restaurant = Restaurant("restaurant")

    cur = conn.cursor()

    cur.execute("DELETE FROM leaderboard_entry")
    restaurant.populate()

    restaurant.add_leaderboard_entry('Edina', 'Edina@gmail.com', 25)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Edina')

    restaurant.add_leaderboard_entry('Cathy', 'Cathy@gmail.com', 102)
    assert(restaurant.get_leaderboard()['players'][0]['name'] == 'Cathy')

    assert(restaurant.get_entertainment()['gameName'] == 'Cookie Game')

    cur.execute("DELETE FROM leaderboard_entry")
    conn.commit


pytest.main()
