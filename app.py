from flask import *
from enum import Enum
import math

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# MySQL
import mysql.connector
import os
import setting
import mysql.connector.pooling

DB_HOST = os.getenv("db_host")
DB_USER = os.getenv("db_user")
DB_PASSWORD = os.getenv("db_password")
DB_DATABASE = os.getenv("db_database")
DB_POOLNAME = os.getenv("db_poolname")
SECRET_KEY = os.getenv("secret_key")

# mydb = mysql.connector.connect(host=DB_HOST,
#                                user=DB_USER,
#                                password=DB_PASSWORD,
#                                database=DB_DATABASE)
# mycursor = mydb.cursor()


dbconfig = {
    "host":DB_HOST,
    "user": DB_USER,
    "password":DB_PASSWORD,
    "database": DB_DATABASE,
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = DB_POOLNAME,
                                                      pool_size = 5,
                                                      **dbconfig)

cnx1 = cnxpool.get_connection()

app.secret_key = SECRET_KEY


# Enum
class AttractionEnum(Enum):
    spotid = 0
    info = 1
    stitle = 2
    xpostDate = 3
    longitude = 4
    REF_WP = 5
    avBegin = 6
    langinfo = 7
    MRT = 8
    SERIAL_NO = 9
    RowNumber = 10
    CAT1 = 11
    CAT2 = 12
    MEMO_TIME = 13
    POI = 14
    idpt = 15
    latitude = 16
    xbody = 17
    _id = 18
    avEnd = 19
    address = 20


# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


# 以下新增
@app.route('/api/attractions')
def attractions():
    cnx1 = cnxpool.get_connection()
    mycursor = cnx1.cursor()
    # 取得client傳來的參數
    page = int(request.args.get('page'))
    keyword = request.args.get('keyword')
    # 景點總數
    spotCount = 0
    if keyword == None:
        sql = "SELECT COUNT(spotid) FROM spots"
        mycursor.execute(sql)
        spotCount = mycursor.fetchone()[0]
    else:
        sql = "SELECT COUNT(stitle) FROM spots WHERE stitle LIKE %s ORDER BY spotid"
        txt = ("%" + keyword + "%", )
        mycursor.execute(sql, txt)
        spotCount = mycursor.fetchone()[0]

    # 計算最大頁數
    spotNumInPage = 12  # 一次顯示12筆
    maxPage = math.ceil(spotCount / spotNumInPage)
    # nextPage
    nextPage = (page + 1) if ((page + 1) < maxPage) else None
    try:
        # Get 12筆資料/頁 (也有可能會是未滿12筆資料/頁)
        startID = page * spotNumInPage

        numInPage = spotNumInPage if (
            (startID + spotNumInPage + 1) < spotCount) else (spotCount -
                                                             startID)

        if keyword == None:
            sql = "SELECT * FROM spots ORDER BY spotid LIMIT %s,%s"
            txt = (startID, numInPage)
        else:
            sql = "SELECT * FROM spots WHERE stitle LIKE %s ORDER BY spotid LIMIT %s,%s"
            txt = ("%" + keyword + "%", startID, numInPage)

        mycursor.execute(sql, txt)
        result = mycursor.fetchall()

        # 轉成 JSON 格式
        itemDic = {}
        itemDic.update({'nextPage': nextPage})
        itemList = []
        for i in range(len(result)):

            # image list
            targetID = result[i][AttractionEnum.spotid.value]
            sql = "SELECT imgurl FROM images WHERE spotid = %s"
            txt = (targetID, )
            mycursor.execute(sql, txt)
            result_image = mycursor.fetchall()
            result_image = [y for x in result_image for y in x]

            item = {
                "id": result[i][AttractionEnum.spotid.value],  #spotid
                "name": result[i][AttractionEnum.stitle.value],  #stitle
                "category": result[i][AttractionEnum.CAT2.value],  #CAT2
                "description": result[i][AttractionEnum.xbody.value],  #xbody
                "address": result[i][AttractionEnum.address.value],  #address
                "transport": result[i][AttractionEnum.info.value],  #info
                "mrt": result[i][AttractionEnum.MRT.value],  #MRT
                "latitude":
                result[i][AttractionEnum.latitude.value],  #latitude
                "longitude":
                result[i][AttractionEnum.longitude.value],  #longitude
                "images": result_image
            }
            itemList.append(item)

        itemDic.update({'data': itemList})
        cnx1.close()
        return jsonify(itemDic), 200
    except:
        response_data = {"error": True, "message": "serverError"}
        return jsonify(response_data), 500

