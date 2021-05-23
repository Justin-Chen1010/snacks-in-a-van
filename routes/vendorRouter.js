const express = require("express");
const vendorRouter = express.Router();
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");
const passport = require('passport');
require('../config/vendorPassport')(passport);

// get all vendors
//vendorRouter.get("/", (req, res) => vendorController.getAllVendors(req, res));

vendorRouter.get("/", (req, res) =>  res.render("vendor/login",{title: "VENDOR", layout: 'vendormain.hbs'}));

vendorRouter.get("/login", (req, res) => {
  res.render('vendor/login',{layout:"vendormain.hbs"});
});

vendorRouter.get("/forgot-password", (req, res) => {
//{message: req.session.message,
if (req.session.vendoremail!==req.body.vendoremail){
  req.flash("message","email not found");
}
  res.render('vendor/passwordmanagement',{layout:"vendormain.hbs"});

});
vendorRouter.get("/reset-password", (req, res) => {

  res.render('vendor/resetpassword',{layout:"vendormain.hbs"});
  

});

vendorRouter.get("/home", (req, res) => {
  if (req.isAuthenticated()&& req.session.role==="vendor") {
    res.render("vendor/home", {layout:"vendormain.hbs"});
  } else {
    req.session.returnTo = "/vendor/home";
    res.redirect("/vendor/login");
  }
});
// vendorRouter.get("/signup", (req, res) => {
//   res.render('vendor/signup',{layout:"vendormain.hbs"});
// // });
// vendorRouter.post('/signup', passport.authenticate('local-signup', {
//   successRedirect : '/', // redirect to the homepage
//   failureRedirect : '/vendor/signup/', // redirect to signup page
//   failureFlash : true // allow flash messages
// }));
// POST login form -- authenticate user
// http:localhost:5000/user/login


vendorRouter.post("/forgot-password", passport.authenticate('local-password-management',{
  
  successRedirect : '/vendor/reset-password', // redirect to the homepage
  failureRedirect : '/vendor/forgot-password', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages

}));
vendorRouter.post('/login', passport.authenticate('vendor-login', {
  successRedirect : '/vendor/home', // redirect to the homepage
  failureRedirect : '/vendor/login', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
  
}));



// get outstanding orders for a vendor
vendorRouter.get("/:vendorName/order", (req, res) =>
  vendorController.getOutstandingOrders(req, res)
);

// mark item as fulfilled
vendorRouter.put("/:vendorName/order/:orderId/status", (req, res) =>
  vendorController.markOrderAsFulfilled(req, res)
);

// set van status
vendorRouter.put("/:vendorName/status", (req, res) =>
  vendorController.updateVanStatus(req, res)
);

// create new vendor
vendorRouter.post("/", (req, res) => vendorController.addVendor(req, res));

module.exports = vendorRouter;
