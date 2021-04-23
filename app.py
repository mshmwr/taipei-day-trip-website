from flask import *
# from enum import Enum
# import math

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# #MySQL
# import mysql.connector

# mydb = mysql.connector.connect(host="localhost",
#                                user="root",
#                                password="wingjan120",
#                                database="taipeiattractions")
# mycursor = mydb.cursor()

# # Enum
# class AttractionEnum(Enum):
#     spotid = 0
#     info = 1
#     stitle = 2
#     xpostDate = 3
#     longitude = 4
#     REF_WP = 5
#     avBegin = 6
#     langinfo = 7
#     MRT = 8
#     SERIAL_NO = 9
#     RowNumber = 10
#     CAT1 = 11
#     CAT2 = 12
#     POI = 13
#     idpt = 14
#     latitude = 15
#     xbody = 16
#     _id = 17
#     avEnd = 18
#     address = 19


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


# # 以下新增
# @app.route('/api/attractions')
# def attractions():

#     # 取得client傳來的參數
#     page = int(request.args.get('page'))
#     keyword = request.args.get('keyword')

#     # 景點總數
#     spotCount = 0
#     if keyword == None:
#         sql = "SELECT COUNT(spotid) FROM spots"
#         mycursor.execute(sql)
#         spotCount = mycursor.fetchone()[0]
#     else:
#         sql = "SELECT COUNT(stitle) FROM spots WHERE stitle LIKE %s ORDER BY spotid"
#         txt = ("%" + keyword + "%", )
#         mycursor.execute(sql, txt)
#         spotCount = mycursor.fetchone()[0]

#     # 計算最大頁數
#     spotNumInPage = 12  # 一次顯示12筆
#     maxPage = math.ceil(spotCount / spotNumInPage)
#     # nextPage
#     nextPage = (page + 1) if ((page + 1) < maxPage) else None

#     try:
#         # Get 12筆資料/頁
#         startID = 0
#         if keyword == None:
#             sql = "SELECT * FROM spots ORDER BY spotid LIMIT %s,%s"
#             startID = page * spotNumInPage
#             endID = ((page + 1) * spotNumInPage - 1) if (
#                 (page + 1) * spotNumInPage - 1 <= spotCount) else spotCount
#             txt = (startID, endID)
#         else:
#             sql = "SELECT * FROM spots WHERE stitle LIKE %s ORDER BY spotid"
#             txt = ("%" + keyword + "%", )

#         mycursor.execute(sql, txt)
#         result = mycursor.fetchall()

#         # 轉成 JSON 格式
#         itemDic = {}
#         itemDic.update({'nextPage': nextPage})
#         itemList = []
#         for i in range(len(result)):

#             # image list
#             targetID = result[i][AttractionEnum.spotid.value]
#             sql = "SELECT imgurl FROM images WHERE spotid = %s"
#             txt = (targetID, )
#             mycursor.execute(sql, txt)
#             result_image = mycursor.fetchall()
#             result_image = [y for x in result_image for y in x]

#             item = {
#                 "id": result[i][AttractionEnum.spotid.value],  #spotid
#                 "name": result[i][AttractionEnum.stitle.value],  #stitle
#                 "category": result[i][AttractionEnum.CAT2.value],  #CAT2
#                 "description": result[i][AttractionEnum.xbody.value],  #xbody
#                 "address": result[i][AttractionEnum.address.value],  #address
#                 "transport": result[i][AttractionEnum.info.value],  #info
#                 "mrt": result[i][AttractionEnum.MRT.value],  #MRT
#                 "latitude":
#                 result[i][AttractionEnum.latitude.value],  #latitude
#                 "longitude":
#                 result[i][AttractionEnum.longitude.value],  #longitude
#                 "images": result_image
#             }
#             itemList.append(item)

#         itemDic.update({'data': itemList})

#         return jsonify(itemDic), 200
#     except:
#         response_data = {"error": True, "message": "serverError"}
#         return jsonify(response_data), 500

# @app.route('/api/attraction/<attractionId>')
# def attractionId(attractionId):
#     # 景點總數
#     sql = "SELECT COUNT(spotid) FROM spots"
#     mycursor.execute(sql)
#     spotCount = mycursor.fetchone()[0]
#     try:
#         if int(attractionId) > spotCount or int(attractionId) < 1:
#             return jsonify({"error": True, "message": "景點編號不正確"}), 400
#         else:
#             # 根據景點編號取得景點資料
#             sql = "SELECT * FROM spots WHERE spotid=%s"
#             txt = (attractionId, )
#             mycursor.execute(sql, txt)
#             result = mycursor.fetchall()

#             # 轉成 JSON 格式
#             # image list
#             sql = "SELECT imgurl FROM images WHERE spotid = %s"
#             txt = (attractionId, )
#             mycursor.execute(sql, txt)
#             result_image = mycursor.fetchall()
#             result_image = [y for x in result_image for y in x]

#             item = {
#                 "id": result[0][AttractionEnum.spotid.value],  #spotid
#                 "name": result[0][AttractionEnum.stitle.value],  #stitle
#                 "category": result[0][AttractionEnum.CAT2.value],  #CAT2
#                 "description": result[0][AttractionEnum.xbody.value],  #xbody
#                 "address": result[0][AttractionEnum.address.value],  #address
#                 "transport": result[0][AttractionEnum.info.value],  #info
#                 "mrt": result[0][AttractionEnum.MRT.value],  #MRT
#                 "latitude":
#                 result[0][AttractionEnum.latitude.value],  #latitude
#                 "longitude":
#                 result[0][AttractionEnum.longitude.value],  #longitude
#                 "images": result_image
#             }

#             return jsonify({'data': item}), 200
#     except:
#         response_data = {"error": True, "message": "serverError"}
#         return jsonify(response_data), 500

app.run(host="0.0.0.0", port=3000)  #伺服器能夠自動綁到公開的 IP 上
