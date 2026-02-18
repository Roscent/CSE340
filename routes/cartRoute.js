const express = require("express");
const router = new express.Router();
const cartController = require("../controllers/cartController");
const utilities = require("../utilities");

/* ****************************************
 *  Cart routes - all require login
 * *************************************** */

// Show cart page
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(cartController.buildCart)
);

// Add item to cart
router.post(
    "/add",
    utilities.checkLogin,
    utilities.handleErrors(cartController.addToCart)
);

// Update cart item quantity
router.post(
    "/update",
    utilities.checkLogin,
    utilities.handleErrors(cartController.updateCart)
);

// Remove item from cart
router.post(
    "/remove",
    utilities.checkLogin,
    utilities.handleErrors(cartController.removeFromCart)
);

// Clear cart
router.post(
    "/clear",
    utilities.checkLogin,
    utilities.handleErrors(cartController.clearCart)
);

// Checkout
router.post(
    "/checkout",
    utilities.checkLogin,
    utilities.handleErrors(cartController.checkout)
);

module.exports = router;