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
  if (data[0]) {
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } else {
    res.render("./inventory/no-itemsForClass", {
      title: "No Vehicles for this classification",
      nav,
      errors: null,      
    })
  }
}

/* ***************************
 *  Build inventory by price view
 * ************************** */
invCont.buildInvByPrice = async function (req, res, next) {
  const {classification_id, ranger} = req.body
  const nav = await utilities.getNav()
  const data = await invModel.getInventoryByPrice(classification_id, ranger)
  


  const grid = await utilities.buildClassificationGrid(data)
  if (data[0]) {
    // req.flash("notice", "Success!")
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } else {
    res.render("./inventory/no-itemsForClass", {
      title: "No Vehicles at this price",
      nav,
      errors: null,      
    })
  } 
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
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Process update inventory entry
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getItemById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Process Delete inventory item
 * ************************** */
invCont.deleteFromDatabase = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body
  const deleteResult = await invModel.deleteFromInventory(
    req.body.inv_id,  
  )

  if (deleteResult) {
    // const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont