const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const invId = req.params.id
  let vehicle = await invModel.getInventoryById(invId)
  const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
  let nav = await utilities.getNav()
  const vehicleTitle =
    vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleTitle,
    nav,
    message: null,
    htmlData,
  })
}

/* ****************************************
 *  Process intentional error
 *  Assignment 3, Task 3
 * ************************************ */
invCont.throwError = async function (req, res) {
  throw new Error("I made this error on purpose")
}

/* ****************************************
 *  Build Management View
 *  Assignment 4, Task 1
 * ************************************ */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/* ****************************************
 *  Deliver Add Classification View
 *  Assignment 4, Task 2
 * ************************************ */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: ''
  })
}

/* ****************************************
 *  Process New Classification
 *  Assignment 4, Task 2
 * ************************************ */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const errors = validationResult(req)
  
  if (errors.isEmpty()) {
    const regResult = await invModel.addClassification(classification_name)

    if (regResult) {
      // Rebuild nav to include new classification
      nav = await utilities.getNav()
      req.flash(
        "notice",
        `Classification "${classification_name}" was successfully added.`
      )
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the classification addition failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name
      })
    }
  } else {
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      classification_name,
    })
  }
}

/* ****************************************
 *  Deliver Add Inventory View
 *  Assignment 4, Task 3
 * ************************************ */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: '',
    inv_model: '',
    inv_year: '',
    inv_description: '',
    inv_image: '/images/vehicles/no-image.png',
    inv_thumbnail: '/images/vehicles/no-image-tn.png',
    inv_price: '',
    inv_miles: '',
    inv_color: ''
  })
}

/* ****************************************
 *  Process New Inventory
 *  Assignment 4, Task 3
 * ************************************ */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const errors = validationResult(req)
  
  if (errors.isEmpty()) {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    const regResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )

    if (regResult) {
      req.flash(
        "notice", 
        `The ${inv_make} ${inv_model} was successfully added.`
      )
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Sorry, the inventory addition failed.")
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
        ...req.body
      })
    }
  } else {
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add New Inventory",
      nav,
      classificationList,
      ...req.body
    })
  }
}

module.exports = invCont