// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build by item ID view
router.get("/detail/:item_id", invController.buildByInvId);

module.exports = router;