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
router.get("/detail/:id", 
utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 * Assignment 3, Task 3
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.throwError)
)

/* ****************************************
 * Build Management View Route
 * Assignment 4, Task 1
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
)

/* ****************************************
 * Build add-classification View Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/newClassification",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.newClassificationView)
)


/* ****************************************
 * Process add-classification Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
  "/addClassification",
  //utilities.checkAccountType,
  invChecks.classificationRule(),
  invChecks.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-vehicle View Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
  "/newVehicle",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.newInventoryView)
)

/* ****************************************
 * Process add-vehicle Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
  "/addInventory",
  //utilities.checkAccountType,
  invChecks.newInventoryRules(),
  invChecks.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to handle AJAX request for inventory items by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

/* ******************************
 * Deliver Edit Inventory View
 * **************************** */
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.post("/update/", invController.updateInventory)

module.exports = router;