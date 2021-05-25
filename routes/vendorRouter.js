const express = require("express");
const vendorRouter = express.Router();
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");
const passport = require('passport');
const authenticate = require("./authenticate");
const orderController = require("../controllers/orderController");

require('../config/vendorPassport')(passport);

// get all vendors
//vendorRouter.get("/", (req, res) => vendorController.getAllVendors(req, res));

vendorRouter.get("/", (req, res) =>  res.render("vendor/login",{title: "VENDOR", layout: 'vendorMain.hbs'}));

vendorRouter.get("/login", (req, res) => {
  res.render('vendor/login',{layout:"vendorMain.hbs"});
});
vendorRouter.get("/signup", (req, res) => {
  res.render('vendor/signup',{layout:"vendorMain.hbs"});
});


vendorRouter.get("/account", authenticate.isVendorLoggedIn, async (req, res) => {
  res.render("vendor/account", { vendorName: req.session.vendorName, layout:"vendorMain.hbs" });
});


vendorRouter.get("/forgot-password", (req, res) => {
//{message: req.session.message,
if (req.session.vendoremail!==req.body.vendoremail){
  req.flash("message","email not found");
}
  res.render('vendor/passwordManagement',{layout:"vendorMain.hbs"});

});
vendorRouter.get("/reset-password", (req, res) => {

  res.render('vendor/resetPassword',{layout:"vendorMain.hbs"});
  

});

vendorRouter.get("/home", authenticate.isVendorLoggedIn, (req, res) => {
  if (req.isAuthenticated() && req.session.role==="vendor") {
    res.render("vendor/home", {layout:"vendorMain.hbs"});
  } else {
    req.session.returnTo = "/vendor/home";
    res.redirect("/vendor/login");
  }
});
// vendorRouter.get("/signup", (req, res) => {
//   res.render('vendor/signup',{layout:"vendorMain.hbs"});
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

vendorRouter.post('/signup', passport.authenticate('local-signup-vendor', {
  successRedirect : '/vendor/login', // redirect to the homepage
  failureRedirect : '/vendor/signup', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
  
}));

// logout function, users are redirected to login after
vendorRouter.post("/logout", function (req, res) {
  
  req.logout();
  req.flash("");
  res.redirect("/vendor/login");
});




// get the available vendors
vendorRouter.get("/location", authenticate.isVendorLoggedIn, async (req, res) => {
  if (req.session.role==="vendor") {
    res.render("vendor/location", {layout:"vendorMain.hbs"});
  }
});

// get outstanding ('preparing') orders for a vendor, can query status
// ?status=preparing is default, but status=fulfilled or completed
vendorRouter.get("/orders", authenticate.isVendorLoggedIn, async (req, res) => {
  orderController.getOrdersForOneVendor(req, res);
});

vendorRouter.get("/orders/:orderId", authenticate.isVendorLoggedIn, async (req, res) => {
  console.log("asd");
  orderController.getOneOrder(req, res);
});

// mark item as fulfilled
vendorRouter.put("/orders/:orderId/status", authenticate.isVendorLoggedIn, (req, res) => {
    
  vendorController.markOrderAsFulfilled(req, res);
    
});

// set van status
vendorRouter.put("/status", authenticate.isVendorLoggedIn, (req, res) =>
  vendorController.updateVanStatus(req, res)
);

// create new vendor
vendorRouter.post("/", (req, res) => vendorController.addVendor(req, res));

module.exports = vendorRouter;
