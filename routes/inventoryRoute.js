// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);


/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail))

/* ****************************************
 * Error Route
 * Assignment 3, Task 3
 **************************************** */
router.get("/broken", utilities.handleErrors(invController.throwError))

/* ****************************************
 * Management Routes
 * Assignment 4, Task 1, 2, 3
 **************************************** */

// Route to build management view
router.get("/", 
  utilities.handleErrors(invController.buildManagement)
)

// Route to build add classification view
router.get("/add-classification", 
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to process new classification
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkNewClassification,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", 
  utilities.handleErrors(invController.buildAddInventory)
)

// Route to process new inventory
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkNewInventory,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;