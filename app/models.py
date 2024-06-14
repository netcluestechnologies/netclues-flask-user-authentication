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


class OTPMaster(db.Model):
    __tablename__ = 'otp-master'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(6), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    valid_till = db.Column(db.DateTime)
    created_date = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, email, otp, valid_till, created_date):
        self.email = email
        self.otp = otp
        self.valid_till = valid_till
        self.created_date = created_date
