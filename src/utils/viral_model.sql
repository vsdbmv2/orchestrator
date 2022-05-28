DROP SCHEMA IF EXISTS `viral_model` ;

-- -----------------------------------------------------
-- Schema viral_model
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `viral_model` ;
USE `viral_model` ;

-- -----------------------------------------------------
-- Table `viral_model`.`sequence`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`sequence` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`sequence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sequence` TEXT NOT NULL,
  `accession_version` VARCHAR(100) NULL,
  `locus` TEXT NULL,
  `definition` TEXT NULL,
  `size` INT NULL,
  `gi` INT NULL,
  `moltype` TEXT NULL,
  `topology` TEXT NULL,
  `taxonomy` TEXT NULL,
  `country` TEXT NULL,
  `creationdate` DATE NULL,
  `idbiosample` VARCHAR(100) NULL,
  `pubmed_id` TEXT NULL,
  `id_subtype` INT NULL,
  `subtype_score` DOUBLE NULL,
  `map_init` INT NULL,
  `map_end` INT NULL,
  `coverage_pct` DOUBLE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`sequence_feature`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`sequence_feature` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`sequence_feature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idsequence` INT NULL,
  `feature_key` TEXT NULL,
  `feature_init` INT NULL,
  `feature_end` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`feature_qualifier`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`feature_qualifier` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`feature_qualifier` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idsequence_feature` INT NULL,
  `name` TEXT NULL,
  `value` TEXT NULL,
  `visited` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`subtype`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`subtype` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`subtype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`subtype_reference_sequence`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`subtype_reference_sequence` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`subtype_reference_sequence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idsubtype` INT NULL,
  `idsequence` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`sequence_journal_reference`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`sequence_journal_reference` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`sequence_journal_reference` (
  `idsequence_journal_reference` INT NOT NULL AUTO_INCREMENT,
  `idsequence` INT NULL,
  `reference_title` TEXT NULL,
  `journal` TEXT NULL,
  PRIMARY KEY (`idsequence_journal_reference`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`biosampleinfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`biosampleinfo` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`biosampleinfo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `access` TEXT NULL,
  `publication_date` TIMESTAMP NULL,
  `accession` TEXT NULL,
  `id_sra` TEXT NULL,
  `id_organism` INT NULL,
  `package` TEXT NULL,
  `strain` TEXT NULL,
  `collectedby` TEXT NULL,
  `collection_date` TEXT NULL,
  `geolocation` TEXT NULL,
  `host` TEXT NULL,
  `disease` TEXT NULL,
  `isolation_source` TEXT NULL,
  `lat_long` TEXT NULL,
  `bioproject_id` TEXT NULL,
  `id_gi` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`sequence_map`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`sequence_map` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`sequence_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idsequence` INT NULL,
  `map_init` INT NULL,
  `map_end` INT NULL,
  `coverage_pct` DOUBLE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`epitope`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`epitope` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`epitope` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `linearsequence` VARCHAR(45) NOT NULL,
  `count` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`epitope_iedb_match`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`epitope_iedb_match` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`epitope_iedb_match` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_epitope` INT NOT NULL,
  `id_iedb_epitope` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`epitope_feature_map`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`epitope_feature_map` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`epitope_feature_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_epitope` INT NOT NULL,
  `id_feature` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`bcell_assay`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`bcell_assay` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`bcell_assay` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `epitope_id` INT NULL,
  `iedb_epitope_id` INT NULL,
  `organism_name` TEXT NULL,
  `comment` TEXT NULL,
  `result` TEXT NULL,
  `bcell_id` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`tcell_assay`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`tcell_assay` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`tcell_assay` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `epitope_id` INT NULL,
  `iedb_epitope_id` INT NULL,
  `organism_name` TEXT NULL,
  `comment` TEXT NULL,
  `result` TEXT NULL,
  `tcell_id` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `viral_model`.`mhc_assay`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `viral_model`.`mhc_assay` ;

CREATE TABLE IF NOT EXISTS `viral_model`.`mhc_assay` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `epitope_id` INT NULL,
  `iedb_epitope_id` INT NULL,
  `allele_name` TEXT NULL,
  `comment` TEXT NULL,
  `result` TEXT NULL,
  `mhc_id` INT NULL,
  `inequality` VARCHAR(3) NULL,
  `value` DOUBLE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;