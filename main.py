#from venv import create
from website import create_app
import atexit
from website.init_db import conn
from website.backend.restaurant import Restaurant

restaurant = Restaurant("plateup")

app = create_app()

    
restaurant.populate

def closedb():
    conn.close()
    
atexit.register(closedb)


if __name__ == '__main__':
    app.run(debug=True)