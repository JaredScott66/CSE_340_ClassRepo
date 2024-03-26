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



module.exports = router;