-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema vsdbmv2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema vsdbmv2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `vsdbmv2` ;
USE `vsdbmv2` ;

-- -----------------------------------------------------
-- Table `vsdbmv2`.`virus`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `vsdbmv2`.`virus` ;

CREATE TABLE IF NOT EXISTS `vsdbmv2`.`virus` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500) NULL,
  `reference_accession` VARCHAR(100) NULL,
  `database_name` VARCHAR(100) NULL,
  `latest_update` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `vsdbmv2`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `vsdbmv2`.`user` ;

CREATE TABLE IF NOT EXISTS `vsdbmv2`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(250) NULL,
  `password` VARCHAR(250) NULL,
  `context` VARCHAR(45) NULL DEFAULT 'user',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  `name` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema iedb_public
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema iedb_public
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `iedb_public` DEFAULT CHARACTER SET latin1 ;
USE `iedb_public` ;

-- -----------------------------------------------------
-- Table `iedb_public`.`allele_finder_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`allele_finder_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iedb_mhc_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_iedb_mhc_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`article` (
  `article_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `journal_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `journal_volume` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `journal_issue` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_date` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_pages` VARCHAR(24) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_title` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_authors` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_abstract` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_affiliations` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_chemical_list` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `article_mesh_headings_list` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `medline_date` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `pubmed_id` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `pmc_id` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`article_id`),
  INDEX `journal_id` (`journal_id` ASC),
  INDEX `reference_id` (`reference_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`assay_finder_bcell_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`assay_finder_bcell_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`assay_finder_elution_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`assay_finder_elution_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`assay_finder_tcell_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`assay_finder_tcell_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_assay_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`assay_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`assay_type` (
  `assay_type_id` DECIMAL(22,0) NOT NULL,
  `category` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `assay_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `response` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `units` VARCHAR(30) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `obi_id` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `class` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`assay_type_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`bcell`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`bcell` (
  `bcell_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `curated_epitope_id` DECIMAL(22,0) NOT NULL,
  `as_location` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_char_value` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_value` FLOAT NULL DEFAULT NULL,
  `as_inequality` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_subjects` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_num_responded` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_response_frequency` FLOAT NULL DEFAULT NULL,
  `as_immunization_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_comments` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_ant_conformation` VARCHAR(20) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `h_gaz_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_mhc_types_present` TEXT NULL DEFAULT NULL,
  `iv1_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_route` VARCHAR(350) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_imm_ev` VARCHAR(3500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ab_name` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_type` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_materials_assayed` VARCHAR(600) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_immunoglobulin_domain` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_c1_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_c2_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_iv_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_iv_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_ab_name` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_ab_type` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_ab_materials_assayed` VARCHAR(600) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_ab_immunoglobulin_domain` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_ab_c1_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_ab_c2_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_h_gaz_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_mhc_types_present` TEXT NULL DEFAULT NULL,
  `adt_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ant_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `complex_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ab_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_ab_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`bcell_id`),
  INDEX `iv2_disease_id` (`iv2_disease_id` ASC),
  INDEX `adt_iv_disease_id` (`adt_iv_disease_id` ASC),
  INDEX `as_type_id` (`as_type_id` ASC),
  INDEX `reference_id` (`reference_id` ASC),
  INDEX `iv2_con_object_id` (`iv2_con_object_id` ASC),
  INDEX `adt_iv_con_object_id` (`adt_iv_con_object_id` ASC),
  INDEX `iv1_con_object_id` (`iv1_con_object_id` ASC),
  INDEX `adt_iv_imm_object_id` (`adt_iv_imm_object_id` ASC),
  INDEX `adt_ab_object_id` (`adt_ab_object_id` ASC),
  INDEX `iv1_imm_object_id` (`iv1_imm_object_id` ASC),
  INDEX `ant_con_object_id` (`ant_con_object_id` ASC),
  INDEX `ab_object_id` (`ab_object_id` ASC),
  INDEX `iv2_imm_object_id` (`iv2_imm_object_id` ASC),
  INDEX `curated_epitope_id` (`curated_epitope_id` ASC),
  INDEX `h_gaz_id` (`h_gaz_id` ASC),
  INDEX `adt_h_gaz_id` (`adt_h_gaz_id` ASC),
  INDEX `h_organism_id` (`h_organism_id` ASC),
  INDEX `adt_h_organism_id` (`adt_h_organism_id` ASC),
  INDEX `complex_id` (`complex_id` ASC),
  INDEX `iv1_disease_id` (`iv1_disease_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`bcell_receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`bcell_receptor` (
  `curated_receptor_id` DECIMAL(22,0) NOT NULL,
  `bcell_id` DECIMAL(22,0) NOT NULL,
  PRIMARY KEY (`curated_receptor_id`, `bcell_id`),
  INDEX `bcell_id` (`bcell_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`chain`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`chain` (
  `chain_id` DECIMAL(22,0) NOT NULL,
  `species` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `v_dom_seq` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `v_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `d_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `j_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `cdr1_seq` LONGTEXT NULL DEFAULT NULL,
  `cdr1_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr1_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr2_seq` LONGTEXT NULL DEFAULT NULL,
  `cdr2_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr2_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr3_seq` LONGTEXT NULL DEFAULT NULL,
  `cdr3_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr3_end` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`chain_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`complex`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`complex` (
  `complex_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `atom_pairs` LONGTEXT NULL DEFAULT NULL,
  `pdb_id` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `pdb_cell_contact_area` DECIMAL(22,0) NULL DEFAULT NULL,
  `e_contact_area` DECIMAL(22,0) NULL DEFAULT NULL,
  `e_viewer_status` VARCHAR(25) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_c1_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_c2_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_c1_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_c2_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_c1_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_c2_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_pdb_chain` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ab_ant_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_mhc_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_tcr_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_tcr_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_mhc_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_atom_pairs` LONGTEXT NULL DEFAULT NULL,
  `calc_e_contact_area` FLOAT NULL DEFAULT NULL,
  `calc_cell_contact_area` FLOAT NULL DEFAULT NULL,
  `calc_e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_ab_ant_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_e_mhc_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_e_tcr_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_mhc_e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_mhc_tcr_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_tcr_e_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `calc_tcr_mhc_residues` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `complex_type` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `type_flag` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `c1_type` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `c2_type` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_chain1` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_chain2` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`complex_id`),
  INDEX `reference_id` (`reference_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`curated_epitope`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`curated_epitope` (
  `curated_epitope_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `e_name` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_location` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_region_domain_flag` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `related_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `related_object_type` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `e_ref_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `e_ref_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `e_ref_region` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`curated_epitope_id`),
  INDEX `related_object_id` (`related_object_id` ASC),
  INDEX `e_object_id_idx` (`e_object_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`curated_receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`curated_receptor` (
  `curated_receptor_id` DECIMAL(22,0) NOT NULL,
  `distinct_receptor_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ref_name` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ref_synonyms` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `rr_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `receptor_type` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain1_id_cur` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain1_id_calc` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain1_nt_acc` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain1_nt_seq` LONGTEXT NULL DEFAULT NULL,
  `chain1_pro_acc` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain1_pro_seq` LONGTEXT NULL DEFAULT NULL,
  `chain2_id_cur` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain2_id_calc` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain2_nt_acc` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain2_nt_seq` LONGTEXT NULL DEFAULT NULL,
  `chain2_pro_acc` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain2_pro_seq` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`curated_receptor_id`),
  INDEX `chain1_id_calc` (`chain1_id_calc` ASC),
  INDEX `chain2_id_calc` (`chain2_id_calc` ASC),
  INDEX `chain1_id_cur` (`chain1_id_cur` ASC),
  INDEX `chain2_id_cur` (`chain2_id_cur` ASC),
  INDEX `distinct_receptor_id` (`distinct_receptor_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`disease`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`disease` (
  `disease_id` DECIMAL(22,0) NOT NULL,
  `disease_name` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `synonyms` LONGTEXT NULL DEFAULT NULL,
  `accession` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `disease_source` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`disease_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`distinct_chain`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`distinct_chain` (
  `distinct_chain_id` DECIMAL(22,0) NOT NULL,
  `species` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `v_dom_seq` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `v_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `d_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `j_gene` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `cdr1_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr1_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr2_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr2_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr3_start` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr3_end` DECIMAL(22,0) NULL DEFAULT NULL,
  `cdr1_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `cdr2_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `cdr3_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`distinct_chain_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`distinct_receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`distinct_receptor` (
  `distinct_receptor_id` DECIMAL(22,0) NOT NULL,
  `distinct_chain1_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `distinct_chain2_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `receptor_type` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `species` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`distinct_receptor_id`),
  INDEX `distinct_chain2_id` (`distinct_chain2_id` ASC),
  INDEX `distinct_chain1_id` (`distinct_chain1_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`distinct_receptor_receptor_grp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`distinct_receptor_receptor_grp` (
  `receptor_group_id` DECIMAL(22,0) NOT NULL,
  `distinct_receptor_id` DECIMAL(22,0) NOT NULL,
  `match_code` VARCHAR(22) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`distinct_receptor_id`, `receptor_group_id`),
  INDEX `receptor_group_id` (`receptor_group_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`epitope`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`epitope` (
  `epitope_id` DECIMAL(22,0) NOT NULL,
  `description` VARCHAR(535) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `linear_peptide_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `linear_peptide_modified_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `linear_peptide_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `non_aa_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `disc_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `disc_region` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `disc_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mc_region` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mc_mol1_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mc_mol1_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mc_mol2_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mc_mol2_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`epitope_id`),
  INDEX `non_aa_source_id` (`non_aa_source_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`epitope_object`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`epitope_object` (
  `epitope_id` DECIMAL(22,0) NOT NULL,
  `object_id` DECIMAL(22,0) NOT NULL,
  `source_antigen_accession` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `source_organism_org_id` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`epitope_id`, `object_id`),
  INDEX `source_organism_org_id` (`source_organism_org_id` ASC),
  INDEX `object_id_idx` (`object_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`geoloc_finder_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`geoloc_finder_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`geolocation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`geolocation` (
  `gaz_id` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `display_name` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `secondary_names` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`gaz_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`journal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`journal` (
  `journal_id` DECIMAL(22,0) NOT NULL,
  `journal_title` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `journal_issn` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `medline_ta` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`journal_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`mhc_allele_restriction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`mhc_allele_restriction` (
  `mhc_allele_restriction_id` DECIMAL(22,0) NOT NULL,
  `displayed_restriction` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `synonyms` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `includes` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `restriction_level` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `organism` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `organism_ncbi_tax_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `class` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `haplotype` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `locus` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `serotype` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `molecule` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_i_name` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_ii_name` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_i_locus` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_i_mutation` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_ii_locus` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_ii_mutation` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain_i_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain_ii_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iri` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`displayed_restriction`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`mhc_bind`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`mhc_bind` (
  `mhc_bind_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `curated_epitope_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_location` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_char_value` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_value` FLOAT NULL DEFAULT NULL,
  `as_inequality` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_comments` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_allele_restriction_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mhc_allele_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `complex_id` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`mhc_bind_id`),
  INDEX `mhc_allele_name` (`mhc_allele_name` ASC),
  INDEX `complex_id` (`complex_id` ASC),
  INDEX `curated_epitope_id` (`curated_epitope_id` ASC),
  INDEX `as_type_id` (`as_type_id` ASC),
  INDEX `reference_id` (`reference_id` ASC),
  INDEX `as_num_value_idx` (`as_num_value` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`mhc_elution`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`mhc_elution` (
  `mhc_elution_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `curated_epitope_id` DECIMAL(22,0) NOT NULL,
  `as_location` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_char_value` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_value` FLOAT NULL DEFAULT NULL,
  `as_inequality` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_subjects` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_num_responded` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_response_frequency` FLOAT NULL DEFAULT NULL,
  `as_immunization_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_comments` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `h_gaz_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_mhc_types_present` TEXT NULL DEFAULT NULL,
  `iv1_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ivt_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ivt_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mhc_allele_restriction_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mhc_allele_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_allele_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `apc_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_tissue_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_origin` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`mhc_elution_id`),
  INDEX `ant_object_id` (`ant_object_id` ASC),
  INDEX `ivt_con_object_id` (`ivt_con_object_id` ASC),
  INDEX `iv1_con_object_id` (`iv1_con_object_id` ASC),
  INDEX `ivt_imm_object_id` (`ivt_imm_object_id` ASC),
  INDEX `curated_epitope_id` (`curated_epitope_id` ASC),
  INDEX `h_gaz_id` (`h_gaz_id` ASC),
  INDEX `iv1_imm_object_id` (`iv1_imm_object_id` ASC),
  INDEX `reference_id` (`reference_id` ASC),
  INDEX `as_type_id` (`as_type_id` ASC),
  INDEX `mhc_allele_name` (`mhc_allele_name` ASC),
  INDEX `h_organism_id` (`h_organism_id` ASC),
  INDEX `iv1_disease_id` (`iv1_disease_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`molecule_finder_nonp_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`molecule_finder_nonp_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`molecule_finder_prot_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`molecule_finder_prot_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`object`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`object` (
  `object_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `object_type` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `object_sub_type` VARCHAR(200) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `object_description` VARCHAR(535) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `derivative_type` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `organism2_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `region` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `starting_position` DECIMAL(22,0) NULL DEFAULT NULL,
  `ending_position` DECIMAL(22,0) NULL DEFAULT NULL,
  `cell_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tissue_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `origin` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol1_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol1_modified_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol1_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol1_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mol2_modified_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol2_modification` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mol2_source_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mult_chain_mol_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  INDEX `mol1_source_id` (`mol1_source_id` ASC),
  INDEX `organism2_id` (`organism2_id` ASC),
  INDEX `organism_id` (`organism_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`organism`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`organism` (
  `organism_id` DECIMAL(22,0) NOT NULL,
  `parent_tax_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `active_node` DECIMAL(22,0) NULL DEFAULT NULL,
  `path` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `rank` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`organism_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`organism_finder_host_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`organism_finder_host_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `org_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_org_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`organism_finder_src_ancestry`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`organism_finder_src_ancestry` (
  `node_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `org_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `obi_id` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_org_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_obi_id` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `child_obi_species_obi` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`organism_names`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`organism_names` (
  `organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `name_txt` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `name_class` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  INDEX `organism_id` (`organism_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`receptor_group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`receptor_group` (
  `receptor_group_id` DECIMAL(22,0) NOT NULL,
  `receptor_type` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `species` DECIMAL(22,0) NULL DEFAULT NULL,
  `chain1_cdr3_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chain2_cdr3_seq` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`receptor_group_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`reference`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`reference` (
  `reference_id` DECIMAL(22,0) NOT NULL,
  `reference_type` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `curation_keywords` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`reference_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`reference_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`reference_category` (
  `ref_category_id` DECIMAL(22,0) NOT NULL,
  `category_name` VARCHAR(80) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `priority` DECIMAL(22,0) NULL DEFAULT NULL,
  `sort_order` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`ref_category_id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`reference_category_assoc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`reference_category_assoc` (
  `reference_id` DECIMAL(22,0) NOT NULL,
  `ref_category_id` DECIMAL(22,0) NOT NULL,
  PRIMARY KEY (`reference_id`, `ref_category_id`),
  INDEX `ref_category_id` (`ref_category_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`reference_linking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`reference_linking` (
  `reference_id` DECIMAL(22,0) NOT NULL,
  `ref_reference_id` DECIMAL(22,0) NOT NULL,
  `comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `title` VARCHAR(1000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`reference_id`, `ref_reference_id`),
  INDEX `ref_reference_id` (`ref_reference_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`source`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`source` (
  `source_id` DECIMAL(22,0) NOT NULL,
  `accession` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `database` VARCHAR(15) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `name` VARCHAR(535) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `aliases` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `chemical_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `source_date` DATETIME NULL DEFAULT NULL,
  `sequence` LONGTEXT NULL DEFAULT NULL,
  `smiles_structure` VARCHAR(3500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `synonyms` LONGTEXT NULL DEFAULT NULL,
  `organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `organism_name` VARCHAR(150) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `smiles_image` LONGBLOB NULL DEFAULT NULL,
  PRIMARY KEY (`source_id`),
  INDEX `organism_id` (`organism_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`submission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`submission` (
  `submission_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `submitter_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `submission_date` DATETIME NULL DEFAULT NULL,
  `submission_authors` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `submission_affiliations` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `submission_title` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `submission_abstract` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  INDEX `reference_id` (`reference_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`tcell`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`tcell` (
  `tcell_id` DECIMAL(22,0) NOT NULL,
  `reference_id` DECIMAL(22,0) NOT NULL,
  `curated_epitope_id` DECIMAL(22,0) NOT NULL,
  `as_location` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_type_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_char_value` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_value` FLOAT NULL DEFAULT NULL,
  `as_inequality` VARCHAR(5) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_num_subjects` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_num_responded` DECIMAL(22,0) NULL DEFAULT NULL,
  `as_response_frequency` FLOAT NULL DEFAULT NULL,
  `as_immunization_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `as_comments` VARCHAR(4000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `h_gaz_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `h_mhc_types_present` TEXT NULL DEFAULT NULL,
  `tcr_name` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_c1_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `tcr_c2_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv1_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv1_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `iv2_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `iv2_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ivt_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_responder_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_stimulator_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ivt_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ivt_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_iv_process_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_adjuvants` VARCHAR(400) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_route` VARCHAR(35) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_dose_schedule` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_disease_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_iv_disease_stage` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_imm_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_iv_imm_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_iv_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_tcr_name` VARCHAR(500) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_tcr_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_tcr_c1_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_tcr_c2_mol_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_h_gaz_id` VARCHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_h_mhc_types_present` TEXT NULL DEFAULT NULL,
  `adt_effector_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_effector_tissue_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_effector_origin` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `adt_comments` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `effector_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `effector_tissue_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `effector_origin` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_allele_restriction_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `mhc_allele_name` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_allele_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `mhc_autologous` VARCHAR(1) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_cell_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_tissue_type` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_origin` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_h_organism_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `apc_h_age` VARCHAR(85) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_h_sex` VARCHAR(10) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `apc_h_mhc_types_present` VARCHAR(2000) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_type` VARCHAR(50) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_ref_name` VARCHAR(250) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `ant_ev` VARCHAR(100) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NULL DEFAULT NULL,
  `ant_con_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `complex_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `tcr_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  `adt_tcr_object_id` DECIMAL(22,0) NULL DEFAULT NULL,
  PRIMARY KEY (`tcell_id`),
  INDEX `complex_id` (`complex_id` ASC),
  INDEX `h_organism_id` (`h_organism_id` ASC),
  INDEX `adt_iv_disease_id` (`adt_iv_disease_id` ASC),
  INDEX `iv1_disease_id` (`iv1_disease_id` ASC),
  INDEX `iv2_disease_id` (`iv2_disease_id` ASC),
  INDEX `as_type_id` (`as_type_id` ASC),
  INDEX `reference_id` (`reference_id` ASC),
  INDEX `iv2_imm_object_id` (`iv2_imm_object_id` ASC),
  INDEX `ant_con_object_id` (`ant_con_object_id` ASC),
  INDEX `adt_iv_con_object_id` (`adt_iv_con_object_id` ASC),
  INDEX `adt_iv_imm_object_id` (`adt_iv_imm_object_id` ASC),
  INDEX `iv2_con_object_id` (`iv2_con_object_id` ASC),
  INDEX `ivt_con_object_id` (`ivt_con_object_id` ASC),
  INDEX `tcr_object_id` (`tcr_object_id` ASC),
  INDEX `ivt_imm_object_id` (`ivt_imm_object_id` ASC),
  INDEX `ant_object_id` (`ant_object_id` ASC),
  INDEX `adt_tcr_object_id` (`adt_tcr_object_id` ASC),
  INDEX `iv1_con_object_id` (`iv1_con_object_id` ASC),
  INDEX `iv1_imm_object_id` (`iv1_imm_object_id` ASC),
  INDEX `curated_epitope_id` (`curated_epitope_id` ASC),
  INDEX `adt_h_gaz_id` (`adt_h_gaz_id` ASC),
  INDEX `h_gaz_id` (`h_gaz_id` ASC),
  INDEX `adt_tcr_organism_id` (`adt_tcr_organism_id` ASC),
  INDEX `adt_h_organism_id` (`adt_h_organism_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `iedb_public`.`tcell_receptor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `iedb_public`.`tcell_receptor` (
  `curated_receptor_id` DECIMAL(22,0) NOT NULL,
  `tcell_id` DECIMAL(22,0) NOT NULL,
  PRIMARY KEY (`curated_receptor_id`, `tcell_id`),
  INDEX `tcell_id` (`tcell_id` ASC))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


CREATE USER 'root'@'%' IDENTIFIED BY 'to_change_password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;