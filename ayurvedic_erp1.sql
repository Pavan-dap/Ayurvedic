-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: ayurvedic_erp1
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add customer category',7,'add_customercategory'),(26,'Can change customer category',7,'change_customercategory'),(27,'Can delete customer category',7,'delete_customercategory'),(28,'Can view customer category',7,'view_customercategory'),(29,'Can add customer',8,'add_customer'),(30,'Can change customer',8,'change_customer'),(31,'Can delete customer',8,'delete_customer'),(32,'Can view customer',8,'view_customer'),(33,'Can add customer transaction',9,'add_customertransaction'),(34,'Can change customer transaction',9,'change_customertransaction'),(35,'Can delete customer transaction',9,'delete_customertransaction'),(36,'Can view customer transaction',9,'view_customertransaction'),(37,'Can add vendor',10,'add_vendor'),(38,'Can change vendor',10,'change_vendor'),(39,'Can delete vendor',10,'delete_vendor'),(40,'Can view vendor',10,'view_vendor'),(41,'Can add vendor product',11,'add_vendorproduct'),(42,'Can change vendor product',11,'change_vendorproduct'),(43,'Can delete vendor product',11,'delete_vendorproduct'),(44,'Can view vendor product',11,'view_vendorproduct'),(45,'Can add vendor performance',12,'add_vendorperformance'),(46,'Can change vendor performance',12,'change_vendorperformance'),(47,'Can delete vendor performance',12,'delete_vendorperformance'),(48,'Can view vendor performance',12,'view_vendorperformance'),(49,'Can add product category',13,'add_productcategory'),(50,'Can change product category',13,'change_productcategory'),(51,'Can delete product category',13,'delete_productcategory'),(52,'Can view product category',13,'view_productcategory'),(53,'Can add product',14,'add_product'),(54,'Can change product',14,'change_product'),(55,'Can delete product',14,'delete_product'),(56,'Can view product',14,'view_product'),(57,'Can add stock',15,'add_stock'),(58,'Can change stock',15,'change_stock'),(59,'Can delete stock',15,'delete_stock'),(60,'Can view stock',15,'view_stock'),(61,'Can add stock movement',16,'add_stockmovement'),(62,'Can change stock movement',16,'change_stockmovement'),(63,'Can delete stock movement',16,'delete_stockmovement'),(64,'Can view stock movement',16,'view_stockmovement'),(65,'Can add purchase order',17,'add_purchaseorder'),(66,'Can change purchase order',17,'change_purchaseorder'),(67,'Can delete purchase order',17,'delete_purchaseorder'),(68,'Can view purchase order',17,'view_purchaseorder'),(69,'Can add purchase order item',18,'add_purchaseorderitem'),(70,'Can change purchase order item',18,'change_purchaseorderitem'),(71,'Can delete purchase order item',18,'delete_purchaseorderitem'),(72,'Can view purchase order item',18,'view_purchaseorderitem'),(73,'Can add goods receipt note',19,'add_goodsreceiptnote'),(74,'Can change goods receipt note',19,'change_goodsreceiptnote'),(75,'Can delete goods receipt note',19,'delete_goodsreceiptnote'),(76,'Can view goods receipt note',19,'view_goodsreceiptnote'),(77,'Can add goods receipt item',20,'add_goodsreceiptitem'),(78,'Can change goods receipt item',20,'change_goodsreceiptitem'),(79,'Can delete goods receipt item',20,'delete_goodsreceiptitem'),(80,'Can view goods receipt item',20,'view_goodsreceiptitem'),(81,'Can add production formula',21,'add_productionformula'),(82,'Can change production formula',21,'change_productionformula'),(83,'Can delete production formula',21,'delete_productionformula'),(84,'Can view production formula',21,'view_productionformula'),(85,'Can add formula ingredient',22,'add_formulaingredient'),(86,'Can change formula ingredient',22,'change_formulaingredient'),(87,'Can delete formula ingredient',22,'delete_formulaingredient'),(88,'Can view formula ingredient',22,'view_formulaingredient'),(89,'Can add production batch',23,'add_productionbatch'),(90,'Can change production batch',23,'change_productionbatch'),(91,'Can delete production batch',23,'delete_productionbatch'),(92,'Can view production batch',23,'view_productionbatch'),(93,'Can add batch ingredient consumption',24,'add_batchingredientconsumption'),(94,'Can change batch ingredient consumption',24,'change_batchingredientconsumption'),(95,'Can delete batch ingredient consumption',24,'delete_batchingredientconsumption'),(96,'Can view batch ingredient consumption',24,'view_batchingredientconsumption'),(97,'Can add production order',25,'add_productionorder'),(98,'Can change production order',25,'change_productionorder'),(99,'Can delete production order',25,'delete_productionorder'),(100,'Can view production order',25,'view_productionorder'),(101,'Can add quality check',26,'add_qualitycheck'),(102,'Can change quality check',26,'change_qualitycheck'),(103,'Can delete quality check',26,'delete_qualitycheck'),(104,'Can view quality check',26,'view_qualitycheck'),(105,'Can add sale',27,'add_sale'),(106,'Can change sale',27,'change_sale'),(107,'Can delete sale',27,'delete_sale'),(108,'Can view sale',27,'view_sale'),(109,'Can add sale item',28,'add_saleitem'),(110,'Can change sale item',28,'change_saleitem'),(111,'Can delete sale item',28,'delete_saleitem'),(112,'Can view sale item',28,'view_saleitem'),(113,'Can add payment',29,'add_payment'),(114,'Can change payment',29,'change_payment'),(115,'Can delete payment',29,'delete_payment'),(116,'Can view payment',29,'view_payment'),(117,'Can add split payment',30,'add_splitpayment'),(118,'Can change split payment',30,'change_splitpayment'),(119,'Can delete split payment',30,'delete_splitpayment'),(120,'Can view split payment',30,'view_splitpayment'),(121,'Can add discount',31,'add_discount'),(122,'Can change discount',31,'change_discount'),(123,'Can delete discount',31,'delete_discount'),(124,'Can view discount',31,'view_discount'),(125,'Can add sales target',32,'add_salestarget'),(126,'Can change sales target',32,'change_salestarget'),(127,'Can delete sales target',32,'delete_salestarget'),(128,'Can view sales target',32,'view_salestarget'),(129,'Can add expense category',33,'add_expensecategory'),(130,'Can change expense category',33,'change_expensecategory'),(131,'Can delete expense category',33,'delete_expensecategory'),(132,'Can view expense category',33,'view_expensecategory'),(133,'Can add expense',34,'add_expense'),(134,'Can change expense',34,'change_expense'),(135,'Can delete expense',34,'delete_expense'),(136,'Can view expense',34,'view_expense'),(137,'Can add gst report',35,'add_gstreport'),(138,'Can change gst report',35,'change_gstreport'),(139,'Can delete gst report',35,'delete_gstreport'),(140,'Can view gst report',35,'view_gstreport'),(141,'Can add hsn report',36,'add_hsnreport'),(142,'Can change hsn report',36,'change_hsnreport'),(143,'Can delete hsn report',36,'delete_hsnreport'),(144,'Can view hsn report',36,'view_hsnreport'),(145,'Can add cash flow',37,'add_cashflow'),(146,'Can change cash flow',37,'change_cashflow'),(147,'Can delete cash flow',37,'delete_cashflow'),(148,'Can view cash flow',37,'view_cashflow'),(149,'Can add bank account',38,'add_bankaccount'),(150,'Can change bank account',38,'change_bankaccount'),(151,'Can delete bank account',38,'delete_bankaccount'),(152,'Can view bank account',38,'view_bankaccount'),(153,'Can add bank transaction',39,'add_banktransaction'),(154,'Can change bank transaction',39,'change_banktransaction'),(155,'Can delete bank transaction',39,'delete_banktransaction'),(156,'Can view bank transaction',39,'view_banktransaction'),(157,'Can add department',40,'add_department'),(158,'Can change department',40,'change_department'),(159,'Can delete department',40,'delete_department'),(160,'Can view department',40,'view_department'),(161,'Can add employee',41,'add_employee'),(162,'Can change employee',41,'change_employee'),(163,'Can delete employee',41,'delete_employee'),(164,'Can view employee',41,'view_employee'),(165,'Can add attendance',42,'add_attendance'),(166,'Can change attendance',42,'change_attendance'),(167,'Can delete attendance',42,'delete_attendance'),(168,'Can view attendance',42,'view_attendance'),(169,'Can add leave',43,'add_leave'),(170,'Can change leave',43,'change_leave'),(171,'Can delete leave',43,'delete_leave'),(172,'Can view leave',43,'view_leave'),(173,'Can add payroll',44,'add_payroll'),(174,'Can change payroll',44,'change_payroll'),(175,'Can delete payroll',44,'delete_payroll'),(176,'Can view payroll',44,'view_payroll'),(177,'Can add shift schedule',45,'add_shiftschedule'),(178,'Can change shift schedule',45,'change_shiftschedule'),(179,'Can delete shift schedule',45,'delete_shiftschedule'),(180,'Can view shift schedule',45,'view_shiftschedule'),(181,'Can add employee shift',46,'add_employeeshift'),(182,'Can change employee shift',46,'change_employeeshift'),(183,'Can delete employee shift',46,'delete_employeeshift'),(184,'Can view employee shift',46,'view_employeeshift'),(185,'Can add outlet',47,'add_outlet'),(186,'Can change outlet',47,'change_outlet'),(187,'Can delete outlet',47,'delete_outlet'),(188,'Can view outlet',47,'view_outlet'),(189,'Can add stock transfer',48,'add_stocktransfer'),(190,'Can change stock transfer',48,'change_stocktransfer'),(191,'Can delete stock transfer',48,'delete_stocktransfer'),(192,'Can view stock transfer',48,'view_stocktransfer'),(193,'Can add stock transfer item',49,'add_stocktransferitem'),(194,'Can change stock transfer item',49,'change_stocktransferitem'),(195,'Can delete stock transfer item',49,'delete_stocktransferitem'),(196,'Can view stock transfer item',49,'view_stocktransferitem'),(197,'Can add cash denomination',50,'add_cashdenomination'),(198,'Can change cash denomination',50,'change_cashdenomination'),(199,'Can delete cash denomination',50,'delete_cashdenomination'),(200,'Can view cash denomination',50,'view_cashdenomination'),(201,'Can add report template',51,'add_reporttemplate'),(202,'Can change report template',51,'change_reporttemplate'),(203,'Can delete report template',51,'delete_reporttemplate'),(204,'Can view report template',51,'view_reporttemplate'),(205,'Can add generated report',52,'add_generatedreport'),(206,'Can change generated report',52,'change_generatedreport'),(207,'Can delete generated report',52,'delete_generatedreport'),(208,'Can view generated report',52,'view_generatedreport'),(209,'Can add saved dashboard',53,'add_saveddashboard'),(210,'Can change saved dashboard',53,'change_saveddashboard'),(211,'Can delete saved dashboard',53,'delete_saveddashboard'),(212,'Can view saved dashboard',53,'view_saveddashboard'),(213,'Can add dashboard widget',54,'add_dashboardwidget'),(214,'Can change dashboard widget',54,'change_dashboardwidget'),(215,'Can delete dashboard widget',54,'delete_dashboardwidget'),(216,'Can view dashboard widget',54,'view_dashboardwidget');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$600000$YSjzW2njpjreLE1mNSDQYM$RqWIaWrVawrcSGPKLgRxKCBikXH6rUqg3pLBwMmqgfo=',NULL,1,'admin','System','Administrator','admin@ayurvedicerp.com',1,1,'2025-09-30 23:50:40.000000');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers_customer`
--

DROP TABLE IF EXISTS `customers_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers_customer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_code` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `alternate_phone` varchar(15) DEFAULT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `country` varchar(100) NOT NULL,
  `customer_type` varchar(10) NOT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `credit_limit` decimal(12,2) NOT NULL,
  `loyalty_points` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_code` (`customer_code`),
  KEY `customers_customer_category_id_97f881f9_fk_customers` (`category_id`),
  KEY `customers_customer_created_by_id_e3e9e010_fk_auth_user_id` (`created_by_id`),
  KEY `idx_customers_phone` (`phone`),
  KEY `idx_customers_email` (`email`),
  CONSTRAINT `customers_customer_category_id_97f881f9_fk_customers` FOREIGN KEY (`category_id`) REFERENCES `customers_customercategory` (`id`),
  CONSTRAINT `customers_customer_created_by_id_e3e9e010_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_customer`
