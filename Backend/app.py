from flask import Flask, redirect, url_for, render_template, request, jsonify,make_response,current_app
from flask_cors import CORS
from flask_socketio import SocketIO, send,emit, join_room
from flask_mysqldb import MySQL
import flask_praetorian 
import bcrypt
import json
import base64
import jwt
import mysql.connector
from functools import wraps
import matplotlib
import matplotlib.pyplot as plt
from flask_praetorian import Praetorian
import os
import logging
from werkzeug.serving import WSGIRequestHandler
from colorama import Fore, Style
from Profile_Score import profile_score


matplotlib.use('Agg')
app = Flask(__name__)
# app.config['SECRET'] = "secret!123"
socketio = SocketIO(app,cors_allowed_origins="*")
app.config['SECRET_KEY'] = 'top secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.logger.setLevel(logging.INFO)
app.logger.propagate = False
app.app_context().push()
WSGIRequestHandler.handler_class = lambda *args, **kwargs: None



@app.route('/')
def index():
    return render_template("index.html")


db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "python_project"
}

# mysql = MySQL(app)

cors = CORS(app, resources={r"/register_business": {"origins": "http://localhost:5173"}})
cors = CORS(app, resources={r"/register_investor": {"origins": "http://localhost:5173"}})
cors = CORS(app, resources={r"/login": {"origins": "*"}})
cors = CORS(app, resources={r"/getbusiness": {"origins": "*"}})
cors = CORS(app, resources={r"/getinvestor": {"origins": "*"}})
cors = CORS(app, resources={r"/user_data": {"origins": "*"}})
CORS(app,supports_credentials=True)

with app.app_context():
    guard = flask_praetorian.Praetorian()




class User_investor:
    def __init__(self,id,username,password):
        self.id = id
        self.username = username
        self.password = password

    @property
    def rolenames(self):
        return []
    
 
    @classmethod
    def lookup(cls,username):
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute('Select investor_id,investor_username,investor_password from investors where investor_username = %s', (username,))
        data = cursor.fetchone()
        # print('inside lookup',data)
        cursor.close()
        if data :
            id,username,password = data
            return cls(id,username,password)
        return None

    @classmethod
    def identify(cls, id):
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT investor_id,investor_username,investor_password FROM investors WHERE investor_id = %s", (id,))
        data = cursor.fetchone()
        # print('inside identify',data)
        cursor.close()
        if data:
            id, username, password = data
            return cls(id, username, password)
        return None  
    
 
    @property
    def identity(self):
        return self.id
    
    


class User_business:
    def __init__(self,id,username,password):
        self.id = id
        self.username = username
        self.password = password

    @property
    def rolenames(self):
        return self.username
    

    @classmethod
    def lookup(cls,username):
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute('Select business_id,owner_username,owner_password from business_owners where owner_username = %s', (username,))
        data = cursor.fetchone()
        # print('inside lookup',data)
        cursor.close()
        if data :
            id,username,password = data
            return cls(id,username,password)
        return None

    @classmethod
    def identify(cls, id):
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT business_id,owner_username,owner_password FROM business_owners WHERE business_id = %s", (id,))
        data = cursor.fetchone()
        # print('inside identify',data)
        cursor.close()
        if data:
            id, username, password = data
            return cls(id, username, password)
        return None  
    
 
    @property
    def identity(self):
        return self.id
    
    

guard.init_app(app, User_business)
guard.init_app(app, User_investor)

