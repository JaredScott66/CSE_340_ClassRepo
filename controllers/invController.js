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
  })
}

module.exports = invCont