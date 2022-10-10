
import psycopg2

#https://www.digitalocean.com/community/tutorials/how-to-use-a-postgresql-database-in-a-flask-application

def query_db(query):
    conn = psycopg2.connect(
        host="localhost",
        database="flask_db",
        user="postgres"
        )
    
    cur = conn.cursor()

    cur.execute(query)

    conn.commit()

    result = cur.fetchall()

    cur.close()
    conn.close()

    return result
    
    
conn = psycopg2.connect(
    host="localhost",
    database="flask_db",
    user="postgres",
    password="james"
    )