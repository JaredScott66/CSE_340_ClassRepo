const utilities = require(".")
const invModel = require("../models/inventory-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */

validate.classValidateRules = () => {
    return [
        //classification_name must not have spaces or special characters
        body("classification_name")
        .trim()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Please provide class name.")
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClass(classification_name)
            if (classExists){
                throw new Error("Class already exists")
            }
        })
    ]
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.addInventoryRules = () => {
    return [
        //Make min 3 characters required
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a make."),
        
        //Model min 3 characters required
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a model."),

        //Year 4 digits
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Please provide valid year."),

        //Price in decimals or integers 
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("please provide a valid number."),

        //Miles in integers only
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide valid integer only."),

        //Color must be present
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide color"),
    ]
}

 /* ******************************
 * Check data and return errors or continue inventory addition
 * ***************************** */
 validate.checkAddInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const class_options = await utilities.buildClassificationList()
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Car",
            nav,
            class_options,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
        })
        return
    }
    next()
}

 /* ******************************
 * Check data and return errors or continue class addition
 * ***************************** */
 validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Class",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate;