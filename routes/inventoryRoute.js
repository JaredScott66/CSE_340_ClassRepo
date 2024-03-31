// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/invValidation")
const utilities = require("../utilities/")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView));

//Route to build new Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.addInvView));

//Route to retreive inventory info
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to modify inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventoryView))

//Route to Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManageView))

//Route Delete Confirm View
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteView))

//Route to post delete SQL
router.post(
    '/delete', 
    utilities.handleErrors(invController.deleteFromDatabase)
) 



//Route to add new classification
router.post(
    '/addClass',
    classValidate.classValidateRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

//Route to add new vehicle to inventory
router.post(
    '/addInv',
    classValidate.addInventoryRules(),
    classValidate.checkAddInvData,
    utilities.handleErrors(invController.addNewInventory)
)

//Route to post edits to database
router.post('/update',
    classValidate.addInventoryRules(),
    classValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)


module.exports = router;