@app.route('/api/attraction/<attractionId>')
def attractionId(attractionId):
    
    cnx1 = cnxpool.get_connection()
    mycursor = cnx1.cursor()
    # 景點總數
    sql = "SELECT COUNT(spotid) FROM spots"
    mycursor.execute(sql)
    spotCount = mycursor.fetchone()[0]
    try:
        if int(attractionId) > spotCount or int(attractionId) < 1:
            return jsonify({"error": True, "message": "景點編號不正確"}), 400
        else:
            # 根據景點編號取得景點資料
            sql = "SELECT * FROM spots WHERE spotid=%s"
            txt = (attractionId, )
            mycursor.execute(sql, txt)
            result = mycursor.fetchall()

            # 轉成 JSON 格式
            # image list
            sql = "SELECT imgurl FROM images WHERE spotid = %s"
            txt = (attractionId, )
            mycursor.execute(sql, txt)
            result_image = mycursor.fetchall()
            result_image = [y for x in result_image for y in x]

            item = {
                "id": result[0][AttractionEnum.spotid.value],  #spotid
                "name": result[0][AttractionEnum.stitle.value],  #stitle
                "category": result[0][AttractionEnum.CAT2.value],  #CAT2
                "description": result[0][AttractionEnum.xbody.value],  #xbody
                "address": result[0][AttractionEnum.address.value],  #address
                "transport": result[0][AttractionEnum.info.value],  #info
                "mrt": result[0][AttractionEnum.MRT.value],  #MRT
                "latitude":
                result[0][AttractionEnum.latitude.value],  #latitude
                "longitude":
                result[0][AttractionEnum.longitude.value],  #longitude
                "images": result_image
            }
            
            cnx1.close()
            return jsonify({'data': item}), 200
    except:
        response_data = {"error": True, "message": "serverError"}
        
        cnx1.close()
        return jsonify(response_data), 500

# ----- /api/user
# [GET]
@app.route('/api/user',methods=['GET'])
def getUser():
    email = session.get("user")
    cnx1 = cnxpool.get_connection()
    if email:
        mycursor = cnx1.cursor()
        sql = "SELECT * FROM users WHERE email = %s"
        adr = (email, )
        mycursor.execute(sql, adr)
        result = mycursor.fetchall()
        cnx1.close()

        id = result[0][0] #id
        name = result[0][1] #id
        userData =  {
                "id": id,
                "name": name,
                "email": email
        }
        
        return jsonify({"data": userData}), 200
    else:
        cnx1.close()
        return jsonify({"data": None}), 200

# [POST]
@app.route('/api/user',methods=['POST'])
def registerUser():
    request_data = request.get_json()
    cnx1 = cnxpool.get_connection()
    try:
        mycursor = cnx1.cursor()
        name = request_data["name"]
        email = request_data["email"]
        password = request_data["password"]

        isRegisterFailed = False  
        errorMsg=""

        if name=="" or email=="" or password=="":
            isRegisterFailed = True
            errorMsg += "Error! The column(s) is/are empty."
        else:
            # Check the email is registered or not
            sql = "SELECT * FROM users WHERE email = %s"
            adr = (email, )
            mycursor.execute(sql, adr)
            result = mycursor.fetchall()
            if len(result) != 0:
                errorMsg += "The email already exists."
                isRegisterFailed = True

        if isRegisterFailed:
            
            cnx1.close()
            return jsonify({"error": True, "message": errorMsg}), 400
        else:
            sql = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
            val = (name, email, password)
            mycursor.execute(sql, val)
            cnx1.commit()
            cnx1.close()
            return jsonify({"ok": True}), 200

    except:
        
        cnx1.close()
        return jsonify({"error": True, "message": "serverError"}), 500

