/* ***********************
 * Require Statements
 *************************/
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = require("../utilities");
const bcrypt = require("bcryptjs")
const accountModel= require("../models/account-model")


/* ***************************
 *  Deliver login view
 * ************************** */
async function buildLogin(req, res, next) {
    let nav = await Util.getNav()
    res.render("account/login" , {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Deliver Registration View
 * ************************** */
async function buildRegister(req, res, next) {
    let nav = await Util.getNav()
    res.render("account/registration", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Deliver Account Manager View
 * ************************** */
async function buildAccountManageView (req, res, next) {
    let nav = await Util.getNav()
    res.render("account/account-manage", {
        title: "Login success!",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process Registration
 * ************************** */
async function registerAccount(req, res) {
    let nav = await Util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        //regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration')
        req.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in`  
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await Util.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
     delete accountData.account_password
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
     if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
       } else {
         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
       }
     return res.redirect("/account/")
     }
    } catch (error) {
     return new Error('Access Forbidden')
    }
   }

/* *************************
 * Test account credentials
 ***************************/
// account_firstname: Basic
// account_lastname: Client
// account_email: basic@340.edu
// account_password: I@mABas1cCl!3nt

// account_firstname: Happy
// account_lastname: Employee
// account_email: happy@340.edu
// account_password: I@mAnEmpl0y33

// account_firstname: Manager
// account_lastname: User
// account_email: manager@340.edu
// account_password: I@mAnAdm!n1strat0r

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManageView}