/* ************************************
 *  Account routes
 *  Unit 4, deliver login view activity
 *  ******************************** */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ************************************
 *  Deliver Login View
 *  Unit 4, deliver login view activity
 *  ******************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ************************************
 *  Deliver Registration View
 *  Unit 4, deliver registration view activity
 *  ******************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ************************************
 *  Process Login
 *  Unit 4, stickiness activity
 *  Modified in Unit 5, Login Process activity
 *  ******************************** */

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ************************************
 *  Account Management View
 *  Unit 5, Login Process Activity
 *  ******************************** */
// Default route for account management
router.get("/", utilities.handleErrors(accountController.buildManagementView))

router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))
router.post("/update-info", regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/update-password", regValidate.passwordRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updatePassword))

module.exports = router