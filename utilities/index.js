const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***********************************
 * Build car detailed view HTML
 ************************************* */
Util.buildDetailedView = async function(data, vehicle) {
  let detail_view
  if (data.length > 0){
    data = data[0]
    detail_view = '<section id="carDetail">'
    detail_view += '<img id="carImg" src="' + data.inv_image
    + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model
    + ' on CSE Motors" />'
    detail_view += '<h2 id="nameTitle">' + data.inv_year + ' ' + data.inv_make 
    + ' ' + data.inv_model + '</h2>'
    detail_view += '<div id="carCard">'
    detail_view += '<h2>' + 'Price: $' + new Intl.NumberFormat('en-US').format(data.inv_price)
    + '</h2>'
    detail_view += '<ul>'
    detail_view += '<li>' + '<p class="facts">Current Miles: ' +  new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>' 
    + '</li>'
    detail_view += '<li>' + '<p class="facts">Color: ' + data.inv_color + '</p>' 
    + '</li>'
    detail_view += '</ul>'
    detail_view += '<p id="description">' + data.inv_description + '</p>'
    detail_view += '<h3>Contact Us</h3>'
    detail_view += '</div>'
    detail_view += '</section>'
  } else {
    detail_view += '<p class="notice">Sorry, vehicle could not be found</p>'
  }
  return detail_view
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ***********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ************************************* */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util