const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")

// Route to trigger intentional 500 error
router.get("/error", utilities.handleErrors(async(req, res) => {
  throw new Error("Intentional 500 Server Error for Testing")
}))

module.exports = router