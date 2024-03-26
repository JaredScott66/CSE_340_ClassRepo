const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
    errors: null,
  })
}

/* ***************************
 *  Build page by inventory Id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.item_id
  const data = await invModel.getItemById(inv_id)
  const detail_view = await utilities.buildDetailedView(data, inv_id)
  let nav = await utilities.getNav()
  const carName = data[0].inv_make
  res.render("./inventory/car_details", {
    title: carName,
    nav,
    detail_view,
    errors: null,
  })
}

/* ***************************
 *  Build Management View page
 * ************************** */
invCont.buildManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Manage",
      nav,
      errors: null,
  })
}

/* ***************************
 *  Build new class entry page
 * ************************** */
invCont.buildAddClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Class",
    nav,
    errors: null,
  }) 
}

/* ***************************
 *  Build new inventory entry page
 * ************************** */
invCont.addInvView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const class_options = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Car",
    nav,
    class_options,
    errors: null,
  })
}

/* ***************************
 *  Process new class entry
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const addResult = await invModel.addClassItem(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Success! Classification ${classification_name} added to database`
    )
    res.status(200).render("./inventory/add-classification", {
      title: "Add classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the class addition has failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ***************************
 *  Process new inventory entry
 * ************************** */
invCont.addNewInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const class_options = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const addResult = await invModel.addInventoryItem(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (addResult) {
    req.flash(
      "notice",
      "Success! New Car added to database"
    )
    res.status(200).render("./inventory/add-inventory", {
      title: "Add New Car",
      nav,
      class_options,
    })
  } else {
    req.flash("notice", "Sorry, the class addition has failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Car",
      nav,
      class_options,
    })
  }
}

module.exports = invCont