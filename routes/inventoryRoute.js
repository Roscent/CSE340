// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

/* *******************
* Route to build vehicle (inventory) detail view
* *******************/
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

/* **************
* Error Route
****************/
router.get("/broken", utilities.handleErrors(invController.throwError))
module.exports = router;