const utilities = require("../utilities/");
const cartModel = require("../models/cart-model");

const cartController = {};

/* ****************************************
 * Show cart page
 * *************************************** */
cartController.buildCart = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const cartItems = await cartModel.getCartItems(account_id);
    const cartTotal = await cartModel.getCartTotal(account_id);
    const cartCount = await cartModel.getCartCount(account_id);
    
    res.render("cart/cart", {
      title: "Shopping Cart",
      nav,
      cartItems,
      cartTotal,
      cartCount,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Add item to cart - FIXED FOR AJAX
 * *************************************** */
cartController.addToCart = async function (req, res, next) {
  try {
    const { inv_id } = req.body;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;
    const account_id = res.locals.accountData.account_id;
    
    await cartModel.addToCart(account_id, inv_id, quantity);
    const cartCount = await cartModel.getCartCount(account_id);
    
    // Check if the request is from fetch/AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, cartCount: cartCount });
    } else {
      req.flash("success", "Item added to cart");
      return res.redirect("/cart");
    }
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
    next(error);
  }
};

/* ****************************************
 * Update quantity - FIXED FOR AJAX
 * *************************************** */
cartController.updateCart = async function (req, res, next) {
  try {
    const { cart_id, quantity } = req.body;
    await cartModel.updateCartQuantity(cart_id, quantity);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true });
    } else {
      return res.redirect("/cart");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Remove item from cart - FIXED FOR AJAX
 * *************************************** */
cartController.removeFromCart = async function (req, res, next) {
  try {
    const { cart_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    
    await cartModel.removeFromCart(cart_id);
    const cartCount = await cartModel.getCartCount(account_id);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, cartCount: cartCount });
    } else {
      req.flash("success", "Item removed from cart");
      return res.redirect("/cart");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Clear cart - FIXED FOR AJAX
 * *************************************** */
cartController.clearCart = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    
    await cartModel.clearCart(account_id);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, cartCount: 0 });
    } else {
      req.flash("success", "Cart cleared");
      return res.redirect("/cart");
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 * Checkout - FIXED
 * *************************************** */
cartController.checkout = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    
    // Here you would normally process payment
    // For now, just clear the cart and show success
    await cartModel.clearCart(account_id);
    
    req.flash("success", "Order placed successfully!");
    return res.redirect("/cart");
  } catch (error) {
    next(error);
  }
};

module.exports = cartController;