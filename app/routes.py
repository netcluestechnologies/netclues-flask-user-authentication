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


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    if 'username' in session:
        return redirect(url_for('home'))
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            username = request.form.get('username')
            email = request.form.get('email')
            hashed_password = bcrypt.generate_password_hash(request.form.get('password')).decode('utf-8')
            user = UserMaster(name=name, username=username, email=email, phone=request.form.get('phone'), password=hashed_password, gender=request.form.get('gender'), is_verified=False, is_active=True, created_date=datetime.now(), updated_date=None)
            db.session.add(user)
            db.session.commit()
            msg = Message('Welcome to Netclues!', sender=app.config.get('MAIL_USERNAME'), recipients=[email])
            msg.body = f"Hello {name},\n\nWe all are really excited to welcome you in our Family.\n\nYour User Credentials:\n\nEmail ID: {email}\nUsername: {username}\n\nThank You for joining us..."
            mail.send(msg)
            return {'status': True, 'message': 'Successfully Registered ...'}
        except Exception as e:
            print('Error while Register User: ', e)
            return {'status': False, 'message': 'Something Went Wrong, Try After Sometime !!!'}
    else:
        return render_template('registration.html')


@app.route("/home")
def home():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('home.html')


@app.route("/login-with-otp")
def login_with_otp():
    if 'username' in session:
        return redirect(url_for('home'))
    return render_template('login-with-otp.html')


@app.route("/sent-otp", methods=['POST'])
def sent_otp():
    email = request.form.get('email')
    check_email = UserMaster.query.filter_by(email=email).first()
    if check_email:
        name = check_email.name
        otp = str(secrets.randbelow(1000000)).zfill(6)
        now = datetime.now()
        valid_till = now + timedelta(minutes=5)
        otp_master = OTPMaster(email=email, otp=otp, valid_till=valid_till, created_date=datetime.now())
        db.session.add(otp_master)
        db.session.commit()
        msg = Message('Welcome to Netclues!', sender=app.config.get('MAIL_USERNAME'), recipients=[email])
        msg.body = f"Hello {name},\n\nOTP for Login {otp}.\n\nNote: This OTP is valid for 5 minute\n\nThank You..."
        mail.send(msg)
        return {'status': True}
    else:
        return {'status': False}


@app.route("/verify-otp", methods=['POST'])
def verify_otp():
    email = request.form.get('email')
    otp = request.form.get('otp')
    verify_otp = OTPMaster.query.filter((OTPMaster.email == email) & (OTPMaster.otp == otp)).first()
    if verify_otp:
        server_tz = pytz.timezone('Asia/Kolkata')
        current_time = datetime.now(server_tz)
        if verify_otp.valid_till >= current_time:
            data = UserMaster.query.filter_by(email=email).first()
            session.clear()
            session['userid'] = data.id
            session['name'] = data.name
            session['username'] = data.username
            session['email'] = data.email
            session['phone'] = data.phone
            session['gender'] = data.gender
            return {'status': True, 'message': 'OTP Verified ...'}
        else:
            return {'status': True, 'message': 'OTP Expired !!!'}
    else:
        return {'status': False, 'message': 'Invalid OTP !!!'}


@app.route("/check-email-exists", methods=['POST'])
def check_email_exists():
    check_email = UserMaster.query.filter_by(email=request.form.get('email')).first()
    if check_email:
        return {'isExist': True}
    else:
        return {'isExist': False}


@app.route("/check-username-exists", methods=['POST'])
def check_username_exists():
    check_username = UserMaster.query.filter_by(username=request.form.get('username')).first()
    if check_username:
        return {'isExist': True}
    else:
        return {'isExist': False}


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('login'))
