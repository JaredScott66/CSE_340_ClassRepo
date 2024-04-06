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
//Route to build account manager view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountLandingView))

router.get("/account-manage", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManageView))

//Route to post registration info
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
    )

// Process Account edit
router.post("/edit", 
    utilities.handleErrors(accountController.editAccountPost)
)

// Process Account edit
router.post("/edit-password", 
    // regValidate.registrationRules(),
    // regValidate.checkEditData, 
    utilities.handleErrors(accountController.editPasswordPost)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

//Process Logout
router.get(
    '/logout', 
    utilities.handleErrors(accountController.accountLogout))

module.exports = router;