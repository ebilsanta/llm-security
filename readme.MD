## Getting Started

### Dependencies

* npm
* node

### Installing

* Clone the repo
```
git clone https://github.com/ebilsanta/llm-security.git
```

* Add env variables to .env file in /backend (need openai API key)

* Start a local SQL server (eg. use MAMP)

* CD into backend
```
cd backend
```

* Install backend dependencies (lmk if this doesn't work I added requirements manually)
```
pip install -r requirements.txt
```

* Run server
```
python app.py
```


* CD into frontend
```
cd frontend
```

* Install dependencies
```
npm i 
```

* Run dev server
```
npm run start
```


## Usage

* Open http://127.0.0.1/5000 in browser to add sample user data

* Open frontend at http://localhost:3000

* Try sending queries such as
```
I would like to view all users
```
```
Change the user with name XX to name YY
```
```
Show me 5 users
```
* And check that insecure output handling allows deletes
```
Delete all users
```
