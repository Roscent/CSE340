const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cartModel = require("../models/cart-model");
const favoritesModel = require("../models/favorites-model");
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul class="navigationul">'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '<div class="actions">'
            grid += `<button class="btn-add-to-cart" data-inv-id="${vehicle.inv_id}">Add to Cart</button>`
            grid += `<button class="btn-favorite" data-inv-id="${vehicle.inv_id}">Add to favorite</button>`
            grid += '</div>'
            grid += '</li>'
            })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildSingleVehicleDisplay = async function (data) {
    let grid = '<section id="vehicle-display">'
    grid += `<div>`
    grid += '<section class="imagePrice">'
    grid += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">`
    grid += '</section>'
    grid += '<section class="vehicleDetail">'
    grid += "<h3> " + data.inv_make + " " + data.inv_model + " Details</h3>"
    grid += '<ul id="vehicle-details">'
    grid +=
        "<li><h4>Price: $" +
        new Intl.NumberFormat("en-US").format(data.inv_price) +
        "</h4></li>"
    grid += "<li><h4>Description:</h4> " + data.inv_description + "</li>"
    grid += "<li><h4>Color:</h4> " + data.inv_color + "</li>"
    grid +=
        "<li><h4>Miles:</h4> " +
        new Intl.NumberFormat("en-US").format(data.inv_miles) +
        "</li>"
    grid += "</ul>"
    grid += '<div class="detail-actions">'
    grid += '<button class="btn-add-to-cart-large" data-inv-id="' + data.inv_id + '">Add to Cart</button>'
    grid += '<button class="btn-add-to-favorite-large" data-inv-id="' + data.inv_id + '">Add to Favorites</button>'
    grid += '</div>'
    grid += "</section>"
    grid += `</div>`
    return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
* Unit 5, Login Process activity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      try {
            const cartCount = await cartModel.getCartCount(accountData.account_id);
            const favoritesCount = await favoritesModel.getFavoritesCount(accountData.account_id);
            res.locals.cartCount = cartCount;
            res.locals.favoritesCount = favoritesCount;
          } catch (error) {
            console.error("Error getting counts:", error);
            res.locals.cartCount = 0;
            res.locals.favoritesCount = 0;
          }
      next()
      })
  } else {
    res.locals.cartCount = 0;
    res.locals.favoritesCount = 0;
    next()
  }
};

/* ****************************************
 *  Check Login
 *  Unit 5, jwt authorize activity
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Assignment 5 task2
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if(!res.locals.accountData)
 {
    return res.redirect("/account/login")
    }
  if (res.locals.accountData.account_type == "Employee" ||
      res.locals.accountData.account_type == "Admin") 
    {
      next()
    } 
    else 
    {
      return res.redirect("/account/login")
    }
}

Util.getCartCount = async function(account_id) {
    if (!account_id) return 0;
    try {
        return await cartModel.getCartCount(account_id);
    } catch (error) {
        console.error("Error getting cart count:", error);
        return 0;
    }
};

Util.getFavoritesCount = async function(account_id) {
    if (!account_id) return 0;
    try {
        return await favoritesModel.getFavoritesCount(account_id);
    } catch (error) {
        console.error("Error getting favorites count:", error);
        return 0;
    }
};

module.exports = Util