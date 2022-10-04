#from venv import create
from website import create_app

app = create_app()

#initialise restaurant class here (constructing it. it should be global)

if __name__ == '__main__':
    app.run(debug=True)