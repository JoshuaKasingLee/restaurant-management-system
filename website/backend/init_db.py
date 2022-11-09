
import psycopg2
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
    user="postgres"
    # database="postgres",
    # user="postgres",
    # password="mypassword",
    # host="myrestaurant.cmza9ty67rf0.ap-northeast-1.rds.amazonaws.com",
    # port="5432"
)