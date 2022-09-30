#from venv import create
from website import create_app
import atexit

import psycopg2

#initialise restaurant class here (constructing it. it should be global)

app = create_app()

conn = psycopg2.connect(
    host="localhost",
    database="flask_db",
    user="postgres"
    )

def closedb():
    conn.close()
    
atexit.register(closedb)


if __name__ == '__main__':
    app.run(debug=True)