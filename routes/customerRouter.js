const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");
const orderController = require("../controllers/orderController");
const passport = require('passport');
require('../config/customerPassport')(passport);

// get the menu: details of all snacks
customerRouter.get("/menu", async (req, res) =>
  snackController.getAllSnacks(req, res)
);

// get the details of a single snack
customerRouter.get("/menu/:snackId", async (req, res) => {
  snackController.getOneSnack(req, res);
});

// insert an order, specifying the name of the first snack and the assigned
// vendor
customerRouter.post("/:customerId/order", async (req, res) =>
  orderController.addOrder(req, res)
);

//FIXME: check customer ID and authenticate
customerRouter.get("/orders", async (req, res) =>
  orderController.getAllOrders(req, res)
);

// insert new customer
customerRouter.post("/", async (req, res) =>
  customerController.addCustomer(req, res)
);

customerRouter.get("/cart", async (req, res) => res.render("cart"));

customerRouter.get("/login", async (req, res) => res.render("login"));
customerRouter.post("/login", passport.authenticate('local-login', {
  successRedirect: '/customer/cart', //redirect to cart after login if success
  failureRedirect: '/customer/login', //redirect to the login page after failed
  failureFlash: true
}));

customerRouter.get("/signup", (req, res) => { res.render('signup')});
customerRouter.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/customer/login', //redirect to the login page if sign up succeed
  failureRedirect: '/customer/signup', //redirect to the sign up page if failed
  failureFlash: true
}));

customerRouter.post('/logout', function(req, res) {
  req.logout();
  req.flash('');
  res.redirect('/customer/login');
});

module.exports = customerRouter;
