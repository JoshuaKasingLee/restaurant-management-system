#from venv import create
from __init__ import create_app
import atexit
from init_db import conn

app = create_app()

def closedb():
    conn.close()
    
atexit.register(closedb)

if __name__ == '__main__':
    app.run(debug=True)


