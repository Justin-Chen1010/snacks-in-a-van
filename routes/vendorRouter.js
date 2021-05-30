const express = require("express");
const vendorRouter = express.Router();
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");
const passport = require('passport');
const authenticate = require("./authenticate");
const orderController = require("../controllers/orderController");

require('../config/vendorPassport')(passport);

// redirect to vendor home page
vendorRouter.get("/", (req, res) =>  {
  res.redirect("/vendor/home")
});

// vendor home page
vendorRouter.get("/home", async (req, res) => {
  res.render("vendor/home", {layout:"vendormain.hbs"});
});

// vendor signup page
vendorRouter.get("/signup", (req, res) => {
  res.render('vendor/signup', {vendorName: req.session.vendorName, layout:"vendormain.hbs"});
});

// vendor account page
vendorRouter.get("/account", authenticate.isVendorLoggedIn, async (req, res) => {
  res.render("vendor/account", { vendorName: req.session.vendorName, layout:"vendormain.hbs" })
});

// update vendor details based on the data given
vendorRouter.post("/account", authenticate.isVendorLoggedIn, 
  async (req, res) => {
    vendorController.updateVendor(req, res);
  }
);

// login page, display login error message if last login was failed
vendorRouter.get("/login", async (req, res) => {
  res.render("vendor/login", { "vendorLoginFailed" : req.session.vendorLoginErr, layout:"vendormain.hbs" });
  req.session.vendorLoginErr = false;
});

vendorRouter.post('/login', passport.authenticate('vendor-login', {
  successRedirect : '/vendor/home', // redirect to the home page
  failureRedirect : '/vendor/login', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
}));

vendorRouter.post('/signup', passport.authenticate('local-signup-vendor', {
  successRedirect : '/vendor/login', // redirect to the login page
  failureRedirect : '/vendor/signup', // redirect back to the sign up page if there is an error
  failureFlash : true // allow flash messages
}));

// logout function, users are redirected to login afterwards
vendorRouter.post("/logout", function (req, res) {
  req.logout();
  req.flash("");
  res.redirect("/vendor/login");
});

// get the available vendors
vendorRouter.get("/location", authenticate.isVendorLoggedIn, async (req, res) => {
  res.render("vendor/location", {layout:"vendormain.hbs"});
});

// get outstanding ('preparing') orders for a vendor, can query status
// ?status=preparing is default, but status=fulfilled or completed
vendorRouter.get("/orders", authenticate.isVendorLoggedIn, async (req, res) => {
  orderController.getOrdersForVendor(req, res);
});

// search orders based on the orderId given (do not require full id)
vendorRouter.post("/orders", authenticate.isVendorLoggedIn, async(req, res) => {
  orderController.getOrderByIdPattern(req, res);
});

// get order detail page of the vendor
vendorRouter.get("/orders/:orderId",
  authenticate.isVendorLoggedIn,
  snackController.getMenu,
  orderController.getOrderingCustomer,
  async (req, res) => {
    orderController.getOneOrderForVendor(req, res);
});

// update the status of an order
vendorRouter.put("/orders/:orderId", authenticate.isVendorLoggedIn,
  async (req, res) => orderController.updateOrder(req, res)
);

// change van status
vendorRouter.put("/status", authenticate.isVendorLoggedIn, async (req, res) => {
  vendorController.updateVanStatus(req, res);
});

// get the status of the vendor
vendorRouter.get("/status", authenticate.isVendorLoggedIn, async (req, res) => {
  vendorController.getOneVendor(req, res);
});

module.exports = vendorRouter;
