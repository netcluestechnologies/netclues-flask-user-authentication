# Flask User Authentication

This Flask application implements user registration, login with email/username and password, and login with OTP functionality. It uses SQLAlchemy for ORM, facilitating interaction with a PostgreSQL database. This project provides a basic framework for building more complex authentication systems using Flask.

<p align="center">
    <a href="https://www.python.org/">
        <img src="https://img.shields.io/badge/Python-3.8+-ffd343.svg" alt="Python">
    </a>
    <a href="https://flask.palletsprojects.com/">
        <img src="https://img.shields.io/badge/Flask-3.0.3-05998a.svg" alt="Flask">
    </a>
    <a href="https://www.postgresql.org/">
        <img src="https://img.shields.io/badge/PostgreSQL-16-336791.svg" alt="PostgreSQL">
    </a>
    <a href="https://docs.sqlalchemy.org/">
        <img src="https://img.shields.io/badge/ORM-SQLAlchemy-003b63.svg" alt="ORM">
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
        <img src="https://img.shields.io/badge/HTML-5-e34f26.svg" alt="HTML">
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
        <img src="https://img.shields.io/badge/CSS-3-264de4.svg" alt="CSS">
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
        <img src="https://img.shields.io/badge/JavaScript-ES6+-f7df1e.svg" alt="JavaScript">
    </a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="MIT License">
    </a>
</p>

## 🌟 **Introduction**

- **Flask**: A lightweight WSGI web application framework in Python.
- **User Authentication**: Involves user registration, login, and security features like OTP (One Time Password).
- **ORM**: SQLAlchemy provides an Object Relational Mapper (ORM) that maps Python classes to database tables, simplifying database interactions.

## 🚀 **Getting Started**

### **1. Setup Your Environment**

#### Create a Virtual Environment

To keep your project dependencies isolated, create and activate a virtual environment:

```
python -m venv env
venv/bin/activate  # Activate on Unix/MacOS
venv\Scripts\activate # For Windows use 
```

#### Install Dependencies

Make sure you have Python installed. Then, install the necessary packages:

```
pip install Flask Flask-Bcrypt Flask-SQLAlchemy Flask-Mail psycopg2 pytz
```

### **2. Project Structure**

```
netclues-flask-user-authentication/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   ├── templates/
│   │   ├── home.html
│   │   ├── login.html
│   │   └── login-with-otp.html
│   │   ├── register.html
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── img/
│   │   │   └── logo.png
│   │   ├── js/
│   │   │   └── scripts.js
├── README.md
├── requirements.txt
└── run.py
```

### **3. Understanding the Files**

- `app/__init__.py`: Initializes the Flask app, sets up extensions (SQLAlchemy), and imports routes.
- `app/models.py`: Defines the User model using SQLAlchemy ORM.
- `app/routes.py`: Contains route handlers for registration, login, logout, and OTP verification.
- `app/templates/`: HTML templates for rendering the user interface.
- `app/static/css/styles.css`: CSS for styling the HTML pages.
- `app/static/js/scripts.js`: Placeholder for JavaScript files.
- `README.md`: Project documentation.
- `requirements.txt`: Lists the dependencies for the project.
- `run.py`: Entry point to run the Flask application.

## 🛠️ **Implementing User Authentication Functionality**

### **Models** (`app/models.py`)
Defines the User model using SQLAlchemy ORM:

python
```
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class UserMaster(db.Model):
    __tablename__ = 'user-master'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_date = db.Column(db.DateTime, default=datetime.now)
    updated_date = db.Column(db.DateTime)

    def __init__(self, name, username, email, phone, password, gender, is_verified, is_active, created_date, updated_date):
        self.name = name
        self.username = username
        self.email = email
        self.phone = phone
        self.password = password
        self.gender = gender
        self.is_verified = is_verified
        self.is_active = is_active
        self.created_date = created_date
        self.updated_date = updated_date

# Similar models for otp-master, etc go here
```

### **Routes** (`app/routes.py`)
Defines routes for registration, login, logout, and OTP verification:

python

```
from flask import render_template, request, session, redirect, url_for
from . import app, db
from .models import UserMaster, OTPMaster
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from datetime import datetime, timedelta
import secrets
import pytz

bcrypt = Bcrypt(app)
mail = Mail(app)


@app.route("/")
@app.route("/login", methods=['GET', 'POST'])
def login():
    if 'username' in session:
        return redirect(url_for('home'))
    if request.method == 'POST':
        username_emailid = request.form.get('username_emailid')
        password = request.form.get('password')
        users = UserMaster.query.filter((UserMaster.email == username_emailid) | (UserMaster.username == username_emailid)).all()
        if users:
            isUser = False
            for i in users:
                if bcrypt.check_password_hash(i.password, password):
                    isUser = True
                    data = i
            if isUser:
                session.clear()
                session['userid'] = data.id
                session['name'] = data.name
                session['username'] = data.username
                session['email'] = data.email
                session['phone'] = data.phone
                session['gender'] = data.gender
                return {'status': True, 'message': 'Login Successfully ...'}
            else:
                return {'status': False, 'message': 'Invalid Password !!!'}
        else:
            return {'status': False, 'message': 'Invalid Username or Email ID !!!'}
    else:
        return render_template('login.html')
# Similar functions for registration, send-otp, verify-otp go here
```

## 🔧 Flask API Application

### 6.1. Application Initialization (`app/__init__.py`)
Defines the User model using SQLAlchemy ORM:
Initializes the Flask app, sets up extensions (SQLAlchemy), Config the Secret Key, Database connection, SMTP connections and imports routes
python

```
from flask import Flask
from .models import db

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@host:port/database-name'  # Replace these details with your database connection details
db.init_app(app)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'sender_email_id'
app.config['MAIL_PASSWORD'] = 'sender_email_password'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = 'default_email_id' # sender_email_id

from app import routes, models

```


### 6.2. Application Runner (`run.py`)
Entry point for running the Flask application:

python
```
from app import app

if __name__ == "__main__":
    app.run(debug=True)
```

## 📦 Quick Start

### **Install the Dependencies**

Install dependencies using the following command:

```
pip install -r requirements.txt  # For Windows
pip3 install -r requirements.txt  # For Linux/MacOS
```

### **Run the Project**

```
py .\run.py
```

### **Access the Application**

- **Base URL (Login)**: http://127.0.0.1:5000
- **Register**: http://127.0.0.1:5000/register

## 👩‍💻 **Contributing**

Feel free to fork this repository and make improvements. Contributions are welcome!

## 📄 **License**

This project is licensed under the MIT License.
