// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invChecks = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 **************************************** */
router.get("/broken", utilities.handleErrors(invController.throwError))

/* ****************************************
 * Build Management View Route utilities.checkAccountType
 **************************************** */
router.get("/",utilities.handleErrors(invController.buildManagement))

/* ****************************************
 * Build add-classification View Route utilities.checkAccountType
 **************************************** */
router.get("/newClassification", utilities.handleErrors(invController.newClassification))

/* ****************************************
 * Process add-classification Route utilities.checkAccountType
 **************************************** */
router.post("/addClassification", invChecks.classificationRule(), invChecks.checkClassificationData, utilities.handleErrors(invController.addClassification))

/* ****************************************
 * Build add-vehicle View Route utilities.checkAccountType
 **************************************** */
router.get("/newVehicle",utilities.handleErrors(invController.newInventory))

/* ****************************************
 * Process add-vehicle Route utilities.checkAccountType
 **************************************** */
router.post("/addInventory", invChecks.newInventoryRules(), invChecks.checkInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;