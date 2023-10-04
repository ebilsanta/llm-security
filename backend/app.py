from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import openai
import os
from functions import execute_function_call
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

openai.api_key = os.environ.get('OPENAI_API_KEY')

app = Flask(__name__)
print(os.environ.get('DATABASE_URI'))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
db = SQLAlchemy(app)
cors = CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

with app.app_context():
    db.create_all()

users = ["john_doe", "jane_smith", "bob_jones", "alice_green", "michael_wang", "susan_brown", "peter_nguyen", "linda_kim", "james_smith", "emily_davis"]

@app.route('/')
def index():
    for user in users:
        new_user = User(username=user)
        db.session.add(new_user)
    db.session.add(new_user)
    db.session.commit()
    return 'Users added to database!'

@app.route('/message', methods=['POST'])
def send_message():
    message = request.json.get('message')  
    function_descriptions = [
        {
            "name": "ask_database",
            "description": "Use this function to answer user questions about a user database. Input should be a fully formed SQL query.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": f"""
                            SQL query extracting info to answer the user's question.
                            SQL should be written using this database schema:
                            user(id, username)
                            The query should be returned in plain text, not in JSON.
                            """,
                    }
                }
            }
        },
    ]
    messages = [{
      "role": "system",
      "content": "You are a chatbot that helps generate sql queries, which will be passed to a function for execution. The table is called 'user' and has the following columns: id, username"
    }]
    messages.append({"role": "user", "content": message})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=messages,
        functions=function_descriptions
    )
    assistant_message = response['choices'][0]['message']
    if assistant_message.get("function_call"):
        result = execute_function_call(assistant_message, db=db)
        return jsonify({'message': assistant_message, "result": result}), 200
    return jsonify({"error": "No function call detected"}), 400

if __name__ == '__main__':
    app.run()