# [PATCH]
@app.route('/api/user',methods=['PATCH'])
def loginUser():
    request_data = request.get_json()
    cnx1 = cnxpool.get_connection()
    try:
        mycursor = cnx1.cursor()
        email = request_data["email"]
        password = request_data["password"]

        sql = "SELECT * FROM users WHERE email = %s and password= %s"
        adr = (email, password)
        mycursor.execute(sql, adr)
        result = mycursor.fetchall()
        
        cnx1.close()
        if len(result) == 1:
            session["user"] = email #use email as session content
            return jsonify({"ok": True}), 200
        else:
            return jsonify({"error": True, "message": "Email or Password incorrect."}), 400

    except:
        cnx1.close()
        return jsonify({"error": True, "message": "serverError"}), 500

# [DELETE]
@app.route('/api/user', methods=['DELETE'])
def deleteUser():
    session.pop("user") 
    return jsonify({"ok": True}), 200



# ----- /api/booking
# [GET]
@app.route('/api/booking',methods=['GET'])
def getBooking():
    email = session.get("user")
    cnx1 = cnxpool.get_connection()
    if email:
        booking = session.get("booking")
        if booking:
            attractionId = booking["attractionId"] #attractionId
            date = booking["date"] #date
            time = booking["time"] #time
            price = booking["price"] #price
        
            mycursor = cnx1.cursor()

            # 根據景點編號取得景點資料
            sql = "SELECT * FROM spots WHERE spotid=%s"
            txt = (attractionId, )
            mycursor.execute(sql, txt)
            result = mycursor.fetchall()

            # image list
            sql = "SELECT imgurl FROM images WHERE spotid = %s"
            txt = (attractionId, )
            mycursor.execute(sql, txt)
            result_image = mycursor.fetchall()
            result_image = [y for x in result_image for y in x]
            cnx1.close()

            # 轉成 JSON 格式
            attraction = {
                "id": result[0][AttractionEnum.spotid.value],  #spotid
                "name": result[0][AttractionEnum.stitle.value],  #stitle
                "address": result[0][AttractionEnum.address.value],  #address
                "images": result_image[0] #first url
            }

            bookingData =  {
                    "attraction": attraction,
                    "date": date,
                    "time": time,
                    "price": price
            }
        else:
            bookingData = None
        return jsonify({"data": bookingData}), 200
    else:
        cnx1.close()
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403

# [POST]
@app.route('/api/booking',methods=['POST'])
def addBooking():
    request_data = request.get_json()
    email = session.get("user")
    if email:
        try:
            attractionId = request_data["attractionId"]
            date = request_data["date"]
            time = request_data["time"]
            price = request_data["price"]
            bookingData = None
            
            if attractionId and date and time and price:
                bookingData = {
                    "attractionId":attractionId,
                    "date":date,
                    "time":time,
                    "price":price
                }
            else:
                return jsonify({"error": True, "message": "建立失敗，輸入不正確或其他原因"}), 400
                
            session["booking"] = bookingData

            return jsonify({"ok": True}), 200

        except:
            return jsonify({"error": True, "message": "serverError"}), 500
    else:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403


# [DELETE]
@app.route('/api/booking', methods=['DELETE'])
def deleteBooking():
    email = session.get("user") 
    if email:
        booking = session.get("booking") 
        if booking:
            session.pop("booking")
        return jsonify({"ok": True}), 200
    else:
        return jsonify({"error": True, "message": "未登入系統，拒絕存取"}), 403 


app.run(host="0.0.0.0", port=3000)  #伺服器能夠自動綁到公開的 IP 上
# app.run(port=3000)