@app.route("/register_business", methods=["POST", "GET"])
def sign_up_business():
    if request.method == "POST":
        
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        try:

            business_data = request.get_json()
             # Get the next available business_id from the database
            cursor.execute('SELECT MAX(CAST(SUBSTRING(business_id,2)AS UNSIGNED)) FROM business_owners')
            result = cursor.fetchone()
            if result and result[0]:
                business_id = result[0] + 1
            else:
                business_id = 1  # If no records exist, start from 1
            
            # Construct the new business_id
            new_business_id = f"B{business_id}"

            business_data['business_id'] = new_business_id
            password = business_data['owner_password']
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            business_data['owner_password'] = hashed_password
            business_name = business_data['business_name']



            insert_query = """
            # Define an INSERT query
            INSERT INTO business_owners 
            (business_id,owner_username, owner_password, owner_name, owner_email, owner_location, 
            owner_adhaar_no, owner_phone_no, business_name, business_category, business_location, 
            business_revenue_6,business_revenue_5,business_revenue_4,business_revenue_3,business_revenue_2,business_revenue_1, business_desc, business_website, business_linkedIn, business_twitter, business_instagram)
            VALUES (%(business_id)s,%(owner_username)s, %(owner_password)s, %(owner_name)s, %(owner_email)s, %(owner_location)s, 
            %(owner_adhaar_no)s, %(owner_phone_no)s, %(business_name)s, %(business_category)s, %(business_location)s, 
            %(business_revenue_6)s,%(business_revenue_5)s,%(business_revenue_4)s,%(business_revenue_3)s,%(business_revenue_2)s,%(business_revenue_1)s, %(business_desc)s, %(business_website)s, %(business_linkedIn)s, %(business_twitter)s, %(business_instagram)s)
            """

            cursor.execute(insert_query, business_data)
            connection.commit()
            #You should write basicConfig onlye once as it is reconfigure the root logger whenever we write the basicConfig anywhere in the code
            register_logger = logging.getLogger('register_logger')
            register_logger.setLevel(logging.INFO)
            register_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            register_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            register_logger_handler = logging.FileHandler('./Logs/Signup.log',encoding='UTF-8')
            register_logger_handler.setFormatter(logging.Formatter( fmt=register_logger_format,datefmt=register_logger_datefmt))
            register_logger.addHandler(register_logger_handler)
            register_logger.info(f'BUSINESS :{business_name} with id = B{business_id} is Successfully registered ')

            # logging.basicConfig(filename='./Logs/Signup.log',encoding="UTF-8",level=logging.INFO,format='%(asctime)s --> %(levelname)s : %(message)s', datefmt='%m/%d/%y %I:%M:%S %p')
            # logging.info(f'BUSINESS : Business name {business_name} with id = B{business_id} is Successfully registered ')
            return jsonify({"message": "Business data inserted successfully"})
        except Exception as e:

            #Custom logger for Error handling in Sign UP
            error_logger = logging.getLogger('error_logger')
            error_logger.setLevel(logging.ERROR)
            error_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            error_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            error_logger_handler =logging.FileHandler('./Logs/ErrSignUp.log', encoding="UTF-8")
            error_logger_handler.setFormatter(logging.Formatter(fmt=error_logger_format,datefmt=error_logger_datefmt))
            error_logger.addHandler(error_logger_handler)
            # Log the error using the error logger
            error_logger.error(f'Error : {str(e)}')


            return jsonify({"error": str(e)})
        finally:
            if cursor is not None:  # Check if cursor is not None before closing
                cursor.close()
            if connection is not None:
                connection.close()

            

