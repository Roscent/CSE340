const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

/* ****************************************
 *  Favorites routes - all require login
 * *************************************** */

// Show favorites page
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.buildFavorites)
);

// Add to favorites
router.post(
    "/add",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.addToFavorites)
);

// Remove from favorites
router.post(
    "/remove",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.removeFromFavorites)
);

// Check if item is in favorites (AJAX)
router.get(
    "/check/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.checkFavorite)
);

module.exports = router;