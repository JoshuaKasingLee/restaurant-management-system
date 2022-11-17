# This file establishes the connection between the restaurant and the database

import psycopg2
    
# uncomment the database connections you would like to connect to
conn = psycopg2.connect(
    # connection to your local database
    host="localhost",
    database="flask_db",
    user="lubuntu",
    password="lubuntu"

    # connection to the AWS server
    # database="postgres",
    # user="postgres",
    # password="mypassword",
    # host="myrestaurant.cmza9ty67rf0.ap-northeast-1.rds.amazonaws.com",
    # port="5432"
)