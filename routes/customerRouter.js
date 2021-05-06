const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const vendorController = require("../controllers/vendorController");
const snackController = require("../controllers/snackController");
const orderController = require("../controllers/orderController");
const passport = require('passport');
require('../config/customerPassport')(passport);

// get the available vendors
customerRouter.get("/vendors", async (req, res) => 
  vendorController.getAllVendors(req, res)
);

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
customerRouter.post("/:customerId/orders", async (req, res) => 
  orderController.addOrder(req, res)
);

//Directly check orders
customerRouter.get("/:customerId/orders", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.session.userId === req.params.customerId) {
      orderController.getOrdersForOneCustomer(req, res);
    }
    else {
        res.redirect(`/customer/${req.session.userId}/orders`);
    }
  }
  else {
    req.session.returnTo = `/customer/${req.session.userId}/orders`;
    res.redirect(`/customer/login`);
  }
});


// redirect unauthenticated customer
// NavBar Check orders
customerRouter.get("/orders", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect(`/customer/${req.session.userId}/orders`);
  }
  else {
    req.session.returnTo = '/orders';
    res.redirect('/customer/login');
  }
});

// TODO: auth for checking individual orders
customerRouter.get("/orders/:orderId", snackController.getMenu, async (req, res) =>
  orderController.getOneOrder(req, res)
);

customerRouter.put("/orders/:orderId", async (req, res) =>
  orderController.updateOrder(req, res)
);

// insert new customer
customerRouter.post("/", async (req, res) =>
  customerController.addCustomer(req, res)
);

customerRouter.get("/cart", snackController.getMenu, async (req, res) => {
  res.render("cart", {menu: req.menu});
});

customerRouter.get("/account", async (req, res) => {
  if (req.isAuthenticated()) {
    res.render("account", {'email': req.session.email});
  }
  else {
    req.session.returnTo = "/customer/account"
    res.redirect("/customer/login");
  }
});

customerRouter.get("/login", async (req, res) => res.render("login"));
customerRouter.post("/login", passport.authenticate('local-login', {
  successReturnToOrRedirect: '/customer/cart', //redirect to cart after login if success
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
