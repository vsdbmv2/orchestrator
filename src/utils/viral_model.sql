DROP SCHEMA IF EXISTS `viral_model` ;

-- -----------------------------------------------------
-- Schema viral_model
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `viral_model` ;
USE `viral_model` ;

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
-- Table structure for table `bcell_assay`
--

DROP TABLE IF EXISTS `viral_model`.`bcell_assay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`bcell_assay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `epitope_id` int(11) DEFAULT NULL,
  `iedb_epitope_id` int(11) DEFAULT NULL,
  `organism_name` text COLLATE utf8mb4_unicode_ci,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `result` text COLLATE utf8mb4_unicode_ci,
  `bcell_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `biosampleinfo`
--

DROP TABLE IF EXISTS `viral_model`.`biosampleinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`biosampleinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access` text COLLATE utf8mb4_unicode_ci,
  `publication_date` timestamp NULL DEFAULT NULL,
  `accession` text COLLATE utf8mb4_unicode_ci,
  `id_sra` text COLLATE utf8mb4_unicode_ci,
  `id_organism` int(11) DEFAULT NULL,
  `package` text COLLATE utf8mb4_unicode_ci,
  `strain` text COLLATE utf8mb4_unicode_ci,
  `collectedby` text COLLATE utf8mb4_unicode_ci,
  `collection_date` text COLLATE utf8mb4_unicode_ci,
  `geolocation` text COLLATE utf8mb4_unicode_ci,
  `host` text COLLATE utf8mb4_unicode_ci,
  `disease` text COLLATE utf8mb4_unicode_ci,
  `isolation_source` text COLLATE utf8mb4_unicode_ci,
  `lat_long` text COLLATE utf8mb4_unicode_ci,
  `bioproject_id` text COLLATE utf8mb4_unicode_ci,
  `id_gi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epitope`
--

DROP TABLE IF EXISTS `viral_model`.`epitope`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`epitope` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linearsequence` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epitope_feature_map`
--

DROP TABLE IF EXISTS `viral_model`.`epitope_feature_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`epitope_feature_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_epitope` int(11) NOT NULL,
  `id_feature` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epitope_iedb_match`
--

DROP TABLE IF EXISTS `viral_model`.`epitope_iedb_match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`epitope_iedb_match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_epitope` int(11) NOT NULL,
  `id_iedb_epitope` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feature_qualifier`
--

DROP TABLE IF EXISTS `viral_model`.`feature_qualifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`feature_qualifier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idsequence_feature` int(11) DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci,
  `value` text COLLATE utf8mb4_unicode_ci,
  `visited` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3979576 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mhc_assay`
--

DROP TABLE IF EXISTS `viral_model`.`mhc_assay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`mhc_assay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `epitope_id` int(11) DEFAULT NULL,
  `iedb_epitope_id` int(11) DEFAULT NULL,
  `allele_name` text COLLATE utf8mb4_unicode_ci,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `result` text COLLATE utf8mb4_unicode_ci,
  `mhc_id` int(11) DEFAULT NULL,
  `inequality` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequence`
--

DROP TABLE IF EXISTS `viral_model`.`sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`sequence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sequence` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `accession_version` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locus` text COLLATE utf8mb4_unicode_ci,
  `definition` text COLLATE utf8mb4_unicode_ci,
  `size` int(11) DEFAULT NULL,
  `gi` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moltype` text COLLATE utf8mb4_unicode_ci,
  `topology` text COLLATE utf8mb4_unicode_ci,
  `taxonomy` text COLLATE utf8mb4_unicode_ci,
  `country` text COLLATE utf8mb4_unicode_ci,
  `creationdate` date DEFAULT NULL,
  `idbiosample` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pubmed_id` text COLLATE utf8mb4_unicode_ci,
  `map_init` int(11) DEFAULT NULL,
  `map_end` int(11) DEFAULT NULL,
  `coverage_pct` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=282375 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequence_feature`
--

DROP TABLE IF EXISTS `viral_model`.`sequence_feature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`sequence_feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idsequence` int(11) DEFAULT NULL,
  `feature_key` text COLLATE utf8mb4_unicode_ci,
  `feature_init` int(11) DEFAULT NULL,
  `feature_end` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=748790 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequence_journal_reference`
--

DROP TABLE IF EXISTS `viral_model`.`sequence_journal_reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`sequence_journal_reference` (
  `idsequence_journal_reference` int(11) NOT NULL AUTO_INCREMENT,
  `idsequence` int(11) DEFAULT NULL,
  `reference_title` text COLLATE utf8mb4_unicode_ci,
  `journal` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`idsequence_journal_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sequence_map`
--

DROP TABLE IF EXISTS `viral_model`.`sequence_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`sequence_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idsequence` int(11) DEFAULT NULL,
  `map_init` int(11) DEFAULT NULL,
  `map_end` int(11) DEFAULT NULL,
  `coverage_pct` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `viral_model`.`sequence_subtype`
--

DROP TABLE IF EXISTS `viral_model`.`sequence_subtype`;
/*!50001 DROP VIEW IF EXISTS `viral_model`.`sequence_subtype`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `viral_model`.`sequence_subtype` AS SELECT 
 1 AS `id`,
 1 AS `idsubtype`,
 1 AS `idsequence`,
 1 AS `is_refseq`,
 1 AS `subtype_score`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `subtype`
--

DROP TABLE IF EXISTS `viral_model`.`subtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`subtype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subtype_reference_sequence`
--

DROP TABLE IF EXISTS `viral_model`.`subtype_reference_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`subtype_reference_sequence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idsubtype` int(11) DEFAULT NULL,
  `idsequence` int(11) DEFAULT NULL,
  `is_refseq` tinyint(1) NOT NULL DEFAULT '0',
  `subtype_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6067962 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tcell_assay`
--

DROP TABLE IF EXISTS `viral_model`.`tcell_assay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viral_model`.`tcell_assay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `epitope_id` int(11) DEFAULT NULL,
  `iedb_epitope_id` int(11) DEFAULT NULL,
  `organism_name` text COLLATE utf8mb4_unicode_ci,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `result` text COLLATE utf8mb4_unicode_ci,
  `tcell_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Final view structure for view `viral_model`.`sequence_subtype`
--

/*!50001 DROP VIEW IF EXISTS `viral_model`.`sequence_subtype`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `viral_model`.`sequence_subtype` AS select `a`.`id` AS `id`,`a`.`idsubtype` AS `idsubtype`,`a`.`idsequence` AS `idsequence`,`a`.`is_refseq` AS `is_refseq`,`a`.`subtype_score` AS `subtype_score`,`s`.`description` AS `description` from ((`48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype_reference_sequence` `a` join (select `48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype_reference_sequence`.`idsequence` AS `idsequence`,max(`48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype_reference_sequence`.`subtype_score`) AS `max_score` from `48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype_reference_sequence` group by `48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype_reference_sequence`.`idsequence`) `b` on(((`a`.`idsequence` = `b`.`idsequence`) and (`a`.`subtype_score` = `b`.`max_score`)))) join `48f8746a0d1d19d88cccd24aa80a5ad3`.`subtype` `s` on((`s`.`id` = `a`.`idsubtype`))) where (`a`.`is_refseq` = FALSE) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
