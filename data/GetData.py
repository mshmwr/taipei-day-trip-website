'''
在我們的專案中有一個data 資料夾，裡面存放了一個taipei-attractions.json檔案，包含所有景點的相關資料。請在MySQL 資料庫中，設計你的資料表，在data 資料夾下，額外寫一隻獨立的Python 程式統一將景點資料存放到資料庫中。請特別注意景點圖片的處理，我們會過濾資料中，不是JPG 或PNG 的檔案，景點的每張圖片網址都必須被想辦法儲存在資料庫中。
'''

import json

import mysql.connector

mydb = mysql.connector.connect(host="localhost",
                               user="root",
                               password="",
                               database="taipeiattractions")

#print(mydb)
mycursor = mydb.cursor()

# Get raw data
src = "./taipei-attractions.json"
# read file
with open(src, 'r', encoding='utf8') as myfile:  #坑1 cp950: encoding
    attractions = json.load(myfile)

results = attractions["result"]["results"]
resultsLen = len(results)
itemArr = [""] * resultsLen

# Get each data
for i in range(0, len(results)):
    # 存進 db
    data = results[i]
    info = data["info"]
    stitle = data["stitle"]
    xpostDate = data["xpostDate"]
    longitude = data["longitude"]
    REF_WP = data["REF_WP"]
    avBegin = data["avBegin"]
    langinfo = data["langinfo"]
    MRT = data["MRT"]
    SERIAL_NO = data["SERIAL_NO"]
    RowNumber = data["RowNumber"]
    CAT1 = data["CAT1"]
    CAT2 = data["CAT2"]
    MEMO_TIME = data["MEMO_TIME"]
    POI = data["POI"]
    idpt = data["idpt"]
    latitude = data["latitude"]
    xbody = data["xbody"]
    _id = data["_id"]
    avEnd = data["avEnd"]
    address = data["address"]

    sql = "INSERT INTO spots (info, stitle, xpostDate, longitude, REF_WP, avBegin, langinfo, MRT, SERIAL_NO, RowNumber, CAT1, CAT2, MEMO_TIME, POI, idpt, latitude, xbody, _id, avEnd, address) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"  #坑2: 即使是數字也不需要用%d，全部%s就可以
    val = [(info, stitle, xpostDate, longitude, REF_WP, avBegin, langinfo, MRT,
            SERIAL_NO, RowNumber, CAT1, CAT2, MEMO_TIME, POI, idpt, latitude,
            xbody, _id, avEnd, address)]
    mycursor.executemany(sql, val)
    mydb.commit()

    # 圖檔網址過濾 & 存進 db
    imgStr = data["file"]  #圖檔
    splitStr = "http"
    imgList = imgStr.split("http")  # imgList[0] 會是空的
    imgList.pop(0)
    # check is .jpg or .png file or not
    for index in range(len(imgList) - 1, -1, -1):
        if "jpg" in imgList[index].lower() or "png" in imgList[index].lower():
            imgList[index] = splitStr + imgList[index]
        else:
            imgList.pop(index)  # remove the file which is not .jpg or .png
    for index in range(0, len(imgList)):
        sql = "INSERT INTO images (spotid, imgindex, imgurl) VALUES (%s, %s, %s)"
        val = [(i + 1, index, imgList[index])
               ]  #坑3: DB的AUTO_INCREMENT PRIMARY KEY是從1開始
        mycursor.executemany(sql, val)
        mydb.commit()