--

LOCK TABLES `customers_customer` WRITE;
/*!40000 ALTER TABLE `customers_customer` DISABLE KEYS */;
INSERT INTO `customers_customer` VALUES (1,'CUST1001','Rajesh Medical Store','rajesh@medicalstore.com','9876543220',NULL,'Market Street',NULL,'Chandigarh','Punjab','160022','India','B2B',NULL,0.00,0,1,'2025-10-01 00:05:09.000000','2025-10-01 00:05:09.000000',1,NULL),(2,'CUST1002','Wellness Clinic','info@wellnessclinic.com','9876543221',NULL,'Sector 34',NULL,'Chandigarh','Punjab','160034','India','B2B',NULL,0.00,0,1,'2025-10-01 00:05:09.000000','2025-10-01 00:05:09.000000',2,NULL),(3,'CUST1003','Priya Sharma','priya@email.com','9876543222',NULL,'House 123, Sector 21',NULL,'Panchkula','Haryana','134109','India','RETAIL',NULL,0.00,0,1,'2025-10-01 00:05:09.000000','2025-10-01 00:05:09.000000',1,NULL),(4,'CUST1004','Ayurveda Distributors','sales@ayurvedadist.com','9876543223',NULL,'Industrial Area',NULL,'Delhi','Delhi','110001','India','WHOLESALE',NULL,0.00,0,1,'2025-10-01 00:05:09.000000','2025-10-01 00:05:09.000000',3,NULL);
/*!40000 ALTER TABLE `customers_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers_customercategory`
--

DROP TABLE IF EXISTS `customers_customercategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers_customercategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_customercategory`
--

LOCK TABLES `customers_customercategory` WRITE;
/*!40000 ALTER TABLE `customers_customercategory` DISABLE KEYS */;
INSERT INTO `customers_customercategory` VALUES (1,'Regular',0.00,'2025-09-30 23:53:17.000000'),(2,'Premium',5.00,'2025-09-30 23:53:17.000000'),(3,'Wholesale',10.00,'2025-09-30 23:53:17.000000'),(4,'Corporate',15.00,'2025-09-30 23:53:17.000000');
/*!40000 ALTER TABLE `customers_customercategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers_customertransaction`
--

DROP TABLE IF EXISTS `customers_customertransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers_customertransaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_type` varchar(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `loyalty_points` int NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `description` longtext,
  `created_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customers_customertr_customer_id_5fa1ca4f_fk_customers` (`customer_id`),
  CONSTRAINT `customers_customertr_customer_id_5fa1ca4f_fk_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers_customer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_customertransaction`
--

LOCK TABLES `customers_customertransaction` WRITE;
/*!40000 ALTER TABLE `customers_customertransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers_customertransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_dashboardwidget`
--

DROP TABLE IF EXISTS `dashboard_dashboardwidget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_dashboardwidget` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `chart_type` varchar(20) DEFAULT NULL,
  `data_source` varchar(50) NOT NULL,
  `filters` json NOT NULL,
  `position_x` int NOT NULL,
  `position_y` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `config` json NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `dashboard_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dashboard_dashboardw_dashboard_id_72904630_fk_dashboard` (`dashboard_id`),
  CONSTRAINT `dashboard_dashboardw_dashboard_id_72904630_fk_dashboard` FOREIGN KEY (`dashboard_id`) REFERENCES `dashboard_saveddashboard` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_dashboardwidget`
--

LOCK TABLES `dashboard_dashboardwidget` WRITE;
/*!40000 ALTER TABLE `dashboard_dashboardwidget` DISABLE KEYS */;
INSERT INTO `dashboard_dashboardwidget` VALUES (1,'Daily Sales','chart','bar','sales','{\"period\": \"daily\"}',0,0,6,4,'{\"title\": \"Daily Sales Trend\"}','2025-09-30 23:53:38.000000',1),(2,'Top Products','table',NULL,'products','{\"sort\": \"sales_desc\", \"limit\": 10}',6,0,6,4,'{\"title\": \"Top Selling Products\"}','2025-09-30 23:53:38.000000',1),(3,'Sales Metrics','metric',NULL,'sales','{\"period\": \"monthly\"}',0,4,3,2,'{\"title\": \"Monthly Sales\"}','2025-09-30 23:53:38.000000',1),(4,'Stock Alerts','alert',NULL,'inventory','{\"alert_type\": \"low_stock\"}',0,0,4,3,'{\"title\": \"Low Stock Alerts\"}','2025-09-30 23:53:38.000000',2),(5,'Expiry Alerts','alert',NULL,'inventory','{\"alert_type\": \"expiry\"}',4,0,4,3,'{\"title\": \"Expiry Alerts\"}','2025-09-30 23:53:38.000000',2),(6,'Daily Sales','chart','bar','sales','{\"period\": \"daily\"}',0,0,6,4,'{\"title\": \"Daily Sales Trend\"}','2025-10-01 00:52:39.000000',1),(7,'Top Products','table',NULL,'products','{\"sort\": \"sales_desc\", \"limit\": 10}',6,0,6,4,'{\"title\": \"Top Selling Products\"}','2025-10-01 00:52:39.000000',1),(8,'Sales Metrics','metric',NULL,'sales','{\"period\": \"monthly\"}',0,4,3,2,'{\"title\": \"Monthly Sales\"}','2025-10-01 00:52:39.000000',1),(9,'Stock Alerts','alert',NULL,'inventory','{\"alert_type\": \"low_stock\"}',0,0,4,3,'{\"title\": \"Low Stock Alerts\"}','2025-10-01 00:52:39.000000',2),(10,'Expiry Alerts','alert',NULL,'inventory','{\"alert_type\": \"expiry\"}',4,0,4,3,'{\"title\": \"Expiry Alerts\"}','2025-10-01 00:52:39.000000',2);
/*!40000 ALTER TABLE `dashboard_dashboardwidget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard_saveddashboard`
--

DROP TABLE IF EXISTS `dashboard_saveddashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard_saveddashboard` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` longtext,
  `is_default` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dashboard_saveddashboard_created_by_id_0ba31086_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `dashboard_saveddashboard_created_by_id_0ba31086_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard_saveddashboard`
--

LOCK TABLES `dashboard_saveddashboard` WRITE;
/*!40000 ALTER TABLE `dashboard_saveddashboard` DISABLE KEYS */;
INSERT INTO `dashboard_saveddashboard` VALUES (1,'Sales Overview','Daily sales metrics and trends',1,'2025-09-30 23:53:36.000000','2025-09-30 23:53:36.000000',NULL),(2,'Inventory Dashboard','Stock levels and alerts',0,'2025-09-30 23:53:36.000000','2025-09-30 23:53:36.000000',NULL),(3,'Production Dashboard','Manufacturing and batch tracking',0,'2025-09-30 23:53:36.000000','2025-09-30 23:53:36.000000',NULL),(4,'Sales Overview','Daily sales metrics and trends',1,'2025-10-01 00:32:37.000000','2025-10-01 00:32:37.000000',NULL),(5,'Inventory Dashboard','Stock levels and alerts',0,'2025-10-01 00:32:37.000000','2025-10-01 00:32:37.000000',NULL),(6,'Production Dashboard','Manufacturing and batch tracking',0,'2025-10-01 00:32:37.000000','2025-10-01 00:32:37.000000',NULL),(7,'Sales Overview','Daily sales metrics and trends',1,'2025-10-01 00:51:57.000000','2025-10-01 00:51:57.000000',NULL),(8,'Inventory Dashboard','Stock levels and alerts',0,'2025-10-01 00:51:57.000000','2025-10-01 00:51:57.000000',NULL),(9,'Production Dashboard','Manufacturing and batch tracking',0,'2025-10-01 00:51:57.000000','2025-10-01 00:51:57.000000',NULL),(10,'Sales Overview','Daily sales metrics and trends',1,'2025-10-01 00:52:35.000000','2025-10-01 00:52:35.000000',NULL),(11,'Inventory Dashboard','Stock levels and alerts',0,'2025-10-01 00:52:35.000000','2025-10-01 00:52:35.000000',NULL),(12,'Production Dashboard','Manufacturing and batch tracking',0,'2025-10-01 00:52:35.000000','2025-10-01 00:52:35.000000',NULL);
/*!40000 ALTER TABLE `dashboard_saveddashboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(8,'customers','customer'),(7,'customers','customercategory'),(9,'customers','customertransaction'),(54,'dashboard','dashboardwidget'),(53,'dashboard','saveddashboard'),(38,'finance','bankaccount'),(39,'finance','banktransaction'),(37,'finance','cashflow'),(34,'finance','expense'),(33,'finance','expensecategory'),(35,'finance','gstreport'),(36,'finance','hsnreport'),(42,'hr','attendance'),(40,'hr','department'),(41,'hr','employee'),(46,'hr','employeeshift'),(43,'hr','leave'),(44,'hr','payroll'),(45,'hr','shiftschedule'),(20,'inventory','goodsreceiptitem'),(19,'inventory','goodsreceiptnote'),(14,'inventory','product'),(13,'inventory','productcategory'),(17,'inventory','purchaseorder'),(18,'inventory','purchaseorderitem'),(15,'inventory','stock'),(16,'inventory','stockmovement'),(50,'outlets','cashdenomination'),(47,'outlets','outlet'),(48,'outlets','stocktransfer'),(49,'outlets','stocktransferitem'),(24,'production','batchingredientconsumption'),(22,'production','formulaingredient'),(23,'production','productionbatch'),(21,'production','productionformula'),(25,'production','productionorder'),(26,'production','qualitycheck'),(52,'reports','generatedreport'),(51,'reports','reporttemplate'),(31,'sales','discount'),(29,'sales','payment'),(27,'sales','sale'),(28,'sales','saleitem'),(32,'sales','salestarget'),(30,'sales','splitpayment'),(6,'sessions','session'),(10,'vendors','vendor'),(12,'vendors','vendorperformance'),(11,'vendors','vendorproduct');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-09-30 18:18:59.394293'),(2,'auth','0001_initial','2025-09-30 18:18:59.518145'),(3,'admin','0001_initial','2025-09-30 18:18:59.553860'),(4,'admin','0002_logentry_remove_auto_add','2025-09-30 18:18:59.558096'),(5,'admin','0003_logentry_add_action_flag_choices','2025-09-30 18:18:59.563295'),(6,'contenttypes','0002_remove_content_type_name','2025-09-30 18:18:59.601183'),(7,'auth','0002_alter_permission_name_max_length','2025-09-30 18:18:59.614416'),(8,'auth','0003_alter_user_email_max_length','2025-09-30 18:18:59.622701'),(9,'auth','0004_alter_user_username_opts','2025-09-30 18:18:59.628008'),(10,'auth','0005_alter_user_last_login_null','2025-09-30 18:18:59.639212'),(11,'auth','0006_require_contenttypes_0002','2025-09-30 18:18:59.640286'),(12,'auth','0007_alter_validators_add_error_messages','2025-09-30 18:18:59.644011'),(13,'auth','0008_alter_user_username_max_length','2025-09-30 18:18:59.662480'),(14,'auth','0009_alter_user_last_name_max_length','2025-09-30 18:18:59.676464'),(15,'auth','0010_alter_group_name_max_length','2025-09-30 18:18:59.685408'),(16,'auth','0011_update_proxy_permissions','2025-09-30 18:18:59.704252'),(17,'auth','0012_alter_user_first_name_max_length','2025-09-30 18:18:59.718985'),(18,'sessions','0001_initial','2025-09-30 18:18:59.727398'),(19,'vendors','0001_initial','2025-09-30 18:18:59.804945'),(20,'customers','0001_initial','2025-09-30 18:23:05.108346'),(21,'dashboard','0001_initial','2025-09-30 18:23:05.159713'),(22,'outlets','0001_initial','2025-09-30 18:23:05.276772'),(23,'finance','0001_initial','2025-09-30 18:23:05.484048'),(24,'hr','0001_initial','2025-09-30 18:23:05.664163'),(25,'inventory','0001_initial','2025-09-30 18:23:05.891312'),(26,'production','0001_initial','2025-09-30 18:23:06.149407'),(27,'reports','0001_initial','2025-09-30 18:23:06.207201'),(28,'sales','0001_initial','2025-09-30 18:23:06.454768');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_bankaccount`
--

DROP TABLE IF EXISTS `finance_bankaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_bankaccount` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_name` varchar(200) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `ifsc_code` varchar(20) NOT NULL,
  `account_type` varchar(15) NOT NULL,
  `current_balance` decimal(15,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `finance_bankaccount_outlet_id_d51c4584_fk_outlets_outlet_id` (`outlet_id`),
  CONSTRAINT `finance_bankaccount_outlet_id_d51c4584_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_bankaccount`
--

LOCK TABLES `finance_bankaccount` WRITE;
/*!40000 ALTER TABLE `finance_bankaccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_bankaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_banktransaction`
--

DROP TABLE IF EXISTS `finance_banktransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_banktransaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_type` varchar(10) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `description` longtext NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `bank_account_id` bigint NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `finance_banktransact_bank_account_id_682e719d_fk_finance_b` (`bank_account_id`),
  KEY `finance_banktransaction_created_by_id_9da5c37b_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `finance_banktransact_bank_account_id_682e719d_fk_finance_b` FOREIGN KEY (`bank_account_id`) REFERENCES `finance_bankaccount` (`id`),
  CONSTRAINT `finance_banktransaction_created_by_id_9da5c37b_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_banktransaction`
--

LOCK TABLES `finance_banktransaction` WRITE;
/*!40000 ALTER TABLE `finance_banktransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_banktransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_cashflow`
--

DROP TABLE IF EXISTS `finance_cashflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_cashflow` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `flow_type` varchar(10) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` longtext NOT NULL,
  `reference_type` varchar(50) NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `finance_cashflow_created_by_id_df6b1db8_fk_auth_user_id` (`created_by_id`),
  KEY `finance_cashflow_outlet_id_2cd1cd5d_fk_outlets_outlet_id` (`outlet_id`),
  CONSTRAINT `finance_cashflow_created_by_id_df6b1db8_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `finance_cashflow_outlet_id_2cd1cd5d_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_cashflow`
--

LOCK TABLES `finance_cashflow` WRITE;
/*!40000 ALTER TABLE `finance_cashflow` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_cashflow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_expense`
--

DROP TABLE IF EXISTS `finance_expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_expense` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expense_number` varchar(20) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `expense_date` date NOT NULL,
  `description` longtext NOT NULL,
  `vendor_name` varchar(200) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `payment_method` varchar(20) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `approved_by_id` int DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_number` (`expense_number`),
  KEY `finance_expense_approved_by_id_fa40e9cf_fk_auth_user_id` (`approved_by_id`),
  KEY `finance_expense_category_id_19b015b6_fk_finance_e` (`category_id`),
  KEY `finance_expense_created_by_id_913042dd_fk_auth_user_id` (`created_by_id`),
  KEY `finance_expense_outlet_id_e36ddfb9_fk_outlets_outlet_id` (`outlet_id`),
  CONSTRAINT `finance_expense_approved_by_id_fa40e9cf_fk_auth_user_id` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `finance_expense_category_id_19b015b6_fk_finance_e` FOREIGN KEY (`category_id`) REFERENCES `finance_expensecategory` (`id`),
  CONSTRAINT `finance_expense_created_by_id_913042dd_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `finance_expense_outlet_id_e36ddfb9_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_expense`
--

LOCK TABLES `finance_expense` WRITE;
/*!40000 ALTER TABLE `finance_expense` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_expensecategory`
--

DROP TABLE IF EXISTS `finance_expensecategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_expensecategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_expensecategory`
--

LOCK TABLES `finance_expensecategory` WRITE;
/*!40000 ALTER TABLE `finance_expensecategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_expensecategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_gstreport`
--

DROP TABLE IF EXISTS `finance_gstreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_gstreport` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `report_type` varchar(10) NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `total_sales` decimal(15,2) NOT NULL,
  `b2b_sales` decimal(15,2) NOT NULL,
  `b2c_sales` decimal(15,2) NOT NULL,
  `export_sales` decimal(15,2) NOT NULL,
  `cgst_amount` decimal(12,2) NOT NULL,
  `sgst_amount` decimal(12,2) NOT NULL,
  `igst_amount` decimal(12,2) NOT NULL,
  `total_tax_collected` decimal(12,2) NOT NULL,
  `total_purchases` decimal(15,2) NOT NULL,
  `input_tax_credit` decimal(12,2) NOT NULL,
  `tax_payable` decimal(12,2) NOT NULL,
  `generated_at` datetime(6) NOT NULL,
  `generated_by_id` int DEFAULT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `finance_gstreport_report_type_month_year_outlet_id_5bbd6d5c_uniq` (`report_type`,`month`,`year`,`outlet_id`),
  KEY `finance_gstreport_generated_by_id_443a12ef_fk_auth_user_id` (`generated_by_id`),
  KEY `finance_gstreport_outlet_id_c3904664_fk_outlets_outlet_id` (`outlet_id`),
  KEY `idx_gst_report_period` (`month`,`year`),
  CONSTRAINT `finance_gstreport_generated_by_id_443a12ef_fk_auth_user_id` FOREIGN KEY (`generated_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `finance_gstreport_outlet_id_c3904664_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_gstreport`
--

LOCK TABLES `finance_gstreport` WRITE;
/*!40000 ALTER TABLE `finance_gstreport` DISABLE KEYS */;
INSERT INTO `finance_gstreport` VALUES (1,'GSTR1',1,2024,485670.00,385670.00,100000.00,0.00,29140.00,29140.00,0.00,58280.00,0.00,15000.00,43280.00,'2025-10-01 00:30:07.000000',NULL,1),(2,'GSTR3B',1,2024,125000.00,75000.00,50000.00,0.00,7500.00,7500.00,0.00,15000.00,0.00,4500.00,10500.00,'2025-10-01 00:30:07.000000',NULL,2);
/*!40000 ALTER TABLE `finance_gstreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_hsnreport`
--

DROP TABLE IF EXISTS `finance_hsnreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_hsnreport` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `hsn_code` varchar(20) NOT NULL,
  `description` longtext NOT NULL,
  `unit_of_measure` varchar(20) NOT NULL,
  `total_quantity` decimal(15,3) NOT NULL,
  `total_value` decimal(15,2) NOT NULL,
  `taxable_value` decimal(15,2) NOT NULL,
  `integrated_tax` decimal(12,2) NOT NULL,
  `central_tax` decimal(12,2) NOT NULL,
  `state_tax` decimal(12,2) NOT NULL,
  `cess` decimal(12,2) NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `generated_at` datetime(6) NOT NULL,
  `generated_by_id` int DEFAULT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `finance_hsnreport_hsn_code_month_year_outlet_id_7b4fc8a7_uniq` (`hsn_code`,`month`,`year`,`outlet_id`),
  KEY `finance_hsnreport_generated_by_id_d73efcea_fk_auth_user_id` (`generated_by_id`),
  KEY `finance_hsnreport_outlet_id_36c2ef34_fk_outlets_outlet_id` (`outlet_id`),
  KEY `idx_hsn_report_period` (`month`,`year`),
  CONSTRAINT `finance_hsnreport_generated_by_id_d73efcea_fk_auth_user_id` FOREIGN KEY (`generated_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `finance_hsnreport_outlet_id_36c2ef34_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_hsnreport`
--

LOCK TABLES `finance_hsnreport` WRITE;
/*!40000 ALTER TABLE `finance_hsnreport` DISABLE KEYS */;
INSERT INTO `finance_hsnreport` VALUES (1,'15159090','Herbal Oils','ml',1500.000,180000.00,180000.00,0.00,10800.00,10800.00,0.00,1,2024,'2025-10-01 00:32:33.000000',NULL,1),(2,'12119099','Herbal Powders','gm',800.000,160000.00,160000.00,0.00,4000.00,4000.00,0.00,1,2024,'2025-10-01 00:32:33.000000',NULL,1),(3,'33049900','Herbal Creams','gm',300.000,75000.00,75000.00,0.00,6750.00,6750.00,0.00,1,2024,'2025-10-01 00:32:33.000000',NULL,1);
/*!40000 ALTER TABLE `finance_hsnreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_attendance`
--

DROP TABLE IF EXISTS `hr_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `shift_type` varchar(10) NOT NULL,
  `check_in_time` time(6) DEFAULT NULL,
  `check_out_time` time(6) DEFAULT NULL,
  `total_hours` decimal(4,2) NOT NULL,
  `overtime_hours` decimal(4,2) NOT NULL,
  `is_present` tinyint(1) NOT NULL,
  `is_late` tinyint(1) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_attendance_employee_id_date_shift_type_2c4c008e_uniq` (`employee_id`,`date`,`shift_type`),
  CONSTRAINT `hr_attendance_employee_id_7ed1b344_fk_hr_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `hr_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_attendance`
--

LOCK TABLES `hr_attendance` WRITE;
/*!40000 ALTER TABLE `hr_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_department`
--

DROP TABLE IF EXISTS `hr_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_department` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `head_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `hr_department_head_id_b279af3b_fk_auth_user_id` (`head_id`),
  CONSTRAINT `hr_department_head_id_b279af3b_fk_auth_user_id` FOREIGN KEY (`head_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_department`
--

LOCK TABLES `hr_department` WRITE;
/*!40000 ALTER TABLE `hr_department` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_employee`
--

DROP TABLE IF EXISTS `hr_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_employee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(20) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `employment_type` varchar(15) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `emergency_contact` varchar(15) DEFAULT NULL,
  `address` longtext NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `join_date` date NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `department_id` bigint NOT NULL,
  `outlet_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `hr_employee_department_id_0bf585c1_fk_hr_department_id` (`department_id`),
  KEY `hr_employee_outlet_id_6805f5a1_fk_outlets_outlet_id` (`outlet_id`),
  CONSTRAINT `hr_employee_department_id_0bf585c1_fk_hr_department_id` FOREIGN KEY (`department_id`) REFERENCES `hr_department` (`id`),
  CONSTRAINT `hr_employee_outlet_id_6805f5a1_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`),
  CONSTRAINT `hr_employee_user_id_0b2d424f_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_employee`
--

LOCK TABLES `hr_employee` WRITE;
/*!40000 ALTER TABLE `hr_employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_employeeshift`
--

DROP TABLE IF EXISTS `hr_employeeshift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_employeeshift` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `day_of_week` varchar(10) NOT NULL,
  `is_working_day` tinyint(1) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_until` date DEFAULT NULL,
  `employee_id` bigint NOT NULL,
  `shift_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_employeeshift_employee_id_bcfa1704_fk_hr_employee_id` (`employee_id`),
  KEY `hr_employeeshift_shift_id_6b7e7fcc_fk_hr_shiftschedule_id` (`shift_id`),
  CONSTRAINT `hr_employeeshift_employee_id_bcfa1704_fk_hr_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `hr_employee` (`id`),
  CONSTRAINT `hr_employeeshift_shift_id_6b7e7fcc_fk_hr_shiftschedule_id` FOREIGN KEY (`shift_id`) REFERENCES `hr_shiftschedule` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_employeeshift`
--

LOCK TABLES `hr_employeeshift` WRITE;
/*!40000 ALTER TABLE `hr_employeeshift` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_employeeshift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_leave`
--

DROP TABLE IF EXISTS `hr_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_leave` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `leave_type` varchar(15) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NOT NULL,
  `reason` longtext NOT NULL,
  `status` varchar(10) NOT NULL,
  `applied_date` datetime(6) NOT NULL,
  `approved_date` datetime(6) DEFAULT NULL,
  `comments` longtext,
  `approved_by_id` int DEFAULT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hr_leave_approved_by_id_48284e72_fk_auth_user_id` (`approved_by_id`),
  KEY `hr_leave_employee_id_ff3d8f5b_fk_hr_employee_id` (`employee_id`),
  CONSTRAINT `hr_leave_approved_by_id_48284e72_fk_auth_user_id` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `hr_leave_employee_id_ff3d8f5b_fk_hr_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `hr_employee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_leave`
--

LOCK TABLES `hr_leave` WRITE;
/*!40000 ALTER TABLE `hr_leave` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_leave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_payroll`
--

DROP TABLE IF EXISTS `hr_payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_payroll` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) NOT NULL,
  `conveyance` decimal(10,2) NOT NULL,
  `overtime_amount` decimal(10,2) NOT NULL,
  `bonus` decimal(10,2) NOT NULL,
  `total_earnings` decimal(12,2) NOT NULL,
  `pf_deduction` decimal(10,2) NOT NULL,
  `esi_deduction` decimal(10,2) NOT NULL,
  `tax_deduction` decimal(10,2) NOT NULL,
  `other_deductions` decimal(10,2) NOT NULL,
  `total_deductions` decimal(10,2) NOT NULL,
  `net_salary` decimal(12,2) NOT NULL,
  `total_working_days` int NOT NULL,
  `days_worked` int NOT NULL,
  `leaves_taken` int NOT NULL,
  `overtime_hours` decimal(5,2) NOT NULL,
  `status` varchar(10) NOT NULL,
  `generated_at` datetime(6) NOT NULL,
  `paid_date` datetime(6) DEFAULT NULL,
  `employee_id` bigint NOT NULL,
  `generated_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_payroll_employee_id_month_year_78b5024f_uniq` (`employee_id`,`month`,`year`),
  KEY `hr_payroll_generated_by_id_4c72cb97_fk_auth_user_id` (`generated_by_id`),
  CONSTRAINT `hr_payroll_employee_id_b112a6a4_fk_hr_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `hr_employee` (`id`),
  CONSTRAINT `hr_payroll_generated_by_id_4c72cb97_fk_auth_user_id` FOREIGN KEY (`generated_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_payroll`
--

LOCK TABLES `hr_payroll` WRITE;
/*!40000 ALTER TABLE `hr_payroll` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_shiftschedule`
--

DROP TABLE IF EXISTS `hr_shiftschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_shiftschedule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `start_time` time(6) NOT NULL,
  `end_time` time(6) NOT NULL,
  `break_duration` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_shiftschedule`
--

LOCK TABLES `hr_shiftschedule` WRITE;
/*!40000 ALTER TABLE `hr_shiftschedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_shiftschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_goodsreceiptitem`
--

DROP TABLE IF EXISTS `inventory_goodsreceiptitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_goodsreceiptitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(50) NOT NULL,
  `quantity_received` decimal(10,3) NOT NULL,
  `quantity_accepted` decimal(10,3) NOT NULL,
  `quantity_rejected` decimal(10,3) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `notes` longtext,
  `grn_id` bigint NOT NULL,
  `po_item_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_goodsrecei_grn_id_c554f8a4_fk_inventory` (`grn_id`),
  KEY `inventory_goodsrecei_po_item_id_4820af7d_fk_inventory` (`po_item_id`),
  CONSTRAINT `inventory_goodsrecei_grn_id_c554f8a4_fk_inventory` FOREIGN KEY (`grn_id`) REFERENCES `inventory_goodsreceiptnote` (`id`),
  CONSTRAINT `inventory_goodsrecei_po_item_id_4820af7d_fk_inventory` FOREIGN KEY (`po_item_id`) REFERENCES `inventory_purchaseorderitem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_goodsreceiptitem`
--

LOCK TABLES `inventory_goodsreceiptitem` WRITE;
/*!40000 ALTER TABLE `inventory_goodsreceiptitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_goodsreceiptitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_goodsreceiptnote`
--

DROP TABLE IF EXISTS `inventory_goodsreceiptnote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_goodsreceiptnote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `grn_number` varchar(20) NOT NULL,
  `received_date` datetime(6) NOT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `approved_by_id` int DEFAULT NULL,
  `purchase_order_id` bigint NOT NULL,
  `received_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grn_number` (`grn_number`),
  KEY `inventory_goodsrecei_approved_by_id_2d327fc7_fk_auth_user` (`approved_by_id`),
  KEY `inventory_goodsrecei_purchase_order_id_9a223a06_fk_inventory` (`purchase_order_id`),
  KEY `inventory_goodsrecei_received_by_id_b37d44b2_fk_auth_user` (`received_by_id`),
  CONSTRAINT `inventory_goodsrecei_approved_by_id_2d327fc7_fk_auth_user` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `inventory_goodsrecei_purchase_order_id_9a223a06_fk_inventory` FOREIGN KEY (`purchase_order_id`) REFERENCES `inventory_purchaseorder` (`id`),
  CONSTRAINT `inventory_goodsrecei_received_by_id_b37d44b2_fk_auth_user` FOREIGN KEY (`received_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_goodsreceiptnote`
--

LOCK TABLES `inventory_goodsreceiptnote` WRITE;
/*!40000 ALTER TABLE `inventory_goodsreceiptnote` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_goodsreceiptnote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_product`
--

DROP TABLE IF EXISTS `inventory_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `product_type` varchar(20) NOT NULL,
  `description` longtext,
  `unit_of_measure` varchar(20) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `minimum_stock_level` decimal(10,3) NOT NULL,
  `maximum_stock_level` decimal(10,3) NOT NULL,
  `reorder_point` decimal(10,3) NOT NULL,
  `shelf_life_days` int NOT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` bigint NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_code` (`product_code`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `inventory_product_category_id_c907876e_fk_inventory` (`category_id`),
  KEY `inventory_product_created_by_id_acb3b5df_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `inventory_product_category_id_c907876e_fk_inventory` FOREIGN KEY (`category_id`) REFERENCES `inventory_productcategory` (`id`),
  CONSTRAINT `inventory_product_created_by_id_acb3b5df_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_product`
--

LOCK TABLES `inventory_product` WRITE;
/*!40000 ALTER TABLE `inventory_product` DISABLE KEYS */;
INSERT INTO `inventory_product` VALUES (1,'FG0001','Premium Coconut Oil','FINISHED','Premium coconut oil with herbal extracts','ml',80.00,120.00,50.000,1000.000,20.000,365,'8901234567890',1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',1,NULL),(2,'FG0002','Triphala Churna','FINISHED','Traditional Triphala powder for digestion','gm',150.00,200.00,100.000,1000.000,50.000,365,'8901234567891',1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',2,NULL),(3,'FG0003','Neem Face Cream','FINISHED','Anti-acne face cream with neem extract','gm',180.00,250.00,30.000,1000.000,15.000,365,'8901234567892',1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',3,NULL),(4,'RM0001','Sprig Twist','RAW_MATERIAL','Sprig twist extract for oil preparation','gm',5.00,0.00,500.000,1000.000,200.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(5,'RM0002','Shea Butter Extract','RAW_MATERIAL','Pure shea butter extract','gm',15.00,0.00,100.000,1000.000,50.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(6,'RM0003','Coconut Milk','RAW_MATERIAL','Fresh coconut milk','gm',8.00,0.00,200.000,1000.000,100.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(7,'RM0004','Aloe Vera Gel','RAW_MATERIAL','Pure aloe vera gel','gm',12.00,0.00,150.000,1000.000,75.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(8,'RM0005','Rose Water','RAW_MATERIAL','Distilled rose water','gm',10.00,0.00,100.000,1000.000,50.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(9,'RM0006','Mandela Pulp','RAW_MATERIAL','Mandela fruit pulp extract','gm',20.00,0.00,75.000,1000.000,35.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(10,'RM0007','Green Tea Extract','RAW_MATERIAL','Concentrated green tea extract','gm',25.00,0.00,50.000,1000.000,25.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(11,'RM0008','Onion Seed Extract','RAW_MATERIAL','Onion seed oil extract','gm',30.00,0.00,40.000,1000.000,20.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(12,'RM0009','Argan Oil','RAW_MATERIAL','Pure argan oil','ml',50.00,0.00,25.000,1000.000,10.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(13,'RM0010','Grape Seed Oil','RAW_MATERIAL','Cold pressed grape seed oil','ml',40.00,0.00,30.000,1000.000,15.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(14,'RM0011','Neem Oil','RAW_MATERIAL','Pure neem oil','ml',35.00,0.00,20.000,1000.000,10.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(15,'RM0012','Jasmin Oil','RAW_MATERIAL','Essential jasmin oil','ml',60.00,0.00,15.000,1000.000,8.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(16,'RM0013','Tea Tree Oil','RAW_MATERIAL','Pure tea tree oil','ml',45.00,0.00,15.000,1000.000,8.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(17,'RM0014','Ethylene','RAW_MATERIAL','Ethylene compound','gm',15.00,0.00,50.000,1000.000,25.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(18,'RM0015','Pyridoxine','RAW_MATERIAL','Vitamin B6 (Pyridoxine)','gm',25.00,0.00,50.000,1000.000,25.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',4,NULL),(19,'PK0001','Glass Bottles 100ml','PACKAGING','100ml amber glass bottles','pieces',15.00,0.00,500.000,1000.000,200.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',5,NULL),(20,'PK0002','Plastic Caps','PACKAGING','Screw caps for bottles','pieces',2.00,0.00,1000.000,1000.000,500.000,365,NULL,1,'2025-10-01 00:13:01.000000','2025-10-01 00:13:01.000000',5,NULL);
/*!40000 ALTER TABLE `inventory_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_productcategory`
--

DROP TABLE IF EXISTS `inventory_productcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_productcategory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `hsn_code` varchar(20) DEFAULT NULL,
  `gst_rate` decimal(5,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_productcategory`
--

LOCK TABLES `inventory_productcategory` WRITE;
/*!40000 ALTER TABLE `inventory_productcategory` DISABLE KEYS */;
INSERT INTO `inventory_productcategory` VALUES (1,'Herbal Oils','Ayurvedic oils for various treatments','15159090',12.00,1,'2025-09-30 23:53:22.000000'),(2,'Herbal Powders','Natural herbal powders and churnas','12119099',5.00,1,'2025-09-30 23:53:22.000000'),(3,'Herbal Creams','Topical ayurvedic creams and ointments','33049900',18.00,1,'2025-09-30 23:53:22.000000'),(4,'Raw Materials','Raw herbs and materials for production','12119010',5.00,1,'2025-09-30 23:53:22.000000'),(5,'Packaging Materials','Bottles, caps, labels and packaging items','39233090',18.00,1,'2025-09-30 23:53:22.000000');
/*!40000 ALTER TABLE `inventory_productcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_purchaseorder`
--

DROP TABLE IF EXISTS `inventory_purchaseorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_purchaseorder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `po_number` varchar(20) NOT NULL,
  `vendor_name` varchar(200) NOT NULL,
  `vendor_contact` varchar(200) DEFAULT NULL,
  `po_date` date NOT NULL,
  `expected_delivery` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax_amount` decimal(12,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `notes` longtext,
  `terms_conditions` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `po_number` (`po_number`),
  KEY `inventory_purchaseorder_created_by_id_c2f7af15_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `inventory_purchaseorder_created_by_id_c2f7af15_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_purchaseorder`
--

LOCK TABLES `inventory_purchaseorder` WRITE;
/*!40000 ALTER TABLE `inventory_purchaseorder` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_purchaseorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_purchaseorderitem`
--

DROP TABLE IF EXISTS `inventory_purchaseorderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_purchaseorderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(200) NOT NULL,
  `description` longtext,
  `quantity` decimal(10,3) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `received_quantity` decimal(10,3) NOT NULL,
  `unit_of_measure` varchar(20) NOT NULL,
  `purchase_order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_purchaseor_purchase_order_id_af9dd3c5_fk_inventory` (`purchase_order_id`),
  CONSTRAINT `inventory_purchaseor_purchase_order_id_af9dd3c5_fk_inventory` FOREIGN KEY (`purchase_order_id`) REFERENCES `inventory_purchaseorder` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_purchaseorderitem`
--

LOCK TABLES `inventory_purchaseorderitem` WRITE;
/*!40000 ALTER TABLE `inventory_purchaseorderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_purchaseorderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_stock`
--

DROP TABLE IF EXISTS `inventory_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_stock` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(50) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `reserved_quantity` decimal(12,3) NOT NULL,
  `available_quantity` decimal(12,3) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `outlet_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_stock_product_id_outlet_id_batch_number_05704720_uniq` (`product_id`,`outlet_id`,`batch_number`),
  KEY `inventory_stock_outlet_id_da5d694d_fk_outlets_outlet_id` (`outlet_id`),
  KEY `idx_stock_expiry` (`expiry_date`),
  CONSTRAINT `inventory_stock_outlet_id_da5d694d_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`),
  CONSTRAINT `inventory_stock_product_id_b75f69ba_fk_inventory_product_id` FOREIGN KEY (`product_id`) REFERENCES `inventory_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_stock`
--

LOCK TABLES `inventory_stock` WRITE;
/*!40000 ALTER TABLE `inventory_stock` DISABLE KEYS */;
INSERT INTO `inventory_stock` VALUES (1,'PCO202401001',500.000,0.000,0.000,80.00,'2024-01-15','2025-01-15',NULL,1,'2025-10-01 00:16:18.000000','2025-10-01 00:16:18.000000',1,1),(2,'TC202401001',200.000,0.000,0.000,150.00,'2024-01-20','2025-01-20',NULL,1,'2025-10-01 00:16:18.000000','2025-10-01 00:16:18.000000',1,2),(3,'NFC202401001',100.000,0.000,0.000,180.00,'2024-01-25','2025-01-25',NULL,1,'2025-10-01 00:16:18.000000','2025-10-01 00:16:18.000000',1,3),(4,'ST202401001',1000.000,0.000,0.000,5.00,'2024-01-10','2025-01-10',NULL,1,'2025-10-01 00:16:18.000000','2025-10-01 00:16:18.000000',1,4),(5,'SBE202401001',150.000,0.000,0.000,15.00,'2024-01-10','2025-01-10',NULL,1,'2025-10-01 00:16:18.000000','2025-10-01 00:16:18.000000',1,5);
/*!40000 ALTER TABLE `inventory_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_stockmovement`
--

DROP TABLE IF EXISTS `inventory_stockmovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_stockmovement` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `movement_type` varchar(20) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `stock_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventory_stockmovement_created_by_id_9a39cb99_fk_auth_user_id` (`created_by_id`),
  KEY `inventory_stockmovement_stock_id_041b80f1_fk_inventory_stock_id` (`stock_id`),
  CONSTRAINT `inventory_stockmovement_created_by_id_9a39cb99_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `inventory_stockmovement_stock_id_041b80f1_fk_inventory_stock_id` FOREIGN KEY (`stock_id`) REFERENCES `inventory_stock` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_stockmovement`
--

LOCK TABLES `inventory_stockmovement` WRITE;
/*!40000 ALTER TABLE `inventory_stockmovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_stockmovement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlets_cashdenomination`
--

DROP TABLE IF EXISTS `outlets_cashdenomination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlets_cashdenomination` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `note_2000` int NOT NULL,
  `note_500` int NOT NULL,
  `note_200` int NOT NULL,
  `note_100` int NOT NULL,
  `note_50` int NOT NULL,
  `note_20` int NOT NULL,
  `note_10` int NOT NULL,
  `coin_10` int NOT NULL,
  `coin_5` int NOT NULL,
  `coin_2` int NOT NULL,
  `coin_1` int NOT NULL,
  `total_cash` decimal(12,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `outlets_cashdenomination_outlet_id_date_0b6869fb_uniq` (`outlet_id`,`date`),
  KEY `outlets_cashdenomination_created_by_id_d5b2e02e_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `outlets_cashdenomination_created_by_id_d5b2e02e_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `outlets_cashdenomination_outlet_id_e65f6894_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlets_cashdenomination`
--

LOCK TABLES `outlets_cashdenomination` WRITE;
/*!40000 ALTER TABLE `outlets_cashdenomination` DISABLE KEYS */;
/*!40000 ALTER TABLE `outlets_cashdenomination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlets_outlet`
--

DROP TABLE IF EXISTS `outlets_outlet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlets_outlet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `outlet_code` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `outlet_type` varchar(20) NOT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `outlet_code` (`outlet_code`),
  KEY `outlets_outlet_manager_id_3755bfcd_fk_auth_user_id` (`manager_id`),
  CONSTRAINT `outlets_outlet_manager_id_3755bfcd_fk_auth_user_id` FOREIGN KEY (`manager_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlets_outlet`
--

LOCK TABLES `outlets_outlet` WRITE;
/*!40000 ALTER TABLE `outlets_outlet` DISABLE KEYS */;
INSERT INTO `outlets_outlet` VALUES (1,'MAIN0001','Main Manufacturing Unit','MAIN','Industrial Area Phase-1',NULL,'Chandigarh','Punjab','160002','9876543210',NULL,NULL,1,'2025-09-30 23:53:15.000000','2025-09-30 23:53:15.000000',NULL),(2,'OUT0001','Sector 17 Store','RETAIL','SCO 123, Sector 17-C',NULL,'Chandigarh','Punjab','160017','9876543211',NULL,NULL,1,'2025-09-30 23:53:15.000000','2025-09-30 23:53:15.000000',NULL),(3,'OUT0002','Panchkula Outlet','RETAIL','Shop 45, Sector 5',NULL,'Panchkula','Haryana','134109','9876543212',NULL,NULL,1,'2025-09-30 23:53:15.000000','2025-09-30 23:53:15.000000',NULL),(4,'OUT0003','Mohali Store','RETAIL','Phase 7, Mohali',NULL,'Mohali','Punjab','160055','9876543213',NULL,NULL,1,'2025-09-30 23:53:15.000000','2025-09-30 23:53:15.000000',NULL),(5,'OUT0004','Delhi Warehouse','WAREHOUSE','Plot 789, Industrial Area',NULL,'New Delhi','Delhi','110001','9876543214',NULL,NULL,1,'2025-09-30 23:53:15.000000','2025-09-30 23:53:15.000000',NULL);
/*!40000 ALTER TABLE `outlets_outlet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlets_stocktransfer`
--

DROP TABLE IF EXISTS `outlets_stocktransfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlets_stocktransfer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transfer_number` varchar(20) NOT NULL,
  `transfer_date` datetime(6) NOT NULL,
  `expected_delivery` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `approved_by_id` int DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `from_outlet_id` bigint NOT NULL,
  `to_outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transfer_number` (`transfer_number`),
  KEY `outlets_stocktransfer_approved_by_id_355ce25b_fk_auth_user_id` (`approved_by_id`),
  KEY `outlets_stocktransfer_created_by_id_453899c2_fk_auth_user_id` (`created_by_id`),
  KEY `outlets_stocktransfe_from_outlet_id_30801865_fk_outlets_o` (`from_outlet_id`),
  KEY `outlets_stocktransfer_to_outlet_id_f17d739d_fk_outlets_outlet_id` (`to_outlet_id`),
  CONSTRAINT `outlets_stocktransfe_from_outlet_id_30801865_fk_outlets_o` FOREIGN KEY (`from_outlet_id`) REFERENCES `outlets_outlet` (`id`),
  CONSTRAINT `outlets_stocktransfer_approved_by_id_355ce25b_fk_auth_user_id` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `outlets_stocktransfer_created_by_id_453899c2_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `outlets_stocktransfer_to_outlet_id_f17d739d_fk_outlets_outlet_id` FOREIGN KEY (`to_outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlets_stocktransfer`
--

LOCK TABLES `outlets_stocktransfer` WRITE;
/*!40000 ALTER TABLE `outlets_stocktransfer` DISABLE KEYS */;
/*!40000 ALTER TABLE `outlets_stocktransfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlets_stocktransferitem`
--

DROP TABLE IF EXISTS `outlets_stocktransferitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlets_stocktransferitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(200) NOT NULL,
  `batch_number` varchar(50) NOT NULL,
  `quantity_requested` decimal(10,3) NOT NULL,
  `quantity_sent` decimal(10,3) NOT NULL,
  `quantity_received` decimal(10,3) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `notes` longtext,
  `transfer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `outlets_stocktransfe_transfer_id_e31a649b_fk_outlets_s` (`transfer_id`),
  CONSTRAINT `outlets_stocktransfe_transfer_id_e31a649b_fk_outlets_s` FOREIGN KEY (`transfer_id`) REFERENCES `outlets_stocktransfer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlets_stocktransferitem`
--

LOCK TABLES `outlets_stocktransferitem` WRITE;
/*!40000 ALTER TABLE `outlets_stocktransferitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `outlets_stocktransferitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_batchingredientconsumption`
--

DROP TABLE IF EXISTS `production_batchingredientconsumption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_batchingredientconsumption` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number_used` varchar(50) NOT NULL,
  `planned_quantity` decimal(10,3) NOT NULL,
  `actual_quantity_used` decimal(10,3) NOT NULL,
  `wastage` decimal(10,3) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `notes` longtext,
  `batch_id` bigint NOT NULL,
  `ingredient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `production_batchingr_batch_id_69235e3c_fk_productio` (`batch_id`),
  KEY `production_batchingr_ingredient_id_d1ae8a11_fk_inventory` (`ingredient_id`),
  CONSTRAINT `production_batchingr_batch_id_69235e3c_fk_productio` FOREIGN KEY (`batch_id`) REFERENCES `production_productionbatch` (`id`),
  CONSTRAINT `production_batchingr_ingredient_id_d1ae8a11_fk_inventory` FOREIGN KEY (`ingredient_id`) REFERENCES `inventory_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_batchingredientconsumption`
--

LOCK TABLES `production_batchingredientconsumption` WRITE;
/*!40000 ALTER TABLE `production_batchingredientconsumption` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_batchingredientconsumption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_formulaingredient`
--

DROP TABLE IF EXISTS `production_formulaingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_formulaingredient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity_required` decimal(10,3) NOT NULL,
  `unit_of_measure` varchar(20) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `is_critical` tinyint(1) NOT NULL,
  `formula_id` bigint NOT NULL,
  `ingredient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `production_formulain_formula_id_e5b633ec_fk_productio` (`formula_id`),
  KEY `production_formulain_ingredient_id_8345d689_fk_inventory` (`ingredient_id`),
  CONSTRAINT `production_formulain_formula_id_e5b633ec_fk_productio` FOREIGN KEY (`formula_id`) REFERENCES `production_productionformula` (`id`),
  CONSTRAINT `production_formulain_ingredient_id_8345d689_fk_inventory` FOREIGN KEY (`ingredient_id`) REFERENCES `inventory_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_formulaingredient`
--

LOCK TABLES `production_formulaingredient` WRITE;
/*!40000 ALTER TABLE `production_formulaingredient` DISABLE KEYS */;
INSERT INTO `production_formulaingredient` VALUES (1,900.000,'gm',5.00,NULL,1,1,4),(2,100.000,'gm',15.00,NULL,1,1,5),(3,350.000,'gm',8.00,NULL,1,1,6),(4,150.000,'gm',12.00,NULL,1,1,7),(5,50.000,'gm',10.00,NULL,0,1,8),(6,75.000,'gm',20.00,NULL,0,1,9),(7,50.000,'gm',25.00,NULL,0,1,10),(8,37.500,'gm',30.00,NULL,0,1,11),(9,20.000,'ml',50.00,NULL,0,1,12),(10,20.000,'ml',40.00,NULL,0,1,13),(11,10.000,'ml',35.00,NULL,0,1,14),(12,10.000,'ml',60.00,NULL,0,1,15),(13,10.000,'ml',45.00,NULL,0,1,16),(14,35.000,'gm',15.00,NULL,0,1,17),(15,35.000,'gm',25.00,NULL,0,1,18),(16,900.000,'gm',5.00,NULL,1,1,4),(17,100.000,'gm',15.00,NULL,1,1,5),(18,350.000,'gm',8.00,NULL,1,1,6),(19,150.000,'gm',12.00,NULL,1,1,7),(20,50.000,'gm',10.00,NULL,0,1,8),(21,75.000,'gm',20.00,NULL,0,1,9),(22,50.000,'gm',25.00,NULL,0,1,10),(23,37.500,'gm',30.00,NULL,0,1,11),(24,20.000,'ml',50.00,NULL,0,1,12),(25,20.000,'ml',40.00,NULL,0,1,13),(26,10.000,'ml',35.00,NULL,0,1,14),(27,10.000,'ml',60.00,NULL,0,1,15),(28,10.000,'ml',45.00,NULL,0,1,16),(29,35.000,'gm',15.00,NULL,0,1,17),(30,35.000,'gm',25.00,NULL,0,1,18);
/*!40000 ALTER TABLE `production_formulaingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_productionbatch`
--

DROP TABLE IF EXISTS `production_productionbatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_productionbatch` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(50) NOT NULL,
  `planned_quantity` decimal(10,3) NOT NULL,
  `actual_quantity` decimal(10,3) NOT NULL,
  `wastage_quantity` decimal(10,3) NOT NULL,
  `status` varchar(20) NOT NULL,
  `production_date` datetime(6) NOT NULL,
  `completion_date` datetime(6) DEFAULT NULL,
  `manufacturing_cost` decimal(12,2) NOT NULL,
  `labor_cost` decimal(10,2) NOT NULL,
  `overhead_cost` decimal(10,2) NOT NULL,
  `total_cost` decimal(12,2) NOT NULL,
  `cost_per_unit` decimal(10,2) NOT NULL,
  `quality_approved` tinyint(1) NOT NULL,
  `quality_notes` longtext,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `formula_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `batch_number` (`batch_number`),
  KEY `production_productio_formula_id_5193cecc_fk_productio` (`formula_id`),
  KEY `production_productio_created_by_id_ea05d344_fk_auth_user` (`created_by_id`),
  CONSTRAINT `production_productio_created_by_id_ea05d344_fk_auth_user` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `production_productio_formula_id_5193cecc_fk_productio` FOREIGN KEY (`formula_id`) REFERENCES `production_productionformula` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_productionbatch`
--

LOCK TABLES `production_productionbatch` WRITE;
/*!40000 ALTER TABLE `production_productionbatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_productionbatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_productionformula`
--

DROP TABLE IF EXISTS `production_productionformula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_productionformula` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `formula_name` varchar(200) NOT NULL,
  `version` varchar(20) NOT NULL,
  `batch_size` decimal(10,3) NOT NULL,
  `description` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `finished_product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `production_productio_created_by_id_72dc7a5c_fk_auth_user` (`created_by_id`),
  KEY `production_productio_finished_product_id_044e8006_fk_inventory` (`finished_product_id`),
  CONSTRAINT `production_productio_created_by_id_72dc7a5c_fk_auth_user` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `production_productio_finished_product_id_044e8006_fk_inventory` FOREIGN KEY (`finished_product_id`) REFERENCES `inventory_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_productionformula`
--

LOCK TABLES `production_productionformula` WRITE;
/*!40000 ALTER TABLE `production_productionformula` DISABLE KEYS */;
INSERT INTO `production_productionformula` VALUES (1,'Premium Coconut Oil Formula','1.0',900.000,'Premium coconut oil with 15 herbal ingredients as per traditional recipe',1,'2025-09-30 23:53:27.000000','2025-09-30 23:53:27.000000',NULL,1),(2,'Premium Coconut Oil Formula','1.0',900.000,'Premium coconut oil with 15 herbal ingredients as per traditional recipe',1,'2025-10-01 00:13:07.000000','2025-10-01 00:13:07.000000',NULL,1);
/*!40000 ALTER TABLE `production_productionformula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_productionorder`
--

DROP TABLE IF EXISTS `production_productionorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_productionorder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_number` varchar(20) NOT NULL,
  `quantity_to_produce` decimal(10,3) NOT NULL,
  `priority` varchar(20) NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `approved_by_id` int DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `production_productio_approved_by_id_f43f8ec6_fk_auth_user` (`approved_by_id`),
  KEY `production_productio_created_by_id_9371790e_fk_auth_user` (`created_by_id`),
  KEY `production_productio_product_id_5fe1307f_fk_inventory` (`product_id`),
  CONSTRAINT `production_productio_approved_by_id_f43f8ec6_fk_auth_user` FOREIGN KEY (`approved_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `production_productio_created_by_id_9371790e_fk_auth_user` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `production_productio_product_id_5fe1307f_fk_inventory` FOREIGN KEY (`product_id`) REFERENCES `inventory_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_productionorder`
--

LOCK TABLES `production_productionorder` WRITE;
/*!40000 ALTER TABLE `production_productionorder` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_productionorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_qualitycheck`
--

DROP TABLE IF EXISTS `production_qualitycheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_qualitycheck` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `check_date` datetime(6) NOT NULL,
  `appearance` varchar(11) DEFAULT NULL,
  `color` varchar(11) DEFAULT NULL,
  `odor` varchar(11) DEFAULT NULL,
  `consistency` varchar(11) DEFAULT NULL,
  `ph_value` decimal(12,2) DEFAULT NULL,
  `overall_result` varchar(12) NOT NULL,
  `comments` longtext,
  `corrective_action` longtext,
  `batch_id` bigint NOT NULL,
  `checked_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `production_qualitych_batch_id_6402e2e0_fk_productio` (`batch_id`),
  KEY `production_qualitycheck_checked_by_id_627187a2_fk_auth_user_id` (`checked_by_id`),
  CONSTRAINT `production_qualitych_batch_id_6402e2e0_fk_productio` FOREIGN KEY (`batch_id`) REFERENCES `production_productionbatch` (`id`),
  CONSTRAINT `production_qualitycheck_checked_by_id_627187a2_fk_auth_user_id` FOREIGN KEY (`checked_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_qualitycheck`
--

LOCK TABLES `production_qualitycheck` WRITE;
/*!40000 ALTER TABLE `production_qualitycheck` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_qualitycheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports_generatedreport`
--

DROP TABLE IF EXISTS `reports_generatedreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports_generatedreport` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `parameters_used` json NOT NULL,
  `status` varchar(15) NOT NULL,
  `export_format` varchar(10) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` bigint NOT NULL,
  `total_records` int NOT NULL,
  `generation_time` double NOT NULL,
  `error_message` longtext,
  `generated_at` datetime(6) NOT NULL,
  `generated_by_id` int DEFAULT NULL,
  `template_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_generatedreport_generated_by_id_634c8b8f_fk_auth_user_id` (`generated_by_id`),
  KEY `reports_generatedrep_template_id_cc9efa1c_fk_reports_r` (`template_id`),
  CONSTRAINT `reports_generatedrep_template_id_cc9efa1c_fk_reports_r` FOREIGN KEY (`template_id`) REFERENCES `reports_reporttemplate` (`id`),
  CONSTRAINT `reports_generatedreport_generated_by_id_634c8b8f_fk_auth_user_id` FOREIGN KEY (`generated_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports_generatedreport`
--

LOCK TABLES `reports_generatedreport` WRITE;
/*!40000 ALTER TABLE `reports_generatedreport` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports_generatedreport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports_reporttemplate`
--

DROP TABLE IF EXISTS `reports_reporttemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports_reporttemplate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `report_type` varchar(20) NOT NULL,
  `description` longtext,
  `query_template` longtext NOT NULL,
  `parameters` json NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_reporttemplate_created_by_id_d379b15b_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `reports_reporttemplate_created_by_id_d379b15b_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports_reporttemplate`
--

LOCK TABLES `reports_reporttemplate` WRITE;
/*!40000 ALTER TABLE `reports_reporttemplate` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports_reporttemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_discount`
--

DROP TABLE IF EXISTS `sales_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_discount` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `discount_type` varchar(10) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minimum_purchase` decimal(12,2) NOT NULL,
  `maximum_discount` decimal(10,2) DEFAULT NULL,
  `valid_from` datetime(6) NOT NULL,
  `valid_until` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_discount`
--

LOCK TABLES `sales_discount` WRITE;
/*!40000 ALTER TABLE `sales_discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_payment`
--

DROP TABLE IF EXISTS `sales_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_number` varchar(20) NOT NULL,
  `payment_date` datetime(6) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(15) NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `sale_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_number` (`payment_number`),
  KEY `sales_payment_created_by_id_6b1d0cba_fk_auth_user_id` (`created_by_id`),
  KEY `sales_payment_sale_id_c2196611_fk_sales_sale_id` (`sale_id`),
  CONSTRAINT `sales_payment_created_by_id_6b1d0cba_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `sales_payment_sale_id_c2196611_fk_sales_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales_sale` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_payment`
--

LOCK TABLES `sales_payment` WRITE;
/*!40000 ALTER TABLE `sales_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_sale`
--

DROP TABLE IF EXISTS `sales_sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_sale` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(20) NOT NULL,
  `sale_date` datetime(6) NOT NULL,
  `sale_type` varchar(10) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_status` varchar(10) NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL,
  `due_amount` decimal(12,2) NOT NULL,
  `notes` longtext,
  `terms_conditions` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `outlet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `sales_sale_created_by_id_f6773268_fk_auth_user_id` (`created_by_id`),
  KEY `sales_sale_customer_id_2d66a408_fk_customers_customer_id` (`customer_id`),
  KEY `sales_sale_outlet_id_ceb0e524_fk_outlets_outlet_id` (`outlet_id`),
  KEY `idx_sales_date` (`sale_date`),
  CONSTRAINT `sales_sale_created_by_id_f6773268_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `sales_sale_customer_id_2d66a408_fk_customers_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers_customer` (`id`),
  CONSTRAINT `sales_sale_outlet_id_ceb0e524_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_sale`
--

LOCK TABLES `sales_sale` WRITE;
/*!40000 ALTER TABLE `sales_sale` DISABLE KEYS */;
INSERT INTO `sales_sale` VALUES (1,'INV20240101','2024-01-20 10:30:00.000000','B2B',2500.00,0.00,0.00,300.00,2800.00,'PAID',2800.00,0.00,NULL,NULL,'2025-10-01 00:23:22.000000','2025-10-01 00:23:22.000000',NULL,1,2),(2,'INV20240102','2024-01-20 14:15:00.000000','RETAIL',450.00,0.00,0.00,54.00,504.00,'PARTIAL',200.00,0.00,NULL,NULL,'2025-10-01 00:23:22.000000','2025-10-01 00:23:22.000000',NULL,3,3),(3,'INV20240103','2024-01-21 09:45:00.000000','B2B',5000.00,0.00,0.00,600.00,5600.00,'PENDING',0.00,0.00,NULL,NULL,'2025-10-01 00:23:22.000000','2025-10-01 00:23:22.000000',NULL,2,2);
/*!40000 ALTER TABLE `sales_sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_saleitem`
--

DROP TABLE IF EXISTS `sales_saleitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_saleitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,3) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `tax_percentage` decimal(5,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `product_id` bigint NOT NULL,
  `sale_id` bigint NOT NULL,
  `stock_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_saleitem_product_id_aeb6c9cd_fk_inventory_product_id` (`product_id`),
  KEY `sales_saleitem_sale_id_56e67045_fk_sales_sale_id` (`sale_id`),
  KEY `sales_saleitem_stock_id_403ab127_fk_inventory_stock_id` (`stock_id`),
  CONSTRAINT `sales_saleitem_product_id_aeb6c9cd_fk_inventory_product_id` FOREIGN KEY (`product_id`) REFERENCES `inventory_product` (`id`),
  CONSTRAINT `sales_saleitem_sale_id_56e67045_fk_sales_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales_sale` (`id`),
  CONSTRAINT `sales_saleitem_stock_id_403ab127_fk_inventory_stock_id` FOREIGN KEY (`stock_id`) REFERENCES `inventory_stock` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_saleitem`
--

LOCK TABLES `sales_saleitem` WRITE;
/*!40000 ALTER TABLE `sales_saleitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_saleitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_salestarget`
--

DROP TABLE IF EXISTS `sales_salestarget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_salestarget` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `period_type` varchar(10) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `target_amount` decimal(12,2) NOT NULL,
  `achieved_amount` decimal(12,2) NOT NULL,
  `achievement_percentage` decimal(5,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `outlet_id` bigint NOT NULL,
  `salesperson_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_salestarget_outlet_id_6c679584_fk_outlets_outlet_id` (`outlet_id`),
  KEY `sales_salestarget_salesperson_id_3fc47352_fk_auth_user_id` (`salesperson_id`),
  CONSTRAINT `sales_salestarget_outlet_id_6c679584_fk_outlets_outlet_id` FOREIGN KEY (`outlet_id`) REFERENCES `outlets_outlet` (`id`),
  CONSTRAINT `sales_salestarget_salesperson_id_3fc47352_fk_auth_user_id` FOREIGN KEY (`salesperson_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_salestarget`
--

LOCK TABLES `sales_salestarget` WRITE;
/*!40000 ALTER TABLE `sales_salestarget` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_salestarget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_splitpayment`
--

DROP TABLE IF EXISTS `sales_splitpayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_splitpayment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_method` varchar(15) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `sale_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_splitpayment_sale_id_1b03da66_fk_sales_sale_id` (`sale_id`),
  CONSTRAINT `sales_splitpayment_sale_id_1b03da66_fk_sales_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales_sale` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_splitpayment`
--

LOCK TABLES `sales_splitpayment` WRITE;
/*!40000 ALTER TABLE `sales_splitpayment` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_splitpayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors_vendor`
--

DROP TABLE IF EXISTS `vendors_vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors_vendor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `vendor_code` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `contact_person` varchar(100) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `alternate_phone` varchar(15) DEFAULT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `country` varchar(100) NOT NULL,
  `vendor_type` varchar(20) NOT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `pan` varchar(10) DEFAULT NULL,
  `credit_period` int NOT NULL,
  `credit_limit` decimal(12,2) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `performance_rating` decimal(3,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendor_code` (`vendor_code`),
  KEY `vendors_vendor_created_by_id_7be907f3_fk_auth_user_id` (`created_by_id`),
  CONSTRAINT `vendors_vendor_created_by_id_7be907f3_fk_auth_user_id` FOREIGN KEY (`created_by_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors_vendor`
--

LOCK TABLES `vendors_vendor` WRITE;
/*!40000 ALTER TABLE `vendors_vendor` DISABLE KEYS */;
INSERT INTO `vendors_vendor` VALUES (1,'VEND1001','Himalayan Herbs Pvt Ltd','Rajesh Kumar','contact@himalayanherbs.com','9876543230',NULL,'Hill Station Road',NULL,'Dehradun','Uttarakhand','248001','India','RAW_MATERIAL',NULL,NULL,0,0.00,NULL,NULL,NULL,4.50,1,'2025-10-01 00:08:07.000000','2025-10-01 00:08:07.000000',NULL),(2,'VEND1002','Organic Botanicals','Suresh Patel','info@organicbot.com','9876543231',NULL,'Farming District',NULL,'Ahmedabad','Gujarat','380001','India','RAW_MATERIAL',NULL,NULL,0,0.00,NULL,NULL,NULL,4.20,1,'2025-10-01 00:08:07.000000','2025-10-01 00:08:07.000000',NULL),(3,'VEND1003','Packaging Solutions','Amit Singh','sales@packagingsol.com','9876543232',NULL,'Industrial Estate',NULL,'Faridabad','Haryana','121001','India','PACKAGING',NULL,NULL,0,0.00,NULL,NULL,NULL,4.00,1,'2025-10-01 00:08:07.000000','2025-10-01 00:08:07.000000',NULL),(4,'VEND1004','Quality Labs','Dr. Sunita Mehta','lab@qualitylabs.com','9876543233',NULL,'Science Park',NULL,'Pune','Maharashtra','411001','India','SERVICE',NULL,NULL,0,0.00,NULL,NULL,NULL,4.80,1,'2025-10-01 00:08:07.000000','2025-10-01 00:08:07.000000',NULL);
/*!40000 ALTER TABLE `vendors_vendor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors_vendorperformance`
--

DROP TABLE IF EXISTS `vendors_vendorperformance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors_vendorperformance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `evaluation_date` date NOT NULL,
  `quality_rating` int NOT NULL,
  `delivery_rating` int NOT NULL,
  `service_rating` int NOT NULL,
  `overall_rating` decimal(3,2) NOT NULL,
  `comments` longtext,
  `created_at` datetime(6) NOT NULL,
  `evaluated_by_id` int DEFAULT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendors_vendorperfor_evaluated_by_id_4c5bbbe0_fk_auth_user` (`evaluated_by_id`),
  KEY `vendors_vendorperfor_vendor_id_8e53316f_fk_vendors_v` (`vendor_id`),
  CONSTRAINT `vendors_vendorperfor_evaluated_by_id_4c5bbbe0_fk_auth_user` FOREIGN KEY (`evaluated_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `vendors_vendorperfor_vendor_id_8e53316f_fk_vendors_v` FOREIGN KEY (`vendor_id`) REFERENCES `vendors_vendor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors_vendorperformance`
--

LOCK TABLES `vendors_vendorperformance` WRITE;
/*!40000 ALTER TABLE `vendors_vendorperformance` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors_vendorperformance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors_vendorproduct`
--

DROP TABLE IF EXISTS `vendors_vendorproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors_vendorproduct` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(200) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `description` longtext,
  `unit_price` decimal(10,2) NOT NULL,
  `unit_of_measure` varchar(20) NOT NULL,
  `minimum_order_qty` decimal(10,3) NOT NULL,
  `lead_time_days` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `vendor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendors_vendorproduct_vendor_id_aa6ac76a_fk_vendors_vendor_id` (`vendor_id`),
  CONSTRAINT `vendors_vendorproduct_vendor_id_aa6ac76a_fk_vendors_vendor_id` FOREIGN KEY (`vendor_id`) REFERENCES `vendors_vendor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors_vendorproduct`
--

LOCK TABLES `vendors_vendorproduct` WRITE;
/*!40000 ALTER TABLE `vendors_vendorproduct` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors_vendorproduct` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01  1:13:12
