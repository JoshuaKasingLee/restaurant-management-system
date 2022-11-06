import pytest
from __init__ import create_app
import atexit
from init_db import conn


def closedb():
    conn.close()

@pytest.fixture()
def app():
    app = create_app()
    app.config.update({
        "TESTING": True
    })
    atexit.register(closedb)
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
    
def test_example(client):
    res = client.get("/customer/table")
    assert(res.json == {'numTables': 0})
    
    
pytest.main()