@app.route("/register_investor" ,methods=["POST","GET"])
def sign_up_investor():
     if request.method == "POST":
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        try:
            investor_data = request.get_json()
            cursor.execute('SELECT MAX(CAST(SUBSTRING(investor_id, 2) AS UNSIGNED)) FROM investors')
            res = cursor.fetchone()
            # print(res)
            if res and res[0]:
                investor_id = 1
                investor_id = res[0] + 1
                # print(investor_id)
            else:
                investor_id = 1
        
            investor_password = investor_data['investor_password']
            print('investor_password = ',investor_password)
            if(investor_password != ""):
                hashed_password = bcrypt.hashpw(investor_password.encode("utf-8"),bcrypt.gensalt())
            else :
                raise Exception(f'Investor Password is Empty')
            investor_data['investor_password'] = hashed_password
            investor_data['investor_id'] = f"I{investor_id}"
            investor_name = investor_data['investor_name']


            # Define an INSERT query for investors
            insert_query = """
            INSERT INTO investors 
            (investor_id, investor_username, investor_password, investor_name, investor_email, investor_location, 
            investor_adhaar_no, investor_phone_no, investor_income, investor_website, investor_linkedIn, 
            investor_twitter, investor_instagram)
            VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(insert_query, (
                investor_data["investor_id"],
                investor_data["investor_username"],
                investor_data["investor_password"],
                investor_data["investor_name"],
                investor_data["investor_email"],
                investor_data["investor_location"],
                investor_data["investor_adhaar_no"],
                investor_data["investor_phone_no"],
                investor_data["investor_income"],
                investor_data["investor_website"],
                investor_data["investor_linkedIn"],
                investor_data["investor_twitter"],
                investor_data["investor_instagram"]
            ))
            
            connection.commit()
            logging.basicConfig(filename='./Logs/Signup.log',encoding="UTF-8",level=logging.INFO,format='%(asctime)s --> %(levelname)s : %(message)s', datefmt='%m/%d/%y %I:%M:%S %p')
            logging.info(f'INVESTOR : {investor_name} with id = I{investor_id} is Successfully registered ')
            return jsonify({"message": "Investor data inserted successfully"})
        except Exception as e:

             #Custom logger for Error handling in Sign UP
            error_logger = logging.getLogger('error_logger')
            error_logger.setLevel(logging.ERROR)
            error_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            error_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            error_logger_handler =logging.FileHandler('./Logs/ErrSignUp.log', encoding="UTF-8")
            error_logger_handler.setFormatter(logging.Formatter(fmt=error_logger_format,datefmt=error_logger_datefmt))
            error_logger.addHandler(error_logger_handler)
            # Log the error using the error logger
            error_logger.error(f'Error : {str(e)}')
            return jsonify({"error": str(e)})
        
        finally:
            if cursor is not None:
                cursor.close()
            if connection is not None:
                connection.close()
          


def business_login(data):
    username = data['username']
    provided_password = data['password']

    user = User_business.lookup(username)
    print(user)
    if user and bcrypt.checkpw(provided_password.encode('utf-8'), user.password.encode('utf-8')):
        token = guard.encode_jwt_token(user)
        return token
    else : 
        return False
    
def investor_login(data):
    username = data['username']
    provided_password = data['password']
    user = User_investor.lookup(username)
    if user and bcrypt.checkpw(provided_password.encode('utf-8'), user.password.encode('utf-8')):
        token = guard.encode_jwt_token(user)
        return token
    else : 
        return False






@app.route("/login", methods=["POST","GET"])
def login():
        data = request.get_json()
        username = data['username']
        token = business_login(data)
        if token == False:
            token = investor_login(data)
        else :
            login_logger = logging.getLogger('login_logger')
            login_logger.setLevel(logging.INFO)
            login_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            login_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            login_logger_handler = logging.FileHandler('./Logs/Login.log',encoding='UTF-8')
            login_logger_handler.setFormatter(logging.Formatter(fmt=login_logger_format,datefmt=login_logger_datefmt))
            login_logger.addHandler(login_logger_handler)
            login_logger.info(f'{username} has {Fore.RED}Successfully{Style.RESET_ALL} LoggedIn ')
            return jsonify({"access_token" : token})
        
        if(token != False):
            login_logger = logging.getLogger('login_logger')
            login_logger.setLevel(logging.INFO)
            login_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            login_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            login_logger_handler = logging.FileHandler('./Logs/Login.log',encoding='UTF-8')
            login_logger_handler.setFormatter(logging.Formatter(fmt=login_logger_format,datefmt=login_logger_datefmt))
            login_logger.addHandler(login_logger_handler)
            login_logger.info(f'{username} has Successfully LoggedIn ')
            return jsonify({"access_token" : token})
        else :
            error_logger = logging.getLogger('error_logger')
            error_logger.setLevel(logging.ERROR)
            error_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            error_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            error_logger_handler =logging.FileHandler('./Logs/Login.log', encoding="UTF-8")
            error_logger_handler.setFormatter(logging.Formatter(fmt=error_logger_format,datefmt=error_logger_datefmt))
            error_logger.addHandler(error_logger_handler)
            # Log the error using the error logger
            error_logger.error(f'Error : Username {username} dont Exist!!!')
            return jsonify({"message" :"user dont exist"})


@app.route("/dashboard" ,methods =["POST", "GET"])
def get_data():
     if request.method == "GET":
          cur = mysql.connection.cursor()
          cur.execute('Select * from business_table')
          data = cur.fetchall()
          cur.close()
          return jsonify(data)
     
@app.route("/getbusiness", methods=["GET"])
def get_all_business():
     connection = mysql.connector.connect(**db_config)
     cur = connection.cursor()
     cur.execute('Select * from business_owners')
     data = cur.fetchall()
     print(data[0])
     list_of_business = []
     for business in data:
        business_dict = {}
        business_dict['business_id'] = business[0]
        business_dict['owner_username'] = business[1]
        business_dict['owner_password'] = business[2]
        business_dict['owner_name'] = business[3]
        business_dict['owner_email'] = business[4]
        business_dict['owner_location'] = business[5]
        business_dict['owner_phone_no'] = business[6]
        business_dict['owner_adhaar_no'] = business[7]
        business_dict['business_name'] = business[8]
        business_dict['business_category'] = business[9]
        business_dict['business_location'] = business[10]
        business_dict['business_revenue_6'] = business[11]
        business_dict['business_revenue_5'] = business[17]
        business_dict['business_revenue_4'] = business[18]
        business_dict['business_revenue_3'] = business[19]
        business_dict['business_revenue_2'] = business[20]
        business_dict['business_revenue_1'] = business[21]
        business_dict['business_desc'] = business[12]
        business_dict['business_website'] = business[13]
        business_dict['business_linkedIn'] = business[14]
        business_dict['business_twitter'] = business[15]
        business_dict['business_instagram'] = business[16]
        list_of_business.append(business_dict)
     connection.commit()
    #  print(list_of_business)

     cur.close()
     return jsonify(data=list_of_business)
    #  return jsonify({"business_name":business_name
    #                  ,"business_location":business_location
    #                  ,"business_revenue":business_revenue
    #                  ,"business_desc":business_desc})

@app.route("/getinvestor", methods=["GET"])
def get_all_investors():
     connection = mysql.connector.connect(**db_config)
     cur = connection.cursor()
     cur.execute('Select * from investors')
     data = cur.fetchall()
     list_of_investors = []
     for investor in data:
        investor_dict = {}
        investor_dict['investor_id'] = investor[0]
        investor_dict['investor_username'] = investor[1]
        investor_dict['investor_password'] = investor[2]
        investor_dict['investor_name'] = investor[3]
        investor_dict['investor_email'] = investor[4]
        investor_dict['investor_location'] = investor[5]
        investor_dict['investor_adhaar_no'] = investor[6]
        investor_dict['investor_phone_no'] = investor[7]
        investor_dict['investor_income'] = investor[8]
        investor_dict['investor_website'] = investor[9]
        investor_dict['investor_linkedIn'] = investor[10]
        investor_dict['investor_twitter'] = investor[11]
        investor_dict['investor_instagram'] = investor[12]
        list_of_investors.append(investor_dict)
     connection.commit()

     cur.close()
     return jsonify(data=list_of_investors)

# Middleware to authenticate the access token
def protected_route(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            token = request.headers.get('Authorization').split()[1]
            # data = guard.extract_jwt_token(token)
            # print(data['id'])
            data = jwt.decode(token,current_app.config["SECRET_KEY"],algorithms=["HS256"])
            user_id = data['id']
            return fn(user_id,*args, **kwargs)

        except Exception as e:
            print("Error:", str(e))
            return jsonify({'message': 'An error occurred'}), 500

    return wrapper


@app.route("/profile_data",methods=["GET","POST"])
@protected_route
def profile_data(user_id):

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    filtered_user_id = user_id[0]
    if filtered_user_id == "B":
        cursor.execute('Select * from business_owners where business_id = %s', (user_id,))
    elif filtered_user_id == "I":
        cursor.execute('Select * from investors where investor_id = %s', (user_id,))
    
    data = cursor.fetchone()
    connection.commit()
    cursor.close()
    
    if filtered_user_id == "B":
        b_user_dict = {}
        b_user_dict['business_id'] = data[0]
        b_user_dict['owner_username'] = data[1]
        b_user_dict['owner_password'] = data[2]
        b_user_dict['owner_name'] = data[3]
        b_user_dict['owner_email'] = data[4]
        b_user_dict['owner_location'] = data[5]
        b_user_dict['owner_adhaar_no'] = data[6]
        b_user_dict['owner_phone_no'] = data[7]
        b_user_dict['business_name'] = data[8]
        b_user_dict['business_category'] = data[9]
        b_user_dict['business_location'] = data[10]
        b_user_dict['business_revenue'] = data[11]
        b_user_dict['business_desc'] = data[12]
        b_user_dict['business_website'] = data[13]
        b_user_dict['business_linkedIn'] = data[14]
        b_user_dict['business_twitter'] = data[15]
        b_user_dict['business_instagram'] = data[16]
        return jsonify(data=b_user_dict)


    if filtered_user_id == "I":
        i_user_dict = {}
        i_user_dict['investor_id'] = data[0]
        i_user_dict['investor_username'] = data[1]
        i_user_dict['investor_password'] = data[2]
        i_user_dict['investor_name'] = data[3]
        i_user_dict['investor_email'] = data[4]
        i_user_dict['investor_location'] = data[5]
        i_user_dict['investor_adhaar_no'] = data[6]
        i_user_dict['investor_phone_no'] = data[7]
        i_user_dict['investor_income'] = data[8]
        i_user_dict['investor_website'] = data[9]
        i_user_dict['investor_linkedIn'] = data[10]
        i_user_dict['investor_twitter'] = data[11]
        i_user_dict['investor_instagram'] = data[12]
        return jsonify(data=i_user_dict)


#Sender Routes Part
@app.route("/connect-request", methods=["POST"])
@protected_route
def connect_request(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try :
        data = request.get_json()
        print(data)
        sender_id = data['sender_id']
        receiver_id = data['receiver_id']
        # data : { sender_id : "", receiver_id : "", req_status : ""}
        insert_query = """
            INSERT INTO Connection_req 
            (sender_id, receiver_id, req_status) 
            VALUES ( %(sender_id)s, %(receiver_id)s, %(req_status)s )
        """

        cursor.execute(insert_query,data)

        if sender_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s',(sender_id))
            sender_data = cursor.fetchone()
        else:
            cursor.execute('Select * from investors where investor_id = %s',(sender_id,))
            sender_data = cursor.fetchone()

        
        if receiver_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s',(receiver_id,))
            receiver_data = cursor.fetchone()
        else:
            cursor.execute('Select * from investors where investor_id = %s',(receiver_id,))
            receiver_data = cursor.fetchone()

        sender_username = sender_data[1]
        receiver_username = receiver_data[1]

        connection.commit()

        req_logger = logging.getLogger('req_logger')
        req_logger.setLevel(logging.INFO)
        req_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
        req_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
        req_logger_handler = logging.FileHandler('./Logs/Connect_Request.log',encoding='UTF-8')
        req_logger_handler.setFormatter(logging.Formatter(fmt=req_logger_format,datefmt=req_logger_datefmt))
        req_logger.addHandler(req_logger_handler)
        req_logger.info(f'{sender_username} with id = {sender_id} have sent a connect request to username = {receiver_username} with id = {receiver_id}. ')
        return jsonify({"message" : "Request Sent Successfully"})
    except Exception as e:
        error_logger = logging.getLogger('error_logger')
        error_logger.setLevel(logging.ERROR)
        error_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
        error_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
        error_logger_handler =logging.FileHandler('./Logs/Connect_Request.log', encoding="UTF-8")
        error_logger_handler.setFormatter(logging.Formatter(fmt=error_logger_format,datefmt=error_logger_datefmt))
        error_logger.addHandler(error_logger_handler)
        # Log the error using the error logger
        error_logger.error(f'Error : {str(e)}!!!')
        return jsonify({"error" : str(e)})


def fetch_data(data,number):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    req_list = []
    for item in data:
        print('inside item in data')
        req_dict = {}
        receiver_id = item[number]
        print('receiver_id',receiver_id)
        print('receiver_id[0]',receiver_id[0])
        if receiver_id[0] == "B": 
            print('inside if')
            cursor.execute('Select * from business_owners where business_id = %s',(receiver_id,))
            new_data = cursor.fetchone()
            print('new_data', new_data)
            req_dict['name'] = new_data[3]
            req_dict['username'] = new_data[1]
            req_dict['req_status'] = item[3]
            req_dict['req_id'] = item[0]
            req_dict['sender_id'] = item[1]
            req_dict['receiver_id'] = item[2]
            print('req_dict = ',req_dict)
            req_list.append(req_dict)
        else:
            print('inside else which is investor part')
            cursor.execute('Select * from investors where investor_id = %s', (receiver_id,))
            new_data = cursor.fetchone()
            req_dict['name'] = new_data[3]
            req_dict['username'] = new_data[1]
            req_dict['req_status'] = item[3]
            req_dict['req_id'] = item[0]
            req_dict['sender_id'] = item[1]
            req_dict['receiver_id'] = item[2]
            req_list.append(req_dict)
    return req_list
    
@app.route("/request-sent",methods=["GET"])
@protected_route
def request_sent(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute('Select * from Connection_req where sender_id = %s and req_status = %s', (user_id,'pending',))
    data = cursor.fetchall()
    value = fetch_data(data,2)
    return jsonify(data=value)


#Receiver side 
@app.route("/friend-request", methods=["GET"])
@protected_route
def friend_request(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute('Select * from Connection_req where receiver_id = %s and req_status = %s',(user_id, 'pending',))
    data = cursor.fetchall()
    value = fetch_data(data,1)
    return jsonify(data=value)

    
@app.route("/status-sent", methods=["POST"])
@protected_route
def status_sent(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    
    try:
        data = request.get_json()
        sender_id = data['sender_id']
        receiver_id = data['receiver_id']
        if sender_id[0] == "B":
                cursor.execute('Select * from business_owners where business_id = %s',(sender_id))
                sender_data = cursor.fetchone()
        else:
                cursor.execute('Select * from investors where investor_id = %s',(sender_id,))
                sender_data = cursor.fetchone()

        
        if receiver_id[0] == "B":
                cursor.execute('Select * from business_owners where business_id = %s',(receiver_id,))
                receiver_data = cursor.fetchone()
        else:
                cursor.execute('Select * from investors where investor_id = %s',(receiver_id,))
                receiver_data = cursor.fetchone()

        sender_username = sender_data[1]
        receiver_username = receiver_data[1]
        print('kahan gaya data mera',data)
        cursor.execute('Update Connection_req set req_status = %s where req_id = %s', (data['req_status'],data['req_id'],))
        if data['req_status'] == 'accepted':
            
            accept_logger = logging.getLogger('accept_logger')
            accept_logger.setLevel(logging.INFO)

            accept_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            accept_logger_datefmt = '%m/%d/%y %I:%M:%S %p'

            accept_logger_handler = logging.FileHandler('./Logs/Connect_Request.log', encoding='UTF-8')
            accept_logger_handler.setFormatter(logging.Formatter(fmt=accept_logger_format,datefmt=accept_logger_datefmt))

            accept_logger.addHandler(accept_logger_handler)
            accept_logger.info(f'{receiver_username} with id = {receiver_id} ACCEPTED  the connect request of username {sender_username} with id = {sender_id} ')
              
            cursor.execute('Insert into Friends (user1_id,user2_id) values ( %(sender_id)s, %(receiver_id)s)',data)
        elif data['req_status'] == "declined":
            declined_logger = logging.getLogger('declined_logger')
            declined_logger.setLevel(logging.ERROR)
            declined_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
            declined_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
            declined_logger_handler =logging.FileHandler('./Logs/Connect_Request.log', encoding="UTF-8")
            declined_logger_handler.setFormatter(logging.Formatter(fmt=declined_logger_format,datefmt=declined_logger_datefmt))
            declined_logger.addHandler(declined_logger_handler)
            # Log the error using the error logger
            declined_logger.error(f'Error : Username {receiver_username} with id = {receiver_id} REJECTED the connect request of username {sender_username} with id = {sender_id} !!!')
        connection.commit()
        return jsonify({"message" : "Status Sent SUCCESSFULLY"})
    except Exception as e:
        print(str(e))
        return jsonify({"error" : str(e)})
    

@app.route("/req-declined", methods=["GET"])
@protected_route
def req_declined(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
        cursor.execute('Select * from Connection_req where sender_id = %s and req_status = %s', (user_id,'declined',))
        data = cursor.fetchall()
        value = fetch_data(data,2)
        return jsonify(data=value)
    except Exception as e :
        return jsonify({"error" : str(e)})



@app.route('/friends', methods=["GET"])
@protected_route
def friends_list(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try: 
        cursor.execute('Select * from friends where user1_id = %s or user2_id = %s', (user_id,user_id,)) 
        data = cursor.fetchall()
        print('data', data)
        friend_list = []
        for item in data:
            if item[1] == user_id:
                new_id = item[2]
                if new_id[0] == "B":
                    cursor.execute('Select * from business_owners where business_id = %s',(new_id,))
                    business_data = cursor.fetchone()
                    business_dict = {}
                    business_dict['username'] = business_data[1]
                    business_dict['name'] = business_data[3]
                    business_dict['friend_id'] = item[0]
                    business_dict['sender_id'] = item[1]
                    business_dict['receiver_id'] = new_id
                    friend_list.append(business_dict)
                if new_id[0] == "I":
                    cursor.execute('Select * from investors where investor_id = %s',(new_id,))
                    investor_data = cursor.fetchone()
                    investor_dict = {}
                    investor_dict['username'] = investor_data[1]
                    investor_dict['name'] = investor_data[3]
                    investor_dict['friend_id'] = item[0]
                    investor_dict['sender_id'] = item[1]
                    investor_dict['receiver_id'] = item[2]
                    investor_dict['receiver_id'] = new_id

                    friend_list.append(investor_dict)
                # cursor.execute('Select * from ')
            elif item[2] == user_id:
                new_id = item[1]
                if new_id[0] == "I":
                    cursor.execute('Select * from investors where investor_id = %s',(new_id,))
                    investor_data = cursor.fetchone()
                    investor_dict = {}
                    investor_dict['username'] = investor_data[1]
                    investor_dict['name'] = investor_data[3]
                    investor_dict['friend_id'] = item[0]
                    investor_dict['sender_id'] = item[2]
                    investor_dict['receiver_id'] = new_id
                    friend_list.append(investor_dict)
                if new_id[0] == "B":
                    cursor.execute('Select * from business_owners where business_id = %s',(new_id,))
                    business_data = cursor.fetchone()
                    business_dict = {}
                    business_dict['username'] = business_data[1]
                    business_dict['name'] = business_data[3]
                    business_dict['friend_id'] = item[0]
                    business_dict['sender_id'] = item[2]
                    business_dict['receiver_id'] = new_id
                    friend_list.append(business_dict)
        return jsonify(data=friend_list)
    except Exception as e:
        return jsonify({"error" : str(e)})




@socketio.on('send_message')
def handle_message(data):
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']
    message_text = data['message_text']




    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
    # Execute and commit the query
        cursor.execute('INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (%s, %s, %s)', (sender_id, receiver_id, message_text))
        connection.commit()
    except Exception as e:
    # Handle the error, e.g., log it
        print(f"Error: {e}")


    emit('receive_message', {'sender_id' : sender_id, 'message_text' : message_text, 'receiver_id' : receiver_id })
    

@app.route('/get-chat-history',methods=["GET"])
@protected_route
def get_chat_history(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
        cursor.execute('Select * from messages')
        data = cursor.fetchall()
        messages_list = []
        for message in data:
            message_dict = {}
            message_dict['message_id'] = message[0]
            message_dict['sender_id'] = message[1]
            message_dict['receiver_id'] = message[2]
            message_dict['message_text'] = message[3]
            message_dict['created_at'] = message[4]
            messages_list.append(message_dict)
        
        return jsonify(data=messages_list)
        


    except Exception as e:
        return jsonify({'error' : str(e)})


def generate_bar_graph(revenue):

    # Get the revenue data for the past 5 months
    # revenue = [10000, 12000, 15000, 17000, 9000]

    # Set the x-axis labels
    x_axis_labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5","Month 6"]


    # Plot the graph
    plt.plot(revenue, marker="o", linestyle="-")

    # Set the title and x-axis label
    plt.title("Revenue for the Past 6 Months")
    plt.xlabel("Month")

    # Set the y-axis label
    plt.ylabel("Revenue")

    # Set the x-axis ticks
    plt.bar(x_axis_labels,revenue)

    plt.savefig("bargraph.png")
    plt.close()

    bar_path =r"./bargraph.png"
    if os.path.exists(bar_path):
        with open(bar_path,"rb") as image_file:
            image_data = image_file.read()
            base64_image_bar = base64.b64encode(image_data).decode('utf-8')
    else :
        base64_image_bar = ""
    
    return base64_image_bar



def generate_pie_graph(revenue):


    # Get the revenue data for the past 5 months
    # revenue = [10000, 12000, 15000, 17000, 9000]

    x_axis_labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5","Month 6"]

    # plt.plot(revenue, marker="o", linestyle="-")

    plt.title("Revenue for the Past 6 Months")


    plt.pie(revenue, labels=x_axis_labels, autopct='%1.2f%%')

    plt.savefig("piechart.png")
    plt.close()


    pie_path =r"./piechart.png"
    if os.path.exists(pie_path):
        with open(pie_path,"rb") as image_file:
            image_data = image_file.read()
            base64_image_pie = base64.b64encode(image_data).decode('utf-8')
    else :
        base64_image_pie = ""

    return base64_image_pie


def generate_line_graph(revenue):
    x_axis_labels = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5","Month 6"]

    # Plot the graph
    plt.plot(revenue, marker="o", linestyle="-")

    # Set the title and x-axis label
    plt.title("Revenue for the Past 6 Months")
    plt.xlabel("Month")

    # Set the y-axis label
    plt.ylabel("Revenue")

    plt.savefig("linegraph.png")
    # Set the x-axis ticks
    plt.xticks(ticks=range(6), labels=x_axis_labels)
    plt.close()



    # Show the plot
        # pie_path =r"./piechart.png"
    line_path =r"./linegraph.png"
    if os.path.exists(line_path):
        with open(line_path,"rb") as image_file:
            image_data = image_file.read()
            base64_image_line = base64.b64encode(image_data).decode('utf-8')
    else :
        base64_image_line = ""

    return base64_image_line








@app.route('/business_graph',methods=["GET"])
@protected_route
def business_graph(user_id):
    if os.path.exists('./linegraph.png'):
        os.remove('./linegraph.png')
        print('removed')
    if os.path.exists('./bargraph.png'):
        os.remove('./bargraph.png')
        print('removed')
    if os.path.exists('./piechart.png'):
        os.remove('./piechart.png')
        print('removed')
    card_id = request.args.get('card_id')
    print(card_id[0])
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    revenue = []
    try:
        if user_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s',(user_id,))
            business_data = cursor.fetchone()
            user_username = business_data[1]
        elif user_id[0] == "I":
            cursor.execute('Select * from investors where investor_id = %s',(user_id,))
            investor_data = cursor.fetchone()
            user_username = investor_data[1]
    except Exception as e:
        print(f"Error : {str(e)}")

        

    try:
        if card_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s', (card_id,))
            data = cursor.fetchone()
            view_username = data[1]
            print('oky bro',data)
            connection.commit()
            revenue.append(int(data[11]))
            revenue.append(int(data[17]))
            revenue.append(int(data[18]))
            revenue.append(int(data[19]))
            revenue.append(int(data[20]))
            revenue.append(int(data[21]))
        

        print(revenue)

        graph_logger = logging.getLogger('graph_logger')
        graph_logger.setLevel(logging.INFO)
        graph_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
        graph_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
        graph_logger_handler = logging.FileHandler('./Logs/Business_Viewed.log',encoding='UTF-8')
        graph_logger_handler.setFormatter(logging.Formatter(fmt=graph_logger_format,datefmt=graph_logger_datefmt))
        graph_logger.addHandler(graph_logger_handler)
        graph_logger.info(f'Username {user_username} with id = {user_id} have Viewed the Financials of Business with username = {view_username} with id = {card_id}. ')  
    except Exception as e:
        err1_logger = logging.getLogger('err1_logger')
        err1_logger.setLevel(logging.ERROR)
        err1_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
        err1_logger_datefmt = '%m/%d/%y %I:%M:%S %p'
        err1_logger_handler =logging.FileHandler('./Logs/Business_Viewed.log', encoding="UTF-8")
        err1_logger_handler.setFormatter(logging.Formatter(fmt=err1_logger_format,datefmt=err1_logger_datefmt))
        err1_logger.addHandler(err1_logger_handler)
        err1_logger.error(f'Error : {str(e)}')
        return jsonify({"error" : str(e)})
    


    base64_image_bar = generate_bar_graph(revenue)
    base64_image_line = generate_line_graph(revenue)
    base64_image_pie = generate_pie_graph(revenue)
    



   
    
    


    return jsonify({
        "base64_image_line" : base64_image_line,
        "base64_image_pie" : base64_image_pie,
        "base64_image_bar" : base64_image_bar,
    })



@app.route('/logout', methods=['GET','POST'])
@protected_route
def logout(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
        if user_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s ',(user_id,))
            data = cursor.fetchone()
            username = data[1]
        elif user_id[0] == "I":
            cursor.execute('Select * from investors where investor_id = %s',(user_id,))
            data = cursor.fetchone()
            username = data[1]
        

        logout_logger = logging.getLogger('logout_logger')
        logout_logger.setLevel(logging.INFO)
        logout_logger_format = '%(asctime)s --> %(levelname)s : %(message)s'
        logout_logger_datefmt = '%m/%d/%y %I:%M:%S %p'

        logout_logger_hander = logging.FileHandler('./Logs/Logout.log',encoding='UTF-8')
        logout_logger_hander.setFormatter(logging.Formatter(fmt=logout_logger_format,datefmt=logout_logger_datefmt))
        logout_logger.addHandler(logout_logger_hander)

        logout_logger.info(f'{username} has Logged Out Successfully')

    except Exception as e:
        return jsonify({"error" : str(e)})


@app.route('/get-profile-score', methods=['GET'])
@protected_route
def get_Score(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    
    try:
        if user_id[0] == "B":
            cursor.execute('Select * from business_owners where business_id = %s ',(user_id,))
            data = cursor.fetchone()
            score_data_dict = {}
            score_data_dict['Personal_Website'] = data[13]
            score_data_dict['LinkedIn'] = data[14]
            score_data_dict['Twitter'] = data[15]
            score_data_dict['Instagram'] = data[16]
            score_data_dict['Income'] = data[11]
        elif user_id[0] == "I":
            cursor.execute('Select * from investors where investor_id = %s', (user_id,))
            data= cursor.fetchone()
            score_data_dict = {}
            score_data_dict['Personal_Website'] = data[9]
            score_data_dict['LinkedIn'] = data[10]
            score_data_dict['Twitter'] = data[11]
            score_data_dict['Instagram'] = data[12]
            score_data_dict['Income'] = data[8]
            print(score_data_dict)
            
    
        score = profile_score(score_data_dict)
        print('Score == ', score)
        return jsonify(data=score)

    except Exception as e:
        print(f"Error : {str(e)}")
        return jsonify(data=0)





if __name__ == "__main__":
    app.run(host='localhost', port=5000)
    socketio.run(app, host='0.0.0.0', port=5000)
    # app.run(host='dev.localhost', port=5000)




#sockets -- used for live 
#Socket library is used to do the real time chatting without refreshing the page live chat 



