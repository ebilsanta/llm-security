from sqlalchemy import text
import json

def ask_database(query, db):
    with db.engine.connect() as connection:
        print(query)
        try:
            if query.strip().lower().startswith('select'):
                result = str(connection.execute(text(query)).fetchall())
            else:
                connection.execute(text(query))
                connection.commit()
                result = str(connection.execute(text("SELECT * FROM user;")).fetchall())
        except Exception as e:
            result = "Error: invalid query" + str(e)
    return result

def execute_function_call(message, db):
    if message["function_call"]["name"] == "ask_database":
        query = json.loads(message["function_call"]["arguments"])["query"]
        results = ask_database(query, db=db)
    else:
        results = f"Error: function {message['function_call']['name']} does not exist"
    return results


    