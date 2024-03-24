// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
//Route to build new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView));
//Route to build managment view


module.exports = router;