const express = require("express")
const router = express.Router()
const testController = require("../controllers/testController")
const utilities = require("../utilities/")

// Route to trigger intentional 500 error
router.get("/", utilities.handleErrors(testController.generateError))

module.exports = router