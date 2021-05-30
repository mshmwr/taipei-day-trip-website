-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: taipeiattractions
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderid` int NOT NULL AUTO_INCREMENT,
  `number` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `attractionID` int NOT NULL,
  `attractionName` varchar(255) DEFAULT NULL,
  `attractionAddress` varchar(255) DEFAULT NULL,
  `attractionImage` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `contactName` varchar(255) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `contactPhone` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`orderid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'202105301',2500,3,'士林官邸','臺北市  士林區福林路60號','http://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D7/E150/F719/71eb4b56-f771-43bc-856c-2fb265a5cc6e.jpg','2021-05-30','afternoon','test','test@gmail.com','0912345678',0),(2,'202105302',2500,3,'士林官邸','臺北市  士林區福林路60號','http://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D7/E150/F719/71eb4b56-f771-43bc-856c-2fb265a5cc6e.jpg','2021-05-30','afternoon','test','test@gmail.com','0912345678',0),(3,'202105303',2500,3,'士林官邸','臺北市  士林區福林路60號','http://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D7/E150/F719/71eb4b56-f771-43bc-856c-2fb265a5cc6e.jpg','2021-05-30','afternoon','test','test@gmail.com','0912345678',0),(4,'202105304',2500,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','afternoon','test','test@gmail.com','0912345678',1),(5,'202105305',2500,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','afternoon','test','test@gmail.com','0912345678',1),(6,'202105306',2500,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','afternoon','test','test@gmail.com','0912312312',1),(7,'202105307',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(8,'202105308',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(9,'202105309',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(10,'2021053010',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912345678',1),(11,'2021053011',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912345678',1),(12,'2021053012',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(13,'2021053013',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(14,'2021053014',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(15,'2021053015',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',0),(16,'2021053016',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912312312',1),(17,'2021053017',2000,2,'大稻埕碼頭','臺北市  大同區環河北路一段','http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000340.jpg','2021-05-30','morning','test','test@gmail.com','0912121212',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-30  1:55:59
