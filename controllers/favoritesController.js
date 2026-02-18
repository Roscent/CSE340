const utilities = require("../utilities/");
const favoritesModel = require("../models/favorites-model");

const favoritesController = {};

/* ****************************************
 * Add to favorites - FIXED FOR AJAX
 * *************************************** */
favoritesController.addToFavorites = async function (req, res, next) {
  try {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    
    await favoritesModel.addToFavorites(account_id, inv_id);
    const favCount = await favoritesModel.getFavoritesCount(account_id);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, favCount: favCount });
    } else {
      req.flash("success", "Added to favorites!");
      return res.redirect("back");
    }
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ success: false });
    }
    next(error);
  }
};

/* ****************************************
 * Remove from favorites
 * *************************************** */
favoritesController.removeFromFavorites = async function (req, res, next) {
  try {
    const { inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    
    await favoritesModel.removeFromFavorites(account_id, inv_id);
    const favCount = await favoritesModel.getFavoritesCount(account_id);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, favCount: favCount });
    } else {
      return res.redirect("/favorites");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Build favorites page
 * *************************************** */
favoritesController.buildFavorites = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoritesModel.getFavorites(account_id);
    const favCount = await favoritesModel.getFavoritesCount(account_id);
    
    res.render("favorites/favorites", {
      title: "My Favorites",
      nav,
      favorites,
      favCount,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Check if item is in favorites (AJAX)
 * *************************************** */
favoritesController.checkFavorite = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const account_id = res.locals.accountData.account_id;
    
    const isFavorite = await favoritesModel.isInFavorites(account_id, inv_id);
    
    return res.json({ isFavorite: isFavorite });
  } catch (error) {
    next(error);
  }
};

module.exports = favoritesController;