// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")

//Route to build account sign in view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Route to post registration info
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
    )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(
    (req, res) => {
      res.status(200).send('login process')
    }
  ))


module.exports = router;