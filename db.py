# 記錄各個操作指令 & 查詢目前使用的db

import mysql.connector

mydb = mysql.connector.connect(host="localhost",
                               user="root",
                               password="",
                               database="taipeiattractions")

#print(mydb)
mycursor = mydb.cursor()

# # create database
# mycursor.execute("CREATE DATABASE taipeiattractions")

# # Creating a Table
# mycursor.execute("CREATE TABLE spots (" +
#                  "spotid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, " +
#                  "info VARCHAR(255), " +
#                  "stitle VARCHAR(255) NOT NULL, " +
#                  "xpostDate VARCHAR(255), " +
#                  "longitude VARCHAR(255), " +
#                  "REF_WP VARCHAR(255), " +
#                  "avBegin VARCHAR(255), " +
#                  "langinfo VARCHAR(255), " +
#                  "MRT VARCHAR(255), " +
#                  "SERIAL_NO VARCHAR(255), " +
#                  "RowNumber VARCHAR(255), " +
#                  "CAT1 VARCHAR(255), " +
#                  "CAT2 VARCHAR(255), " +
#                  "MEMO_TIME VARCHAR(255), " +
#                  "POI VARCHAR(255), " +
#                  "idpt VARCHAR(255), " +
#                  "latitude VARCHAR(255), " +
#                  "xbody VARCHAR(255), " +
#                  "_id INT, " +
#                  "avEnd VARCHAR(255), " +
#                  "address VARCHAR(255)" + ")")

# mycursor.execute("CREATE TABLE images (" +
#                  "imgid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, " +
#                  "spotid INT NOT NULL, " +
#                  "imgindex INT NOT NULL, " +
#                  "imgurl VARCHAR(255) NOT NULL, " +
#                  "FOREIGN KEY(spotid) REFERENCES spots(spotid)"+")")

# # Debug: Data too long
# sql = "alter table spots change MEMO_TIME MEMO_TIME longtext"
# mycursor.execute(sql, )
# mydb.commit()

# # Debug: Remove data from table (initial all)
# sql = "TRUNCATE TABLE images"
# mycursor.execute(sql, )
# mydb.commit()
