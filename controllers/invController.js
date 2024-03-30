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
 *  Build Inventory Management View page
 * ************************** */
invCont.buildManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Manage",
      nav,
      classificationSelect,
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
      errors: null,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


module.exports = invCont